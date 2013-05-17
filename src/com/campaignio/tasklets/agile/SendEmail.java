package com.campaignio.tasklets.agile;

import java.util.Calendar;
import java.util.TimeZone;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.util.DBUtil;
import com.agilecrm.util.Util;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;
import com.campaignio.util.URLShortenerUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.SendGridEmail;

/**
 * <code>SendEmail</code> represents SendEmail node in a workflow. Sends email
 * on any day and any time with text/html or both. Track urls with purl keyword.
 * Recipient email id can be taken automatically from subscriber data. The email
 * body can be either html or text. It converts long urls to shortened urls.
 * 
 * @author Manohar
 * 
 */
public class SendEmail extends TaskletAdapter
{
    /**
     * Sender name in email
     */
    public static String FROM_NAME = "from_name";

    /**
     * Sender email id
     */
    public static String FROM_EMAIL = "from_email";

    /**
     * Subject of an email
     */
    public static String SUBJECT = "subject";

    /**
     * Reply to email id
     */
    public static String REPLY_TO = "replyto_email";

    /**
     * Recipient email id
     */
    public static String TO = "to_email";

    /**
     * HTML content of email
     */
    public static String HTML_EMAIL = "html_email";

    /**
     * Text content of email
     */
    public static String TEXT_EMAIL = "text_email";

    /**
     * On type
     */
    public static String ON = "on";

    /**
     * Any day
     */
    public static String ON_ANY_DAY = "any_day";

    /**
     * Monday to Friday
     */
    public static String ON_MON_FRI = "Mon-Fri";

    /**
     * Monday to Saturday
     */
    public static String ON_MON_SAT = "Mon-Sat";

    /**
     * Saturday to Sunday
     */
    public static String ON_SAT_SUN = "Sat-Sun";

    /**
     * Only on Monday
     */
    public static String ON_MONDAY = "Mon";

    /**
     * Only on Tuesday
     */
    public static String ON_TUESDAY = "Tue";

    /**
     * Only on Wednesday
     */
    public static String ON_WED = "Wed";

    /**
     * Only on Thursday
     */
    public static String ON_THU = "Thu";

    /**
     * Only on Friday
     */
    public static String ON_FRI = "Fri";

    /**
     * Only on Saturday
     */
    public static String ON_SAT = "Sat";

    /**
     * Only on Sunday
     */
    public static String ON_SUN = "Sun";

    /**
     * At says about time
     */
    public static String AT = "at";

    /**
     * Any time
     */
    public static String AT_ANY_TIME = "any_time";

    /**
     * Timezones
     */
    public static String TIME_ZONE = "time_zone";

    /**
     * Track clicks Type
     */
    public static String TRACK_CLICKS = "track_clicks";

    /**
     * Yes to track clicks for links in the email
     */
    public static String TRACK_CLICKS_YES = "yes";

    /**
     * No to not track clicks for the links in the email
     */
    public static String TRACK_CLICKS_NO = "no";

    /**
     * Keyword that is added to url when Track Clicks yes is selected
     */
    public static String PURL_KEYWORD = "purl_keyword";

    /**
     * URL shortened
     */
    public static String URLS_SHORTENED = "urls_shortened";

    /**
     * Tracking id
     */
    public static String TRACKING_ID = "tracking_id";

