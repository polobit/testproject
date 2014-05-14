package com.agilecrm.mandrill.util;

import java.util.List;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.account.util.AccountEmailStatsUtil;
import com.agilecrm.mandrill.util.deferred.MandrillDeferredTask;
import com.agilecrm.queues.backend.BackendUtil;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.util.HttpClientUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.TaskHandle;
import com.thirdparty.mandrill.Mandrill;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

/**
 * <code>MandrillUtil</code> is the utility class for fetching tasks from pull
 * queue and process them. It constructs mail json to send bulk emails with
 * mandrill merge variables
 * 
 * @author Naresh
 * 
 */
public class MandrillUtil
{

    /**
     * Lease period of pull-queue tasks
     */
    public static final int LEASE_PERIOD = 500;

    /**
     * Limit to fetch pull-queue tasks. Max limit to fetch is 1000
     */
    public static final int COUNT_LIMIT = 500;

    /**
     * Mandrill merge vars surrounded by *| |*. Merge vars are case-insensitive.
     * 
     */
    public static enum MandrillMergeVars
    {
	SUBJECT, HTML_CONTENT, TEXT_CONTENT;

	public String getMergeVar()
	{
	    return "*|" + this.name() + "|*";
	}
    }

    /**
     * Adds tasks to pull queue
     * 
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param subject
     *            - email subject
     * @param replyTo
     *            - reply to
     * @param html
     *            - html content
     * @param text
     *            - text content
     */
    public static void sendMail(String fromEmail, String fromName, String to, String subject, String replyTo,
	    String html, String text)
    {
	String subaccount = NamespaceManager.get();
	MandrillDeferredTask mandrillDeferredTask = new MandrillDeferredTask(subaccount, fromEmail, fromName, to,
		subject, replyTo, html, text);

	PullQueueUtil.addToPullQueue(
		"bulk".equals(BackendUtil.getCurrentBackendName()) ? AgileQueues.BULK_EMAIL_PULL_QUEUE
			: AgileQueues.NORMAL_EMAIL_PULL_QUEUE, mandrillDeferredTask, fromEmail);
    }

    /**
     * Sends mails through mandrill. It constructs mail json with merge
     * variables and their content
     * 
     * @param tasks
     *            - pull queue leased tasks
     */
    public static void sendMandrillMails(List<TaskHandle> tasks)
    {
	TaskHandle firstTaskHandle = tasks.get(0);

	MandrillDeferredTask firstMandrillDefferedTask = (MandrillDeferredTask) SerializationUtils
		.deserialize(firstTaskHandle.getPayload());

	JSONObject mailJSON = getMandrillMailJSON(firstMandrillDefferedTask.subaccount,
		firstMandrillDefferedTask.fromEmail, firstMandrillDefferedTask.fromName,
		firstMandrillDefferedTask.replyTo);

	JSONArray mergeVarsArray = new JSONArray();
	JSONArray toArray = new JSONArray();

	try
	{
	    //
	    for (TaskHandle task : tasks)
	    {
		MandrillDeferredTask mandrillDeferredTask = (MandrillDeferredTask) SerializationUtils.deserialize(task
			.getPayload());

		// If same To email exists, send email without merging
		if (isToExists(toArray, mandrillDeferredTask.to))
		{
		    sendWithoutMerging(mandrillDeferredTask);
		    continue;
		}

		// MergeVars
		mergeVarsArray.put(getEachMergeJSON(mandrillDeferredTask.to, mandrillDeferredTask.subject,
			mandrillDeferredTask.html, mandrillDeferredTask.text));

		// To array
		toArray.put(new JSONObject().put(Mandrill.MANDRILL_RECIPIENT_EMAIL, mandrillDeferredTask.to));
	    }

	    mailJSON.getJSONObject(Mandrill.MANDRILL_MESSAGE).put(Mandrill.MANDRILL_TO, toArray)
		    .put(Mandrill.MANDRILL_MERGE_VARS, mergeVarsArray).put(Mandrill.MANDRILL_MERGE, true)
		    .put(Mandrill.MANDRILL_PRESERVE_RECIPIENTS, false);
	}
	catch (Exception e)
	{
	    System.err.println("Got exception in createJSONandSend " + e.getMessage());
	    e.printStackTrace();
	}

	HttpClientUtil.accessPostURLUsingHttpClient(
		Mandrill.MANDRILL_API_POST_URL + Mandrill.MANDRILL_API_MESSAGE_CALL, mailJSON.toString());

	// Records email sent count
	AccountEmailStatsUtil.recordAccountEmailStats(firstMandrillDefferedTask.subaccount, tasks.size());

    }

