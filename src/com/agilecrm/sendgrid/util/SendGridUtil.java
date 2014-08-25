package com.agilecrm.sendgrid.util;

import java.util.List;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.mandrill.util.MandrillUtil;
import com.agilecrm.queues.backend.BackendUtil;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.sendgrid.util.deferred.SendGridDeferredTask;
import com.agilecrm.util.HttpClientUtil;
import com.google.appengine.api.taskqueue.TaskHandle;
import com.thirdparty.SendGrid;

/**
 * <code>SendGridUtil</code> is the utility class for bulk sending using
 * SendGrid api
 * 
 * @author Naresh
 * 
 */
public class SendGridUtil
{

    /**
     * Substitution tags
     * 
     */
    public enum SendGridSubVars
    {
	SUBJECT, HTML, TEXT;

	public String getString()
	{
	    return "-" + this.toString() + "-";
	}
    }

    /**
     * Adds SendGrid deferred tasks to email pull queue
     * 
     * @param apiUser
     *            - sendgrid api user
     * @param apiKey
     *            - sendgrid api key
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email (can be multiple separated by comma)
     * @param cc
     *            - cc email (can be multiple separated by comma)
     * @param bcc
     *            - bcc email (can be multiple separated by comma)
     * @param subject
     *            - email subject
     * @param replyTo
     *            - reply to
     * @param html
     *            - html body
     * @param text
     *            - text body
     */
    public static void sendMail(String apiUser, String apiKey, String fromEmail, String fromName, String to, String cc,
	    String bcc, String subject, String replyTo, String html, String text)
    {
	SendGridDeferredTask sendGridDeferredTask = new SendGridDeferredTask(apiUser, apiKey, fromEmail, fromName, to,
	        cc, bcc, subject, replyTo, html, text);

	PullQueueUtil.addToPullQueue(
	        "bulk".equals(BackendUtil.getCurrentBackendName()) ? AgileQueues.BULK_EMAIL_PULL_QUEUE
	                : AgileQueues.NORMAL_EMAIL_PULL_QUEUE, sendGridDeferredTask, fromEmail);
    }

    /**
     * Sends bulk emails in one request
     * 
     * @param tasks
     */
    public static void sendSendGridMails(List<TaskHandle> tasks)
    {
	try
	{
	    TaskHandle firstTaskHandle = tasks.get(0);

	    // Email fields lists
	    JSONArray toArray = new JSONArray();
	    JSONArray subjectArray = new JSONArray();
	    JSONArray htmlArray = new JSONArray();
	    JSONArray textArray = new JSONArray();

	    // To emails separated by commas
	    String to = "";

	    JSONArray tempArray = new JSONArray();

	    for (TaskHandle task : tasks)
	    {
		SendGridDeferredTask sendgridDeferredTask = (SendGridDeferredTask) SerializationUtils.deserialize(task
		        .getPayload());

		// If same To email or CC or BCC exists, send email without
		// merging
		if (!StringUtils.isBlank(sendgridDeferredTask.cc) || !StringUtils.isBlank(sendgridDeferredTask.bcc)
		        || isToExists(toArray, sendgridDeferredTask.to) || sendgridDeferredTask.to.contains(","))
		{
		    sendWithoutMerging(sendgridDeferredTask);
		    continue;
		}

		toArray.put(sendgridDeferredTask.to);

		subjectArray.put(sendgridDeferredTask.subject);

		htmlArray.put(MandrillUtil.getHTML(sendgridDeferredTask.html, sendgridDeferredTask.text));

		textArray.put(sendgridDeferredTask.text);

		// to emails separated by comma
		to += sendgridDeferredTask.to + ",";

		if (toArray.length() > MandrillUtil.MIN_TO_EMAILS
		        && htmlArray.toString().length() >= MandrillUtil.MAX_CONTENT_SIZE)
		{
		    tempArray.put(new JSONObject().put("to", to).put("to_list", toArray)
			    .put("subject_list", subjectArray).put("html_list", htmlArray).put("text_list", textArray));

		    // Reset fields
		    toArray = new JSONArray();
		    subjectArray = new JSONArray();
		    htmlArray = new JSONArray();
		    textArray = new JSONArray();
		    to = "";
		}

	    }

	    // Append those not exceeded
	    if (toArray.length() != 0)
		tempArray.put(new JSONObject().put("to", to).put("to_list", toArray).put("subject_list", subjectArray)
		        .put("html_list", htmlArray).put("text_list", textArray));

	    SendGridDeferredTask firstSendGridDefferedTask = (SendGridDeferredTask) SerializationUtils
		    .deserialize(firstTaskHandle.getPayload());

	    // Iterates over splitted json array and send batch of emails
	    for (int i = 0, len = tempArray.length(); i < len; i++)
	    {
		String postData = SendGrid.getSendGridQueryString(firstSendGridDefferedTask.apiUser,
		        firstSendGridDefferedTask.apiKey, firstSendGridDefferedTask.fromEmail,
		        firstSendGridDefferedTask.fromName, tempArray.getJSONObject(i).getString("to"), null, null,
		        SendGridSubVars.SUBJECT.getString(), firstSendGridDefferedTask.replyTo,
		        SendGridSubVars.HTML.getString(), SendGridSubVars.TEXT.getString(),
		        getSMTPJSON(tempArray.getJSONObject(i)).toString());

		HttpClientUtil.accessPostURLUsingHttpClient(SendGrid.SENDGRID_API_POST_URL, postData);
	    }

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while sending ..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Returns constructed SMTP JSON
     * 
     * @param json
     * @param i
     * @return
     * @throws JSONException
     */
    private static JSONObject getSMTPJSON(JSONObject json) throws JSONException
    {
	JSONObject SMTPJSON = new JSONObject();

	SMTPJSON.put("to", json.getJSONArray("to_list"));

	SMTPJSON.put(
	        "sub",
	        new JSONObject().put(SendGridSubVars.SUBJECT.getString(), json.getJSONArray("subject_list"))
	                .put(SendGridSubVars.HTML.getString(), json.getJSONArray("html_list"))
	                .put(SendGridSubVars.TEXT.getString(), json.getJSONArray("text_list")));
	return SMTPJSON;
    }

    /**
     * Sends email normally
     * 
     * @param sendGridDeferred
     */
    public static void sendWithoutMerging(SendGridDeferredTask sendGridDeferred)
    {

	SendGrid.sendMail(sendGridDeferred.apiUser, sendGridDeferred.apiKey, sendGridDeferred.fromEmail,
	        sendGridDeferred.fromName, sendGridDeferred.to, sendGridDeferred.cc, sendGridDeferred.bcc,
	        sendGridDeferred.subject, sendGridDeferred.replyTo, sendGridDeferred.html, sendGridDeferred.text, null);
    }

    /**
     * Verifies whether To email exists in list. When multiple send email nodes
     * exists in a workflow, emails need to be send immediately.
     * 
     * @param toList
     *            - To emails list
     * @param toEmail
     *            - email to compare
     * @return boolean
     */
    public static boolean isToExists(JSONArray toArray, String toEmail)
    {
	try
	{
	    for (int i = toArray.length() - 1; i >= 0; i--)
	    {
		if (StringUtils.equals(toEmail, toArray.getString(i)))
		    return true;
	    }
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while comparing To..." + e.getMessage());
	    e.printStackTrace();
	}

	return false;
    }
}
