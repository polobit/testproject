package com.campaignio.tasklets.email;

import java.util.Calendar;
import java.util.TimeZone;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.util.DBUtil;
import com.agilecrm.util.Util;
import com.campaignio.URLShortener;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;
import com.thirdparty.SendGridEmail;

public class SendEmail extends TaskletAdapter
{
	// Fields
	public static String FROM_NAME = "from_name";
	public static String FROM_EMAIL = "from_email";
	public static String SUBJECT = "subject";

	public static String REPLY_TO = "replyto_email";
	public static String TO = "to_email";
	public static String HTML_EMAIL = "html_email";
	public static String TEXT_EMAIL = "text_email";

	// On, At, TimeZone
	public static String ON = "on";
	public static String ON_ANY_DAY = "any_day";

	// Days
	public static String ON_MON_FRI = "Mon-Fri";
	public static String ON_MON_SAT = "Mon-Sat";
	public static String ON_SAT_SUN = "Sat-Sun";
	public static String ON_MONDAY = "Mon";
	public static String ON_TUESDAY = "Tue";
	public static String ON_WED = "Wed";
	public static String ON_THU = "Thu";
	public static String ON_FRI = "Fri";
	public static String ON_SAT = "Sat";
	public static String ON_SUN = "Sun";

	public static String AT = "at";
	public static String AT_ANY_TIME = "any_time";

	public static String TIME_ZONE = "time_zone";

	// Track Clicks
	public static String TRACK_CLICKS = "track_clicks";
	public static String TRACK_CLICKS_YES = "yes";
	public static String TRACK_CLICKS_NO = "no";

	// Keyword
	public static String PURL_KEYWORD = "purl_keyword";

	// URLS
	public static String URLS_SHORTENED = "urls_shortened";
	public static String TRACKING_ID = "tracking_id";

	// Unsubscribe Links
	//public static String UNSUBSCRIBE_LINK = "http://usertracker.contactuswidget.appspot.com/cd_unsubscribe.jsp?id=";
	public static String UNSUBSCRIBE_LINK = "http://unscr.be/";
			
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		// Get Scheduled Time and Day
		String on = getStringValue(nodeJSON, subscriberJSON, data, ON);
		String at = getStringValue(nodeJSON, subscriberJSON, data, AT);

		// If it is any
		if (on.equalsIgnoreCase(ON_ANY_DAY) && at.equalsIgnoreCase(AT_ANY_TIME))
		{

			// Send Email and Execute next task
			sendEmail(campaignJSON, subscriberJSON, data, nodeJSON);

			return;
		}

		// Schedule the time and date

		// Set Timezone
		String timeZoneString = getStringValue(nodeJSON, subscriberJSON, data, TIME_ZONE);
		TimeZone timeZone = TimeZone.getTimeZone(timeZoneString);
		Calendar calendar = Calendar.getInstance(timeZone);

		System.out.println("At  " + at + " On: " + on);

		System.out.println(Util.getCalendarString(calendar.getTimeInMillis()));

		// Any Time
		if (!at.equalsIgnoreCase(AT_ANY_TIME))
		{

			// Truncate time and get the time. 09:00
			// Get Hours and mins
			String hours = at.substring(0, 2);
			String mins = at.substring(3);

			calendar.set(Calendar.HOUR_OF_DAY, Integer.parseInt(hours));
			calendar.set(Calendar.MINUTE, Integer.parseInt(mins));
		}

		// Add one day and check
		calendar.add(Calendar.DAY_OF_MONTH, -1);

		// Check Day
		// Keep adding a day until it breaks
		for (int i = 0; i < 100; i++)
		{

			// Add one day and check
			calendar.add(Calendar.DAY_OF_MONTH, 1);
			if (checkDay(calendar, on))
			{
				break;
			}
		}

		System.out.println("Sleeping till ");
		System.out.println(Util.getCalendarString(calendar.getTimeInMillis()));

