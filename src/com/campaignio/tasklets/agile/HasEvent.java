package com.campaignio.tasklets.agile;

import java.util.List;

import org.json.JSONObject;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.Event.EventType;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.googlecode.objectify.Key;

/**
 * <code>CheckEvent</code> repesent check_event node in campaigns. It checks
 * whether an event for the given conditions exists or not.
 * 
 * @author Bhasuri
 * 
 */
public class HasEvent extends TaskletAdapter
{
	/**
	 * Owner Id
	 */
	public static String OWNER_ID = "owner_id";

	/**
	 * Any owner
	 */
	public static String ANY_OWNER = "any_owner";

	/**
	 * Contact owner
	 */
	public static String CONTACT_OWNER = "contact_owner";

	/**
	 * Selected event status
	 */
	public static String EVENT_STATUS = "event_status";

	/**
	 * Selected event type
	 */
	public static String EVENT_TYPE = "event_type";

	/**
	 * Branch Yes
	 */
	public static String BRANCH_YES = "yes";

	/**
	 * Branch No
	 */
	public static String BRANCH_NO = "no";

	/**
	 * Any Event status i.e upcoming or completed
	 */
	public static String ANY_STATUS = "any_status";

	/**
	 * Upcoming event
	 */
	public static String UPCOMING_EVENT = "upcoming_event";

	/**
	 * Completed event
	 */
	public static String COMPLETED_EVENT = "completed_event";

	/**
	 * Type of appointment. Eg: Web appointment or agile
	 */
	public static String ANY_TYPE_EVENT = "any_type";

	/**
	 * Online appointments
	 */
	public static String ONLINE_APPOINTMENT_EVENT = "online_appointments";

	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		String eventOwner = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);
		String eventStatus = getStringValue(nodeJSON, subscriberJSON, data, EVENT_STATUS);
		String eventType = getStringValue(nodeJSON, subscriberJSON, data, EVENT_TYPE);

		try
		{
			Key<AgileUser> keyOfEvent = null;

			// Get AgileUser Owner
			if (eventOwner.equals(ANY_OWNER))
				eventOwner = null;
			else if (eventOwner.equals(CONTACT_OWNER))
			{
				Long contactOwnerId = null;
				String contactId = AgileTaskletUtil.getId(subscriberJSON);

				// Get Contact Owner Id.
				contactOwnerId = ContactUtil.getContactOwnerId(Long.parseLong(contactId));
				keyOfEvent = new Key<AgileUser>(AgileUser.class, contactOwnerId);
			}
			else if (eventOwner != null)
			{
				// Event owner is the id of the domain User.
				// Get AgileUser from domain User as event has the AgileUser as
				// Owner
				keyOfEvent = new Key<AgileUser>(AgileUser.class, AgileUser.getCurrentAgileUserFromDomainUser(Long
						.parseLong(eventOwner)).id);
			}

			// Set the eventStatus
			if (ANY_STATUS.equals(eventStatus))
				eventStatus = null;
			if (UPCOMING_EVENT.equals(eventStatus))
				eventStatus = "start > ";
			if (COMPLETED_EVENT.equals(eventStatus))
				eventStatus = "end <";

			// Set enventType
			EventType eventtype = null;
			if (ANY_TYPE_EVENT.equals(eventType))
				eventType = null;
			if (ONLINE_APPOINTMENT_EVENT.equals(eventType))
				eventtype = Event.EventType.WEB_APPOINTMENT;

			// Get list of AgileUsers for the given event conditions
			List<Key<Event>> listofKeys = EventUtil.getEventsKey(keyOfEvent, eventStatus, eventtype);

			if (listofKeys.size() > 0)
				TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_YES);
			else
				TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_NO);

		}
		catch (Exception e)
		{
			System.err.println("Exception inside checkEvent node with message: " + e.getMessage());
		}

		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_NO);
	}
}
