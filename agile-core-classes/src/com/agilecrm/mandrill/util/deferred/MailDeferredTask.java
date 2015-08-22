package com.agilecrm.mandrill.util.deferred;

import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.EmailGateway.EMAIL_API;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.sendgrid.SendGrid;
import com.thirdparty.ses.AmazonSES;
import com.thirdparty.ses.util.AmazonSESUtil;
import com.thirdparty.mandrill.Mandrill;

/**
 * <code>MandrillDeferredTask</code> is the deferred task that handles send
 * email details of every task
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class MailDeferredTask implements DeferredTask
{
    /**
     * 
     */
    private static final long serialVersionUID = -4125770150185924086L;

    public String emailGatewayType = null;
    public String apiUser = null;
    public String apiKey = null;
    public String domain = null;
    public String fromEmail = null;
    public String fromName = null;
    public String to = null;
    public String cc = null;
    public String bcc = null;
    public String subject = null;
    public String replyTo = null;
    public String html = null;
    public String text = null;
    public String metadata = null;

    public String subscriberId = null;
    public String campaignId = null;

    /**
     * Constructs a new {@link MailDeferredTask}
     * 
     * @param apiKey
     *            - api Key
     * @param subaccount
     *            - domain name
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param subject
     *            - subject
     * @param replyTo
     *            - reply to email
     * @param html
     *            - html content
     * @param text
     *            - text content
     * @param metadata
     *            - metadata if any
     */
    public MailDeferredTask(String emailGatewayType, String apiUser, String apiKey, String domain, String fromEmail,
	    String fromName, String to, String cc, String bcc, String subject, String replyTo, String html,
	    String text, String metadata, String subscriberId, String campaignId)
    {
	this.emailGatewayType = emailGatewayType;
	this.apiUser = apiUser;
	this.apiKey = apiKey;
	this.domain = domain;
	this.fromEmail = fromEmail;
	this.fromName = fromName;
	this.to = to;
	this.cc = cc;
	this.bcc = bcc;
	this.subject = subject;
	this.replyTo = replyTo;
	this.html = html;
	this.text = text;
	this.metadata = metadata;
	this.subscriberId = subscriberId;
	this.campaignId = campaignId;
    }

    public void run()
    {

	EmailGateway emailGateway = null;

	try
	{
	    emailGateway = EmailGatewayUtil.getEmailGateway();

	// If null or Mandrill
	if (emailGateway == null || emailGateway.email_api == EmailGateway.EMAIL_API.MANDRILL)
	    Mandrill.sendMail(apiKey, true, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text, metadata,
		    null, null);

	// If SendGrid
	else if (emailGateway.email_api == EMAIL_API.SEND_GRID)
	    SendGrid.sendMail(apiUser, apiKey, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text, null);
	
	// Amazon SES
	else if (emailGateway.email_api == EMAIL_API.SES)
		AmazonSESUtil.sendEmail(emailGateway.api_key, emailGateway.api_user, emailGateway.regions, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text);
	
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in MailDeferred Task ..." + e.getMessage());
	}
    }
}
