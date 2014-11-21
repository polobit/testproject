package com.agilecrm.mandrill.util.deferred;

import com.agilecrm.account.EmailGateway.EMAIL_API;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.SendGrid;
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
			String text, String metadata)
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
	}

	public void run()
	{
		System.out.println("MailDeferredTask run...");

		// If gateway type is null or Mandrill
		if (emailGatewayType == null || emailGatewayType.equals(EMAIL_API.MANDRILL.toString()))
			Mandrill.sendMail(apiKey, true, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text, metadata,
					null);

		// If gateway type is SendGrid
		if (emailGatewayType.equals(EMAIL_API.SEND_GRID.toString()))
			SendGrid.sendMail(apiUser, apiKey, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text, null);

	}
}
