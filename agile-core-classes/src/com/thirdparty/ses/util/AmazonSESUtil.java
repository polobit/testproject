package com.thirdparty.ses.util;

import java.util.List;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.EmailGateway;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.util.EmailUtil;
import com.google.appengine.api.taskqueue.TaskHandle;
import com.thirdparty.ses.AmazonSES;

public class AmazonSESUtil
{
	public static void sendSESMails(List<TaskHandle>tasks, EmailSender emailSender)
	{
		MailDeferredTask mailDeferredTask = null;
		EmailGateway emailGateway = emailSender.emailGateway;
		
		if(emailGateway == null)
			return;
		
		AmazonSES ses = AmazonSES.getInstance(emailGateway.api_key, emailGateway.api_user, emailGateway.regions);
		
		for(TaskHandle task: tasks)
		{
			try
			{
				mailDeferredTask = (MailDeferredTask) SerializationUtils
					.deserialize(task.getPayload());
			
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
			
				ses.sendEmail(mailDeferredTask.fromEmail, mailDeferredTask.fromName, mailDeferredTask.to, mailDeferredTask.cc, mailDeferredTask.bcc, mailDeferredTask.subject, mailDeferredTask.replyTo, mailDeferredTask.html, mailDeferredTask.text);
			}
			catch(Exception ex)
			{
				System.err.println("Exception occured in sendSESMails..." + ex.getMessage());
			}
		}
	}
}