		// Sleep till that day
		// Add ourselves to Cron Queue
		long timeout = calendar.getTimeInMillis();
		addToCron(campaignJSON, subscriberJSON, data, nodeJSON, timeout, null, null, null);

	}

	// TimeOut - Cron Job Wakes it up
	public void timeOutComplete(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		System.out.println("Wake up from wait. Executing next one.");
		sendEmail(campaignJSON, subscriberJSON, data, nodeJSON);
	}

	public boolean checkDay(Calendar calendar, String on)
	{

		if (on.equalsIgnoreCase(ON_ANY_DAY))
			return true;

		// Get Day
		int weekday = calendar.get(Calendar.DAY_OF_WEEK);

		// Check if day matches - otherwise return false
		if (weekday == Calendar.MONDAY)
		{
			if (on.equalsIgnoreCase(ON_MON_FRI) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_MONDAY))
				return true;
		}

		// Check if day matches - otherwise return false
		if (weekday == Calendar.TUESDAY)
		{
			if (on.equalsIgnoreCase(ON_MON_FRI) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_TUESDAY))
				return true;
		}

		// Check if day matches - otherwise return false
		if (weekday == Calendar.WEDNESDAY)
		{
			if (on.equalsIgnoreCase(ON_MON_FRI) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_WED))
				return true;
		}

		// Check if day matches - otherwise return false
		if (weekday == Calendar.THURSDAY)
		{
			if (on.equalsIgnoreCase(ON_MON_FRI) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_THU))
				return true;
		}

		// Check if day matches - otherwise return false
		if (weekday == Calendar.FRIDAY)
		{
			if (on.equalsIgnoreCase(ON_MON_FRI) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_FRI))
				return true;
		}

		// Check if day matches - otherwise return false
		if (weekday == Calendar.SATURDAY)
		{
			if (on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_SAT) || on.equalsIgnoreCase(ON_SAT_SUN))
				return true;
		}

		// Check if day matches - otherwise return false
		if (weekday == Calendar.SUNDAY)
		{
			if (on.equalsIgnoreCase(ON_SUN) || on.equalsIgnoreCase(ON_SAT_SUN))
				return true;
		}

		return false;
	}

	public void sendEmail(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		// Add Unsubscription Link
		try
		{
			// Get Data
			if(subscriberJSON.has("data"))
				subscriberJSON.getJSONObject("data").put("UnsubscribeLink", UNSUBSCRIBE_LINK + DBUtil.getId(subscriberJSON));
		} catch (Exception e)
		{
		}

		// Get From, Message
		String fromEmail = getStringValue(nodeJSON, subscriberJSON, data, FROM_EMAIL);
		String fromName = getStringValue(nodeJSON, subscriberJSON, data, FROM_NAME);

		String to = getStringValue(nodeJSON, subscriberJSON, data, TO);
		String subject = getStringValue(nodeJSON, subscriberJSON, data, SUBJECT);
		String html = getStringValue(nodeJSON, subscriberJSON, data, HTML_EMAIL);
		String text = getStringValue(nodeJSON, subscriberJSON, data, TEXT_EMAIL);
		String replyTo = getStringValue(nodeJSON, subscriberJSON, data, REPLY_TO);

		String keyword = getStringValue(nodeJSON, subscriberJSON, data, PURL_KEYWORD);

		String trackClicks = getStringValue(nodeJSON, subscriberJSON, data, TRACK_CLICKS);

		// Check if we need to convert links
		if (trackClicks != null && trackClicks.equalsIgnoreCase(TRACK_CLICKS_YES))
		{
			try
			{
				// Generate a random number which can be used for tracking
				// clicks
				data.put(TRACKING_ID, Calendar.getInstance().getTimeInMillis());

				// Get Keyword
				text = convertLinks(text, " ", data, keyword, DBUtil.getId(subscriberJSON));
				html = convertLinks(html, " ", data, keyword, DBUtil.getId(subscriberJSON));

				text = convertLinks(text, "\n", data, keyword, DBUtil.getId(subscriberJSON));
				html = convertLinks(html, "\n", data, keyword, DBUtil.getId(subscriberJSON));
				
				text = convertLinks(text, "\r", data, keyword, DBUtil.getId(subscriberJSON));
				html = convertLinks(html, "\r", data, keyword, DBUtil.getId(subscriberJSON));

				text = convertLinks(text, "<", data, keyword, DBUtil.getId(subscriberJSON));
				html = convertLinks(html, "<", data, keyword, DBUtil.getId(subscriberJSON));

				text = convertLinks(text, "\"", data, keyword, DBUtil.getId(subscriberJSON));
				html = convertLinks(html, "\"", data, keyword, DBUtil.getId(subscriberJSON));

				text = convertLinks(text, "'", data, keyword, DBUtil.getId(subscriberJSON));
				html = convertLinks(html, "'", data, keyword, DBUtil.getId(subscriberJSON));
				
				text = convertLinks(text, "\"", data, keyword, DBUtil.getId(subscriberJSON));
				html = convertLinks(html, "\"", data, keyword, DBUtil.getId(subscriberJSON));

			} catch (Exception e)
			{
				e.printStackTrace();
			}
		}

		log(campaignJSON, subscriberJSON, "Sending email From:" + fromEmail + " To:" + to + " Subject:" + subject
				+ " Text:" + text + "HTML:" + html);

		// Send Message
		if(html != null && html.length() > 10)
		{
			//Util.sendEmailUsingMailgun(fromEmail, fromName, to, subject, replyTo, html, text, subscriberJSON, campaignJSON);
			SendGridEmail.sendMail(fromEmail, fromName, to, subject, replyTo, html, text, subscriberJSON, campaignJSON);
		}
		else
		{
			//Util.sendEmailUsingMailgun(fromEmail, fromName, to, subject, replyTo, null, text, subscriberJSON, campaignJSON);
			SendGridEmail.sendMail(fromEmail, fromName, to, subject, replyTo, null, text, subscriberJSON, campaignJSON);
		}
		
		// Execute Next One in Loop
		TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}

	public String convertLinks(String input, String delimiter, JSONObject data, String keyword, String subscriberId)
			throws Exception
	{
		boolean converted = false;

		// Tokens
		String[] tokens = input.split(delimiter);
		for (int i = 0; i < tokens.length; i++)
		{
			
			if (tokens[i].startsWith("http") && !tokens[i].startsWith("http://goo.gl") && !tokens[i].startsWith("http://usertracker") && !tokens[i].startsWith("http://unscr.be"))
			{
				// Shorten URL
				String url = URLShortener.getShortURL(tokens[i], keyword, subscriberId, data.getString(TRACKING_ID));
				if (url == null)
					continue;

				tokens[i] = url;

				// Store Shorteners
				JSONArray urls = new JSONArray();
				if (data.has(URLS_SHORTENED))
				{
					urls = data.getJSONArray(URLS_SHORTENED);
				}

				urls.put(tokens[i]);
				data.put(URLS_SHORTENED, urls);
			}
		}

		String replacedString = "";
		for (int i = 0; i < tokens.length; i++)
		{
			replacedString += (tokens[i]);
			if (i != tokens.length - 1 || input.endsWith(delimiter))
				replacedString += delimiter;
		}

		if (converted)
			System.out.println("Replaced " + input + " with " + replacedString);

		return replacedString.trim();
	}
}