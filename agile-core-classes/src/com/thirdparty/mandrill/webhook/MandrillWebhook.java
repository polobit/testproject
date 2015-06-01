package com.thirdparty.mandrill.webhook;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.email.webhook.util.EmailWebhookUtil;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

/**
 * <code>MandrillWebhook</code> is the webhook servlet to handle hard bounce and
 * soft bounces
 * 
 * @author naresh
 * 
 */
@SuppressWarnings("serial")
public class MandrillWebhook extends HttpServlet
{

	public static final String MANDRILL_EVENTS = "mandrill_events";

	public static final String EVENT = "event";
	public static final String HARD_BOUNCE = "hard_bounce";
	public static final String SOFT_BOUNCE = "soft_bounce";
	public static final String SPAM = "spam";

	public static final String MSG = "msg";
	public static final String EMAIL = "email";
	public static final String SUBACCOUNT = "subaccount";
	public static final String SUBJECT = "subject";

	public static final String METADATA = "metadata";
	public static final String METADATA_CAMPAIGN_ID = "campaign_id";

	public void service(HttpServletRequest req, HttpServletResponse res)
	{
		try
		{
			String mandrillEvents = req.getParameter(MANDRILL_EVENTS);

			String event = "";

			if (StringUtils.isBlank(mandrillEvents))
				return;

			JSONArray events = new JSONArray(mandrillEvents);

			for (int i = 0, len = events.length(); i < len; i++)
			{
				JSONObject eventJSON = events.getJSONObject(i);

				event = eventJSON.getString(EVENT);

				System.out.println("Mandrill webhook event is " + event);

				// Set to contact if event is HardBounce or SoftBounce
				if (StringUtils.equalsIgnoreCase(event, HARD_BOUNCE)
						|| StringUtils.equalsIgnoreCase(event, SOFT_BOUNCE)
						|| StringUtils.equalsIgnoreCase(event, SPAM))
					setBounceStatusToContact(eventJSON);
			}
		}
		catch (Exception e)
		{
			System.err.println("Exception occured in Mandrill Webhook post..." + e.getMessage());
			e.printStackTrace();
		}
	}

	/**
	 * Sets bounce state for a contact within namespace
	 * 
	 * @param eventJSON
	 *            webhook event
	 */
	private void setBounceStatusToContact(JSONObject eventJSON)
	{
		String oldNamespace = NamespaceManager.get();
		JSONObject metadata = null;
		String subject = null;

		try
		{
			if (!eventJSON.has(MSG))
				return;

			JSONObject msgJSON = eventJSON.getJSONObject(MSG);

			// If no subaccount or email, return
			if (!msgJSON.has(SUBACCOUNT) || !msgJSON.has(EMAIL))
				return;

			// Return if empty namespace
			if (StringUtils.isBlank(msgJSON.getString(SUBACCOUNT)))
				return;

			NamespaceManager.set(msgJSON.getString(SUBACCOUNT));

			// Get mandrill metadata
			if (msgJSON.has(METADATA))
				metadata = msgJSON.getJSONObject(METADATA);

			// Get email subject
			if (msgJSON.has(SUBJECT))
				subject = msgJSON.getString(SUBJECT);

			// By default SOFT_BOUNCE
			EmailBounceType type = EmailBounceType.SOFT_BOUNCE;

			if (HARD_BOUNCE.equals(eventJSON.getString(EVENT)))
				type = EmailBounceType.HARD_BOUNCE;

			if (SPAM.equals(eventJSON.getString(EVENT)))
				type = EmailBounceType.SPAM;

			String campaignId = null;

			if (metadata != null && metadata.has(METADATA_CAMPAIGN_ID))
				campaignId = metadata.getString(METADATA_CAMPAIGN_ID);

			// Set status to Agile Contact
			EmailWebhookUtil.setContactEmailBounceStatus(msgJSON.getString(EMAIL), subject, type, campaignId);

			// If spam, verify reputation
			if (type.equals(EmailBounceType.SPAM))
				MandrillSubAccounts.checkReputation(msgJSON.getString(SUBACCOUNT));

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
