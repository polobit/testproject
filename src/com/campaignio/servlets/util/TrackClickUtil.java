package com.campaignio.servlets.util;

import java.net.URLEncoder;
import java.util.Iterator;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.servlets.EmailOpenServlet;
import com.campaignio.servlets.deferred.EmailClickDeferredTask;
import com.campaignio.tasklets.agile.SendEmail;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class TrackClickUtil
{
    /**
     * Adds email clicked log to SQL.
     * 
     * @param campaignId
     *            - Campaign Id
     * @param subscriberId
     *            - Contact Id
     * @param longURL
     *            - Original url
     * @param workflowName
     *            - Workflow Name.
     */
    public static void addEmailClickedLog(String campaignId, String subscriberId, String longURL, String workflowName)
    {
	System.out.println("In email clicked log...");

	LogUtil.addLogToSQL(campaignId, subscriberId, "Email link clicked " + longURL + " of campaign " + workflowName,
	        LogType.EMAIL_CLICKED.toString());

	// If no email opened log, add it along with click
	if (!isOpened(campaignId, subscriberId))
	    EmailOpenServlet.addEmailOpenedLog(campaignId, subscriberId, workflowName);
    }

    /**
     * Shows email clicked notification to the contact.
     * 
     * @param contact
     *            - Contact Object.
     * @param workflowName
     *            - Workflow Name.
     * @param longURL
     *            - Original URL.
     */
    public static void showEmailClickedNotification(Contact contact, String workflowName, String longURL)
    {
	try
	{
	    JSONObject customJSON = new JSONObject();

	    // For personal emails, no workflow name
	    if (!StringUtils.isBlank(workflowName))
		customJSON.put("workflow_name", workflowName);

	    customJSON.put("url_clicked", longURL);

	    NotificationPrefsUtil.executeNotification(Type.CLICKED_LINK, contact,
		    new JSONObject().put("custom_value", customJSON));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Removes spaces and new line characters from longURL.
     * 
     * @param url
     *            - Original url that is stored in URLShortener.
     * @return String.
     */
    public static String normaliseLongURL(String url)
    {
	String longURL = url;

	// If URL has spaces or erroneous chars - we chop them
	if (longURL.contains(" "))
	{
	    System.out.println("Trimming " + longURL);
	    longURL = longURL.substring(0, longURL.indexOf(" "));
	}

	if (longURL.contains("\r"))
	{
	    System.out.println("Trimming " + longURL);
	    longURL = longURL.substring(0, longURL.indexOf("\r"));
	}
	if (longURL.contains("\n"))
	{
	    System.out.println("Trimming " + longURL);
	    longURL = longURL.substring(0, longURL.indexOf("\n"));
	}

	return longURL;
    }

    /**
     * Appends contact-properties as params to the url before redirecting to
     * original url.
     * 
     * @param contact
     *            - Contact Object.
     * @return String
     */
    @SuppressWarnings("unchecked")
    public static String appendContactPropertiesToParams(Contact contact)
    {
	String params = "";

	JSONObject contactJSON = AgileTaskletUtil.getSubscriberJSON(contact, true);

	// if null returned due to exception, return empty
	if (contactJSON == null)
	    return params;

	// Remove unnecessary params like powered_by etc
	contactJSON = removeAvoidableParams(contactJSON);

	// Iterate through JSON and construct all params
	Iterator<String> itr = contactJSON.keys();

	while (itr.hasNext())
	{
	    // Get Property Name & Value
	    String propertyName = itr.next();
	    String value = "";
	    try
	    {
		value = contactJSON.getString(propertyName);
		params += ("&" + propertyName.trim() + "=" + URLEncoder.encode(value.trim(), "UTF-8"));
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}
	return params;
    }

    /**
     * Interrupts crons that are saved by Clicked Node of Campaigns.
     * 
     * @param trackerId
     *            - Tracking Id saved in URLShortener. It identifies related
     *            cron object.
     * @param longURL
     *            - Original url to show as custom-data in clicked log.
     */
    public static void interruptCronTasksOfClicked(String clickTrackingId, String campaignId, String subscriberId)
    {

	try
	{
	    JSONObject interruptedData = new JSONObject();
	    interruptedData.put(SendEmail.EMAIL_CLICK, true);
	    interruptedData.put(SendEmail.EMAIL_OPEN, true);

	    // Interrupt clicked in DeferredTask
	    EmailClickDeferredTask emailClickDeferredTask = new EmailClickDeferredTask(clickTrackingId, campaignId,
		    subscriberId, interruptedData.toString());
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.addAsync(TaskOptions.Builder.withPayload(emailClickDeferredTask));
	}
	catch (Exception e)
	{
	    System.out.println("Got Exception in RedirectServlet " + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Removes unnecessary params from contact json
     * 
     * @param contactJSON
     *            - contact properties in json
     * @return JSONObject
     */
    private static JSONObject removeAvoidableParams(JSONObject contactJSON)
    {
	try
	{
	    // Remove unwanted keys
	    contactJSON.remove("isUnsubscribedAll");
	    contactJSON.remove("isBounce");
	    contactJSON.remove("id");
	    contactJSON.getJSONObject("data").remove("powered_by");
	    contactJSON.getJSONObject("data").remove("created_date");
	    contactJSON.getJSONObject("data").remove("modified_date");
	    contactJSON.getJSONObject("data").remove("modified_time");
	    contactJSON.getJSONObject("data").remove("score");
	    contactJSON.getJSONObject("data").remove("owner");
	}
	catch (Exception e)
	{
	    System.out.println("Exception occured in appendContactPropertiesToParams " + e.getMessage());
	    e.printStackTrace();
	}

	return contactJSON;
    }

    /**
     * Returns true if Email Opened logs count is greater than zero
     * 
     * @param campaignId
     *            - Campaign Id
     * @param subscriberId
     *            - Subscriber Id
     * @return boolean
     */
    private static boolean isOpened(String campaignId, String subscriberId)
    {
	int count = LogUtil.getLogsCount(campaignId, subscriberId, LogType.EMAIL_OPENED);

	System.out.println("Email Opened logs count is " + count);

	if (count == 0)
	    return false;

	return true;
    }

}
