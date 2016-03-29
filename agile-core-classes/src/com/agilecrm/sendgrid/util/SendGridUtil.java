package com.agilecrm.sendgrid.util;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.account.EmailGateway;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.mandrill.util.MandrillUtil;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HttpClientUtil;
import com.thirdparty.sendgrid.SendGrid;

/**
 * <code>SendGridUtil</code> is the utility class for bulk sending using
 * SendGrid api
 * 
 * @author Naresh
 * 
 */
public class SendGridUtil
{

    public static final String UNIQUE_ARGUMENTS = "unique_args";
    public static final String SUBSTITUTION_TAG = "sub";

    /**
     * Sendgrid custom substitution tags
     */
    public static final String SENDGRID_SUBJECT_LIST = "subject_list";
    public static final String SENDGRID_TO_LIST = "to_list";
    public static final String SENDGRID_TEXT_LIST = "text_list";
    public static final String SENDGRID_HTML_LIST = "html_list";

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
     * Sends bulk emails in one request
     * 
     * @param tasks
     */
    public static void sendSendGridMails(List<MailDeferredTask> tasks, EmailSender emailSender)
    {
	try
	{
	    EmailGateway emailGateway = emailSender.emailGateway;
	    String apiUser = (emailGateway == null) ? Globals.SENDGRID_API_USER_NAME : emailGateway.api_user;
	    String apiKey = (emailGateway == null) ? Globals.SENDGRID_API_KEY : emailGateway.api_key;

	    MailDeferredTask firstSendGridDefferedTask = tasks.get(0);

	    // Email fields lists
	    JSONArray toArray = new JSONArray();
	    JSONArray subjectArray = new JSONArray();
	    JSONArray htmlArray = new JSONArray();
	    JSONArray textArray = new JSONArray();

	    // To emails separated by commas
	    String to = "";

	    // To split json
	    JSONArray tempArray = new JSONArray();

	    for (MailDeferredTask mailDeferredTask : tasks)
	    {

		// Creates log for sending email
		if (!StringUtils.isBlank(mailDeferredTask.campaignId)
			&& !StringUtils.isBlank(mailDeferredTask.subscriberId))
		{
		    if (!StringUtils.isBlank(mailDeferredTask.text))
		    {
			// Appends Agile label
			mailDeferredTask.text = StringUtils.replace(mailDeferredTask.text,
				EmailUtil.getPoweredByAgileLink("campaign", "Powered by"), "Sent using Agile");
			mailDeferredTask.text = EmailUtil.appendAgileToText(mailDeferredTask.text, "Sent using",
				emailSender.isEmailWhiteLabelEnabled());
		    }

		    // If no powered by merge field, append Agile label to
		    // html
		    if (!StringUtils.isBlank(mailDeferredTask.html)
			    && !StringUtils.contains(mailDeferredTask.html,
				    EmailUtil.getPoweredByAgileLink("campaign", "Powered by")))
			mailDeferredTask.html = EmailUtil.appendAgileToHTML(mailDeferredTask.html, "campaign",
				"Powered by", emailSender.isEmailWhiteLabelEnabled());
		}

		// If same To email or CC or BCC exists, send email without
		// merging
		if (!StringUtils.isBlank(mailDeferredTask.cc) || !StringUtils.isBlank(mailDeferredTask.bcc)
			|| isToExists(toArray, mailDeferredTask.to) || mailDeferredTask.to.contains(","))
		{
		    sendWithoutMerging(mailDeferredTask, apiUser, apiKey);
		    continue;
		}

		toArray.put(mailDeferredTask.to);

		subjectArray.put(mailDeferredTask.subject);

		htmlArray.put(MandrillUtil.getHTML(mailDeferredTask.html, mailDeferredTask.text));

		textArray.put(mailDeferredTask.text);

		// to emails separated by comma
		to += mailDeferredTask.to + ",";

		if (toArray.length() > MandrillUtil.MIN_TO_EMAILS
			&& htmlArray.toString().length() >= MandrillUtil.MAX_CONTENT_SIZE)
		{
		    tempArray.put(new JSONObject().put("to", to).put(SENDGRID_TO_LIST, toArray)
			    .put(SENDGRID_SUBJECT_LIST, subjectArray).put(SENDGRID_HTML_LIST, htmlArray)
			    .put(SENDGRID_TEXT_LIST, textArray));

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
		tempArray.put(new JSONObject().put("to", to).put(SENDGRID_TO_LIST, toArray)
			.put(SENDGRID_SUBJECT_LIST, subjectArray).put(SENDGRID_HTML_LIST, htmlArray)
			.put(SENDGRID_TEXT_LIST, textArray));

	    // Iterates over splitted json array and send batch of emails
	    for (int i = 0, len = tempArray.length(); i < len; i++)
	    {
		String postData = SendGrid.getSendGridQueryString(apiUser, apiKey, firstSendGridDefferedTask.fromEmail,
			firstSendGridDefferedTask.fromName, tempArray.getJSONObject(i).getString("to"), null, null,
			SendGridSubVars.SUBJECT.getString(), firstSendGridDefferedTask.replyTo,
			SendGridSubVars.HTML.getString(), SendGridSubVars.TEXT.getString(),
			getSMTPJSON(tempArray.getJSONObject(i), firstSendGridDefferedTask).toString());

		HttpClientUtil.accessPostURLUsingHttpClient(SendGrid.SENDGRID_API_POST_URL,
			"application/x-www-form-urlencoded", postData);
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
    private static JSONObject getSMTPJSON(JSONObject json, MailDeferredTask deferredtask) throws JSONException
    {
	JSONObject SMTPJSON = new JSONObject();

	SMTPJSON.put(SendGrid.SENDGRID_API_PARAM_TO, json.getJSONArray(SENDGRID_TO_LIST));

	SMTPJSON.put(
		UNIQUE_ARGUMENTS,
		new JSONObject().put("domain", deferredtask.domain).put("subject", deferredtask.subject)
			.put("campaign_id", deferredtask.campaignId));
	SMTPJSON.put(
		SUBSTITUTION_TAG,
		new JSONObject().put(SendGridSubVars.SUBJECT.getString(), json.getJSONArray(SENDGRID_SUBJECT_LIST))
			.put(SendGridSubVars.HTML.getString(), json.getJSONArray(SENDGRID_HTML_LIST))
			.put(SendGridSubVars.TEXT.getString(), json.getJSONArray(SENDGRID_TEXT_LIST)));
	return SMTPJSON;
    }

    /**
     * Sends email normally
     * 
     * @param sendGridDeferred
     */
    public static void sendWithoutMerging(MailDeferredTask sendGridDeferred, String apiUser, String apiKey)
    {

	SendGrid.sendMail(apiUser, apiKey, sendGridDeferred.fromEmail, sendGridDeferred.fromName,
		EmailUtil.getEmail(sendGridDeferred.to), EmailUtil.getEmail(sendGridDeferred.cc),
		EmailUtil.getEmail(sendGridDeferred.bcc), sendGridDeferred.subject, sendGridDeferred.replyTo,
		sendGridDeferred.html, sendGridDeferred.text, null);
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
		if (StringUtils.contains(toEmail, toArray.getString(i)))
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