package com.agilecrm.account.util;

import static com.agilecrm.AgileQueues.AMAZON_SES_EMAIL_PULL_QUEUE;
import static com.agilecrm.account.EmailGateway.EMAIL_API.MAILGUN;
import static com.agilecrm.account.EmailGateway.EMAIL_API.MANDRILL;
import static com.agilecrm.account.EmailGateway.EMAIL_API.SEND_GRID;
import static com.agilecrm.account.EmailGateway.EMAIL_API.SES;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.EmailGateway.EMAIL_API;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.db.GoogleSQL;
import com.agilecrm.mandrill.util.MandrillUtil;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.sendgrid.util.SendGridUtil;
import com.agilecrm.thirdparty.gmail.GMail;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.GmailSendPrefs;
import com.agilecrm.user.SMTPPrefs;
import com.agilecrm.user.util.GmailSendPrefsUtil;
import com.agilecrm.user.util.SMTPPrefsUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.util.SMTPBulkEmailUtil;
import com.agilecrm.util.SMTPBulkEmailUtil.PrefsType;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.IntegrationType;
import com.agilecrm.widgets.Widget.WidgetType;
import com.agilecrm.widgets.util.WidgetUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.CampaignLogsSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskHandle;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.utils.SystemProperty;
import com.thirdparty.mailgun.MailgunNew;
import com.thirdparty.mailgun.util.MailgunUtil;
import com.thirdparty.mandrill.Mandrill;
import com.thirdparty.sendgrid.SendGrid;
import com.thirdparty.sendgrid.deferred.SendGridSubAccountDeferred;
import com.thirdparty.ses.util.AmazonSESUtil;

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
	
	String fromEmailAddress = "";
	String message = "";
	
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
	    
	    String emailSubject = StringEscapeUtils.escapeJava(mailDeferredTask.subject);
	    //getting name and email address together of sender(user) 	    
	    fromEmailAddress=mailDeferredTask.fromEmail;
	    
	    if(StringUtils.isNotBlank(fromEmailAddress) && StringUtils.isNotBlank(mailDeferredTask.fromName))
	    		fromEmailAddress = mailDeferredTask.fromName + " &lt;"+fromEmailAddress + "&gt;";

	    message = "Subject: " + emailSubject + " <br/> From: " + fromEmailAddress
	    		+" <br/> To: " + StringEscapeUtils.escapeHtml(mailDeferredTask.to);
	    
	    // For testing in Localhost
	    if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development){
	    	System.out.println("Development Server...");
	    	
	    	CampaignLogsSQLUtil.addToCampaignLogs("localhost", mailDeferredTask.campaignId, campaignName,
			    mailDeferredTask.subscriberId, message, LogType.EMAIL_SENT.toString(),GoogleSQL.getCurrentDate());
	    	
	    	continue;
	    }
	    
	    Object[] newLog = new Object[] { mailDeferredTask.domain, mailDeferredTask.campaignId, campaignName,
		    mailDeferredTask.subscriberId, GoogleSQL.getCurrentDate(), message,
		    LogType.EMAIL_SENT.toString() };

	    queryList.add(newLog);

	}

	if (queryList.size() > 0)
	{
	    Long start_time = System.currentTimeMillis();
	    CampaignLogsSQLUtil.addToCampaignLogs(queryList);
	    
//	    CampaignLogsSQLUtil.addCampaignLogsToNewInstance(queryList);
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
	else if(emailGateway.email_api.equals(EMAIL_API.MAILGUN))
		response=MailgunUtil.checkMailgunAuthorization(emailGateway.api_key, emailGateway.api_user);
	try
	{
	    // Handle JSON parse exception
	    responseJSON = new JSONObject(response);
	}
	catch (JSONException e)
	{
	    System.err.println("JSON Exception occurred while parsing response " + e.getMessage());
	}

	// SendGrid Error
	if (responseJSON != null && responseJSON.has("errors"))
	    throw new Exception("Error Saving: " + responseJSON.getString("errors"));

	// Mandrill Error
	if (responseJSON != null && responseJSON.has("status") && responseJSON.getString("status").equals("error"))
	    throw new Exception("Error Saving: " + responseJSON.getString("message"));
	
	//Mailgun Error
	 if(response==null || response.contains("401"))
		 throw new Exception("Error Saving: Mailgun API Key or Domain Name is Invalid." );

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
    public static void sendEmail(EmailGateway emailGateway, String domain, String fromEmail,
			String fromName, String to, String cc, String bcc, String subject, String replyTo,
			String html, String text, String mandrillMetadata, List<Long> documentIds,
			String[] mailAttach, String... attachments) {
		try
		{
			to = ContactEmailUtil.normalizeEmailIds(to);
	    	if(StringUtils.isBlank(to)) return;
	    	
	    	cc = ContactEmailUtil.normalizeEmailIds(cc);
	    	bcc = ContactEmailUtil.normalizeEmailIds(bcc);
	    	
	    	/** Sending Mail using SMTP. */
	    	if(smtpOutboundSendMail(fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
					documentIds, mailAttach, attachments)) return;
	
	    	//Fetch the preferred emailgateway from account preferences
	    	EMAIL_API emailAPI = (emailGateway != null) ? emailGateway.email_api : SEND_GRID;
			
			String apiUser = (emailGateway != null) ? emailGateway.api_user : null;
			String apiKey = (emailGateway != null) ? emailGateway.api_key : null;
			
		    /* If no gateway setup or Amazon SES gateway having attachments or documents, 
			sends email through Agile's default (Sendgrid) */
			if(SEND_GRID.equals(emailAPI) ) {
	             System.out.println("sending mail using send grid to: "+to);
				SendGrid.sendMail(apiUser, apiKey, fromEmail, fromName, to, cc, bcc, subject, replyTo, 
		    			html, text, null, documentIds, mailAttach, attachments);
		    }
		    else if(MANDRILL.equals(emailAPI)) {
	             System.out.println("sending mail using mandrill to: "+to);
		    	Mandrill.sendMail(apiKey, true, fromEmail, fromName, to, cc, bcc, subject, replyTo, 
		    			html, text, mandrillMetadata, documentIds, mailAttach, attachments);
		    }
		    else if(SES.equals(emailAPI)) {
	             System.out.println("sending mail using ses to: "+to);
				if ((documentIds != null && documentIds.size() != 0) 
	    				|| (mailAttach != null && mailAttach.length > 0 && StringUtils.isNotBlank(mailAttach[0])) 
	    				|| (attachments != null && attachments.length != 0)) {

					SendGrid.sendMail(null, null, fromEmail, fromName, to, cc, bcc, subject, replyTo, 
			    			html, text, null, documentIds, mailAttach, attachments);
			    	return;
	    		}
		    	MailDeferredTask mailDeferredTask = new MailDeferredTask(emailAPI.toString(), 
		    			apiUser, apiKey, domain, fromEmail, fromName, to, cc, bcc, subject, replyTo, 
		    			html, text, null, null, null);
	
		    	// Add to pull queue with from email as Tag
		    	PullQueueUtil.addToPullQueue(AMAZON_SES_EMAIL_PULL_QUEUE, mailDeferredTask, fromEmail + "_personal");
		    }
		    else if(MAILGUN.equals(emailAPI)) {
	             System.out.println("sending mail using mail gun to: "+to);
		    	MailgunNew.sendMail(apiKey, apiUser, fromEmail, fromName, to, cc, bcc, subject, replyTo, 
		    			html, text, mandrillMetadata, documentIds, mailAttach, attachments);
		    }
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		    System.err.println("Exception occured while sending emails through thirdparty email apis..."
			    + e.getMessage());
		    e.printStackTrace();
		}
    }

	/** 
	 * Sending mails using configured Outbound SMTP or Oauth. 
	 */
	private static boolean smtpOutboundSendMail(String fromEmail, String fromName, String to,
			String cc, String bcc, String subject, String replyTo, String html, String text,
			List<Long> documentIds, String[] mailAttach, String... attachments) {
		
		try {
			AgileUser agileUser = AgileUser.getCurrentAgileUser();

			if(agileUser != null) {
				
				//Fetch the email options from user's Gmail oauth preferences 
				GmailSendPrefs gmailPrefs = GmailSendPrefsUtil.getPrefs(agileUser, fromEmail);
				int emailCount = StringUtils.countMatches(to + cc + bcc , "@");
				
				if(gmailPrefs != null) {
					long emailMaxLimitCount = SMTPBulkEmailUtil.getSMTPEmailsLimit(fromEmail, PrefsType.GMAIL);
					if(emailMaxLimitCount > emailCount)
					{
						SMTPBulkEmailUtil.decreaseSMTPEmailsLimit(fromEmail, emailCount, PrefsType.GMAIL);
						
						System.out.println("GmailPrefs email address : "  + gmailPrefs.email + "   Email Limit : " + emailMaxLimitCount);
						GMail.sendMail(gmailPrefs, to, cc, bcc, subject, replyTo, fromName,
							html, text, documentIds, mailAttach, attachments);
					  return true;
					}
				}

				//Fetch the email options from user's SMTP preferences 
				SMTPPrefs smtpPrefs = SMTPPrefsUtil.getPrefs(agileUser, fromEmail);
				if(smtpPrefs != null) {
					long emailMaxLimitCount = SMTPBulkEmailUtil.getSMTPEmailsLimit(fromEmail, PrefsType.SMTP);
					if(emailMaxLimitCount > emailCount)
					{
						SMTPBulkEmailUtil.decreaseSMTPEmailsLimit(fromEmail, emailCount, PrefsType.SMTP);
						
						System.out.println("SMTPPrefs email address : "  + smtpPrefs.user_name + "   Email Limit : " + emailMaxLimitCount);
						GMail.sendMail(smtpPrefs, to, cc, bcc, subject, replyTo, fromName,
							html, text, documentIds, mailAttach, attachments);
					 return true;
					}
				}
			}
		} 
		catch(Exception ex) {
			System.err.println("Exception occured while getting smtp prefs...");
			System.out.println(ExceptionUtils.getFullStackTrace(ex));
		}
		return false;
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
	    String[] mailAttach, String... attachments)
    {
	EmailGateway emailGateway = EmailGatewayUtil.getEmailGateway();

	sendEmail(emailGateway, domain, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
		mandrillMetadata, documentIds, mailAttach, attachments);
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
    	to = ContactEmailUtil.normalizeEmailIds(to);
    	if(!StringUtils.isBlank(to)) {
			MailDeferredTask mailDeferredTask = new MailDeferredTask(emailGatewayType, apiUser, apiKey, domain, fromEmail,
					fromName, to, ContactEmailUtil.normalizeEmailIds(cc), ContactEmailUtil.normalizeEmailIds(bcc), 
					subject, replyTo, html, text, mandrillMetadata, subscriberId, campaignId);
			
			// Add to pull queue with from email as Tag
			if(emailGatewayType!=null && emailGatewayType.equalsIgnoreCase("SES")){
				queueName = AMAZON_SES_EMAIL_PULL_QUEUE;
			}
			PullQueueUtil.addToPullQueue(queueName, mailDeferredTask, fromEmail);
    	}	
    }

    /**
     * Sends bulk emails obtained from leased tasks
     * 
     * @param tasks
     *            - tasks leased from pull queue
     */
    public static void sendMails(List<TaskHandle> tasks, String queueName)
    {
    	
	sendMailsMailDeferredTask(convertTaskHandlestoMailDeferredTasks(tasks), queueName);
    }
    
    public static void sendMails(List<TaskHandle> tasks)
    {
    	sendMailsMailDeferredTask(convertTaskHandlestoMailDeferredTasks(tasks), null);
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
		List<Object[]> queryList = new ArrayList<Object[]>();
		Map<String, String> campaignNameMap = new HashMap<String, String>();
	    for (MailDeferredTask mailDeferredTask : tasks)
	    {
	    	String campaignName = null;
	    	if (!campaignNameMap.containsKey(mailDeferredTask.campaignId + "-" + mailDeferredTask.domain))
		    {
			campaignName = WorkflowUtil.getCampaignName(mailDeferredTask.campaignId);
			campaignNameMap.put(mailDeferredTask.campaignId + "-" + mailDeferredTask.domain, campaignName);
		    }
		    else
		    {
			campaignName = campaignNameMap.get(mailDeferredTask.campaignId + "-" + mailDeferredTask.domain);
		    }
		    String oldNamespace = NamespaceManager.get();
		    try{	    
		    NamespaceManager.set(mailDeferredTask.domain);
		    // For personal bulk emails, no need to add log
		    if (StringUtils.isEmpty(mailDeferredTask.campaignId ) && StringUtils.isBlank(mailDeferredTask.subscriberId))
		    {
			continue;
		    }

		    Object[] newLog = new Object[] { mailDeferredTask.domain,mailDeferredTask.campaignId, campaignName,mailDeferredTask.subscriberId,
		    		GoogleSQL.getCurrentDate(), "Emails limit exceeded. Please increase your quota.", LogType.EMAIL_SENDING_FAILED.toString(),
		    		 };

		    queryList.add(newLog);
		    }
		    finally{
		    	NamespaceManager.set(oldNamespace);
		    }
		}
		
		if (queryList.size() > 0)
		{
		    Long start_time = System.currentTimeMillis();
		    CampaignLogsSQLUtil.addToCampaignLogs(queryList);
//		    CampaignLogsSQLUtil.addCampaignLogsToNewInstance(queryList);
		    System.out.println("batch request completed : " + (System.currentTimeMillis() - start_time));
		    System.out.println("Logs size : " + queryList.size());
		}

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while adding exceeded log in EmailGatewayUtil..." + e.getMessage());
	}
    }

    public static void sendMailsMailDeferredTask(List<MailDeferredTask> tasks, String queueName)
    {

	MailDeferredTask mailDeferredTask = tasks.get(0);

	String domain = mailDeferredTask.domain;

	String oldNamespace = NamespaceManager.get();

	try
	{
	    // Set namespace
	    NamespaceManager.set(domain);

	    EmailSender emailSender = EmailSender.getEmailSender();
	    emailSender.setQueueName(queueName);
	    emailSender.setEmailsToSend(tasks.size());
	    
	    EmailGateway emailGateway = emailSender.emailGateway;

	    if (emailSender.canSend())
	    {
	    	//Fetch the preferred emailgateway from account preferences
	    	EMAIL_API preferredGateway = (emailGateway != null) ? 
	    			emailGateway.email_api : EMAIL_API.SEND_GRID;
	    	
	    	if(StringUtils.equalsIgnoreCase(queueName, AgileQueues.SMTP_BULK_EMAIL_PULL_QUEUE))
	    	{
	    		tasks = SMTPBulkEmailUtil.sendSMTPBulkEmails(tasks, emailSender);
	    	}
	    	
	    	if(tasks.size() > 0)
	    	{
		    	if(preferredGateway == SEND_GRID)
				    SendGridUtil.sendSendGridMails(tasks, emailSender);
	
		    	else if(preferredGateway == MANDRILL)
		    		MandrillUtil.splitMandrillTasks(tasks, emailSender);
			
		    	else if(preferredGateway == SES)
					AmazonSESUtil.sendSESMails(tasks, emailSender);
		    	
				else if(preferredGateway == MAILGUN)
					 MailgunUtil.sendMailgunMails(tasks, emailSender);
		
				addEmailLogs(tasks);
	    	}
	
			emailSender.setCount(emailSender.getEmailsToSend());
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
    
    /**
     * 
     * @return
     */
    public static boolean isEmailGatewayExist(){
    	EmailGateway emailGateway = EmailGatewayUtil.getEmailGateway();
    	
    	if(emailGateway == null)
    		return false;
    	return true;
    }
    
    public static void checkSubUserExists(String domain)
    {
    	try {
			if(StringUtils.isBlank(domain))
				domain = NamespaceManager.get();
			
			if(StringUtils.isBlank(domain))
				return;
			
			// If gateway exists return
			if(isEmailGatewayExist())
				return;
			
			Queue queue = QueueFactory.getQueue(AgileQueues.ACCOUNT_STATS_UPDATE_QUEUE);
			SendGridSubAccountDeferred task = new SendGridSubAccountDeferred(domain);
			task.setCheckSubUserExists(true);
			queue.add(TaskOptions.Builder.withPayload(task));
		}
    	catch (Exception e) {
			e.printStackTrace();
		}
    }
    
    /**
     * This method will return true and false based on email category
     * @param emailSender
     * @return
     * 		- boolean
     */
    public static boolean isEmailCategoryTransactional(EmailSender emailSender) 
    {
    	final int MAX_LIMIT = 15;
    	
    	if(emailSender == null)
    		return true;
    	if(StringUtils.equalsIgnoreCase(emailSender.getQueueName(), AgileQueues.BULK_EMAIL_PULL_QUEUE))
			return false;
		
		if(StringUtils.equalsIgnoreCase(emailSender.getQueueName(), AgileQueues.TIME_OUT_EMAIL_PULL_QUEUE) && emailSender.getEmailsToSend() > MAX_LIMIT)
			return false;
		
		if(StringUtils.equalsIgnoreCase(emailSender.getQueueName(), AgileQueues.AMAZON_SES_EMAIL_PULL_QUEUE) && emailSender.getEmailsToSend() > MAX_LIMIT)
			return false;
    	
		return true;
	}
    
}
