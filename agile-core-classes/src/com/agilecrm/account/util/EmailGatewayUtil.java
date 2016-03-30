package com.agilecrm.account.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.Globals;
import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.EmailGateway.EMAIL_API;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.db.GoogleSQL;
import com.agilecrm.mandrill.util.MandrillUtil;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.sendgrid.util.SendGridUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.IntegrationType;
import com.agilecrm.widgets.Widget.WidgetType;
import com.agilecrm.widgets.util.WidgetUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.CampaignLogsSQLUtil;
import com.campaignio.logger.util.LogUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.taskqueue.TaskHandle;
import com.thirdparty.sendgrid.SendGrid;
import com.thirdparty.sendgrid.lib.SendGridLib;
import com.thirdparty.ses.util.AmazonSESUtil;
import com.thirdparty.mandrill.Mandrill;

/**
 * <code>EmailGatewayUtil</code> is the utility class for EmailGateway. It
 * retrieves EmailGateway object, verifies given api keys, sends individual and
 * bulk emails
 * 
 * @author naresh
 * 
 */
public class EmailGatewayUtil
{

    public static EmailGateway saveEmailGateway(EmailGateway emailGateway)
    {

	try
	{
	    // Check given api keys.
		EmailGatewayUtil.checkEmailAPISettings(emailGateway);
			
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
		    .entity(e.getMessage()).build());
	}

