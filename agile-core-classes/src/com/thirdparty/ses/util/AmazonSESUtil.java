package com.thirdparty.ses.util;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.EmailGateway;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.VersioningUtil;
import com.google.appengine.api.taskqueue.TaskHandle;
import com.google.appengine.api.utils.SystemProperty;
import com.thirdparty.ses.AmazonSES;

/**
 * <code>AmazonSESUtil</code> is the utility class for verifying given aws keys and sending emails
 * 
 * @author naresh
 *
 */
public class AmazonSESUtil
{
	/**
	 * Converts task handle list to MailDeferred tasks.
	 * 
	 * @param tasks - queue tasks.
	 * @param emailSender - EmailSender object
	 * 
	 * @throws Exception
	 */
	public static void sendBulkMails(List<TaskHandle> tasks, EmailSender emailSender) throws Exception
	{
		List<MailDeferredTask> mailTasks = new ArrayList<MailDeferredTask>();
		
		for(TaskHandle task: tasks)
			mailTasks.add((MailDeferredTask)SerializationUtils.deserialize(task.getPayload()));
		
		sendSESMails(mailTasks, emailSender);
	}
	
	/**
	 * Sends bulk emails using amazon ses
	 * 
	 * @param tasks - maildeferred tasks
	 * @param emailSender - EmailSender
	 * 
	 * @throws Exception - {@link IllegalArgumentException}
	 */
	public static void sendSESMails(List<MailDeferredTask>tasks, EmailSender emailSender) throws Exception
	{
		EmailGateway emailGateway = emailSender.emailGateway;
		
		if(emailGateway == null)
			throw new IllegalArgumentException("EmailGateway cannot be null");
		
		AmazonSES ses = AmazonSES.getInstance(emailGateway.api_user, emailGateway.api_key, emailGateway.regions);
		
		for(MailDeferredTask mailDeferredTask: tasks)
		{
			try
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
			
				long start = System.currentTimeMillis();
				ses.sendEmail(mailDeferredTask.fromEmail, mailDeferredTask.fromName, mailDeferredTask.to, mailDeferredTask.cc, mailDeferredTask.bcc, mailDeferredTask.subject, mailDeferredTask.replyTo, mailDeferredTask.html, mailDeferredTask.text);
				System.out.println("Sent time - " + (System.currentTimeMillis() - start));
			}
			catch(Exception ex)
			{
				System.err.println("Exception occured in sendSESMails..." + ex.getMessage());
			}
		}
	}

	/**
	 * Validates SES credentials.
	 * 
	 * @param accessKey - AWS access key
	 * @param secretKey - AWS secret key
	 * @param region - AWS region
	 * 
	 * @return response string
	 * 
	 * @throws Exception - {@link IOException}
	 */
	public static String verifySESKeys(final String accessKey, final String secretKey, final String region) throws Exception
	{
		
		String host = "http://54.87.153.50:8080/";
		
		if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			host = "http://localhost:8080/ses-beta-app";
			
		if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
		{
			// For Beta sandbox
			if(SystemProperty.applicationId.get().equals("agilecrmbeta"))
				host = host + "ses-beta-app";
		
			// For Production
			if(SystemProperty.applicationId.get().equals("agile-crm-cloud"))
				host = host + "ses-beta-app";
			
		}
		
		String params = "/ses?access_key=" + URLEncoder.encode(accessKey, "UTF-8") + "&secret_key=" + URLEncoder.encode(secretKey, "UTF-8") 
				+ "&region=" +URLEncoder.encode(region, "UTF-8")+ "&action=" + URLEncoder.encode("ListIdentities", "UTF-8");
		
		return HTTPUtil.accessURL(host + params);
	}

	/**
	 * Sends email through amazon ses with provided parameters
	 * 
	 * @param accessKey - AWS access key
	 * @param secretKey - AWS secret key
	 * @param region - AWS region
	 * @param fromEmail - from email
	 * @param fromName - from name
	 * @param to - To email string can be separated by commas
	 * @param cc - CC email string can be separated by commas
	 * @param bcc - BCC email string can be separated by commas
	 * @param subject - email subject
	 * @param replyTo - Reply To
	 * @param html - HTML body
	 * @param text - Text body
	 * 
	 * @throws Exception - {@link IllegalArgumentException}
	 */
	public static void sendEmail(String accessKey, String secretKey,
			String region, String fromEmail, String fromName, String to,
			String cc, String bcc, String subject, String replyTo, String html,
			String text) throws Exception {
		
		AmazonSES ses = AmazonSES.getInstance(accessKey, secretKey, region);
		ses.sendEmail(fromEmail, fromName, to, cc, bcc, subject, replyTo, html,
				text);
	}
}