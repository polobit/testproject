package com.agilecrm.mandrill.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.examples.HtmlToPlainText;

import com.agilecrm.Globals;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HttpClientUtil;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.mandrill.EmailContentLengthLimitExceededException;
import com.thirdparty.mandrill.Mandrill;
import com.thirdparty.mandrill.exception.RetryException;
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
     * Splitting tasks to send emails through different Mandrill Accounts. 
     * 
     * @param tasks
     * @param emailSender
     */
    public static void splitMandrillTasks(List<MailDeferredTask> tasks, EmailSender emailSender)
    {
    	// Allows only 50% tasks to send through new Account
    	int limit = (int) (tasks.size() * 0.5);
    	
    	List<MailDeferredTask> tasksFragment = new ArrayList<MailDeferredTask>();
    	
    	// Add 50% tasks
    	for(int i=0; i < limit; i++)
    		tasksFragment.add(tasks.get(i));
    
    	// New Mandrill key for 50% emails
    	emailSender.setMandrillAPIKey(Globals.MANDRILL_API_KEY_VALUE_2);
    	sendMandrillMails(tasksFragment, emailSender);
    	
    	// Clears list to add remaining tasks
    	tasksFragment.clear();
    	
    	for(int i=limit; i < tasks.size(); i++)
    		tasksFragment.add(tasks.get(i));
    	
    	// Old Mandrill account
    	emailSender.setMandrillAPIKey(Globals.MANDRIL_API_KEY_VALUE);
    	sendMandrillMails(tasksFragment, emailSender);
    }
    
    /**
     * Sends mails through mandrill. It constructs mail json with merge
     * variables and their content
     * 
     * @param tasks
     *            - pull queue leased tasks
     */
    public static void sendMandrillMails(List<MailDeferredTask> tasks, EmailSender emailSender)
    {

    if(tasks.isEmpty())
    	return;
    	
	MailDeferredTask firstMailDefferedTask = tasks.get(0);

	String apiKey = emailSender.getMandrillAPIKey();
	boolean isPaid = emailSender.isPaid();
	
	System.out.println("API key obtained is..." + apiKey);
	
	// Verifies if subaccount exists
	checkSubAccountExists(firstMailDefferedTask.domain, apiKey);
	
	// Initialize mailJSON with common fields
	JSONObject mailJSON = getMandrillMailJSON(apiKey, firstMailDefferedTask.domain,
		firstMailDefferedTask.fromEmail, firstMailDefferedTask.fromName, firstMailDefferedTask.replyTo,
		firstMailDefferedTask.metadata, isPaid);

	JSONArray mergeVarsArray = new JSONArray();
	JSONArray toArray = new JSONArray();

	// To split json array
	JSONArray tempArray = new JSONArray();
	boolean flag = false;
	String toName = "";

	try
	{
	    for (MailDeferredTask mailDeferredTask : tasks)
	    {

		flag = false;

		// Creates log for sending email
		if (!StringUtils.isBlank(mailDeferredTask.campaignId)
			&& !StringUtils.isBlank(mailDeferredTask.subscriberId))
		{

		    System.out.println("Namespace mail deferred task : " + mailDeferredTask.domain);

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

		// If same To email (i.e., multiple send-email nodes linked to
		// each in campaign). If CC or BCC or multiple To with comma
		// separated given then send email without merging
		if (!StringUtils.isBlank(mailDeferredTask.cc) || !StringUtils.isBlank(mailDeferredTask.bcc)
				|| isToExists(toArray, mailDeferredTask.to) || mailDeferredTask.to.contains(","))
		{
		    sendWithoutMerging(mailDeferredTask, emailSender.getMandrillAPIKey());
		    continue;
		}

		// MergeVars
		mergeVarsArray.put(getEachMergeJSON(EmailUtil.getEmail(mailDeferredTask.to), mailDeferredTask.subject,
			mailDeferredTask.html, mailDeferredTask.text));

		JSONObject eachToJSON = new JSONObject();
		eachToJSON.put(Mandrill.MANDRILL_RECIPIENT_EMAIL, EmailUtil.getEmail(mailDeferredTask.to));

		// To name
		toName = EmailUtil.getEmailName(mailDeferredTask.to);

		// Add name if not blank
		if (StringUtils.isNotBlank(toName))
		    eachToJSON.put(Mandrill.MANDRILL_RECIPIENT_NAME, toName);

		// To array
		toArray.put(eachToJSON);

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
			+ Mandrill.MANDRILL_API_MESSAGE_CALL, "application/json", mailJSON.toString());
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
     * @param isPaid
     *            - whether paid or not
     * 
     * @return JSONObject
     */
    public static JSONObject getMandrillMailJSON(String apiKey, String subaccount, String fromEmail, String fromName,
	    String replyTo, String metadata, boolean isPaid)
    {
	try
	{
	    // If Null
		if (StringUtils.isEmpty(apiKey))
	    {
	    	System.out.println("Sending emails in MandrillUtil through subaccount api..." + apiKey);
	    	apiKey = isPaid ? Globals.MANDRIL_API_KEY_VALUE : Globals.MANDRILL_API_KEY_VALUE_2; 
		}

	    // Complete mail json to be sent
//	    JSONObject mailJSON = Mandrill.setMandrillAPIKey(apiKey, subaccount, isPaid);
	    
	    JSONObject mailJSON = new JSONObject();
	    
	    // By Default, naresh1 has Test Key
	    if (StringUtils.equals(subaccount, "naresh1"))
	    	apiKey = Globals.MANDRILL_TEST_API_KEY_VALUE;
	    
	    // IP Pool for Paid Customers
	    if(apiKey != null && Globals.MANDRIL_API_KEY_VALUE.equals(apiKey))
	    {
	    	String ipPool = isPaid ? Globals.MANDRILL_PAID_POOL :  Mandrill.MANDRILL_MAIN_POOL;
	    	mailJSON.put(Mandrill.MANDRILL_IP_POOL, ipPool);
	    }
	    
	    mailJSON.put(Mandrill.MANDRILL_API_KEY, apiKey);

	    JSONObject messageJSON = getMessageJSON(subaccount, fromEmail, fromName, replyTo, metadata);
	    mailJSON.put(Mandrill.MANDRILL_MESSAGE, messageJSON);
	    mailJSON.put(Mandrill.MANDRILL_ASYNC, true);

	    return mailJSON;
	}
	catch (Exception e)
	{
		System.err.println("Exception occured in getMandrillMailJSON method...." + e.getMessage());
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

	    // If replyTo is blank, make fromEmail as replyTo
	    if (StringUtils.isBlank(replyTo))
		replyTo = fromEmail;

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

	    messageJSON.put(Mandrill.MANDRILL_MERGE_LANGUAGE, "mailchimp");

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

	vars.put(getVarJSON(MandrillMergeVars.TEXT_CONTENT.toString(), getText(html, text)));

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
     * Returns Text if not empty, otherwise extracts text from html
     * 
     * @param html
     *            - html body
     * @param text
     *            - text body
     * @return String
     * 
     */
    public static String getText(String html, String text)
    {
	// return text if not empty
	if (!StringUtils.isBlank(text) || StringUtils.isBlank(html))
	    return text;

	return new HtmlToPlainText().getPlainText(Jsoup.parse(html));
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
		if (StringUtils.contains(toEmail, toArray.getJSONObject(i).getString("email")))
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
    public static void sendWithoutMerging(MailDeferredTask mailDeferredTask, String apiKey)
    {
	String oldNamespace = NamespaceManager.get();
	try
	{
	    // Inorder to set mandrill subaccount
	    NamespaceManager.set(mailDeferredTask.domain);

	    // Send email
	    Mandrill.sendMail(apiKey, true, mailDeferredTask.fromEmail, mailDeferredTask.fromName, mailDeferredTask.to,
		    mailDeferredTask.cc, mailDeferredTask.bcc, mailDeferredTask.subject, mailDeferredTask.replyTo,
		    mailDeferredTask.html, mailDeferredTask.text, mailDeferredTask.metadata, null, null);
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

    /**
     * Checks the email total content size including attachments, if the size is
     * valid sends true , otherwise sends false
     * 
     * @param body
     * @param documentId
     * @return
     * @throws EmailContentLengthLimitExceededException
     */
    public static boolean isEmailContentSizeValid(String body, String documentId)
	    throws EmailContentLengthLimitExceededException
    {
	// HttpURLConnection inConn = null;
	// InputStream inStream = null;
	try
	{
	    if (StringUtils.isNotBlank(body))
	    {
		long fileLength = body.getBytes().length;
		// if (StringUtils.isNotBlank(documentId))
		// {
		// Long did = Long.parseLong(documentId);
		// Document document = DocumentUtil.getDocument(did);
		// URL inUrl = new URL(document.url);
		// inConn = (HttpURLConnection) inUrl.openConnection();
		// inConn.setDoInput(true);
		// inStream = inConn.getInputStream();
		// long attachmentLength = inConn.getContentLengthLong();
		// fileLength = fileLength + attachmentLength;
		// }
		if (fileLength > Mandrill.MANDRILL_CONTENT_TOTAL_LIMIT)
		{
		    throw new EmailContentLengthLimitExceededException("Email content length exceeded.");
		}
	    }
	}
	catch (EmailContentLengthLimitExceededException e)
	{
	    throw new EmailContentLengthLimitExceededException("Email content length exceeded.");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    // try
	    // {
	    // if (inStream != null)
	    // inStream.close();
	    // if (inConn != null)
	    // inConn.disconnect();
	    // }
	    // catch (Exception e)
	    // {
	    // e.printStackTrace();
	    // }
	}
	return true;
    }
    
    /**
     * Verifies whether subaccount exists, if not creates
     * 
     * @param subaccountId
     * @param apiKey
     */
    private static void checkSubAccountExists(String subaccountId, String apiKey){
    	
    	if(StringUtils.isBlank(subaccountId) || StringUtils.isBlank(apiKey))
    		return;
    	
    	// To get the response
    	String response = MandrillSubAccounts.updateMandrillSubAccount(subaccountId, apiKey, "");
    	
    	 if (StringUtils.contains(response, "Unknown_Subaccount"))
		 {
			try 
			{
				// throw retry exception and create new subaccount
				throw new RetryException("Unknown Mandrill Subaccount");
			} 
			catch (RetryException e) {
				
				 // Creates new subaccount
			    MandrillSubAccounts.createMandrillSubAccount(subaccountId, apiKey);
			}
		 }
    }
}