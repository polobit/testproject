package com.campaignio.tasklets.agile;

import java.net.URLEncoder;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.TimeZone;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.Globals;
import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.bounce.EmailBounceStatus;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.queues.backend.ModuleUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.EmailLinksConversion;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.VersioningUtil;
import com.agilecrm.workflows.unsubscribe.util.UnsubscribeStatusUtil;
import com.campaignio.cron.Cron;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.sms.SendMessage;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.sendgrid.SendGrid;
import com.thirdparty.mandrill.webhook.MandrillWebhook;

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
    public static String extensions[] = { ".png", ".jpg", ".jpeg", ".jp2", ".jpx", ".gif", ".tif", ".pbm", ".bmp",
	    ".tiff", ".ppm", ".pgm", ".pnm", ".dtd" };
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
     * BCC email id.
     */
    public static String BCC = "bcc_email";

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

    public static String TRACK_CLICKS_YES_AND_PUSH = "yes_and_push";
    public static String TRACK_CLICKS_YES_AND_PUSH_AND_EMAIL_ONLY = "yes_and_push_email_only";

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
    
    /**
     * Time out true and time out false
     */
    public static boolean TIME_OUT_FALSE = false;
    public static boolean TIME_OUT_TRUE = true;

    /*
     * Unsubscribe Links public static String UNSUBSCRIBE_LINK =
     * "http://usertracker.contactuswidget.appspot.com/cd_unsubscribe.jsp?id=";
     */
    /**
     * Unsubscribe link that is shortened
     */
    //private static final String UNSUBSCRIBE_LINK = "http://ag-email.unscr.me/";
    //private static final String UNSUBSCRIBE_SANDBOX_LINK = "http://ag-beta.unscr.me/";
    
    private static final String UNSUBSCRIBE_LINK = "https://list-manage.agle1.cc/unsubscribe";
    private static final String UNSUBSCRIBE_SANDBOX_LINK = "http://list-manage-beta.agle1.cc/unsubscribe";
    

    /*
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {

    	// Get From, Message
    	String fromEmail = getStringValue(nodeJSON, subscriberJSON, data, FROM_EMAIL);
    	String to = getStringValue(nodeJSON, subscriberJSON, data, TO);
    	String cc = getStringValue(nodeJSON, subscriberJSON, data, CC);
    	String bcc = getStringValue(nodeJSON, subscriberJSON, data, BCC);
    	String replyTo = getStringValue(nodeJSON, subscriberJSON, data, REPLY_TO);
    	
    	if(StringUtils.isNotBlank(to) && !isValidEmailAddress(to)){
    		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
    			    "Email skipped since \'To\' address is invalid.",
    			    LogType.EMAIL_SENDING_SKIPPED.toString());

    		// Execute Next One in Loop
    		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    		return;
    	}

    	if(StringUtils.isNotBlank(cc) && !isValidEmailAddress(cc)){
    		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
    			    "Email skipped since \'CC\' address is invalid.",
    			    LogType.EMAIL_SENDING_SKIPPED.toString());

    		// Execute Next One in Loop
    		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    		return;
    	}

    	if(StringUtils.isNotBlank(bcc) && !isValidEmailAddress(bcc)){
    		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
    			    "Email skipped since \'BCC\' address is invalid.",
    			    LogType.EMAIL_SENDING_SKIPPED.toString());

    		// Execute Next One in Loop
    		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    		return;
    	}

    	    	
    	data.remove(SendMessage.SMS_CLICK_TRACKING_ID);
    	data.remove(TwitterSendMessage.TWEET_CLICK_TRACKING_ID);
    	
    	// If From email empty
    	if(StringUtils.isBlank(fromEmail))
    	{
    		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
    			    "Email skipped since \'From\' address is invalid.",
    			    LogType.EMAIL_SENDING_SKIPPED.toString());

    		// Execute Next One in Loop
    		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

    		return;
    	}
    	
    	// If To email empty
    	if(StringUtils.isBlank(to))
    	{
    		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
    			    "Email skipped since \'To\' address is invalid.",
    			    LogType.EMAIL_SENDING_SKIPPED.toString());

    		// Execute Next One in Loop
    		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

    		return;
    	}
    	
    	// If ReplyTo email invalid
    	if(StringUtils.isNotBlank(replyTo) && !isValidEmailAddress(replyTo))
    	{
    		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
    			    "Email skipped since \'ReplyTo\' address is invalid.",
    			    LogType.EMAIL_SENDING_SKIPPED.toString());

    		// Execute Next One in Loop
    		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

    		return;
    	}
    	
	// Verify Unsubscribed status
	if (subscriberJSON.has("isUnsubscribedAll"))
	{
	    if (subscriberJSON.getBoolean("isUnsubscribedAll") || UnsubscribeStatusUtil.isUnsubscribed(subscriberJSON, AgileTaskletUtil.getId(campaignJSON)))
	    {
		System.err.println("Skipping SendEmail node for "
		        + subscriberJSON.getJSONObject("data").getString(Contact.EMAIL)
		        + " as it is Unsubscribed from All.");

		// Add log
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
		        "Campaign email was not sent since the contact unsubscribed from the campaign <br><br> Email subject: "
		                + getStringValue(nodeJSON, subscriberJSON, data, SUBJECT),
		        LogType.EMAIL_SENDING_SKIPPED.toString());

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

		return;
	    }
	}

	// Verify HardBounce status
	if (subscriberJSON.has("isBounce"))
	{
	    if (subscriberJSON.getString("isBounce").equals(EmailBounceStatus.EmailBounceType.HARD_BOUNCE.toString()))
	    {
		// Add log
		LogUtil.addLogToSQL(
		        AgileTaskletUtil.getId(campaignJSON),
		        AgileTaskletUtil.getId(subscriberJSON),
		        "Campaign email was not sent due to hard bounce <br><br> Email subject: "
		                + getStringValue(nodeJSON, subscriberJSON, data, SUBJECT),
		        LogType.EMAIL_SENDING_SKIPPED.toString());

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
		return;
	    }

	    else if (subscriberJSON.getString("isBounce").equals(EmailBounceStatus.EmailBounceType.SPAM.toString()))
	    {
		// Add log
		LogUtil.addLogToSQL(
		        AgileTaskletUtil.getId(campaignJSON),
		        AgileTaskletUtil.getId(subscriberJSON),
		        "Campaign email was not sent due to spam complaint <br><br> Email subject: "
		                + getStringValue(nodeJSON, subscriberJSON, data, SUBJECT),
		        LogType.EMAIL_SENDING_SKIPPED.toString());

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

	System.out.println(DateUtil.getCalendarString(calendar.getTimeInMillis(), "dd MMM yyyy HH:mm:ss z", timeZoneString));

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

	Calendar currentCal = Calendar.getInstance(timeZone);
	
	// Check Day
	// Keep adding a day until it breaks
	for (int i = 0; i < 100; i++)
	{
	    // Add one day and check
	    calendar.add(Calendar.DAY_OF_MONTH, 1);
	    if (checkDay(calendar, on, at, currentCal))
	    {
		break;
	    }
	}

	System.out.println("Sleeping till ");
	System.out.println(DateUtil.getCalendarString(calendar.getTimeInMillis()));

	// Sleep till that day
	// Add ourselves to Cron Queue
	long timeout = calendar.getTimeInMillis();
	long currentTime=System.currentTimeMillis()-20000;
	if(timeout<currentTime){
		timeout=timeout+(7*24*60*60*1000);
		System.out.println("timeout:"+timeout+"currentTime:"+currentTime);
		
		
	}
	addToCron(campaignJSON, subscriberJSON, data, nodeJSON, timeout, null, null, null);
    }
    
    
    private boolean isValidEmailAddress(String emailAddresses){
    	Set<String> emailAddress = EmailUtil.getStringTokenSet(emailAddresses,",");
    	Iterator<String> emailAddressIterator = emailAddress.iterator();
    	
    	while(emailAddressIterator.hasNext()){
    		String address =emailAddressIterator.next();
    		if(!ContactUtil.isValidEmail(address)){
    			return false;
    		}
    	}
    	
    	return true;

    }
    
    /*
     * (non-Javadoc)
     * 
     * @see
     * com.campaignio.tasklets.TaskletAdapter#timeOutComplete(org.json.JSONObject
     * , org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void timeOutComplete(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
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
    public boolean checkDay(Calendar calendar, String on, String at, Calendar currentCal)
    {
	
	// Get Day
	int weekday = calendar.get(Calendar.DAY_OF_WEEK);
	

	if(on.equalsIgnoreCase(ON_ANY_DAY) || on.equalsIgnoreCase(ON_MON_FRI) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_SAT_SUN))
	{
	   if(weekday == currentCal.get(Calendar.DAY_OF_WEEK) && !at.equalsIgnoreCase(AT_ANY_TIME))
	   {
	       // Truncate time and get the time. 09:00
	       // Get Hours and mins
	       String hours = at.substring(0, 2);
	       String mins = at.substring(3);

	       if(Integer.parseInt(hours) < currentCal.get(Calendar.HOUR_OF_DAY))
	       {
		   System.out.println("Returning false as given minutes are less than current mins..." + currentCal.get(Calendar.HOUR_OF_DAY));
		   return false;
	       }
	       
	       if(Integer.parseInt(hours) == currentCal.get(Calendar.HOUR_OF_DAY))
	       {
		   if(Integer.parseInt(mins) < currentCal.get(Calendar.MINUTE))
		   {
		       System.out.println("Returning false as given minutes are less than current mins..." + currentCal.get(Calendar.MINUTE));
		       return false;
		   }
	       }
	   }
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.MONDAY)
	{
	    if (on.equalsIgnoreCase(ON_ANY_DAY) || on.equalsIgnoreCase(ON_MON_FRI) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_MONDAY))
		return true;
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.TUESDAY)
	{
	    if (on.equalsIgnoreCase(ON_ANY_DAY) || on.equalsIgnoreCase(ON_MON_FRI) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_TUESDAY))
		return true;
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.WEDNESDAY)
	{
	    if (on.equalsIgnoreCase(ON_ANY_DAY) || on.equalsIgnoreCase(ON_MON_FRI) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_WED))
		return true;
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.THURSDAY)
	{
	    if (on.equalsIgnoreCase(ON_ANY_DAY) || on.equalsIgnoreCase(ON_MON_FRI) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_THU))
		return true;
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.FRIDAY)
	{
	    if (on.equalsIgnoreCase(ON_ANY_DAY) || on.equalsIgnoreCase(ON_MON_FRI) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_FRI))
		return true;
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.SATURDAY)
	{
	    if (on.equalsIgnoreCase(ON_ANY_DAY) || on.equalsIgnoreCase(ON_MON_SAT) || on.equalsIgnoreCase(ON_SAT) || on.equalsIgnoreCase(ON_SAT_SUN))
		return true;
	}

	// Check if day matches - otherwise return false
	if (weekday == Calendar.SUNDAY)
	{
	    if (on.equalsIgnoreCase(ON_ANY_DAY) || on.equalsIgnoreCase(ON_SUN) || on.equalsIgnoreCase(ON_SAT_SUN))
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
     * @param timeOut 
     * @throws Exception
     */
    public void sendEmail(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {
	// Add Unsubscription Link
	addUnsubscribeLink(subscriberJSON, campaignJSON);

	// Get From, Message
	String fromEmail = getStringValue(nodeJSON, subscriberJSON, data, FROM_EMAIL);
	String fromName = getStringValue(nodeJSON, subscriberJSON, data, FROM_NAME);

	String to = getStringValue(nodeJSON, subscriberJSON, data, TO);
	String cc = getStringValue(nodeJSON, subscriberJSON, data, CC);
	String bcc = getStringValue(nodeJSON, subscriberJSON, data, BCC);
	
	String subject = getStringValue(nodeJSON, subscriberJSON, data, SUBJECT);

	String onlineLinkForEmail = getOnlineLinkForEmail(campaignJSON, subscriberJSON, nodeJSON);

	data.put("online_link", onlineLinkForEmail);
	
	String html = getStringValue(nodeJSON, subscriberJSON, data, HTML_EMAIL);

	data.remove("online_link");

	String text = getStringValue(nodeJSON, subscriberJSON, data, TEXT_EMAIL);

	String replyTo = getStringValue(nodeJSON, subscriberJSON, data, REPLY_TO);

	String keyword = getStringValue(nodeJSON, subscriberJSON, data, PURL_KEYWORD);

	String trackClicks = getStringValue(nodeJSON, subscriberJSON, data, TRACK_CLICKS);

	// Temporary variables to hold ids
	String subscriberId = AgileTaskletUtil.getId(subscriberJSON);
	String campaignId = AgileTaskletUtil.getId(campaignJSON);

	
	// Check if we need to convert links
	if (trackClicks != null
	        && (!trackClicks.equalsIgnoreCase(TRACK_CLICKS_NO)))
	{
	    try
	    {
		// Generate a random number which can be used for tracking
		// clicks
		data.put(CLICK_TRACKING_ID, System.currentTimeMillis());

		html = EmailLinksConversion.convertLinksUsingJSOUP(html, subscriberId, campaignId,
		        trackClicks);

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}

	// Appends name in format e.g., Naresh <naresh@agilecrm.com>
	to = EmailUtil.appendNameToEmail(to, subscriberJSON);
	
	Boolean isTimeOut = false;
	
	// Checks whether current node came after scheduled
	if(data.has(Cron.CRON_TYPE))
	{
		// If true
		String cronType = data.getString(Cron.CRON_TYPE);
		
		if(cronType != null && cronType.equalsIgnoreCase(Cron.CRON_TYPE_TIME_OUT))
			isTimeOut = true;
	}
	
	// Send Message
	if (html != null && html.length() > 10)
	{
		// html = appendUnsubscribeLink(html, subscriberId, campaignId, subscriberJSON.getJSONObject("data").getString("email"));
		
	    html = EmailUtil.appendTrackingImage(html, campaignId, subscriberId);

	    // Send HTML Email
	    sendEmail(fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
		    new JSONObject().put(MandrillWebhook.METADATA_CAMPAIGN_ID, campaignId).toString(), subscriberId,
		    campaignId, isTimeOut);
	}
	else
	{
	    // Send Text Email
	    sendEmail(fromEmail, fromName, to, cc, bcc, subject, replyTo, null, text,
		    new JSONObject().put(MandrillWebhook.METADATA_CAMPAIGN_ID, campaignId).toString(), subscriberId,
		    campaignId, isTimeOut);
	}

	// Creates log for sending email
	// LogUtil.addLogToSQL(campaignId, subscriberId, "Subject: " + subject,
	// LogType.EMAIL_QUEUED.toString());

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
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
		        "unsubscribe_link", getUnsubscribeLink(AgileTaskletUtil.getId(subscriberJSON), AgileTaskletUtil.getId(campaignJSON), 
		        			        	subscriberJSON.getJSONObject("data").getString("email")));
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in SendEmail while inserting unsubscribe link " + e.getMessage());
	    e.printStackTrace();
	}

    }

    /**
     * Sends email using Email APIs
     * 
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param cc
     *            - cc email
     * @param subject
     *            - email subject
     * @param replyTo
     *            - replyTo email
     * @param html
     *            - HTML body
     * @param text
     *            - text body
     * @param timeOut 
     */
    private void sendEmail(String fromEmail, String fromName, String to, String cc, String bcc, String subject,
	    String replyTo, String html, String text, String mandrillMetadata, String subscriberId, String campaignId, Boolean isTimeOut)
    {
	String domain = NamespaceManager.get();

	// Update campaign emailed time
	ContactUtil.updateCampaignEmailedTime(Long.parseLong(subscriberId), System.currentTimeMillis()/1000, to);
	
	EmailGateway emailGateway = EmailGatewayUtil.getEmailGateway();
	
	try{
	
	if(emailGateway!=null && emailGateway.email_api!=null && emailGateway.email_api.name()!=null && emailGateway.email_api.name().equalsIgnoreCase("SES")){
 		System.out.println("Sending mails through amazon pull queue");
 		EmailGatewayUtil.sendBulkEmail(
 		                 AgileQueues.AMAZON_SES_EMAIL_PULL_QUEUE, domain, fromEmail, fromName, to, cc, bcc, subject,
 		        replyTo, html, text, mandrillMetadata, subscriberId, campaignId);
  	}else{
	
	// Send Email using email gateway
	   String queueName = AgileQueues.NORMAL_EMAIL_PULL_QUEUE;
	   
	   if(Globals.BULK_BACKENDS.equals(ModuleUtil.getCurrentModuleName())
			   || Globals.BULK_ACTION_BACKENDS_URL.equals(ModuleUtil.getCurrentModuleName()))
		   queueName = AgileQueues.BULK_EMAIL_PULL_QUEUE;
	   else if(Globals.NORMAL_BACKENDS.equals(ModuleUtil.getCurrentModuleName()) && isTimeOut != null && isTimeOut)
		   queueName = AgileQueues.TIME_OUT_EMAIL_PULL_QUEUE;
	  		
		EmailGatewayUtil.sendBulkEmail(queueName, domain, fromEmail, fromName, to, cc, bcc, subject,
	        replyTo, html, text, mandrillMetadata, subscriberId, campaignId);
  	}
	}catch(Exception e){
		System.err.println("Error occured in sending email:"+e.getMessage());
	}

    }

    /**
     * This method responsible for constructing a url, which is used to read
     * campaign emails online
     * 
     * @param campaignJSON
     * @param subscriberJSON
     * @param nodeJSON
     * @return
     * @throws Exception
     */
    private String getOnlineLinkForEmail(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject nodeJSON)
    {
	String url = "";
	try
	{
	    String domain = NamespaceManager.get();
	    
	    String onlineLink = "https://list-manage.agle1.cc/onlinelink";
	    
	    if(!VersioningUtil.isProductionAPP())
	    	onlineLink = "http://list-manage-beta.agle1.cc/onlinelink";
	    
	    StringBuffer buffer = new StringBuffer();
	    buffer.append(onlineLink);
	    buffer.append("/" + campaignJSON.get("id").toString());
	    buffer.append("/" + subscriberJSON.get("id").toString());
	    buffer.append("/" + nodeJSON.get("id").toString());
	    buffer.append("?ns=" + URLEncoder.encode(domain, "UTF-8"));
	    url = buffer.toString();
	}
	catch (Exception e)
	{
	    System.out.println("Error occured while constructing online link for email");
	}
	return url;
    }
    
    
    private String getUnsubscribeLink(String subscriberId, String campaignId, String email)
    {
    	try
    	{
    	    String unsubscribeLink = UNSUBSCRIBE_LINK;
    	    
    	    if(!VersioningUtil.isProductionAPP())
    		unsubscribeLink = UNSUBSCRIBE_SANDBOX_LINK;
    		
    	    return unsubscribeLink + "?e="
                    + URLEncoder.encode(email, "UTF-8")
                    + "&ns="+URLEncoder.encode(NamespaceManager.get(),"UTF-8")
                    + "&sid=" + URLEncoder.encode(subscriberId, "UTF-8")
                    + "&cid=" + URLEncoder.encode(campaignId, "UTF-8");
    	}
    	catch(Exception e)
    	{
    	   System.err.println("Exception occured while returning unsubscribe link..." + e.getMessage());
    	   e.printStackTrace();
    	   return null;
    	}
    }
        
        
    private String appendUnsubscribeLink(String html, String subscriberId, String campaignId, String email)
    {
    	if(StringUtils.isBlank(html) || StringUtils.contains(html, VersioningUtil.getHostURLByApp(NamespaceManager.get())+"unsubscribe"))
    	    return html;
    	
    	return html + "<br><br><div style=\"float:right;\"><a href=\"" + getUnsubscribeLink(subscriberId, campaignId, email) + "\" target=\"_blank\" style=\"text-decoration:none;\" rel=\"nofollow\"> Unsubscribe</a></div>";
    	
    }
}