    /**
     * Returns constructed mail json to send through mandrill
     * 
     * @param subaccount
     *            - subaccount
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @return JSONObject
     */
    public static JSONObject getMandrillMailJSON(String subaccount, String fromEmail, String fromName, String replyTo)
    {
	try
	{
	    // Complete mail json to be sent
	    JSONObject mailJSON = Mandrill.setMandrillAPIKey(subaccount);

	    JSONObject messageJSON = getMessageJSON(subaccount, fromEmail, fromName, replyTo);
	    mailJSON.put(Mandrill.MANDRILL_MESSAGE, messageJSON);
	    mailJSON.put(Mandrill.MANDRILL_ASYNC, true);

	    return mailJSON;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    /**
     * Returns message json with email fields
     * 
     * @param subaccount
     *            - subaccount
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @return messageJSON
     */
    public static JSONObject getMessageJSON(String subaccount, String fromEmail, String fromName, String replyTo)
    {
	JSONObject messageJSON = new JSONObject();

	try
	{
	    if (!StringUtils.isBlank(subaccount))
		messageJSON.put(MandrillSubAccounts.MANDRILL_SUBACCOUNT, subaccount);

	    messageJSON.put(Mandrill.MANDRILL_HTML, MandrillMergeVars.HTML_CONTENT.getMergeVar());

	    messageJSON.put(Mandrill.MANDRILL_TEXT, MandrillMergeVars.TEXT_CONTENT.getMergeVar());

	    messageJSON.put(Mandrill.MANDRILL_SUBJECT, MandrillMergeVars.SUBJECT.getMergeVar());

	    messageJSON.put(Mandrill.MANDRILL_HEADERS, new JSONObject().put(Mandrill.MANDRILL_REPLY_TO, replyTo));

	    messageJSON.put(Mandrill.MANDRILL_FROM_EMAIL, fromEmail);

	    messageJSON.put(Mandrill.MANDRILL_FROM_NAME, fromName);

	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	return messageJSON;

    }

    /**
     * Returns merge json having content for respective merge variable with
     * respect to recipient
     * 
     * @param to
     *            - recipient email
     * @param replyTo
     *            - replyTo email
     * @param subject
     *            - subject content
     * @param html
     *            - html content
     * @param text
     *            - text content
     * @return JSONObject
     */
    public static JSONObject getEachMergeJSON(String to, String subject, String html, String text)
    {
	JSONObject mergeJSON = new JSONObject();
	try
	{
	    mergeJSON.put(Mandrill.MANDRILL_MERGE_RCPT, to);
	    mergeJSON.put(Mandrill.MANDRILL_MERGE_RCPT_VARS, getVars(subject, html, text));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return mergeJSON;
    }

    /**
     * Returns merge vars array
     * 
     * @param replyTo
     * @param subject
     *            - subject content to replace subject merge variable
     * @param html
     *            - html content to replace
     * @param text
     *            - text content to replace
     * @return JSONArray of vars
     */
    public static JSONArray getVars(String subject, String html, String text)
    {
	JSONArray vars = new JSONArray();

	vars.put(getVarJSON(MandrillMergeVars.SUBJECT.toString(), subject));

	vars.put(getVarJSON(MandrillMergeVars.HTML_CONTENT.toString(), getHTML(html, text)));

	vars.put(getVarJSON(MandrillMergeVars.TEXT_CONTENT.toString(), text));

	return vars;
    }

    /**
     * Returns var json with merge variable and content
     * 
     * @param name
     *            - merge variable
     * @param value
     *            - content to replace
     * @return VarJSON
     */
    public static JSONObject getVarJSON(String name, String value)
    {
	JSONObject var = new JSONObject();

	try
	{
	    var.put(Mandrill.MANDRILL_MERGE_RCPT_VAR_NAME, name);
	    var.put(Mandrill.MANDRILL_MERGE_RCPT_VAR_CONTENT, value);
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	return var;
    }

    /**
     * Returns HTML if not empty, otherwise text
     * 
     * @param html
     *            - html body
     * @param text
     *            - text body
     * @return String
     * 
     */
    public static String getHTML(String html, String text)
    {
	// return html if not empty
	if (!StringUtils.isBlank(html))
	    return html;

	return convertTextIntoHtml(text);
    }

    /**
     * Returns text body replacing with <br>
     * tags where necessary
     * 
     * @param text
     *            - text body
     * @return String
     */
    public static String convertTextIntoHtml(String text)
    {
	if (StringUtils.isBlank(text))
	    return text;

	return text.replaceAll("(\r\n|\n)", "<br>").replaceAll("((?<= ) | (?= ))", "&nbsp;");

    }

    /**
     * Verifies whether To email exists in array
     * 
     * @param toArray
     *            - To emails array
     * @param toEmail
     *            - email to compare
     * @return boolean
     */
    public static boolean isToExists(JSONArray toArray, String toEmail)
    {
	try
	{
	    for (int i = 0; i < toArray.length(); i++)
	    {
		if (StringUtils.equals(toEmail, toArray.getJSONObject(i).getString("email")))
		    return true;
	    }
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while comparing To..." + e.getMessage());
	}

	return false;
    }

    /**
     * Sends mail through without using any merge tags.
     * 
     * @param mandrillDeferredTask
     *            - MandrillDeferredTask
     */
    public static void sendWithoutMerging(MandrillDeferredTask mandrillDeferredTask)
    {
	String oldNamespace = NamespaceManager.get();
	try
	{
	    NamespaceManager.set(mandrillDeferredTask.subaccount);

	    Mandrill.sendMail(true, mandrillDeferredTask.fromEmail, mandrillDeferredTask.fromName,
		    mandrillDeferredTask.to, mandrillDeferredTask.subject, mandrillDeferredTask.replyTo,
		    mandrillDeferredTask.html, mandrillDeferredTask.text);
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while sending email without merging..." + e.getMessage());
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }
}
