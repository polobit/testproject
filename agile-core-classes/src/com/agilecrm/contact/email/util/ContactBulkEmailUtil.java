package com.agilecrm.contact.email.util;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.util.EmailLinksConversion;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.email.MustacheUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.google.appengine.api.NamespaceManager;

public class ContactBulkEmailUtil
{

	/**
	 * Returns number of contacts without email. Sends email to each contact of
	 * the list
	 * 
	 * @param emailData
	 *            - JSON object with email fields
	 * @param contactList
	 *            - Contact list
	 * @return int
	 */
	public static int sendBulkContactEmails(JSONObject emailData, List<Contact> contactList, EmailSender emailSender)
	{
		int noEmailsCount = 0;

		try
		{
			// Fetches values from email json with form field names
			String fromEmail = emailData.getString("from_email");
			String fromName = emailData.getString("from_name");
			String subject = emailData.getString("subject");
			String body = emailData.getString("body");
			String signature = emailData.getString("signature");
			boolean trackClicks = emailData.getBoolean("track_clicks");

			if (contactList == null)
				return 0;

			String domain = NamespaceManager.get();
			int len = contactList.size();
			
			// Custom date labels to convert epoch to Date format
			List<String> dateCustomFieldLabels = AgileTaskletUtil.getDateCustomLabelsFromCache();
			String timezone = AccountPrefsUtil.getTimeZone();

			for (Contact contact : contactList)
			{

				try
				{
					if (contact == null)
						continue;

					// if contact has no email
					if (StringUtils.isBlank(contact.getContactFieldValue(Contact.EMAIL)))
					{
						noEmailsCount++;
						continue;
					}

					// Converts contact to JSON
					JSONObject subscriberJSON = (contact.type.equals(Contact.Type.COMPANY)) ? AgileTaskletUtil
							.getCompanyJSON(contact, timezone) : AgileTaskletUtil.getSubscriberJSON(contact, dateCustomFieldLabels, timezone);

					if (subscriberJSON != null)
					{
						// Compiles subject and body mustache templates
						String replacedSubject = MustacheUtil.compile(subject, subscriberJSON.getJSONObject("data"));
						String replacedBody = MustacheUtil.compile(body, subscriberJSON.getJSONObject("data"));

						long openTrackerId = System.currentTimeMillis();

						JSONObject data = subscriberJSON.getJSONObject("data");
						String toEmail = data.getString("email");

						// If no email in JSON - if email property not
						// populated
						if (StringUtils.isBlank(toEmail))
						{
							noEmailsCount++;
							continue;
						}

						// Appends name
						String email = EmailUtil.appendNameToEmail(toEmail, subscriberJSON);

						ContactEmailUtil.saveContactEmail(fromEmail, fromName, email, null, null, replacedSubject,
								replacedBody, signature, contact.id, openTrackerId, null, null, null);

						if (trackClicks)
							replacedBody = EmailLinksConversion.convertLinksUsingJSOUP(replacedBody,
									contact.id.toString(), null, false);

						// combined body and signature. Inorder to avoid link
						// tracking in signature, it is appended after
						// conversion.
						replacedBody = replacedBody.replace("</body>", "<div><br/>" + signature + "</div></body>");
						replacedBody = EmailUtil.appendTrackingImage(replacedBody, null, String.valueOf(openTrackerId));

						// Agile label to outgoing emails
						replacedBody = EmailUtil.appendAgileToHTML(replacedBody, "email", "Sent using",
								emailSender.isEmailWhiteLabelEnabled());

						emailSender.addToQueue(len >= 200 ? AgileQueues.BULK_PERSONAL_EMAIL_PULL_QUEUE
								: AgileQueues.NORMAL_PERSONAL_EMAIL_PULL_QUEUE, null, null, null, domain, fromEmail,
								fromName, email, null, null, replacedSubject, fromEmail, replacedBody, null, null,
								null, null);
						
						// Update last emailed time
						contact.setLastEmailed(System.currentTimeMillis()/1000);
						contact.update();
					}
				}
				catch (Exception e)
				{
					e.printStackTrace();
					System.err.println("Exception occured while adding task to queue..." + e.getMessage());
				}
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured in sendBulkContactEmails " + e.getMessage());

		}

		return noEmailsCount;
	}
}