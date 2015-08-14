package com.thirdparty.ses.util;

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

public class AmazonSESUtil
{
	public static void sendBulkMails(List<TaskHandle> tasks, EmailSender emailSender)
	{
		List<MailDeferredTask> mailTasks = new ArrayList<MailDeferredTask>();
		
		for(TaskHandle task: tasks)
			mailTasks.add((MailDeferredTask)SerializationUtils.deserialize(task.getPayload()));
		
		sendSESMails(mailTasks, emailSender);
	}
	
	public static void sendSESMails(List<MailDeferredTask>tasks, EmailSender emailSender)
	{
		EmailGateway emailGateway = emailSender.emailGateway;
		
		if(emailGateway == null)
			return;
		
		AmazonSES ses = AmazonSES.getInstance(emailGateway.api_key, emailGateway.api_user, emailGateway.regions);
		
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

	public static String verifySESKeys(String accessKey, String secretKey, String region) throws Exception
	{
		
		String url = "http://54.87.153.50:8080/";
		
		String params = "/ses?access_key=" + URLEncoder.encode(accessKey, "UTF-8") + "&secret_key=" + URLEncoder.encode(secretKey, "UTF-8") 
				+ "&region=" +URLEncoder.encode(region, "UTF-8")+ "&action=" + URLEncoder.encode("ListIdentities", "UTF-8");
		
		if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			url = "http://localhost:8080/amazon-ses" + params;
			
		if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
		{
			// For Beta sandbox
			if(SystemProperty.applicationId.get().equals("agilecrmbeta"))
				url = url + "amazon-ses" +params;
		
			// For Production
			if(SystemProperty.applicationId.get().equals("agile-crm-cloud"))
				url = url + "amazon-ses" + params;
			
		}
		
		System.out.println("URL is" + url);
		
		String response = HTTPUtil.accessURL(url);
		
		return response;
		
	}
}
