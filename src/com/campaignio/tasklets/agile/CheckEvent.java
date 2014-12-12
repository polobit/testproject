package com.campaignio.tasklets.agile;

import java.util.List;

import org.json.JSONObject;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.util.EventUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>CheckEvent</code>
 * 
 * @author Bhasuri
 * 
 */
public class CheckEvent extends TaskletAdapter
{
	/**
	 * Owner Id
	 */
	public static String OWNER_ID = "owner_id";

	/**
	 * Owner Id
	 */
	public static String ANY_OWNER = "any_owner";

	/**
	 * Owner Id
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
	 * 
	 */
	public static String UPCOMING_EVENT = "upcoming_event";

	/**
	 * 
	 */
	public static String COMPLETED_EVENT = "completed_event";

	/**
	 * 
	 */
	public static String ANY_TYPE_EVENT = "any_type";

	/**
	 * 
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
			List<Event> events = EventUtil.getFutureEvents();
			if (events.size() > 0)
				System.out.println("Yes");
			// Any owner case:
			// Status: any upcoming and compleyed
			// type online or any

			if (eventOwner.equals(ANY_OWNER))
			{
				if (eventStatus.equals(ANY_STATUS))
				{

					if (eventType.equals(ANY_TYPE_EVENT))
					{

					}
					else if (eventType.equals(ONLINE_APPOINTMENT_EVENT))
					{

					}

				}
				else if (eventStatus.equals(UPCOMING_EVENT))
				{
					if (eventType.equals(ANY_TYPE_EVENT))
					{

					}
					else if (eventType.equals(ONLINE_APPOINTMENT_EVENT))
					{

					}

				}
				else if (eventStatus.equals(COMPLETED_EVENT))
				{
					if (eventType.equals(ANY_TYPE_EVENT))
					{

					}
					else if (eventType.equals(ONLINE_APPOINTMENT_EVENT))
					{

					}
				}

			}
			else if (eventOwner.equals(CONTACT_OWNER))
			{
				if (eventStatus.equals(ANY_STATUS))
				{

					if (eventType.equals(ANY_TYPE_EVENT))
					{

					}
					else if (eventType.equals(ONLINE_APPOINTMENT_EVENT))
					{

					}

				}
				else if (eventStatus.equals(UPCOMING_EVENT))
				{
					if (eventType.equals(ANY_TYPE_EVENT))
					{

					}
					else if (eventType.equals(ONLINE_APPOINTMENT_EVENT))
					{

					}

				}
				else if (eventStatus.equals(COMPLETED_EVENT))
				{
					if (eventType.equals(ANY_TYPE_EVENT))
					{

					}
					else if (eventType.equals(ONLINE_APPOINTMENT_EVENT))
					{

					}
				}

			}
			else if (eventOwner != null)
			{
				if (eventStatus.equals(ANY_STATUS))
				{

					if (eventType.equals(ANY_TYPE_EVENT))
					{

					}
					else if (eventType.equals(ONLINE_APPOINTMENT_EVENT))
					{

					}

				}
				else if (eventStatus.equals(UPCOMING_EVENT))
				{
					if (eventType.equals(ANY_TYPE_EVENT))
					{

					}
					else if (eventType.equals(ONLINE_APPOINTMENT_EVENT))
					{

					}

				}
				else if (eventStatus.equals(COMPLETED_EVENT))
				{
					if (eventType.equals(ANY_TYPE_EVENT))
					{

					}
					else if (eventType.equals(ONLINE_APPOINTMENT_EVENT))
					{

					}
				}

			}
		}
		catch (Exception e)
		{

		}

		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_NO);
	}
}
