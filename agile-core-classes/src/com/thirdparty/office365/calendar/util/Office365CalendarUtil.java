package com.thirdparty.office365.calendar.util;

import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.activities.util.WebCalendarEventUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.HTTPUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.thirdparty.google.calendar.GoogleCalenderPrefs;
import com.thirdparty.office365.calendar.Office365CalendarPrefs;
import com.thirdparty.office365.calendar.OfficeCalendarTemplate;

public class Office365CalendarUtil {

	private static String backgroundColor = "#C0E9FF";
	private static String type = "officeCalendar";
	private static String server = "http://54.87.153.50:8080/";
	// private static String server = "http://localhost:8080/";
	private static String appName = "exchange-app";
	private static String serveltName = "appointment";

	public static String getOfficeAuthUrl(String prefs, String startDate,
			String endDate) throws Exception {
		String appointments = null;
		Office365CalendarPrefs officeCalendarPrefs = new Office365CalendarPrefs();
		JSONObject propertyJSON = new JSONObject(prefs);

		officeCalendarPrefs.setUsername(propertyJSON
				.getString("office365-calendar-usrname"));
		officeCalendarPrefs.setPassword(propertyJSON
				.getString("office365-calendar-pwd"));
		officeCalendarPrefs.setServerUrl(propertyJSON
				.getString("office365-calendar-outlook-url"));

		appointments = Office365CalendarUtil.getOfficeURLCalendarPrefs(
				officeCalendarPrefs, startDate, endDate);
		return appointments;
	}

	public static String getOfficeURL(String startDate, String endDate,
			GoogleCalenderPrefs calendarPrefs) {

		String appointments = null;
		if (calendarPrefs != null) {
			try {
				Office365CalendarPrefs officeCalendarPrefs = new Office365CalendarPrefs();
				JSONObject propertyJSON = new JSONObject(
						calendarPrefs.getPrefs());

				officeCalendarPrefs.setUsername(propertyJSON.get(
						"office365-calendar-usrname")

				.toString());
				officeCalendarPrefs.setPassword(propertyJSON.get(
						"office365-calendar-pwd").toString());
				officeCalendarPrefs.setServerUrl(propertyJSON.get(
						"office365-calendar-outlook-url").toString());

				appointments = Office365CalendarUtil.getOfficeURLCalendarPrefs(
						officeCalendarPrefs, startDate, endDate);

			} catch (JSONException e) {
				// TODO Auto-generated catch block
				System.out.println("In office util  " + e);
			}
		}
		return appointments;
	}

	/**
	 * Returns Office url
	 * 
	 * @param officePrefs
	 *            - OfficeEmailPrefs
	 * @param searchEmail
	 *            - email
	 * @param offset
	 *            - offset
	 * @param count
	 *            - emails count
	 * @return String
	 */

	public static String getOfficeURLCalendarPrefs(
			Office365CalendarPrefs calendarPrefs, String startDate,
			String endDate) {

		String userName = calendarPrefs.getUsername();
		String host = calendarPrefs.getServerUrl();
		String password = calendarPrefs.getPassword();

		if (host != null) {
			host = host + "/ews/exchange.asmx";
		}

		DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");

		if (startDate != null) {
			long milliSeconds = Long.parseLong(startDate);
			Calendar calendar = Calendar.getInstance();
			calendar.setTimeInMillis(milliSeconds);
			startDate = formatter.format(calendar.getTime());
		}

		if (endDate != null) {
			long milliSeconds = Long.parseLong(endDate);
			Calendar calendar = Calendar.getInstance();
			calendar.setTimeInMillis(milliSeconds);
			endDate = formatter.format(calendar.getTime());
		}

		String url = null;
		try {
			url = server + appName + "/" + serveltName + "?user_name="
					+ URLEncoder.encode(userName, "UTF-8") + "&password="
					+ URLEncoder.encode(password, "UTF-8") + "&server_url="
					+ URLEncoder.encode(host, "UTF-8") + "&starting_date="
					+ URLEncoder.encode(startDate, "UTF-8") + "&ending_date="
					+ URLEncoder.encode(endDate, "UTF-8");
			System.out.println("url : " + url);
		} catch (Exception e) {
			System.out
					.println("Exception occured in getOfficeURLCalendarPrefs "
							+ e.getMessage());
		}

		return url;
	}

