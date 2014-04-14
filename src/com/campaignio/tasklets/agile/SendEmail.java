package com.campaignio.tasklets.agile;

import java.net.URLEncoder;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.mandrill.util.MandrillUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.VersioningUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.Mailgun;

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
     * Regex to find http urls in a string
     */
    public static final String HTTP_URL_REGEX = "\\b(https|http|HTTP|HTTPS)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;(){}\"\']*[-a-zA-Z0-9+&@#/%=~_|]";

    /**
     * Extensions to avoid url shortening
     */
    public static String extensions[] = { ".png", ".jpg", ".jpeg", ".jp2", ".jpx", ".gif", ".tif", ".pbm", ".bmp", ".tiff", ".ppm", ".pgm", ".pnm", ".dtd" };
    public static List<String> extensionsList = Arrays.asList(extensions);

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
     * CC email id.
     */
    public static String CC = "cc_email";

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
     * Click event tracking id
     */
    public static String CLICK_TRACKING_ID = "click_tracking_id";

    /**
     * Flags to communicate b/w Opened and Clicked nodes.
     */
    public static String EMAIL_OPEN = "email_open";
    public static String EMAIL_CLICK = "email_click";

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
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// No email
	if (!subscriberJSON.getJSONObject("data").has("email"))
	{
	    LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
		    "Email cannot be sent as there is no email-id for this contact.", LogType.EMAIL_SENDING_FAILED.toString());

	    // Execute Next One in Loop
	    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

	    return;
	}

	// Verify Unsubscribed status
	if (subscriberJSON.has("isUnsubscribedAll"))
	{
	    if (subscriberJSON.getBoolean("isUnsubscribedAll"))
	    {
		System.err.println("Skipping SendEmail node for " + subscriberJSON.getJSONObject("data").getString(Contact.EMAIL)
			+ " as it is Unsubscribed from All.");

		// Add log
		LogUtil.addLogToSQL(
			AgileTaskletUtil.getId(campaignJSON),
			AgileTaskletUtil.getId(subscriberJSON),
			"Campaign email was not sent since the contact unsubscribed from the campaign <br><br> Email subject: "
				+ getStringValue(nodeJSON, subscriberJSON, data, SUBJECT), LogType.EMAIL_SENDING_SKIPPED.toString());

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

		return;
	    }
	}

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

	System.out.println(DateUtil.getCalendarString(calendar.getTimeInMillis()));

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
	System.out.println(DateUtil.getCalendarString(calendar.getTimeInMillis()));

	// Sleep till that day
	// Add ourselves to Cron Queue
	long timeout = calendar.getTimeInMillis();
	addToCron(campaignJSON, subscriberJSON, data, nodeJSON, timeout, null, null, null);
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.campaignio.tasklets.TaskletAdapter#timeOutComplete(org.json.JSONObject
     * , org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void timeOutComplete(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
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
    public void sendEmail(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Add Unsubscription Link
	addUnsubscribeLink(subscriberJSON, campaignJSON);

	// Get From, Message
	String fromEmail = getStringValue(nodeJSON, subscriberJSON, data, FROM_EMAIL);
	String fromName = getStringValue(nodeJSON, subscriberJSON, data, FROM_NAME);

	String to = getStringValue(nodeJSON, subscriberJSON, data, TO);
	String cc = getStringValue(nodeJSON, subscriberJSON, data, CC);

	String subject = getStringValue(nodeJSON, subscriberJSON, data, SUBJECT);

	String html = getStringValue(nodeJSON, subscriberJSON, data, HTML_EMAIL);

	String text = getStringValue(nodeJSON, subscriberJSON, data, TEXT_EMAIL);

	String replyTo = getStringValue(nodeJSON, subscriberJSON, data, REPLY_TO);

	String keyword = getStringValue(nodeJSON, subscriberJSON, data, PURL_KEYWORD);

	String trackClicks = getStringValue(nodeJSON, subscriberJSON, data, TRACK_CLICKS);

	// Temporary variables to hold ids
	String subscriberId = AgileTaskletUtil.getId(subscriberJSON);
	String campaignId = AgileTaskletUtil.getId(campaignJSON);

	// Check if we need to convert links
	if (trackClicks != null && trackClicks.equalsIgnoreCase(TRACK_CLICKS_YES))
	{
	    try
	    {
		// Generate a random number which can be used for tracking
		// clicks
		data.put(CLICK_TRACKING_ID, System.currentTimeMillis());

		text = convertLinksUsingRegex(text, subscriberId, campaignId);
		html = convertLinksUsingRegex(html, subscriberId, campaignId);

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}

	// Appends Agile label
	text = StringUtils.replace(text, EmailUtil.getPoweredByAgileLink("campaign", "Powered by"), "Sent using Agile");
	text = EmailUtil.appendAgileToText(text, "Sent using");

	// Send Message
	if (html != null && html.length() > 10)
	{
	    html = EmailUtil.appendTrackingImage(html, campaignId, subscriberId);

	    // If no powered by merge field, append Agile label to html
	    if (!StringUtils.contains(html, EmailUtil.getPoweredByAgileLink("campaign", "Powered by")))
		html = EmailUtil.appendAgileToHTML(html, "campaign", "Powered by");

	    // if cc present, send using Mailgun as it supports 'Cc'
	    if (!StringUtils.isEmpty(cc))
		Mailgun.sendMail(fromEmail, fromName, to, cc, null, subject, replyTo, html, text);
	    else
		MandrillUtil.sendMail(fromEmail, fromName, to, subject, replyTo, html, text);
	}
	else
	{
	    // if cc present, send using Mailgun as it supports 'Cc'
	    if (!StringUtils.isEmpty(cc))
		Mailgun.sendMail(fromEmail, fromName, to, cc, null, subject, replyTo, null, text);
	    else
		MandrillUtil.sendMail(fromEmail, fromName, to, subject, replyTo, null, text);
	}

	// Creates log for sending email
	LogUtil.addLogToSQL(campaignId, subscriberId, "Subject: " + subject, LogType.EMAIL_SENT.toString());

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }

    /**
     * Replaces http urls with agile tracking urls
     * 
     * @param input
     *            - text or html
     * @param subscriberId
     *            - subscriber id
     * @param campaignId
     *            - campaign id
     * @return String
     */
    public String convertLinksUsingRegex(String input, String subscriberId, String campaignId)
    {
	Pattern p = Pattern.compile(HTTP_URL_REGEX);
	Matcher m = p.matcher(input);

	StringBuffer stringBuffer = new StringBuffer();

	// Domain URL
	// String domainURL = VersioningUtil.getLoginURL(NamespaceManager.get(),
	// "sandbox");

	String domainURL = VersioningUtil.getDefaultLoginUrl(NamespaceManager.get());

	try
	{
	    // Iterate over matches
	    while (m.find())
	    {
		String url = m.group();

		// Replaces valid http urls with agile tracking links
		if (isSpecialLink(url))
		{
		    // Appends to StringBuffer
		    m.appendReplacement(stringBuffer, domainURL + "/backend/click?u=" + url + "&s=" + subscriberId + "&c=" + campaignId);
		}
	    }

	    // append last characters to the stringbuffer too
	    m.appendTail(stringBuffer);

	    input = stringBuffer.toString();
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while converting links..." + e.getMessage());
	    e.printStackTrace();
	}

	return input;
    }

    /**
     * Validates links present in the email body (either in text or html)
     * inorder which urls need to be shortened. It omits the links ended with
     * image extensions and links like http://agle.cc
     * 
     * @param str
     *            - String token obtained based on delimiters
     * @return Boolean
     */
    private boolean isSpecialLink(String str)
    {
	boolean isContains = false;

	if (str.indexOf('.') == -1)
	    return false;

	// Compares string token with the extensions
	isContains = extensionsList.contains(str.substring(str.lastIndexOf('.')).toLowerCase());

	if ((str.toLowerCase().startsWith("http") || str.toLowerCase().startsWith("https")) && !isContains && !str.toLowerCase().contains("unsubscribe")
		&& !StringUtils.equals(str, EmailUtil.getPoweredByAgileURL("campaign"))
		&& (StringUtils.startsWith(str, "https://www.agilecrm.com") || !str.toLowerCase().contains(".agilecrm.com"))
		&& !str.toLowerCase().startsWith("http://goo.gl") && !str.toLowerCase().startsWith("http://agle.cc")
		&& !str.toLowerCase().startsWith("http://unscr.be"))
	    return true;

	return false;
    }

    /**
     * Adds unsubscribe link to subscriber json with subscribe-id, campaign-id
     * and email as query params
     * 
     * @param subscriberJSON
     *            - subscriberJSON
     * @param campaignJSON
     *            -campaignJSON
     */
    public void addUnsubscribeLink(JSONObject subscriberJSON, JSONObject campaignJSON)
    {

	try
	{
	    // Get Data
	    if (subscriberJSON.has("data"))
		subscriberJSON.getJSONObject("data").put(
			"unsubscribe_link",
			"https://" + NamespaceManager.get() + ".agilecrm.com/unsubscribe?sid="
				+ URLEncoder.encode(AgileTaskletUtil.getId(subscriberJSON), "UTF-8") + "&cid="
				+ URLEncoder.encode(AgileTaskletUtil.getId(campaignJSON), "UTF-8") + "&e="
				+ URLEncoder.encode(subscriberJSON.getJSONObject("data").getString("email"), "UTF-8"));
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in SendEmail while inserting unsubscribe link " + e.getMessage());
	    e.printStackTrace();
	}

    }

}