	try
	{
	    Widget widget = WidgetUtil.getWidgetByNameAndType("EmailGateway", IntegrationType.EMAIL);

	    if (widget == null)
	    {
		widget = new Widget("EmailGateway",
			"Email gateway supports third party email apis integration into Agile.", "", "", "", "",
			WidgetType.INTEGRATIONS, IntegrationType.EMAIL);
	    }

	    ObjectMapper map = new ObjectMapper();
	    widget.prefs = map.writeValueAsString(emailGateway);
	    widget.save();

	    if (emailGateway != null)
		CacheUtil.setCache(NamespaceManager.get() + "_email_gateway", emailGateway);

	    return emailGateway;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static void addEmailLogs(List<MailDeferredTask> tasks)
    {
	Map<String, String> campaignNameMap = new HashMap<String, String>();
	List<Object[]> queryList = new ArrayList<Object[]>();
	for (MailDeferredTask mailDeferredTask : tasks)
	{
	    String campaignName = null;
	    if (StringUtils.isEmpty(mailDeferredTask.campaignId))
	    {
		continue;
	    }

	    if (!campaignNameMap.containsKey(mailDeferredTask.campaignId + "-" + mailDeferredTask.domain))
	    {
		campaignName = WorkflowUtil.getCampaignName(mailDeferredTask.campaignId);
		campaignNameMap.put(mailDeferredTask.campaignId + "-" + mailDeferredTask.domain, campaignName);
	    }
	    else
	    {
		campaignName = campaignNameMap.get(mailDeferredTask.campaignId + "-" + mailDeferredTask.domain);
	    }

	    Object[] newLog = new Object[] { mailDeferredTask.domain, mailDeferredTask.campaignId, campaignName,
		    mailDeferredTask.subscriberId, GoogleSQL.getFutureDate(), "Subject: " + mailDeferredTask.subject,
		    LogType.EMAIL_SENT.toString() };

	    queryList.add(newLog);

	}

	if (queryList.size() > 0)
	{
	    Long start_time = System.currentTimeMillis();
	    CampaignLogsSQLUtil.addToCampaignLogs(queryList);
	    System.out.println("batch request completed : " + (System.currentTimeMillis() - start_time));
	    System.out.println("Logs size : " + queryList.size());
	}
    }

    /**
     * Returns email gateway from datastore
     * 
     * @return EmailGateway
     */
    public static EmailGateway getEmailGateway()
    {

	// Get from Cache
	EmailGateway gateway = (EmailGateway) CacheUtil.getCache(NamespaceManager.get() + "_email_gateway");

	if (gateway != null)
	{
	    System.out.println("Returning gateway from Cache...");
	    return gateway;
	}

	Widget widget = WidgetUtil.getWidgetByNameAndType("EmailGateway", IntegrationType.EMAIL);

	// If no widget return null
	if (widget == null)
	    return null;

	EmailGateway emailGateway = null;

	try
	{
	    // Fetch from widget prefs and wrap to EmailGateway
	    ObjectMapper mapper = new ObjectMapper();
	    emailGateway = mapper.readValue(widget.prefs, EmailGateway.class);
	}
	catch (Exception e)
	{
	    System.out.println("Exception occured while getting email gateway from object mapper..." + e.getMessage());
	    e.printStackTrace();
	}

	return emailGateway;
    }

    /**
     * Deletes Email Gateway widget from datastore and memcache
     */
    public static void deleteEmailGateway()
    {
	try
	{
	    // Delete from cache
	    CacheUtil.deleteCache(NamespaceManager.get() + "_email_gateway");
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while deleting gateway from cache..." + e.getMessage());
	}

	Widget widget = WidgetUtil.getWidgetByNameAndType("EmailGateway", IntegrationType.EMAIL);
	widget.delete();
    }

    /**
     * Verifies whether given email gateway api keys are valid or not
     * 
     * @param emailGateway
     *            - EmailGateway object
     * @throws Exception
     */
    public static void checkEmailAPISettings(EmailGateway emailGateway) throws Exception
    {
	// If null return
	if (emailGateway == null)
	    return;

	String response = null;
	JSONObject responseJSON = null;

	// Test email to validate email gateway credentials
	if (emailGateway.email_api.equals(EMAIL_API.SEND_GRID))
	    response = SendGrid.sendMail(emailGateway.api_user, emailGateway.api_key, "api_test@agilecrm.com",
		    "API Test", "naresh@agilecrm.com", null, null,
		    "SendGrid test email from " + NamespaceManager.get(), null, "Test Email.", "Test Email", null);
	else if(emailGateway.email_api.equals(EMAIL_API.MANDRILL))
	    response = Mandrill.sendMail(emailGateway.api_key, false, "api_test@agilecrm.com", "API Test",
		    "naresh@agilecrm.com", null, null, "Mandrill test email from " + NamespaceManager.get(), null,
		    "Test Email.", "Test Email", null, null, null);
	else if(emailGateway.email_api.equals(EMAIL_API.SES))
		response = AmazonSESUtil.verifySESKeys(emailGateway.api_user, emailGateway.api_key, emailGateway.regions);

	try
	{
	    // Handle JSON parse exception
	    responseJSON = new JSONObject(response);
	}
	catch (JSONException e)
	{
	    System.err.println("JSON Exception occurred while parsing response " + e.getMessage());
	    e.printStackTrace();
	}

	// SendGrid Error
	if (responseJSON != null && responseJSON.has("errors"))
	    throw new Exception("Error Saving: " + responseJSON.getString("errors"));

	// Mandrill Error
	if (responseJSON != null && responseJSON.has("status") && responseJSON.getString("status").equals("error"))
	    throw new Exception("Error Saving: " + responseJSON.getString("message"));

    }

    /**
     * Adds to Pull Queue
     * 
     * @param domain
     *            - Agile Domain
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param cc
     *            - cc email
     * @param bcc
     *            - bcc email
     * @param subject
     *            - email subject
     * @param replyTo
     *            - reply to email
     * @param html
     *            - html body
     * @param text
     *            - text body
     * @param mandrillMetadata
     *            - Mandrill Metadata. e.g., campaign-id is sent as metadata
     *            which is used in webhook use in webhook
     */
    public static void sendBulkEmail(String queue, String domain, String fromEmail, String fromName, String to,
	    String cc, String bcc, String subject, String replyTo, String html, String text, String mandrillMetadata)
    {
	try
	{
	    // Add To Queue
	    addToQueue(queue, null, null, null, domain, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
		    mandrillMetadata, null, null);

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while adding to queue..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Adds to Pull Queue
     * 
     * @param domain
     *            - Agile Domain
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param cc
     *            - cc email
     * @param bcc
     *            - bcc email
     * @param subject
     *            - email subject
     * @param replyTo
     *            - reply to email
     * @param html
     *            - html body
     * @param text
     *            - text body
     * @param mandrillMetadata
     *            - Mandrill Metadata. e.g., campaign-id is sent as metadata
     *            which is used in webhook use in webhook
     */
    public static void sendBulkEmail(String queue, String domain, String fromEmail, String fromName, String to,
	    String cc, String bcc, String subject, String replyTo, String html, String text, String mandrillMetadata,
	    String subscriberId, String campaignId)
    {
	try
	{
	    // Add To Queue
	    addToQueue(queue, null, null, null, domain, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
		    mandrillMetadata, subscriberId, campaignId);

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while adding to queue..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Send personal email or individual email directly without adding to queue
     * 
     * @param domain
     *            - agile domain
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param cc
     *            - cc email
     * @param bcc
     *            - bcc email
     * @param subject
     *            - email subject
     * @param replyTo
     *            - reply to email
     * @param html
     *            - html body
     * @param text
     *            - text bodt
     * @param mandrillMetadata
     *            - - Mandrill Metadata. e.g., campaign-id is sent as metadata
     *            which is used in webhook
     * @param attachments
     *            - attachment files like contacts export csv file
     */
    public static void sendEmail(EmailGateway emailGateway, String domain, String fromEmail, String fromName,
	    String to, String cc, String bcc, String subject, String replyTo, String html, String text,
	    String mandrillMetadata, List<Long> documentIds, List<BlobKey> blobKeys, String... attachments)
    {
	try
	{
	    // For domain "clickdeskengage" - use SendGrid API
	    if (StringUtils.equals(domain, Globals.CLICKDESK_ENGAGE_DOMAIN))
	    {
		SendGrid.sendMail(fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text);
		return;
	    }

	    // If no gateway setup, sends email through Agile Mandrill
	    if (emailGateway == null || (EMAIL_API.SES.equals(emailGateway.email_api) && ((documentIds != null && documentIds.size() != 0) || (blobKeys != null && blobKeys.size() != 0))))
	    {
			//Mandrill.sendMail(null, true, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
			//		mandrillMetadata, documentIds, blobKeys, attachments);
	    	
	    	SendGrid.sendMail(null, null, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text, null, documentIds, blobKeys, attachments);
	    	return;
	    }

	    // If Mandrill
	    else if (EMAIL_API.MANDRILL.equals(emailGateway.email_api))
		Mandrill.sendMail(emailGateway.api_key, true, fromEmail, fromName, to, cc, bcc, subject, replyTo, html,
			text, mandrillMetadata, documentIds, blobKeys, attachments);

	    // If SendGrid
	    else if (EMAIL_API.SEND_GRID.equals(emailGateway.email_api))
		SendGrid.sendMail(emailGateway.api_user, emailGateway.api_key, fromEmail, fromName, to, cc, bcc,
		        subject, replyTo, html, text, null, documentIds, blobKeys, attachments);
	    
	    else if (EMAIL_API.SES.equals(emailGateway.email_api))
	    {
	    	MailDeferredTask mailDeferredTask = new MailDeferredTask(emailGateway.email_api.toString(), emailGateway.api_user, emailGateway.api_key, domain, fromEmail,
	    	        fromName, to, cc, bcc, subject, replyTo, html, text, null, null, null);

	    	// Add to pull queue with from email as Tag
	    	PullQueueUtil.addToPullQueue(AgileQueues.NORMAL_PERSONAL_EMAIL_PULL_QUEUE, mailDeferredTask, fromEmail + "_personal");
	    }

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while sending emails through thirdparty email apis..."
		    + e.getMessage());

	    e.printStackTrace();
	}
    }

    /**
     * Sends email after fetching EmailGateway
     * 
     * @param domain
     * @param fromEmail
     * @param fromName
     * @param to
     * @param cc
     * @param bcc
     * @param subject
     * @param replyTo
     * @param html
     * @param text
     * @param mandrillMetadata
     * @param attachments
     */
    public static void sendEmail(String domain, String fromEmail, String fromName, String to, String cc, String bcc,
	    String subject, String replyTo, String html, String text, String mandrillMetadata, List<Long> documentIds,
	    List<BlobKey> blobKeys, String... attachments)
    {
	EmailGateway emailGateway = EmailGatewayUtil.getEmailGateway();

	sendEmail(emailGateway, domain, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
		mandrillMetadata, documentIds, blobKeys, attachments);
    }

    /**
     * Adds email details to deferred task before adding to pull queue
     * 
     * @param emailGatewayType
     * @param apiUser
     * @param apiKey
     * @param domain
     * @param fromEmail
     * @param fromName
     * @param to
     * @param cc
     * @param bcc
     * @param subject
     * @param replyTo
     * @param html
     * @param text
     * @param mandrillMetadata
     */
    public static void addToQueue(String queueName, String emailGatewayType, String apiUser, String apiKey,
	    String domain, String fromEmail, String fromName, String to, String cc, String bcc, String subject,
	    String replyTo, String html, String text, String mandrillMetadata, String subscriberId, String campaignId)
    {
	MailDeferredTask mailDeferredTask = new MailDeferredTask(emailGatewayType, apiUser, apiKey, domain, fromEmail,
		fromName, to, cc, bcc, subject, replyTo, html, text, mandrillMetadata, subscriberId, campaignId);

	// Add to pull queue with from email as Tag
	PullQueueUtil.addToPullQueue(queueName, mailDeferredTask, fromEmail);
    }

    /**
     * Sends bulk emails obtained from leased tasks
     * 
     * @param tasks
     *            - tasks leased from pull queue
     */
    public static void sendMails(List<TaskHandle> tasks)
    {
    	
	sendMailsMailDeferredTask(convertTaskHandlestoMailDeferredTasks(tasks));
    }

    public static List<MailDeferredTask> convertTaskHandlestoMailDeferredTasks(List<TaskHandle> tasks)
    {
	List<MailDeferredTask> mailDeferredTasks = new ArrayList<MailDeferredTask>();
	for (TaskHandle handle : tasks)
	{
	    try
	    {
		mailDeferredTasks.add((MailDeferredTask) SerializationUtils.deserialize(handle.getPayload()));
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}
	return mailDeferredTasks;
    }

    /**
     * Adds email exceeded log
     * 
     * @param tasks
     *            - Leased tasks
     */
    public static void addEmailExceededLog(List<MailDeferredTask> tasks)
    {
	try
	{
	    for (MailDeferredTask mailDeferredTask : tasks)
	    {

		// For personal bulk emails, no need to add log
		if (StringUtils.isBlank(mailDeferredTask.campaignId)
			&& StringUtils.isBlank(mailDeferredTask.subscriberId))
		    break;

		LogUtil.addLogToSQL(mailDeferredTask.campaignId, mailDeferredTask.subscriberId,
			"Emails limit exceeded. Please increase your quota.", LogType.EMAIL_SENDING_FAILED.toString());

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while adding exceeded log in EmailGatewayUtil..." + e.getMessage());
	}
    }

    public static void sendMailsMailDeferredTask(List<MailDeferredTask> tasks)
    {

	MailDeferredTask mailDeferredTask = tasks.get(0);

	String domain = mailDeferredTask.domain;

	String oldNamespace = NamespaceManager.get();

	try
	{

	    // Set namespace
	    NamespaceManager.set(domain);

	    EmailSender emailSender = EmailSender.getEmailSender();
	    EmailGateway emailGateway = emailSender.emailGateway;

	    if (emailSender.canSend())
	    {
	    	// If No Gateway or SendGrid
	    	if (emailGateway == null || emailGateway.email_api == EMAIL_API.SEND_GRID)
			    SendGridUtil.sendSendGridMails(tasks, emailSender);
		
	    	// If Mandrill
	    	else if (emailGateway.email_api == EmailGateway.EMAIL_API.MANDRILL)
	    		MandrillUtil.splitMandrillTasks(tasks, emailSender);
		
	    	else if (emailGateway.email_api == EMAIL_API.SES)
				AmazonSESUtil.sendSESMails(tasks, emailSender);
	
			addEmailLogs(tasks);
	
			emailSender.setCount(tasks.size());
			emailSender.updateStats();

	    }
	    else
	    {
		// Add email exceeded log to each subscriber
		addEmailExceededLog(tasks);
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in sendMails of EmailGatewayUtil..." + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
