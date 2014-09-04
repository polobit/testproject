package com.agilecrm.mandrill.util;

import java.util.List;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
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
     * Allowed maximum mail json content length
     */
    public static final int MAX_CONTENT_SIZE = 8 * 1024 * 1024;

    /**
     * Minimum To emails content expected to not exceed Max content size
     */
    public static final int MIN_TO_EMAILS = 50;

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
     * Sends mails through mandrill. It constructs mail json with merge
     * variables and their content
     * 
     * @param tasks
     *            - pull queue leased tasks
     */
    public static void sendMandrillMails(List<TaskHandle> tasks)
    {
	TaskHandle firstTaskHandle = tasks.get(0);

	MailDeferredTask firstMailDefferedTask = (MailDeferredTask) SerializationUtils.deserialize(firstTaskHandle
	        .getPayload());

	// Initialize mailJSON with common fields
	JSONObject mailJSON = getMandrillMailJSON(firstMailDefferedTask.apiKey, firstMailDefferedTask.domain,
	        firstMailDefferedTask.fromEmail, firstMailDefferedTask.fromName, firstMailDefferedTask.replyTo,
	        firstMailDefferedTask.metadata);

	JSONArray mergeVarsArray = new JSONArray();
	JSONArray toArray = new JSONArray();

	// To split json array
	JSONArray tempArray = new JSONArray();
	boolean flag = false;

	try
	{
	    for (TaskHandle task : tasks)
	    {
		flag = false;

		MailDeferredTask mailDeferredTask = (MailDeferredTask) SerializationUtils
		        .deserialize(task.getPayload());

		// If same To email (i.e., multiple send-email nodes linked to
		// each in campaign). If CC or BCC or multiple To with comma
		// separated given then send email without merging
		if (!StringUtils.isBlank(mailDeferredTask.cc) || !StringUtils.isBlank(mailDeferredTask.bcc)
		        || isToExists(toArray, mailDeferredTask.to) || mailDeferredTask.to.contains(","))
		{
		    sendWithoutMerging(mailDeferredTask);
		    continue;
		}

		// MergeVars
		mergeVarsArray.put(getEachMergeJSON(mailDeferredTask.to, mailDeferredTask.subject,
		        mailDeferredTask.html, mailDeferredTask.text));

		// To array
		toArray.put(new JSONObject().put(Mandrill.MANDRILL_RECIPIENT_EMAIL, mailDeferredTask.to));

		// If exceeds Content Size limit, split mailJSON
		if (toArray.length() > MIN_TO_EMAILS && mergeVarsArray.toString().length() >= MAX_CONTENT_SIZE)
		{

		    System.err.println("Length Exceeded. Splitting tasks...");

		    tempArray.put(new JSONObject().put("mergeVarsArray", mergeVarsArray).put("toArray", toArray));

		    mergeVarsArray = new JSONArray();
		    toArray = new JSONArray();

		    flag = true;
		}

	    }

	    // Append mergeVars which not exceeded limit
	    if (!flag && toArray.length() != 0)
		tempArray.put(new JSONObject().put("mergeVarsArray", mergeVarsArray).put("toArray", toArray));

	    // Iterates over splitted json array and send batch of emails
	    for (int i = 0, len = tempArray.length(); i < len; i++)
	    {
		mailJSON.getJSONObject(Mandrill.MANDRILL_MESSAGE)
		        .put(Mandrill.MANDRILL_TO, tempArray.getJSONObject(i).getJSONArray("toArray"))
		        .put(Mandrill.MANDRILL_MERGE_VARS, tempArray.getJSONObject(i).getJSONArray("mergeVarsArray"))
		        .put(Mandrill.MANDRILL_MERGE, true).put(Mandrill.MANDRILL_PRESERVE_RECIPIENTS, false);

		HttpClientUtil.accessPostURLUsingHttpClient(Mandrill.MANDRILL_API_POST_URL
		        + Mandrill.MANDRILL_API_MESSAGE_CALL, mailJSON.toString());
	    }

	}
	catch (Exception e)
	{
	    System.err.println("Got exception in createJSONandSend " + e.getMessage());
	    e.printStackTrace();
	}

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
    public static JSONObject getMandrillMailJSON(String apiKey, String subaccount, String fromEmail, String fromName,
	    String replyTo, String metadata)
    {
	try
	{
	    // Complete mail json to be sent
	    JSONObject mailJSON = Mandrill.setMandrillAPIKey(apiKey, subaccount);

	    JSONObject messageJSON = getMessageJSON(subaccount, fromEmail, fromName, replyTo, metadata);
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
    public static JSONObject getMessageJSON(String subaccount, String fromEmail, String fromName, String replyTo,
	    String metadata)
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

	    if (!StringUtils.isBlank(metadata))
		messageJSON.put(Mandrill.MANDRILL_METADATA, new JSONObject(metadata));

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
	    for (int i = toArray.length() - 1; i >= 0; i--)
	    {
		if (StringUtils.equals(toEmail, toArray.getJSONObject(i).getString("email")))
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

    /**
     * Sends mail through without using any merge tags.
     * 
     * @param mailDeferredTask
     *            - MandrillDeferredTask
     */
    public static void sendWithoutMerging(MailDeferredTask mailDeferredTask)
    {
	String oldNamespace = NamespaceManager.get();
	try
	{
	    // Inorder to set mandrill subaccount
	    NamespaceManager.set(mailDeferredTask.domain);

	    // Send email
	    Mandrill.sendMail(mailDeferredTask.apiKey, true, mailDeferredTask.fromEmail, mailDeferredTask.fromName,
		    mailDeferredTask.to, mailDeferredTask.cc, mailDeferredTask.bcc, mailDeferredTask.subject,
		    mailDeferredTask.replyTo, mailDeferredTask.html, mailDeferredTask.text, mailDeferredTask.metadata);
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