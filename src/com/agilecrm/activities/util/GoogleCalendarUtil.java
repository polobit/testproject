package com.agilecrm.activities.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.util.DateUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.gdata.data.DateTime;
import com.thirdparty.google.calendar.GoogleCalenderPrefs;
import com.thirdparty.google.calendar.util.GooglecalendarPrefsUtil;

public class GoogleCalendarUtil
{
    /**
     * Returns filled time slots on selected date from Google calendar. Gets
     * prefs for authentication on google calendar. Gets primary calendar with
     * events for selected date. Make slots size as per selected slot
     * time(duration).
     * 
     * @param username
     *            Client's name
     * @param slotTime
     *            Selected duration (time slot)
     * @param date
     *            Selected date
     * @param timezone
     *            Client's time zone
     * @param timezoneName
     *            Client's time zone name
     * @param epochTime
     *            Client's epoch time
     * @return List of filled slots from Google calendar on selected date
     */
    public static List<List<Long>> getFilledGoogleSlots(String username, int slotTime, Date date, int timezone,
	    String timezoneName, Long epochTime)
    {
	System.out.println("In getFilledGoogleSlots");

	List<List<Long>> filledSlots = new ArrayList<List<Long>>();

	// Current user calendar prefs
	GoogleCalenderPrefs prefs = GooglecalendarPrefsUtil.getCalendarPref();
	System.out.println(prefs);

	// If google calendar sync with Agile Calendar then Get calendar
	if (prefs == null)
	    return null;
	else
	{
	    try
	    {
		// Refresh google token
		prefs.refreshToken();

		// Get primary calendar's email id
		String pCalId = getPrimaryCaledarId(prefs);

		// Get start date and time
		DateUtil startDateUtil = new DateUtil(date);
		Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

		// Get end date and time
		DateUtil endDateUtil = new DateUtil(date);
		Long endTime = endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000;

		System.out.println(startDateUtil.getTime() + " " + endDateUtil.getTime());
		System.out.println("check for " + startTime + " " + endTime);

		// Get events from primary calendar of google on selected date
		String googleEvents = getPrimaryCalendar(startTime, endTime, prefs, timezone, timezoneName, pCalId);

		System.out.println(googleEvents);

		// google events
		JSONObject joGoogleEvents = new JSONObject(googleEvents);

		// google calendars
		JSONObject calendars = (JSONObject) joGoogleEvents.get("calendars");

		// If calendars has primary calendar which is sync
		if (calendars.has(pCalId))
		{
		    // Get primary calendar
		    JSONObject accCalendar = (JSONObject) calendars.get(pCalId);

		    // Get busy slots
		    JSONArray busyArray = new JSONArray(accCalendar.get("busy").toString());
		    for (int i = 0; i < busyArray.length(); i++)
		    {
			// Get start and end of busy slot
			String start1 = busyArray.getJSONObject(i).getString("start");
			String end1 = busyArray.getJSONObject(i).getString("end");

			System.out.println(start1 + " " + end1);

			// Get time from busy slot's datetime
			new DateTime();
			DateTime s1 = DateTime.parseDateTime(start1);
			DateTime e1 = DateTime.parseDateTime(end1);
			System.out.println(s1.getValue() / 1000 + " " + e1.getValue() / 1000);

			/*
			 * Make sub slot of filled slot as per selected
			 * duration(slot time) and add in list
			 */
			filledSlots.addAll(WebCalendarEventUtil.makeSlots(slotTime, s1.getValue() / 1000,
				e1.getValue() / 1000));
		    }
		}
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return filledSlots;
    }

    /**
     * Sends get request to google server with access token and get primary
     * calendar id which is email id of user who registered with Agile.
     * 
     * @param prefs
     *            Google calendar oauth details.
     * @return primary calendar id which is email id of register user.
     * @throws JSONException
     */
    private static String getPrimaryCaledarId(GoogleCalenderPrefs prefs) throws JSONException
    {
	// URL for get request
	String urlForPCal = "https://www.googleapis.com/calendar/v3/calendars/primary?access_token="
		+ prefs.access_token;

	// Send get request and get result
	String pCal = HTTPUtil.accessURL(urlForPCal);

	// String to json object
	JSONObject GoogleCalenderId = new JSONObject(pCal);

	// Return id
	return GoogleCalenderId.getString("id");
    }

    /**
     * Get google events from primary calendar which are scheduled within range
     * of start time and end time.
     * 
     * @param startTime
     *            start time to get events from calendar
     * @param endTime
     *            end time to get events from calendar
     * @param prefs
     *            Google calendar oauth details.
     * @param timezone
     *            Client's time zone
     * @param timezoneName
     *            Client's time zone name
     * @param pCalId
     *            primary calendar id which is email id of register user
     * @return Result from google server, string with busy slot details.
     * @throws Exception
     */
    private static String getPrimaryCalendar(Long startTime, Long endTime, GoogleCalenderPrefs prefs, int timezone,
	    String timezoneName, String pCalId) throws Exception
    {
	System.out.println("In getPrimaryCalendar");

	// Url to get calendar
	String url = "https://www.googleapis.com/calendar/v3/freeBusy?access_token=" + prefs.access_token;

	JSONObject object = new JSONObject();

	// Date time conversion
	DateTime sd = new DateTime(startTime * 1000, timezone);
	DateTime ed = new DateTime(endTime * 1000, timezone);

	System.out.println(sd);
	System.out.println(ed);
	System.out.println(timezoneName);

	// Set request parameter
	object.put("timeMin", sd);
	object.put("timeMax", ed);
	object.put("timeZone", timezoneName);

	JSONArray array = new JSONArray();
	JSONObject newObject = new JSONObject();
	newObject.put("id", pCalId);
	array.put(newObject);
	object.put("items", array);

	// Send request and return result
	return HTTPUtil.accessURLUsingPostForWebCalendar(url, object.toString());
    }

}
