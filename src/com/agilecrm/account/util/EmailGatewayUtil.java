package com.agilecrm.account.util;

import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.EmailGateway.EMAIL_API;
import com.agilecrm.mandrill.util.MandrillUtil;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.queues.backend.BackendUtil;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.sendgrid.util.SendGridUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.IntegrationType;
import com.agilecrm.widgets.Widget.WidgetType;
import com.agilecrm.widgets.util.WidgetUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.TaskHandle;
import com.thirdparty.SendGrid;
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
	    // Check given api keys
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
	else
	    response = Mandrill.sendMail(emailGateway.api_key, false, "api_test@agilecrm.com", "API Test",
		    "naresh@agilecrm.com", null, null, "Mandrill test email from " + NamespaceManager.get(), null,
		    "Test Email.", "Test Email", null);

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
	    throw new Exception("Error saving - " + responseJSON.getString("errors"));

	// Mandrill Error
	if (responseJSON != null && responseJSON.has("status") && responseJSON.getString("status").equals("error"))
	    throw new Exception("Error saving - " + responseJSON.getString("message"));

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
    public static void sendBulkEmail(String domain, String fromEmail, String fromName, String to, String cc,
	    String bcc, String subject, String replyTo, String html, String text, String mandrillMetadata)
    {
	try
	{
	    // Fetch EmailGateway
	    EmailGateway emailGateway = getEmailGateway();

	    // If no gateway setup, sends email through Agile Mandrill
	    if (emailGateway == null)
	    {
		// Add to Pull Queue
		addToQueue(null, null, null, domain, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
		        mandrillMetadata);

		return;
	    }

	    System.out.println("Sending email using emailgateway " + emailGateway.email_api.toString() + " of domain "
		    + domain);

	    // Add To Queue
	    addToQueue(emailGateway.email_api.toString(), emailGateway.api_user, emailGateway.api_key, domain,
		    fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text, mandrillMetadata);

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
    public static void sendEmail(String domain, String fromEmail, String fromName, String to, String cc, String bcc,
	    String subject, String replyTo, String html, String text, String mandrillMetadata, String... attachments)
    {
	try
	{
	    // Fetch EmailGateway
	    EmailGateway emailGateway = getEmailGateway();

	    // If no gateway setup, sends email through Agile Mandrill
	    if (emailGateway == null)
	    {
		Mandrill.sendMail(null, true, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
		        mandrillMetadata, attachments);
		return;
	    }

	    // If SendGrid
	    if (EMAIL_API.SEND_GRID.equals(emailGateway.email_api))
		SendGrid.sendMail(emailGateway.api_user, emailGateway.api_key, fromEmail, fromName, to, cc, bcc,
		        subject, replyTo, html, text, null, attachments);

	    // If Mandrill
	    if (EMAIL_API.MANDRILL.equals(emailGateway.email_api))
		Mandrill.sendMail(emailGateway.api_key, true, fromEmail, fromName, to, cc, bcc, subject, replyTo, html,
		        text, mandrillMetadata, attachments);

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while sending emails through thirdparty email apis..."
		    + e.getMessage());

	    e.printStackTrace();

	    System.out.println("Sending email again from exception in EmailGatewayUtil... " + e.getMessage());

	    Mandrill.sendMail(null, true, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
		    mandrillMetadata, attachments);

	}
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
    public static void addToQueue(String emailGatewayType, String apiUser, String apiKey, String domain,
	    String fromEmail, String fromName, String to, String cc, String bcc, String subject, String replyTo,
	    String html, String text, String mandrillMetadata)
    {
	MailDeferredTask mailDeferredTask = new MailDeferredTask(emailGatewayType, apiUser, apiKey, domain, fromEmail,
	        fromName, to, cc, bcc, subject, replyTo, html, text, mandrillMetadata);

	// Add to pull queue with from email as Tag
	PullQueueUtil.addToPullQueue(
	        "bulk".equals(BackendUtil.getCurrentBackendName()) ? AgileQueues.BULK_EMAIL_PULL_QUEUE
	                : AgileQueues.NORMAL_EMAIL_PULL_QUEUE, mailDeferredTask, fromEmail);
    }

    /**
     * Sends bulk emails obtained from leased tasks
     * 
     * @param tasks
     *            - tasks leased from pull queue
     */
    public static void sendMails(List<TaskHandle> tasks)
    {
	TaskHandle firstTaskHandle = tasks.get(0);

	MailDeferredTask mailDeferredTask = (MailDeferredTask) SerializationUtils.deserialize(firstTaskHandle
	        .getPayload());

	// If null or Mandrill
	if (mailDeferredTask.emailGatewayType == null
	        || StringUtils.equals(mailDeferredTask.emailGatewayType, EMAIL_API.MANDRILL.toString()))
	    MandrillUtil.sendMandrillMails(tasks);

	// If SendGrid
	if (StringUtils.equals(mailDeferredTask.emailGatewayType, EMAIL_API.SEND_GRID.toString()))
	    SendGridUtil.sendSendGridMails(tasks);

	// Records email sent count
	AccountEmailStatsUtil.recordAccountEmailStats(mailDeferredTask.domain, tasks.size());
    }
}
