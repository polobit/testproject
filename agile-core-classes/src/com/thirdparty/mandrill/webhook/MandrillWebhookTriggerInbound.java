package com.thirdparty.mandrill.webhook;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.campaignio.servlets.deferred.EmailRepliedDeferredTask;
import com.campaignio.tasklets.util.MandrillConstans;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.utils.SystemProperty;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class MandrillWebhookTriggerInbound extends HttpServlet
{
	public static enum AgileDetail
	{
		API_KEY, DOMAIN;
	}

	public static final String INBOUND_MAIL_EVENT = "INBOUND_MAIL_EVENT";

	public static final List<String> confirmationEmails;

	static
	{
		confirmationEmails = new ArrayList<String>();
		confirmationEmails.add("forwarding-noreply@google.com");
		confirmationEmails.add("no-reply@cc.yahoo-inc.com");
		confirmationEmails.add("noreply@zoho.com");
	}

	public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
	{
		String oldNamespace = NamespaceManager.get();
		try
		{
			String mandrillEvents = request.getParameter(MandrillConstans.MANDRILL_EVENTS);
			if (StringUtils.isBlank(mandrillEvents))
			{
				return;
			}
			JSONArray events = new JSONArray(mandrillEvents);
			for (int i = 0; i < events.length(); i++)
			{
				JSONObject event = events.getJSONObject(i);

				if (event.has(MandrillConstans.EVENT)
						&& StringUtils.equals(event.getString(MandrillConstans.EVENT), MandrillConstans.INBOUND))
				{
					JSONObject message = event.getJSONObject(MandrillConstans.MSG);
					if (message == null)
					{
						continue;
					}
					String agileEmail = getAgileEmail(message);
					String apiKey = getAgileDetail(agileEmail, AgileDetail.API_KEY);
					String agileDomain = getAgileDetail(agileEmail, AgileDetail.DOMAIN);
					System.out.println("agile api key is " + apiKey);
					System.out.println("agile special email is " + agileEmail);
					System.out.println("agile domain is " + agileDomain);
					if (agileEmail == null || agileDomain == null || apiKey == null)
					{
						continue;
					}
					NamespaceManager.set(agileDomain);
					Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);
					System.out.println("owner is " + owner);
					if (owner == null)
					{
						continue;
					}
					System.out.println("CURRENT namespace is " + NamespaceManager.get());
					if (isConfirmationEmail(message))
					{
						sendConfirmationEmail(apiKey, message);
						continue;
					}
					// invokes email reply node in campaign
					parseEmailMessageAndRunCampaign(message, agileDomain);
					String fromEmail = message.getString(MandrillConstans.MSG_FROM_EMAIL);
					String fromName = null;
					if (message.has(MandrillConstans.MSG_FROM_NAME))
						fromName = message.getString(MandrillConstans.MSG_FROM_NAME);

					System.out.println("from email is " + fromEmail);
					System.out.println("from name is " + fromName);

					Boolean isNewContact = isNewContact(fromEmail);
					Contact contact = buildContact(fromName, fromEmail, isNewContact);

					if (contact == null)
					{
						continue;
					}
					System.out.println("saving contact");
					if (isNewContact)
						contact.setContactOwner(owner);
					try
					{
						contact.save();
					}
					catch (PlanRestrictedException e)
					{
						continue;
					}
					catch (Exception e)
					{
						continue;
					}
					invokeInboundTriggers(isNewContact, contact, message);
				}
			}
		}
		catch (Exception e)
		{
			System.out.println("exception occured parsing mandrill events JSON " + e.getMessage());
			NamespaceManager.set(oldNamespace);
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
		return;
	}

	public JSONObject getSenderNames(String fromName, String fromEmail) throws JSONException
	{
		JSONObject from = new JSONObject();
		if (!(StringUtils.isBlank(fromName) || StringUtils.equals(fromName, "null")))
		{
			if (StringUtils.contains(fromName, " "))
			{
				from.put(Contact.FIRST_NAME, fromName.split(" ")[0]);
				from.put(Contact.LAST_NAME, fromName.split(" ")[1]);
			}
			else
				from.put(Contact.FIRST_NAME, fromName);
		}
		else
			from.put(Contact.FIRST_NAME, fromEmail.split("@")[0]);
		return from;
	}

	public Boolean isNotAgileEmail(String recepientEmail)
	{
		return !StringUtils.contains(recepientEmail, "@agle.cc");
	}

	public Contact buildContact(String fromName, String fromEmail, Boolean isNewContact)
	{
		if (StringUtils.isBlank(fromEmail) || StringUtils.equals(fromEmail, "null"))
			return null;

		Contact contact = null;

		if (isNewContact)
			contact = new Contact();
		else
			contact = ContactUtil.searchContactByEmail(fromEmail);

		contact.addpropertyWithoutSaving(new ContactField(Contact.EMAIL, fromEmail, null));
		try
		{
			JSONObject from = getSenderNames(fromName, fromEmail);
			if (from.has(Contact.FIRST_NAME))
				contact.addpropertyWithoutSaving(new ContactField(Contact.FIRST_NAME, from
						.getString(Contact.FIRST_NAME), null));
			if (from.has(Contact.LAST_NAME))
				contact.addpropertyWithoutSaving(new ContactField(Contact.LAST_NAME, from.getString(Contact.LAST_NAME),
						null));

			return contact;
		}
		catch (JSONException e)
		{
			return null;
		}
	}

	public String getAgileEmail(JSONObject message)
	{
		try
		{
			JSONArray allRecepients = new JSONArray();
			if (message.has("to"))
				allRecepients.put(message.getJSONArray("to"));
			if (message.has("cc"))
				allRecepients.put(message.getJSONArray("cc"));

			for (int i = 0; i < allRecepients.length(); i++)
			{
				System.out.println(allRecepients.getJSONArray(i));
				JSONArray recepients = allRecepients.getJSONArray(i);
				for (int j = 0; j < recepients.length(); j++)
				{
					System.out.println(recepients.getJSONArray(j));
					JSONArray recepient = recepients.getJSONArray(j);
					if (!isNotAgileEmail(recepient.getString(0)))
						return recepient.getString(0);
				}
			}
			if (!StringUtils.isBlank(message.getString("email")) && !isNotAgileEmail(message.getString("email")))
				return message.getString("email");
			return null;
		}
		catch (JSONException e)
		{
			return null;
		}
	}

	public String getAgileDetail(String agileEmail, AgileDetail detail)
	{
		try
		{
			if (detail == AgileDetail.API_KEY)
				return agileEmail.split("@")[0].split("-")[1];
			else if (detail == AgileDetail.DOMAIN)
				return agileEmail.split("@")[0].split("-")[0];
			return null;
		}
		catch (Exception e)
		{
			return null;
		}
	}

	public Boolean isNewContact(String fromEmail)
	{
		return !ContactUtil.isExists(fromEmail.toLowerCase());
	}

	public void invokeInboundTriggers(boolean newContact, Contact contact, JSONObject message) throws Exception
	{
		List<Trigger> triggers = TriggerUtil
				.getTriggersByCondition(com.agilecrm.workflows.triggers.Trigger.Type.INBOUND_MAIL_EVENT);
		for (Trigger trigger : triggers)
		{
			System.out.println("trigger id is " + trigger.id);
			if (getTriggerRunResult(newContact, trigger))
			{
				System.out.println("assigning campaign to contact");

				WorkflowSubscribeUtil.subscribeDeferred(contact, trigger.campaign_id,
						new JSONObject().put("message", message));
			}
		}
	}

	public Boolean getTriggerRunResult(Boolean newContact, Trigger trigger)
	{
		return (newContact || !TriggerUtil.getTriggerRunStatus(trigger));
	}

	public Boolean isConfirmationEmail(JSONObject message)
	{
		Boolean isConfirmationEmail = false;
		try
		{
			String fromEmail = message.getString("from_email");

			for (String entry : confirmationEmails)
			{
				if (StringUtils.equals(entry, fromEmail))
				{
					isConfirmationEmail = true;
					break;
				}
			}
		}
		catch (JSONException e)
		{
			isConfirmationEmail = false;
		}
		return isConfirmationEmail;
	}

	public void sendConfirmationEmail(String apiKey, JSONObject message)
	{
		try
		{
			String messageSubject = message.getString("subject");
			System.out.println("forwarding confirmation email with subject " + messageSubject);

			DomainUser user = APIKey.getDomainUserRelatedToAPIKey(apiKey);
			EmailUtil.sendEmailUsingAPI("noreply@agilecrm.com", "Agile CRM", user.email, null, null, messageSubject,
					null, getMessageContent("html", message), getMessageContent("text", message), null, null);
		}
		catch (Exception e)
		{
			System.out.println("exception occured in sending confirmation email " + e.getMessage());
		}
	}

	public String getMessageContent(String contentType, JSONObject message)
	{
		try
		{
			if (message.has(contentType))
				return message.getString(contentType);
		}
		catch (JSONException e)
		{
		}
		return null;
	}

	/**
	 * Parses Mandrill inbound email message, extracts campaignId, SubscriberId
	 * from 1x1 image src. Runs the campaign.
	 * 
	 * @param emailMessage
	 */
	private void parseEmailMessageAndRunCampaign(JSONObject emailMessage, String agileDomain)
	{
		if (emailMessage.has("html"))
		{
			try
			{
				String mailHtmlContent = emailMessage.get("html").toString();
				String applicationId = SystemProperty.applicationId.get();
				Pattern pattern = null;
				if (StringUtils.equals(applicationId, "agilecrmbeta"))
				{
					agileDomain = agileDomain + "-dot-sandbox-dot-" + applicationId + "\\.appspot\\.com";
					pattern = Pattern.compile("src=[\"']https:\\/\\/" + agileDomain + "[^\"']*");
				}
				else
					pattern = Pattern.compile("src=[\"']https:\\/\\/" + agileDomain + "\\.agilecrm\\.com+[^\"']*");
				Matcher matcher = pattern.matcher(mailHtmlContent);
				if (matcher.find())
				{
					String src = matcher.group(0);
					if (StringUtils.isNotEmpty(src))
					{
						src = StringEscapeUtils.unescapeHtml(src);
						String[] srcSplits = src.split("\\?");
						String params = srcSplits[1];
						String campaignId = params.split("&")[0].split("=")[1];
						String subscriberId = params.split("&")[1].split("=")[1];
						System.out.println("Campaign Id " + campaignId);
						System.out.println("SubscriberId " + subscriberId);
						interruptCronTasksOfReplied(campaignId, subscriberId);
					}
				}
			}
			catch (Exception e)
			{
				System.out.println("Parsing 1X1 image failed " + e.getMessage());
				e.printStackTrace();
			}
		}
	}

	/**
	 * Interrupts email replied in Cron
	 * 
	 * @param campaignId
	 * @param subscriberId
	 */
	private void interruptCronTasksOfReplied(String campaignId, String subscriberId)
	{
		try
		{
			// Interrupt opened in DeferredTask
			EmailRepliedDeferredTask emailOpenDeferredTask = new EmailRepliedDeferredTask(campaignId, subscriberId,
					null);
			Queue queue = QueueFactory.getQueue("email-reply-queue");
			queue.addAsync(TaskOptions.Builder.withPayload(emailOpenDeferredTask));
			System.out.println("Email Reply yes node task added to email reply queue");
		}
		catch (Exception e)
		{
			System.out.println("Error while invoking email reply yes node " + e.getMessage());
			e.printStackTrace();
		}
	}
}