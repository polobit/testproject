package com.agilecrm.account.util;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.EmailGateway.EMAIL_API;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.mandrill.util.MandrillUtil;
import com.agilecrm.sendgrid.util.SendGridUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.thirdparty.SendGrid;
import com.thirdparty.mandrill.Mandrill;

public class EmailGatewayUtil
{
    public static Map<String, EmailGateway> emailAPIs = new HashMap<String, EmailGateway>();

    private static ObjectifyGenericDao<EmailGateway> dao = new ObjectifyGenericDao<EmailGateway>(EmailGateway.class);

    public static EmailGateway getEmailGateway()
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(EmailGateway.class).get();
    }

    public static EmailGateway getEmailGatewayByType(EmailGateway.EMAIL_API emailAPI)
    {
	Map<String, Object> filter = new HashMap<String, Object>();
	filter.put("email_api", emailAPI);

	return dao.getByProperty(filter);
    }

    public static EmailGateway getEmailGatewayFromMap(String domain)
    {
	// Verify first in HashMap
	EmailGateway api = emailAPIs.get(domain);

	// If not exists, fetch from Cache
	if (api == null)
	{
	    api = EmailGatewayUtil.getEmailGateway();

	    // Add to cache map
	    emailAPIs.put(domain, api);
	}

	return api;
    }

    public static void checkEmailAPISettings(EmailGateway emailGateway) throws Exception
    {
	if (emailGateway == null)
	    return;

	String response = null;
	JSONObject responseJSON = null;

	// Test email to validate credentials
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
    public static void sendBulkEmail(String domain, String fromEmail, String fromName, String to, String cc,
	    String bcc, String subject, String replyTo, String html, String text, String mandrillMetadata)
    {
	try
	{
	    // Fetch EmailGateway
	    EmailGateway emailGateway = EmailGatewayUtil.getEmailGateway();

	    // If no gateway setup, sends email through Agile Mandrill
	    if (emailGateway == null)
	    {
		// Add to Pull Queue
		MandrillUtil.sendMail(null, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
		        mandrillMetadata);
		return;
	    }

	    // If Email API type is SendGrid
	    if (emailGateway.email_api.equals(EMAIL_API.SEND_GRID))
		SendGridUtil.sendMail(emailGateway.api_user, emailGateway.api_key, fromEmail, fromName, to, cc, bcc,
		        subject, replyTo, html, text);
	    else
		MandrillUtil.sendMail(emailGateway.api_key, fromEmail, fromName, to, cc, bcc, subject, replyTo, html,
		        text, mandrillMetadata);

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while sending emails through thirdparty email apis..."
		    + e.getMessage());

	    e.printStackTrace();

	    System.out.println("Sending email again from exception in EmailGatewayUtil... " + e.getMessage());

	    MandrillUtil.sendMail(null, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
		    mandrillMetadata);

	}
    }

    /**
     * Send mails directly
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
	    String subject, String replyTo, String html, String text, String mandrillMetadata, String... attachments)
    {
	try
	{
	    // Fetch EmailGateway
	    EmailGateway emailGateway = EmailGatewayUtil.getEmailGatewayFromMap(domain);

	    // If no gateway setup, sends email through Agile Mandrill
	    if (emailGateway == null)
	    {
		Mandrill.sendMail(null, true, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text,
		        mandrillMetadata, attachments);
		return;
	    }

	    // If Email API type is SendGrid
	    if (emailGateway.email_api.equals(EMAIL_API.SEND_GRID))
		SendGrid.sendMail(emailGateway.api_user, emailGateway.api_key, fromEmail, fromName, to, cc, bcc,
		        subject, replyTo, html, text, null, attachments);
	    else
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
}
