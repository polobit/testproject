package com.thirdparty.email.webhook.util;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.bounce.EmailBounceStatus;
import com.agilecrm.contact.email.bounce.EmailBounceStatus.EmailBounceType;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.EmailBounceTriggerUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;

public class EmailWebhookUtil
{

	/**
	 * Set bounce status to contact having obtained email
	 * 
	 * @param email
	 *            - bounced email-id
	 * @param emailBounceType
	 *            - Hard Bounce or SoftBounce
	 */
	public static void setContactEmailBounceStatus(String email, String emailSubject, EmailBounceType emailBounceType,
			String campaignId)
	{

		try
		{
			boolean isNew = true;

			Contact contact = ContactUtil.searchContactByEmail(email);

			if (contact == null)
			{
				System.err.println("Contact didn't exist having email " + email);
				return;
			}

			// Set log
			setCampaignLog(campaignId, contact.id.toString(), email, emailSubject, emailBounceType);

			List<EmailBounceStatus> emailBounceList = contact.emailBounceStatus;

			for (EmailBounceStatus emailBounceStatus : emailBounceList)
			{
				if (email.equals(emailBounceStatus.email))
				{
					emailBounceStatus.emailBounceType = emailBounceType;
					emailBounceStatus.time = System.currentTimeMillis() / 1000;

					if (campaignId != null)
						emailBounceStatus.campaign_id = campaignId;

					isNew = false;
					break;
				}
			}

			if (isNew)
			{
				EmailBounceStatus emailBounceStatus = new EmailBounceStatus(email, emailBounceType);

				if (campaignId != null)
					emailBounceStatus.campaign_id = campaignId;

				contact.emailBounceStatus.add(emailBounceStatus);
			}

			contact.save();

			// Execute trigger
			EmailWebhookUtil.executeTriggerForBounce(contact, emailBounceType);
		}
		catch (Exception e)
		{
			System.err.println("Exception occured while saving contact..." + e.getMessage());
			e.printStackTrace();
		}
	}

	/**
	 * Sets bounce log
	 * 
	 * @param campaignId
	 *            - campaign-id
	 * @param subscriberId
	 *            - contact id
	 * @param email
	 *            - contact email bounced
	 * @param emailSubject
	 *            - email subject
	 * @param emailBounceType
	 *            - Hard or Soft
	 */
	public static void setCampaignLog(String campaignId, String subscriberId, String email, String emailSubject,
			EmailBounceType emailBounceType)
	{

		// if campaign-id empty
		if (StringUtils.isBlank(campaignId))
			return;

		try
		{
			String logType = LogType.EMAIL_HARD_BOUNCED.toString();
			String message = "There was a hard bounce on email \'" + email + "\' <br><br> Email subject: "
					+ emailSubject;

			if (emailBounceType.equals(EmailBounceType.SOFT_BOUNCE))
			{
				message = "There was a soft bounce on email \'" + email + "\' <br><br> Email subject: " + emailSubject;
				logType = LogType.EMAIL_SOFT_BOUNCED.toString();
			}

			if (emailBounceType.equals(EmailBounceType.SPAM))
			{
				message = "There was a spam complaint from email \'" + email + "\' <br><br> Email subject: "
						+ emailSubject;
				logType = LogType.EMAIL_SPAM.toString();
			}

			LogUtil.addLogToSQL(campaignId, subscriberId, message, logType);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured while setting bounce log..." + e.getMessage());
		}
	}

	/**
	 * Executes trigger for email bounce
	 * 
	 * @param contact
	 *            - Bounced email contact
	 * @param emailBounceType
	 *            - Soft or Hard bounce
	 */
	public static void executeTriggerForBounce(Contact contact, EmailBounceType emailBounceType)
	{
		// Trigger for Soft Bounce
		if (emailBounceType.equals(EmailBounceType.SOFT_BOUNCE))
			EmailBounceTriggerUtil.executeTriggerForBounce(contact, Trigger.Type.SOFT_BOUNCE);

		// Trigger for Hard Bounce
		if (emailBounceType.equals(EmailBounceType.HARD_BOUNCE))
			EmailBounceTriggerUtil.executeTriggerForBounce(contact, Trigger.Type.HARD_BOUNCE);

		// Trigger for SPAM
		if (emailBounceType.equals(EmailBounceType.SPAM))
			EmailBounceTriggerUtil.executeTriggerForBounce(contact, Trigger.Type.SPAM_REPORT);

	}

}
