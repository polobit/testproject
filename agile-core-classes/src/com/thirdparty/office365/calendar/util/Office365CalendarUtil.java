package com.thirdparty.office365.calendar.util;

import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.TimeZone;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.util.HTTPUtil;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.thirdparty.google.calendar.GoogleCalenderPrefs;
import com.thirdparty.google.calendar.util.GooglecalendarPrefsUtil;
import com.thirdparty.office365.calendar.Office365CalendarPrefs;
import com.thirdparty.office365.calendar.OfficeCalendarTemplate;

public class Office365CalendarUtil {

	private static String backgroundColor = "#C0E9FF";
	private static String type = "officeCalendar";
	private static String server = "http://54.87.153.50:8080/";
	// private static String server = "http://localhost:8080/";
	private static String appName = "exchange-app";
	private static String serveltName = "appointment";

	public static String getOfficeURL(String startDate, String endDate) {

		String appointments = null;
		// Get Office Exchange Prefs
		GoogleCalenderPrefs calendarPrefs = GooglecalendarPrefsUtil
				.getCalendarPrefsByType(GoogleCalenderPrefs.CALENDAR_TYPE.OFFICE365);
		if (calendarPrefs != null) {
			try {
				Office365CalendarPrefs officeCalendarPrefs = new Office365CalendarPrefs();
				JSONObject propertyJSON = new JSONObject(
						calendarPrefs.getPrefs());
				
				officeCalendarPrefs.setUsername(propertyJSON.get("office365-calendar-usrname")
						
						.toString());
				officeCalendarPrefs.setPassword(propertyJSON.get("office365-calendar-pwd")
						.toString());
				officeCalendarPrefs.setServerUrl(propertyJSON.get("office365-calendar-outlook-url")
						.toString());

				appointments = Office365CalendarUtil.getOfficeURLCalendarPrefs(
						officeCalendarPrefs, startDate, endDate);

			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
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

		String userName = calendarPrefs.username;
		String host = calendarPrefs.serverUrl;
		String password = calendarPrefs.password;

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
			System.err
					.println("Exception occured in getOfficeURLCalendarPrefs "
							+ e.getMessage());
			e.printStackTrace();
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
			String url) {
		List<OfficeCalendarTemplate> appointmentsList = new ArrayList<OfficeCalendarTemplate>();

		try {
			// Returns imap emails, usually in form of {emails:[]}, if not build
			// result like that.
			String jsonResult = HTTPUtil.accessURL(url);
			JSONArray jsonArray = new JSONArray(jsonResult);
			for (int i = 0; i < jsonArray.length(); i++) {
				OfficeCalendarTemplate CalenderObj = new OfficeCalendarTemplate();
				String obj = String.valueOf(jsonArray.get(i));
				JSONObject resultObj = new JSONObject(obj);

				String pattern = "EE MMM dd HH:mm:ss z yyyy";

				SimpleDateFormat parsedFormat = new SimpleDateFormat(pattern,
						Locale.ENGLISH);
				parsedFormat.setTimeZone(TimeZone.getTimeZone(AccountPrefsUtil
						.getTimeZone()));
				SimpleDateFormat reqFormat = new SimpleDateFormat(
						"MMM d, yyyy HH:mm:ss");
				reqFormat.setTimeZone(TimeZone.getTimeZone(AccountPrefsUtil
						.getTimeZone()));
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
		} catch (Exception e) {
			System.out
					.println("while fetching office appointment error accorded");
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
}