package com.agilecrm.activities.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Event;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.HTTPUtil;
import com.google.gdata.data.DateTime;
import com.googlecode.objectify.Key;
import com.thirdparty.google.calendar.GoogleCalenderPrefs;

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
	 * @param timezone
	 *            Selected date
	 * @param timezoneName
	 *            Client's time zone
	 * @param startTime
	 *            Client's time zone name
	 * @param endTime
	 *            Client's epoch time
	 * @return List of filled slots from Google calendar on selected date
	 */
	public static List<List<Long>> getFilledGoogleSlots(Long userid, int slotTime, int timezone, String timezoneName,
			Long startTime, Long endTime)
	{
		System.out.println("In getFilledGoogleSlots");

		List<List<Long>> filledSlots = new ArrayList<List<Long>>();

		// Current user calendar prefs
//		GoogleCalenderPrefs prefs = GoogleCalenderPrefs.dao.getByProperty("domainUserKey", new Key<DomainUser>(
//				DomainUser.class, userid));
		
		Map<String, Object> queryMap = new HashMap<String, Object>();
		queryMap.put("domainUserKey", new Key<DomainUser>(
				DomainUser.class, userid));
		queryMap.put("calendar_type", GoogleCalenderPrefs.CALENDAR_TYPE.GOOGLE);
		
		GoogleCalenderPrefs prefs = GoogleCalenderPrefs.dao.getByProperty(queryMap);
		
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
				
				JSONArray calenderIds = null;	
				boolean hasCalenders = false;
				
				if( prefs.prefs != null){
					JSONObject calenderObj = new JSONObject( prefs.prefs);
					if(calenderObj.get("fields") != null){
						hasCalenders = true;
						calenderIds = new JSONArray(calenderObj.get("fields").toString());
					}
				}
				
				if(!hasCalenders){
					// Get primary calendar's email id
					String pCalId = getPrimaryCaledarId(prefs);
					calenderIds = new JSONArray();
					calenderIds.put(pCalId);
				}
				

				System.out.println("check for " + startTime + " " + endTime);

				// Get events from primary calendar of google on selected date
				String googleEvents = getAllCalendarEvents(startTime, endTime, prefs, timezone, timezoneName, calenderIds);

				System.out.println(googleEvents);

				// google events
				JSONObject joGoogleEvents = new JSONObject(googleEvents);

				// google calendars
				JSONObject calendars = (JSONObject) joGoogleEvents.get("calendars");
				
				
				for (int j = 0; j < calenderIds.length(); j++) {
					String gCalenderId = calenderIds.getString(j);
					// If calendars has primary calendar which is sync
					if (calendars.has(gCalenderId)){
						
						// Get primary calendar
						JSONObject accCalendar = (JSONObject) calendars.get(gCalenderId);

						// Get busy slots
						JSONArray busyArray = new JSONArray(accCalendar.get("busy").toString());
						for (int i = 0; i < busyArray.length(); i++){
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
	
	/**
	 *  Gets all the calender and sub calender events.
	 *  
	 * @param startTime
	 * @param endTime
	 * @param prefs
	 * @param timezone
	 * @param timezoneName
	 * @param pCalId
	 * @return
	 * @throws Exception
	 */
	private static String getAllCalendarEvents(Long startTime, Long endTime, GoogleCalenderPrefs prefs, int timezone,
			String timezoneName, JSONArray  calendarIds) throws Exception
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
		
		for (int i = 0; i < calendarIds.length(); i++) {			
			if(calendarIds.get(i) != null){
				JSONObject newObject = new JSONObject();
				newObject.put("id", calendarIds.get(i));
				array.put(newObject);
			}
		}
		object.put("items", array);

		// Send request and return result
		return HTTPUtil.accessURLUsingPostForWebCalendar(url, object.toString());
	}

	/**
	 * 
	 * if user cancel the appointment from his mail the same event has to be
	 * deleted from agile user google calendar,since we are giving cancel
	 * appointment link in confirmation mail of the person who booked
	 * appointment
	 * 
	 * @param event
	 *            Agile Event Object
	 * @return
	 */
	private static String deleteGoogleEventBasedOnEvent(Event event)
	{
		try
		{

			Long user_id = event.getOwner().id;

			GoogleCalenderPrefs prefs = GoogleCalenderPrefs.dao.getByProperty("domainUserKey", new Key<DomainUser>(
					DomainUser.class, user_id));
			System.out.println(prefs);

			// If google calendar sync with Agile Calendar then Get calendar
			if (prefs == null)
				return null;

			prefs.refreshToken();

			// Get primary calendar's email id
			String pCalId = getPrimaryCaledarId(prefs);
			DateTime sd = new DateTime(event.start * 1000, 0);
			DateTime ed = new DateTime(event.end * 1000, 0);

			String postURL = "https://www.googleapis.com/calendar/v3/calendars/" + pCalId + "/events?access_token="
					+ prefs.access_token + "&timeMax=" + ed + "&timeMin=" + sd;

			String googleEventsInSpecifiedTime = HTTPUtil.accessURL(postURL);
			System.out.println(googleEventsInSpecifiedTime);

			JSONObject joGoogleEvents = new JSONObject(googleEventsInSpecifiedTime);
			JSONArray eventArray = new JSONArray(joGoogleEvents.get("items").toString());
			System.out.println(eventArray);

			String googleEventId = null;

			if (eventArray != null && eventArray.length() > 0)
			{
				for (int i = 0; i <= eventArray.length() - 1; i++)
				{
					JSONObject jsn = eventArray.getJSONObject(i);
					if (event.title.equalsIgnoreCase(jsn.getString("summary")))
					{
						googleEventId = jsn.getString("id");
						break;
					}
				}
			}

			if (googleEventId != null)
			{
				String deleteUrl = "https://www.googleapis.com/calendar/v3/calendars/" + pCalId + "/events/"
						+ googleEventId + "?access_token=" + prefs.access_token;
				return HTTPUtil.accessURLToReadScript(deleteUrl, "DELETE", null);
			}
			return null;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("exception occured while fetching google events " + e.getMessage());
			return null;
		}

	}

	/**
	 * deletes event from google calendar
	 * 
	 * @param event
	 */
	public static void deleteGoogleEvent(Event event)
	{
		deleteGoogleEventBasedOnEvent(event);
	}

}
