package com.thirdparty.mailgun.webhook;

import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.bounce.EmailBounceStatus;
import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.EmailBounceTriggerUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.thirdparty.email.webhook.util.EmailWebhookUtil;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;
import com.thirdparty.sendgrid.webhook.SendGridInboundWebhook;

/**
 * <code>MailgunWebhook</code> is the webhook servlet to handle hard bounce,
 * soft bounce and spam
 * 
 * @author Prashannjeet
 * 
 */
@SuppressWarnings("serial")
public class MailgunWebhook extends HttpServlet {

	public static final String EVENT = "event";
	public static final String HARD_BOUNCE = "bounced";
	public static final String SOFT_BOUNCE = "dropped";
	public static final String SPAM = "complained";

	public static final String MSG = "message-headers";
	public static final String EMAIL = "recipient";
	public static final String SUBACCOUNT = "subaccount";
	public static final String SUBJECT = "Subject";

	public static final String METADATA = "metadata";
	public static final String METADATA_CAMPAIGN_ID = "campaign_id";

	public static final String ERROR_CODE = "code";

	public static final String REASON = "reason";

	public static final String REASON_OLD = "old";

	public static final String REASON_HARDFAIL = "hardfail";

	public void doPost(HttpServletRequest req, HttpServletResponse res) {
		try {
			JSONObject webhooksJSON = SendGridInboundWebhook
					.getJSONFromMIME(req);

			System.out.println("Webhooks Data : " + webhooksJSON.toString());

			String event = webhooksJSON.getString(EVENT);

			if (StringUtils.isBlank(event))
				return;

			System.out.println("Mailgun Webhooks Event : " + event);

			if (event.equals(HARD_BOUNCE)) {
				String code = webhooksJSON.getString(ERROR_CODE);
				if (!StringUtils.startsWith(code, "5"))
					;
				return;
			} else if (event.equals(SOFT_BOUNCE)) {
				String reason = webhooksJSON.getString(REASON);

				if (reason.equals(REASON_OLD))
					event = SOFT_BOUNCE;
				else if (reason.equals(REASON_HARDFAIL))
					event = HARD_BOUNCE;
				else
					return;
			}

			String email = webhooksJSON.getString(EMAIL);
			System.out.println(email);

			String subject = getMailgunWebhookMailSubject(webhooksJSON);
			System.out.println(subject);

			JSONObject metadataJSON = new JSONObject(
					webhooksJSON.getString(METADATA));

			System.out.println("Mailgun Webhooks Parameters Event : " + event
					+ ", Email : " + email + ", subject : " + subject
					+ ", Metadata : " + metadataJSON.toString());

			System.out.println("Mailgun webhook event is " + event);

			// Set to contact if event is HardBounce or SoftBounce
			if (StringUtils.equalsIgnoreCase(event, HARD_BOUNCE)
					|| StringUtils.equalsIgnoreCase(event, SOFT_BOUNCE)
					|| StringUtils.equalsIgnoreCase(event, SPAM))

				setBounceStatusToContact(metadataJSON, subject, event, email);
		} catch (Exception e) {
			System.err.println("Exception occured in Mailgun Webhook post..."
					+ e.getMessage());
			e.printStackTrace();
		}
	}

	/**
	 * Sets bounce state for a contact within namespace
	 * 
	 * @param event2
	 * @param msgJSON
	 * 
	 * @param eventJSON
	 *            webhook event
	 */
	private void setBounceStatusToContact(JSONObject metadataJSON,
			String subject, String event, String email) {
		String oldNamespace = NamespaceManager.get();

		try {

			// If no subaccount or email, return
			if (!metadataJSON.has(SUBACCOUNT)
					|| !metadataJSON.has(METADATA_CAMPAIGN_ID))
				return;

			// Return if empty namespace
			if (StringUtils.isBlank(metadataJSON.getString(SUBACCOUNT)))
				return;

			NamespaceManager.set(metadataJSON.getString(SUBACCOUNT));

			// By default SOFT_BOUNCE
			EmailBounceType type = EmailBounceType.SOFT_BOUNCE;

			if (HARD_BOUNCE.equals(event))
				type = EmailBounceType.HARD_BOUNCE;

			if (SPAM.equals(event))
				type = EmailBounceType.SPAM;

			// Set hardbounce and softbounce status to Agile Contact
			// EmailWebhookUtil.setContactEmailBounceStatus(email, subject,
			// type, metadataJSON.getString(METADATA_CAMPAIGN_ID));

			MailgunWebhookDeferredTask mailgunDeferredTask = new MailgunWebhookDeferredTask(
					email, subject, type,
					metadataJSON.getString(METADATA_CAMPAIGN_ID));

			Queue queue = QueueFactory.getQueue(AgileQueues.MANDRILL_QUEUE);
			queue.add(TaskOptions.Builder.withPayload(mailgunDeferredTask));

		} catch (Exception e) {
			System.err
					.println("Exception occured while setting Mailgun email bounce status..."
							+ e.getMessage());
			e.printStackTrace();
		} finally {
			NamespaceManager.set(oldNamespace);
		}

	}

	/**
	 * This method is used to fetch the email subject from mailgun webhook data
	 * 
	 * @param dataJSON
	 * @return string -subject
	 */
	private String getMailgunWebhookMailSubject(JSONObject webhooksJSON) {
		String subject = null;
		try {
			JSONArray subjectJSON = new JSONArray(webhooksJSON.getString(MSG));

			for (int index = 0; index < subjectJSON.length(); index++) {
				if (subjectJSON.getJSONArray(index).getString(0)
						.equalsIgnoreCase(SUBJECT))
					subject = subjectJSON.getJSONArray(index).getString(1);
			}
		} catch (JSONException e) {
			System.out
					.println("Exception occured while getting subject form Mailgun Webhooks JSON..."
							+ e.getMessage());
			return null;
		}
		return subject;

	}
}

/**
 * <code>MailgunWebhookDeferredTask</code> is the deferred task for executing
 * email events like bounce, spam etc
 * 
 * @author Prashannjeet
 * 
 */

class MailgunWebhookDeferredTask implements DeferredTask {
	String email = null;

	String emailSubject = null;

	String campaignId = null;

	EmailBounceType emailBounceType;

	public MailgunWebhookDeferredTask(String email, String emailSubject,
			EmailBounceType emailBounceType, String campaignId) {

		this.email = email;
		this.emailSubject = emailSubject;
		this.campaignId = campaignId;
		this.emailBounceType = emailBounceType;

	}

	@Override
	public void run() {
		EmailWebhookUtil.setContactEmailBounceStatus(email, emailSubject,
				emailBounceType, campaignId);

	}

}