    /*
     * Unsubscribe Links public static String UNSUBSCRIBE_LINK =
     * "http://usertracker.contactuswidget.appspot.com/cd_unsubscribe.jsp?id=";
     */
    /**
     * Unsubscribe link that is shortened
     */
    public static String UNSUBSCRIBE_LINK = "http://unscr.be/";

    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
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
	String timeZoneString = getStringValue(nodeJSON, subscriberJSON, data,
		TIME_ZONE);
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
	addToCron(campaignJSON, subscriberJSON, data, nodeJSON, timeout, null,
		null, null);
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.campaignio.tasklets.TaskletAdapter#timeOutComplete(org.json.JSONObject
     * , org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void timeOutComplete(JSONObject campaignJSON,
	    JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {
	// TimeOut - Cron Job Wakes it up
	System.out.println("Wake up from wait. Executing next one.");
	sendEmail(campaignJSON, subscriberJSON, data, nodeJSON);
    }

    /**
     * Checks given Day with the available options. Return true if matches
     * otherwise false.
     * 
     * @param calendar
     *            Calendar object
     * @param on
     *            Given day value
     * @return true if matches otherwise false
     */
    public boolean checkDay(Calendar calendar, String on)
    {
	if (on.equalsIgnoreCase(ON_ANY_DAY))
	    return true;

	// Get Day
	int weekday = calendar.get(Calendar.DAY_OF_WEEK);

	// Check if day matches - otherwise return false
	if (weekday == Calendar.MONDAY)
	{
	    if (on.equalsIgnoreCase(ON_MON_FRI)
		    || on.equalsIgnoreCase(ON_MON_SAT)
		    || on.equalsIgnoreCase(ON_MONDAY))
		return true;
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.TUESDAY)
	{
	    if (on.equalsIgnoreCase(ON_MON_FRI)
		    || on.equalsIgnoreCase(ON_MON_SAT)
		    || on.equalsIgnoreCase(ON_TUESDAY))
		return true;
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.WEDNESDAY)
	{
	    if (on.equalsIgnoreCase(ON_MON_FRI)
		    || on.equalsIgnoreCase(ON_MON_SAT)
		    || on.equalsIgnoreCase(ON_WED))
		return true;
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.THURSDAY)
	{
	    if (on.equalsIgnoreCase(ON_MON_FRI)
		    || on.equalsIgnoreCase(ON_MON_SAT)
		    || on.equalsIgnoreCase(ON_THU))
		return true;
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.FRIDAY)
	{
	    if (on.equalsIgnoreCase(ON_MON_FRI)
		    || on.equalsIgnoreCase(ON_MON_SAT)
		    || on.equalsIgnoreCase(ON_FRI))
		return true;
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.SATURDAY)
	{
	    if (on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_SAT)
		    || on.equalsIgnoreCase(ON_SAT_SUN))
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

    /**
     * Sends email to recipient, here the subscriber is the recipient.
     * 
     * @param campaignJSON
     *            Campaign Data
     * @param subscriberJSON
     *            Subscriber Data
     * @param data
     *            Data within the workflow
     * @param nodeJSON
     *            Current Node data
     * @throws Exception
     */
    public void sendEmail(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Add Unsubscription Link
	try
	{
	    // Get Data
	    if (subscriberJSON.has("data"))
		subscriberJSON.getJSONObject("data").put("UnsubscribeLink",
			UNSUBSCRIBE_LINK + DBUtil.getId(subscriberJSON));
	}
	catch (Exception e)
	{
	}

	// Get From, Message
	String fromEmail = getStringValue(nodeJSON, subscriberJSON, data,
		FROM_EMAIL);
	String fromName = getStringValue(nodeJSON, subscriberJSON, data,
		FROM_NAME);

	String to = getStringValue(nodeJSON, subscriberJSON, data, TO);
	String subject = getStringValue(nodeJSON, subscriberJSON, data, SUBJECT);
	String html = getStringValue(nodeJSON, subscriberJSON, data, HTML_EMAIL);
	String text = getStringValue(nodeJSON, subscriberJSON, data, TEXT_EMAIL);
	String replyTo = getStringValue(nodeJSON, subscriberJSON, data,
		REPLY_TO);

	String keyword = getStringValue(nodeJSON, subscriberJSON, data,
		PURL_KEYWORD);

	String trackClicks = getStringValue(nodeJSON, subscriberJSON, data,
		TRACK_CLICKS);

	// Check if we need to convert links
	if (trackClicks != null
		&& trackClicks.equalsIgnoreCase(TRACK_CLICKS_YES))
	{
	    try
	    {
		// Generate a random number which can be used for tracking
		// clicks
		data.put(TRACKING_ID, Calendar.getInstance().getTimeInMillis());

		// Get Keyword
		text = convertLinks(text, " ", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));
		html = convertLinks(html, " ", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));

		text = convertLinks(text, "\n", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));
		html = convertLinks(html, "\n", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));

		text = convertLinks(text, "\r", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));
		html = convertLinks(html, "\r", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));

		text = convertLinks(text, "<", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));
		html = convertLinks(html, "<", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));

		text = convertLinks(text, "\"", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));
		html = convertLinks(html, "\"", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));

		text = convertLinks(text, "'", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));
		html = convertLinks(html, "'", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));

		text = convertLinks(text, "\"", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));
		html = convertLinks(html, "\"", data, keyword,
			DBUtil.getId(subscriberJSON),
			DBUtil.getId(campaignJSON));

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}

	// Creates log for sending email
	log(campaignJSON, subscriberJSON, nodeJSON, "From: " + fromEmail
		+ "<br>" + "To: " + to + "<br>" + "Subject: " + subject
		+ "<br>" + "Text: " + text);

	// Send Message
	if (html != null && html.length() > 10)
	{
	    html = appendTrackingImage(html, campaignJSON, subscriberJSON);

	    // Util.sendEmailUsingMailgun(fromEmail, fromName, to, subject,
	    // replyTo, html, text, subscriberJSON, campaignJSON);
	    SendGridEmail.sendMail(fromEmail, fromName, to, subject, replyTo,
		    html, text, subscriberJSON, campaignJSON);
	}
	else
	{
	    // Util.sendEmailUsingMailgun(fromEmail, fromName, to, subject,
	    // replyTo, null, text, subscriberJSON, campaignJSON);
	    SendGridEmail.sendMail(fromEmail, fromName, to, subject, replyTo,
		    null, text, subscriberJSON, campaignJSON);
	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }

    /**
     * Converts links to short urls.
     * 
     * @param input
     *            text or html body
     * @param delimiter
     *            various delimiters such as \r,\n etc
     * @param data
     *            Data within the workflow
     * @param keyword
     *            Purl keyword given
     * @param subscriberId
     *            Contact Id that subscribes to campaign
     * @return shortened url with purl keyword if given
     * @throws Exception
     */
    public String convertLinks(String input, String delimiter, JSONObject data,
	    String keyword, String subscriberId, String campaignId)
	    throws Exception
    {
	boolean converted = false;

	// Tokens
	String[] tokens = input.split(delimiter);
	for (int i = 0; i < tokens.length; i++)
	{

	    // Avoid image urls
	    if (tokens[i].startsWith("http")
		    && !tokens[i].startsWith("http://goo.gl")
		    && !tokens[i].startsWith("http://usertracker")
		    && !tokens[i].startsWith("http://unscr.be")
		    && !tokens[i].endsWith(".png")
		    && !tokens[i].endsWith(".jpg")
		    && !tokens[i].endsWith(".jpeg")
		    && !tokens[i].endsWith(".gif")
		    && !tokens[i].endsWith(".bmp")
		    && !tokens[i].endsWith(".dtd"))
	    {
		// Shorten URL
		String url = URLShortenerUtil.getShortURL(tokens[i], keyword,
			subscriberId, data.getString(TRACKING_ID), campaignId);

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

    /**
     * Appends tracking image for html body
     * 
     * @param html
     *            - html body.
     * @param campaignJSON
     *            - CampaignJSON.
     * @param subsciberJSON
     *            - SubscriberJSON.
     * @return html string with appended image.
     **/
    public String appendTrackingImage(String html, JSONObject campaignJSON,
	    JSONObject subsciberJSON)
    {
	String namespace = NamespaceManager.get();
	String campaignId = DBUtil.getId(campaignJSON);
	String subscriberId = DBUtil.getId(subsciberJSON);

	if (StringUtils.isEmpty(namespace) || StringUtils.isEmpty(campaignId)
		|| StringUtils.isEmpty(subscriberId))
	    return html;

	String trackingImage = "<div><img src=\"https://" + namespace
		+ ".agilecrm.com/backend/open?n=" + namespace + "&c="
		+ campaignId + "&s=" + subscriberId
		+ "\" nosend=\"1\" width=\"1\" height=\"1\"></img></div>";

	return html + trackingImage;
    }
}