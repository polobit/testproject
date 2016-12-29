package com.thirdparty.mailgun.util;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.simple.parser.ParseException;

import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.mandrill.util.deferred.MailDeferredTask;
import com.agilecrm.sendgrid.util.SendGridUtil;
import com.agilecrm.util.EmailUtil;
import com.google.appengine.api.NamespaceManager;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;
import com.sun.jersey.core.util.MultivaluedMapImpl;
import com.thirdparty.mailgun.MailgunNew;

import java.util.List;

import javax.ws.rs.core.MediaType;

/**
 * <code>MailgunUtil</code> is the utility class for fetching tasks from pull
 * queue and process them. It constructs mail json to send bulk emails with
 * Mailgun
 * 
 * @author Prashannjeet
 * 
 */
public class MailgunUtil {

	/**
	 * This flag variable is use for check html content exist or not. If HTML
	 * content exist then only we are going to append html body.
	 */
	private static boolean flag = false;

	/**
	 * This sub account is represent domain name key
	 */
	private static final String SUBACCOUNT = "subaccount";

	/**
	 * This toAddress variable store the all to email address for bulk emails
	 */
	private static String toAddress = "";

	/**
	 * sendMailgunMails method is used for sending bulk emails and campaign
	 * emails
	 * 
	 * @param MailDeferredTask
	 *            list
	 * @param emailSender
	 */

	public static void sendMailgunMails(List<MailDeferredTask> tasks,
			EmailSender emailSender) {

		if (emailSender.emailGateway == null)
			return;
		try {
			System.out
					.println("calling sendMilgunMails method for sending Bulk emails via mailgun..");
			Client client = new Client();
			client.addFilter(new HTTPBasicAuthFilter(
					MailgunNew.MAILGUN_API_KEY,
					emailSender.emailGateway.api_key));

			WebResource webResource = client
					.resource(MailgunNew.MAILGUN_API_POST_URL
							+ emailSender.emailGateway.api_user + "/messages");

			MultivaluedMapImpl formData = new MultivaluedMapImpl();

			// Initialize toaddress valriable as a empty
			toAddress = "";
			flag = false;

			JSONObject mailgunMessageJSON = getMailgunMailJson(tasks,
					emailSender);

			if (mailgunMessageJSON == null) {
				return;
			}

			formData.add(MailgunNew.MAILGUN_API_PARAM_FROM,
					getMailgunFromAddress(tasks));

			formData.add(MailgunNew.MAILGUN_API_PARAM_TO, toAddress);

			formData.add(MailgunNew.MAILGUN_API_PARAM_SUBJECT,
					"%recipient.subject%");

			formData.add(MailgunNew.MAILGUN_API_PARAM_TEXT_BODY,
					"%recipient.text%");

			if (flag) {
				formData.add(MailgunNew.MAILGUN_API_PARAM_HTML_BODY,
						"%recipient.html%");
				flag = false;
			}

			String replyTo = getMailgunReplyToAddress(tasks);
			if (!StringUtils.isEmpty(replyTo))
				formData.add(MailgunNew.MAILGUN_API_PARAM_REPLY_TO, replyTo);

			JSONObject metadata = getMetadata(tasks);
			if (metadata != null)
				formData.add(MailgunNew.MAILGUN_API_PARAM_METADATA,
						metadata.toString());

			formData.add(MailgunNew.MAILGUN_API_PARAM_RECIPIENT_VARIABLES,
					mailgunMessageJSON.toString());

			ClientResponse response = webResource.type(
					MediaType.APPLICATION_FORM_URLENCODED_TYPE).post(
					ClientResponse.class, formData);

			System.out.println("Response is ; " + response.toString());
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("Exception occured while sending bulk emails");
		}
	}

	/**
	 * 
	 * @param MailDeferredTask
	 * @return From email address for bulk email
	 */
	private static String getMailgunFromAddress(List<MailDeferredTask> task) {
		if (task.isEmpty())
			return null;

		MailDeferredTask message = task.get(0);
		if (StringUtils.isNotEmpty(message.fromName))
			message.fromEmail = message.fromName + " <" + message.fromEmail
					+ ">";
		String fromAddress = message.fromEmail;
		return fromAddress;
	}

	/**
	 * 
	 * @param MailDeferredTask
	 * @return ReplyTo address for bulk email
	 */
	private static String getMailgunReplyToAddress(List<MailDeferredTask> task) {
		if (task.isEmpty())
			return null;

		MailDeferredTask message = task.get(0);
		String fromAddress = message.replyTo;
		return fromAddress;
	}

	/**
	 * This method will return Mailgun JSON which contains subject, text and
	 * html json for bulk emails
	 * 
	 * @param list
	 *            of MailDeferredTask
	 * @return json object of message
	 */

