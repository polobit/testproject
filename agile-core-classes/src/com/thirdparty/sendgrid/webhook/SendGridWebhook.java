package com.thirdparty.sendgrid.webhook;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.thirdparty.email.webhook.util.EmailWebhookUtil;

@SuppressWarnings("serial")
public class SendGridWebhook extends HttpServlet
{

	public static final String EVENT = "event";
	public static final String HARD_BOUNCE = "bounce";
	public static final String SOFT_BOUNCE = "bounce";
	public static final String SPAM_REPORT = "spamreport";
	public static final String SPAM_REPORT_1 = "spam report";
	public static final String DROPPED = "dropped";
	public static final String TYPE = "type";
	public static final String BLOCKED = "blocked";
	public static final String INVALID = "invalid";

	public static final String EMAIL = "email";

	public static final String SUBJECT = "subject";
	public static final String DOMAIN = "domain";
	public static final String CAMPAIGN_ID = "campaign_id";
	
	private static final String REASON = "reason";

	public void service(HttpServletRequest req, HttpServletResponse res)
	{
		try
		{

			String line = null;
			String sendGridEvents = "";
			StringBuilder buffer = new StringBuilder();

			BufferedReader br = null;

			try
			{
				br = new BufferedReader(new InputStreamReader(req.getInputStream()));

				while ((line = br.readLine()) != null)
					buffer.append(line);
			}
			catch (Exception e)
			{
				e.printStackTrace();
				System.err.println("Exceprion occured while reading stream..." + e.getMessage());
			}
			finally
			{
				if (br != null)
					br.close();
			}

			sendGridEvents = buffer.toString();
			System.out.println("SendGrid events are:");
			System.out.println(sendGridEvents);

			if (StringUtils.isBlank(sendGridEvents))
				return;

			JSONArray events = new JSONArray(sendGridEvents);
			String event = "";

			System.out.println("Length si..." + events.length());
			for (int i = 0, len = events.length(); i < len; i++)
			{
				System.out.println("index: " + i);
				JSONObject eventJSON = events.getJSONObject(i);

				System.out.println("Event JSON " + eventJSON.toString());
				event = eventJSON.getString(EVENT);

				System.out.println("SendGrid webhook event is " + event);

				// Set to contact if event is HardBounce or SoftBounce
				if (StringUtils.equalsIgnoreCase(event, HARD_BOUNCE)
						|| StringUtils.equalsIgnoreCase(event, SOFT_BOUNCE)
						|| StringUtils.equalsIgnoreCase(event, SPAM_REPORT)
						|| StringUtils.equalsIgnoreCase(event, DROPPED)
						|| StringUtils.equalsIgnoreCase(event, INVALID)
						|| StringUtils.equalsIgnoreCase(event, SPAM_REPORT_1))
				{
					//setBounceStatusToContact(eventJSON);
					
					//System.out.println(eventJSON.toString());
					SendGridDeferredTask sendGridDeferredTask = new SendGridDeferredTask(eventJSON.toString());
					
					Queue queue = QueueFactory.getQueue(AgileQueues.MANDRILL_QUEUE);
					queue.add(TaskOptions.Builder.withPayload(sendGridDeferredTask));
				}
			}

		}
		catch (Exception e)
		{
			System.err.println("Exception occured in SendGrid..." + e.getMessage());
			e.printStackTrace();
		}
	}

	/**
	 * Sets bounce state for a contact within namespace
	 * 
	 * @param eventJSON
	 *            webhook event
	 */
	public void setBounceStatusToContact(JSONObject eventJSON)
	{
		String oldNamespace = NamespaceManager.get();
		String subject = null;

		try
		{

			// If no domain or email, return
			if (!eventJSON.has(DOMAIN) || !eventJSON.has(EMAIL))
				return;

			String domain = eventJSON.getString(DOMAIN);

			// Return if empty namespace
			if (StringUtils.isBlank(domain))
				return;

			NamespaceManager.set(domain);

			// Get email subject
			if (eventJSON.has(SUBJECT))
				subject = eventJSON.getString(SUBJECT);
			
			// For Dropped event, check whether it is Bounced Address, then save it against contact
			if(StringUtils.equalsIgnoreCase(eventJSON.getString(EVENT), DROPPED) && eventJSON.has(REASON))
			{
				String reason = eventJSON.getString(REASON);
				
				System.out.println("Reason is " + reason);
				
				if(StringUtils.containsIgnoreCase(reason, "Bounced Address"))
					eventJSON.put(EVENT, HARD_BOUNCE);
			}
				

			// By default HARD_BOUNCE
			EmailBounceType type = EmailBounceType.HARD_BOUNCE;
			
			if (SOFT_BOUNCE.equals(eventJSON.getString(EVENT)) && ( eventJSON.has(TYPE) && eventJSON.getString(TYPE).equalsIgnoreCase(BLOCKED) ) )
			type = EmailBounceType.SOFT_BOUNCE;
			
			if (SPAM_REPORT.equals(eventJSON.getString(EVENT)) || SPAM_REPORT_1.equals(eventJSON.getString(EVENT)))
			type = EmailBounceType.SPAM;

			String campaignId = null;

			// Get email subject
			if (eventJSON.has(CAMPAIGN_ID))
				campaignId = eventJSON.getString(CAMPAIGN_ID);

			// Set status to Agile Contact
			EmailWebhookUtil.setContactEmailBounceStatus(eventJSON.getString(EMAIL), subject, type, campaignId);

		}
		catch (Exception e)
		{
			System.err.println("Exception occured while setting email bounce status..." + e.getMessage());
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}

	}

}

/**
 * <code>SendGridDeferredTask</code> is the deferred task for executing email events like bounce, spam etc
 * 
 * @author naresh
 *
 */
class SendGridDeferredTask implements DeferredTask
{

	/**
	 * 
	 */
	private static final long serialVersionUID = -9175934454595478511L;
	
	String eventJSON = null;
	
	public SendGridDeferredTask(String eventJSON)
	{
		this.eventJSON = eventJSON;
	}
	
	public void run()
	{
		try
		{
			JSONObject json = new JSONObject(eventJSON);
			SendGridWebhook sw = new SendGridWebhook();
			sw.setBounceStatusToContact(json);
		}
		catch(JSONException e)
		{
			e.printStackTrace();
			System.err.println("JSONException occured in SendGridDeferredTask..." + e.getMessage());
		}
	}
}
