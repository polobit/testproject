package com.campaignio.tasklets.agile;

import java.util.Calendar;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.activities.Event;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.DateUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>AddEvent</code> represents Add Event node of campaigns. Event can be
 * added through campaigns with campaign subscriber as related contact.
 * 
 * @author naresh
 *
 */
public class AddEvent extends TaskletAdapter
{
    public static String EVENT_NAME = "event_name";

    public static String PRIORITY = "priority";

    public static String START_DATE = "start_date";

    public static String AT = "at";

    public static String TIMEZONE = "time_zone";

    public static String EVENT_DURATION = "event_duration";

    public static String OWNER_ID = "owner_id";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {

	/** Reads each value of Add Event **/
	String eventName = getStringValue(nodeJSON, subscriberJSON, data, EVENT_NAME);
	String priority = getStringValue(nodeJSON, subscriberJSON, data, PRIORITY);
	String daysToStart = getStringValue(nodeJSON, subscriberJSON, data, START_DATE);

	String at = getStringValue(nodeJSON, subscriberJSON, data, AT);
	String timeZone = getStringValue(nodeJSON, subscriberJSON, data, TIMEZONE);
	String eventDuration = getStringValue(nodeJSON, subscriberJSON, data, EVENT_DURATION);
	String givenOwnerId = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);

	try
	{
	    Long contactOwnerId = AgileTaskletUtil.getOwnerId(givenOwnerId,
		    Long.parseLong(AgileTaskletUtil.getContactOwnerIdFromSubscriberJSON(subscriberJSON)));

	    // AgileUser for event
	    AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(contactOwnerId);
	    Long agileUserId = (agileUser == null) ? null : agileUser.id;

	    // Calculates Start and End times
	    DateUtil dateUtil = new DateUtil();
	    dateUtil.toTZ(timeZone);

	    // Replace plus sign from duration e.g., +2 to 2
	    if (daysToStart.contains("+"))
		daysToStart = daysToStart.replaceAll("\\+", "");

	    // Trim spaces
	    daysToStart = StringUtils.trim(daysToStart);

	    Long startTime = null;

	    // Expecting days containing not more than 4 digits
	    if (daysToStart.matches("[0-9]+") && daysToStart.length() <= 4)
	    {
		String hours = at.substring(0, 2);
		String minutes = at.substring(3);

		dateUtil.setHoursAndMinutes(Integer.parseInt(hours), Integer.parseInt(minutes));
		dateUtil.addDays(Integer.parseInt(daysToStart));

		startTime = dateUtil.getTime().getTime() / 1000;
	    }
	    else
	    {
		Calendar cal = DateUtil.getCalendar(daysToStart, timeZone, at);
		startTime = cal.getTimeInMillis() / 1000;

		dateUtil.setCalendar(cal);
	    }

	    Long endTime = null;
	    boolean allDay = false;

	    // All day event
	    if (StringUtils.equals(eventDuration, "all_day"))
	    {
		dateUtil.setHoursAndMinutes(00, 00);
		startTime = dateUtil.getTime().getTime() / 1000;

		dateUtil.setHoursAndMinutes(23, 45);
		endTime = dateUtil.getTime().getTime() / 1000;

		allDay = true;
	    }
	    else
	    {
		// Add minutes
		dateUtil.addMinutes(Integer.parseInt(eventDuration));

		endTime = dateUtil.getTime().getTime() / 1000;
	    }

	    addEvent(eventName, priority, startTime, endTime, allDay,
		    Long.parseLong(AgileTaskletUtil.getId(subscriberJSON)), agileUserId);

	    // Add log
	    LogUtil.addLogToSQL(
		    AgileTaskletUtil.getId(campaignJSON),
		    AgileTaskletUtil.getId(subscriberJSON),
		    "Event Name: "
		            + eventName
		            + "<br/> Start Time: "
		            + DateUtil.getCalendarString(startTime * 1000, "d MMM yyyy hh:mm a zzz", timeZone)
		            + (allDay ? " (all day)" : "<br/> End Time: "
		                    + DateUtil.getCalendarString(endTime * 1000, "d MMM yyyy hh:mm a zzz", timeZone)),
		    LogType.ADD_EVENT.toString());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while adding event..." + e.getMessage());
	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }

    /**
     * Adds new event with related contact
     * 
     * @param eventName
     *            - Name of event
     * @param priority
     *            - High, Normal or low
     * @param daysToStart
     *            - Relative days to start
     * @param eventDuration
     *            - Duration of event
     * @param contactId
     *            - contact id
     * @param givenOwnerId
     *            - event owner id
     */
    private static void addEvent(String eventName, String priority, Long startTime, Long endTime, boolean allDay,
	    Long contactId, Long givenOwnerId)
    {

	Event event = new Event(eventName, startTime, endTime, false, null, givenOwnerId);

	event.addContacts(String.valueOf(contactId));
	event.allDay = allDay;
	event.color = priority;

	event.save();
    }
}