	/**
	 * Fetches emails from server, server can be either IMAP,Microsoft Exchange
	 * Fetches emails based on pageSize and cursor
	 * 
	 * @param url
	 *            server url
	 * @param pageSize
	 *            number of items to fetch from server
	 * @param cursor
	 *            the offset
	 * @return
	 */
	public static List<OfficeCalendarTemplate> getAppointmentsFromServer(
			String url) throws Exception {
		List<OfficeCalendarTemplate> appointmentsList = new ArrayList<OfficeCalendarTemplate>();

		// Returns imap emails, usually in form of {emails:[]}, if not build
		// result like that.
		String jsonResult = HTTPUtil.accessURL(url);
		JSONArray jsonArray = new JSONArray(jsonResult);
		for (int i = 0; i < jsonArray.length(); i++) {
			OfficeCalendarTemplate CalenderObj = new OfficeCalendarTemplate();
			String obj = String.valueOf(jsonArray.get(i));
			JSONObject resultObj = new JSONObject(obj);

			String pattern = "EE MMM dd HH:mm:ss z yyyy";

			System.out.println(AccountPrefsUtil.getTimeZone());

			String userTimeZone = UserPrefsUtil
					.getUserTimezoneFromUserPrefs(AgileUser
							.getCurrentAgileUser().id);

			// For Testing use the below code.
			// String userTimeZone = UserPrefsUtil
			// .getUserTimezoneFromUserPrefs(null);

			SimpleDateFormat parsedFormat = new SimpleDateFormat(pattern,
					Locale.ENGLISH);
			parsedFormat.setTimeZone(TimeZone.getTimeZone(userTimeZone));
			SimpleDateFormat reqFormat = new SimpleDateFormat(
					"MMM d, yyyy HH:mm:ss");
			reqFormat.setTimeZone(TimeZone.getTimeZone(userTimeZone));
			System.out.println("test");
			Date parsedDate;
			String start = resultObj.getString("startDate");
			if (start != null) {
				parsedDate = parsedFormat.parse(start);
				start = reqFormat.format(parsedDate);
			}
			CalenderObj.setStart(start);

			String end = resultObj.getString("endDate");
			if (end != null) {
				parsedDate = parsedFormat.parse(end);
				Calendar cal = Calendar.getInstance();
				cal.setTime(parsedDate);
				// cal.add(Calendar.DATE, -1);
				Date extactDate = cal.getTime();
				end = reqFormat.format(extactDate);
			}
			CalenderObj.setEnd(end);

			CalenderObj.setTitle(resultObj.getString("subject"));
			CalenderObj.setType(type);
			CalenderObj.setBackgroundColor(backgroundColor);

			appointmentsList.add(CalenderObj);
		}

		return appointmentsList;
	}

	/**
	 * Fethes calendar preferences for based on current domain user key
	 * 
	 * @return
	 */
	public static Office365CalendarPrefs getCalendarPref() {
		Objectify ofy = ObjectifyService.begin();
		Office365CalendarPrefs calendarPrefs = ofy.query(
				Office365CalendarPrefs.class).get();

		return calendarPrefs;

	}

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
	public static List<List<Long>> getFilledOfficeSlots(Long userid,
			int slotTime, int timezone, String timezoneName, Long startTime,
			Long endTime) {
		System.out.println("In getFilledGoogleSlots");

		List<List<Long>> filledSlots = new ArrayList<List<Long>>();

		Map<String, Object> queryMap = new HashMap<String, Object>();
		queryMap.put("domainUserKey", new Key<DomainUser>(DomainUser.class,
				userid));
		queryMap.put("calendar_type",
				GoogleCalenderPrefs.CALENDAR_TYPE.OFFICE365);

		// Getting office prefs
		GoogleCalenderPrefs calendarPrefs = GoogleCalenderPrefs.dao
				.getByProperty(queryMap);

		System.out.println(calendarPrefs);

		// If google calendar sync with Agile Calendar then Get calendar
		if (calendarPrefs == null) {
			return null;
		} else {
			String Url = null;
			if (startTime != null && endTime != null) {
				startTime = startTime * 1000;
				endTime = endTime * 1000;
				Url = Office365CalendarUtil.getOfficeURL(startTime.toString(),
						endTime.toString(), calendarPrefs);
			}
			try {
				List<OfficeCalendarTemplate> appointments = Office365CalendarUtil
						.getAppointmentsFromServer(Url);

				for (int i = 0; i < appointments.size(); i++) {
					OfficeCalendarTemplate officeTemplate = appointments.get(i);
					/*
					 * Make sub slot of filled slot as per selected
					 * duration(slot time) and add in list
					 */
					if (officeTemplate != null) {
						long starting = 0L;
						long ending = 0L;

						// Starting time.
						Date start = new Date(officeTemplate.getStart());
						if (start.getTime() / 1000 < startTime) {
							starting = startTime / 1000;
						} else {
							starting = start.getTime() / 1000;
						}

						// Ending time.
						Date end = new Date(officeTemplate.getEnd());
						if (end.getTime() / 1000 < endTime) {
							ending = endTime / 1000;
						} else {
							ending = end.getTime() / 1000;
						}
						filledSlots.addAll(WebCalendarEventUtil.makeSlots(
								slotTime, starting, ending));
					}
				}

			} catch (Exception e) {
				// TODO Auto-generated catch block
				System.out.println(e);
			}
		}
		return filledSlots;
	}
}