	private static JSONObject getMailgunMailJson(List<MailDeferredTask> task,
			EmailSender emailSender) {
		if (task.isEmpty())
			return null;
		// Mailgun mail json
		JSONObject mailgunJSON = new JSONObject();
		
		boolean emailCategory = EmailGatewayUtil.isEmailCategoryTransactional(emailSender);

		// add mail data from MailDeferredTask to json
		for (MailDeferredTask mailDeferredTask : task) {
			if (!StringUtils.isBlank(mailDeferredTask.campaignId)
					&& !StringUtils.isBlank(mailDeferredTask.subscriberId)) {

				System.out.println("Namespace mail deferred task : "
						+ mailDeferredTask.domain);

				if (!StringUtils.isBlank(mailDeferredTask.text)) {
					// Appends Agile label
					mailDeferredTask.text = StringUtils.replace(
							mailDeferredTask.text, EmailUtil
									.getPoweredByAgileLink("campaign",
											"Powered by",  emailCategory), "Sent using Agile");
					mailDeferredTask.text = EmailUtil.appendAgileToText(
							mailDeferredTask.text, "Sent using",
							emailSender.isEmailWhiteLabelEnabled());
				}

				// If no powered by merge field, append Agile label to
				// html
				if (!StringUtils.isBlank(mailDeferredTask.html)
						&& !StringUtils.contains(mailDeferredTask.html,
								EmailUtil.getPoweredByAgileLink("campaign",
										"Powered by",  emailCategory)))
					mailDeferredTask.html = EmailUtil.appendAgileToHTML(
							mailDeferredTask.html, "campaign", "Powered by",
							emailSender.isEmailWhiteLabelEnabled(),  emailCategory);

			}

			JSONObject msgJSON = new JSONObject();
			try {
				// If mail contents cc and bcc then send mail individual

				if (!StringUtils.isBlank(mailDeferredTask.cc)
						|| !StringUtils.isBlank(mailDeferredTask.bcc)
						|| StringUtils.contains(toAddress, mailDeferredTask.to)
						|| mailDeferredTask.to.contains(",")) {
					sendWithoutMerging(mailDeferredTask, emailSender);
					continue;
				}

				if (StringUtils.isEmpty(toAddress))
					toAddress = mailDeferredTask.to;
				else
					toAddress += ", " + mailDeferredTask.to;

				// create Mailgun json where email id is key and html, subject
				// and text is data

				msgJSON.put(MailgunNew.MAILGUN_API_PARAM_SUBJECT,
						mailDeferredTask.subject);
				msgJSON.put(MailgunNew.MAILGUN_API_PARAM_TEXT_BODY,
						mailDeferredTask.text);

				if (!StringUtils.isBlank(mailDeferredTask.html)) {
					msgJSON.put(MailgunNew.MAILGUN_API_PARAM_HTML_BODY,
							mailDeferredTask.html);
					flag = true;
				}

				mailgunJSON.put(getToEmail(mailDeferredTask.to), msgJSON);
			} catch (JSONException e) {

				e.printStackTrace();
				System.err
						.print("Error occured in getting Mailgun Message json");
			}

		}

		return mailgunJSON;
	}

	/**
	 * Returns to email in the form of "prashannjeet@agilecrm.com" if fromName
	 * is not empty, otherwise simply returns email.
	 * 
	 * @param fromEmail
	 *            with name - from email.
	 * @return String
	 */
	private static String getToEmail(String toEmail) {
		// if fromName is empty, simply return email
		if (StringUtils.isEmpty(toEmail) || !toEmail.contains("<"))
			return toEmail;

		String from = StringUtils.substringBetween(toEmail, "<", ">");

		return from;
	}

	/**
	 * @throws ParseException
	 *             Returns to metadata json object with campaign id and sub
	 *             account name.
	 * 
	 * @param MailDeferredTask
	 *            -
	 * @return JSON object of metadata
	 * @throws
	 */
	private static JSONObject getMetadata(List<MailDeferredTask> task)
			throws ParseException {
		for (MailDeferredTask mailDeferredTask : task) {
			try {
				if (mailDeferredTask.metadata == null)
					return null;

				JSONObject metadata = new JSONObject(mailDeferredTask.metadata);

				String subAccount = NamespaceManager.get();
				metadata.put(SUBACCOUNT, subAccount);
				return metadata;
			} catch (JSONException e) {
				e.printStackTrace();
				System.err
						.print("Error occured in getting Mailgun Metadata json");
				return null;
			}
		}
		return null;
	}

	/**
	 * This method is used for checking Mailgun account
	 * 
	 * @param apiKey
	 * @param domainName
	 * @return
	 */
	public static String checkMailgunAuthorization(String apiKey,
			String domainName) {
		Client client = new Client();
		client.addFilter(new HTTPBasicAuthFilter(MailgunNew.MAILGUN_API_KEY,
				apiKey));

		WebResource webResource = client.resource("https://api.mailgun.net/v3/"
				+ domainName + "/log");

		return webResource.get(ClientResponse.class).toString();

	}

	/**
	 * This method is used for sending a mail one by one if mail contains cc and
	 * bcc
	 * 
	 * @param mailDeferredTask
	 * @param emailSender
	 */
	public static void sendWithoutMerging(MailDeferredTask mailDeferredTask,
			EmailSender emailSender) {
		JSONObject metadata = null;
		try {
			if (mailDeferredTask.metadata != null) {
				metadata = new JSONObject(mailDeferredTask.metadata);

				String subAccount = NamespaceManager.get();
				metadata.put(SUBACCOUNT, subAccount);
				mailDeferredTask.metadata = metadata.toString();
			}
		} catch (JSONException e) {
			e.printStackTrace();
			System.err.print("Error occured in getting Mailgun Metadata json");
		}

		MailgunNew.sendMail(emailSender.emailGateway.api_key,
				emailSender.emailGateway.api_user, mailDeferredTask.fromEmail,
				mailDeferredTask.fromName, mailDeferredTask.to,
				mailDeferredTask.cc, mailDeferredTask.bcc,
				mailDeferredTask.subject, mailDeferredTask.replyTo,
				mailDeferredTask.html, mailDeferredTask.text,
				mailDeferredTask.metadata, null, null);
	}

}
