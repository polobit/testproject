package com.thirdparty.mailgun;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.List;

import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.AgileQueues;
import com.agilecrm.document.Document;
import com.agilecrm.document.util.DocumentUtil;
import com.agilecrm.file.readers.BlobFileInputStream;
import com.agilecrm.file.readers.DocumentFileInputStream;
import com.agilecrm.file.readers.IFileInputStream;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;
import com.sun.jersey.api.client.filter.HTTPBasicAuthFilter;
import com.sun.jersey.multipart.BodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;
import com.sun.jersey.multipart.file.StreamDataBodyPart;
import com.sun.jersey.multipart.impl.MultiPartWriter;

/**
 * <code>MailgunNew</code> is the base class that sends email using mailgun api
 * 
 * @author Prashannjeet
 * 
 */
public class MailgunNew {
	/**
	 * Mailgun API key
	 */
	public static final String MAILGUN_API_KEY = "api";

	/**
	 * Mailgun API url
	 */
	public static final String MAILGUN_API_POST_URL = "https://api.mailgun.net/v3/";

	/**
	 * Post param to
	 */
	public static final String MAILGUN_API_PARAM_TO = "to";

	/**
	 * Post param cc
	 */
	public static final String MAILGUN_API_PARAM_CC = "cc";

	/**
	 * Post param bcc
	 */
	public static final String MAILGUN_API_PARAM_BCC = "bcc";

	/**
	 * Post param replyto
	 */
	public static final String MAILGUN_API_PARAM_REPLY_TO = "h:Reply-To";

	/**
	 * Post param from email
	 */
	public static final String MAILGUN_API_PARAM_FROM = "from";

	/**
	 * Post param subject
	 */
	public static final String MAILGUN_API_PARAM_SUBJECT = "subject";

	/**
	 * Post param text body
	 */
	public static final String MAILGUN_API_PARAM_TEXT_BODY = "text";

	/**
	 * Post param html body
	 */
	public static final String MAILGUN_API_PARAM_HTML_BODY = "html";

	/**
	 * Post param attachment
	 */
	public static final String MAILGUN_API_PARAM_METADATA = "v:metadata";

	/**
	 * Post param attachment
	 */
	public static final String MAILGUN_API_PARAM_ATTACHMENT = "attachment";

	/**
	 * Post params for recipient-variables
	 */
	public static final String MAILGUN_API_PARAM_RECIPIENT_VARIABLES = "recipient-variables";

	/**
	 * Sends email by adding required fields with attachment to Send Grid Api.
	 * 
	 * @param mailgunApiKey
	 *            - Mailgun Api key for authentication
	 * @param mailgunDomainName
	 *            - Mailgun user Domain name
	 * @param fromEmail
	 *            - from email-id
	 * @param fromName
	 *            - from name.
	 * @param to
	 *            - to email-id.
	 * @param subject
	 *            - email subject.
	 * @param replyTo
	 *            - email-id to reply
	 * @param html
	 *            - html body.
	 * @param text
	 *            - text body.
	 * @param attachment
	 *            - name of file
	 * @return
	 */

	public static String sendMail(String mailgunApikey,
			String mailgunDomainName, String fromEmail, String fromName,
			String to, String cc, String bcc, String subject, String replyTo,
			String html, String text, String metadata, List<Long> documentIds,
			String[] mailAttach, String... attachments) {
		// Return null if Mailgun API key or domain name is null/empty
		if (StringUtils.isBlank(mailgunApikey)
				|| StringUtils.isBlank(mailgunDomainName)) {
			System.out
					.println("Mailgun Domain name or API Key should not be null or empty");
			return null;
		}

		try {
			// checking attatchment type
			if (documentIds != null && documentIds.size() > 0) {
				sendDocumentAsMailAttachment(fromEmail, fromName, to, cc, bcc,
						subject, replyTo, html, text, metadata,
						documentIds.get(0), mailgunApikey, mailgunDomainName);
			} else if(mailAttach != null && mailAttach.length > 0 
					&& StringUtils.isNotBlank(mailAttach[0])) {
				sendUploadedMailAttachment(fromEmail, fromName, to, cc, bcc, subject, replyTo, html,
						text, metadata, mailAttach[0], mailAttach[1], mailgunApikey,
						mailgunDomainName);
			} else {
				FormDataMultiPart mailgunMessage = getMailgunMessage(fromEmail,
						fromName, to, cc, bcc, subject, replyTo, html, text,
						metadata);

				// Getting attachment as a BodyPart
				BodyPart attachmentBodyPart = getMailgunAttachment(attachments);

				// If attachment part is not null then attach attachment..
				if (attachmentBodyPart != null)
					mailgunMessage.bodyPart(attachmentBodyPart);

				String response = sendMailWithAttachment(mailgunMessage,
						mailgunApikey, mailgunDomainName).toString();

				return response;
			}
			return null;
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println("Exception occured in sendMail of Mandrill "
					+ e.getMessage());
			return e.getMessage();
		}
	}

	/**
	 * This method will send email without email gateway. It will take global
	 * user id and password
	 * 
	 * @param fromEmail
	 * @param fromName
	 * @param to
	 * @param cc
	 * @param bcc
	 * @param subject
	 * @param replyTo
	 * @param html
	 * @param text
	 * @param metadata
	 * @param documentIds
	 * @param blobKeys
	 * @param attachments
	 * @return response
	 */
	public static String sendMail(String fromEmail, String fromName, String to,
			String cc, String bcc, String subject, String replyTo, String html,
			String text, String metadata, List<Long> documentIds,
			String[] mailAttach, String... attachments) {
		return sendMail(null, null, fromEmail, fromName, to, cc, bcc, subject,
				replyTo, html, text, metadata, documentIds, mailAttach, attachments);
	}

	/**
	 * This method will send mail with attachment
	 * 
	 * @param form
	 * @param apiKey
	 * @param domainName
	 * @return
	 */

	public static ClientResponse sendMailWithAttachment(FormDataMultiPart form,
			String apiKey, String domainName) {

		try {
			System.out
					.println("Calling sendMailWithAttachment() through Mailgun");

			ClientConfig clientConfig = new DefaultClientConfig();

			clientConfig.getClasses().add(MultiPartWriter.class);

			Client client = Client.create(clientConfig);

			// add Authentication of Mailgun Account
			client.addFilter(new HTTPBasicAuthFilter(MAILGUN_API_KEY, apiKey));

			WebResource webResource = client.resource(MAILGUN_API_POST_URL
					+ domainName + "/messages");

			return webResource.type(MediaType.MULTIPART_FORM_DATA_TYPE).post(
					ClientResponse.class, form);
		} catch (Exception e) {
			e.printStackTrace();
			System.err
					.println("Exception occured in Mailgun while sending mail...");
		}
		return null;

	}

	/**
	 * This method is used for converting attachment in Mailgun Format
	 * 
	 * @param stringURl
	 * @return BodyPart
	 */
	private static BodyPart getMailgunAttachment(String... attachments) {
		try {
			if (attachments.length == 3) {
				// Attachment File name
				String fileName = attachments[1];

				// Attachment File Content
				String fileContent = attachments[2];

				InputStream is = new ByteArrayInputStream(
						fileContent.getBytes());

				StreamDataBodyPart streamDataBodyPart = new StreamDataBodyPart(
						"attachment", is, fileName);
				streamDataBodyPart
						.setMediaType(MediaType.APPLICATION_OCTET_STREAM_TYPE);

				BodyPart bodyPart = (BodyPart) streamDataBodyPart;
				return bodyPart;
			}
			return null;
		} catch (Exception e) {
			e.printStackTrace();
			System.err
					.println("Exception occured while getting attachment from url");
			return null;
		}
	}

	/**
	 * This method will create email body for Mailgun. and it will return object
	 * of FormDataMultiPart class
	 * 
	 * @param fromEmail
	 * @param fromName
	 * @param to
	 * @param cc
	 * @param bcc
	 * @param subject
	 * @param replyTo
	 * @param html
	 * @param text
	 * @param metadata
	 * @return FormDataMultiPart
	 */
	public static FormDataMultiPart getMailgunMessage(String fromEmail,
			String fromName, String to, String cc, String bcc, String subject,
			String replyTo, String html, String text, String metadata) {

		FormDataMultiPart form = new FormDataMultiPart();

		if (!StringUtils.isBlank(fromName))
			fromEmail = fromName + " <" + fromEmail + ">";

		form.field(MAILGUN_API_PARAM_FROM, fromEmail);

		form.field(MAILGUN_API_PARAM_TO, to);

		if (!StringUtils.isEmpty(bcc))
			form.field(MAILGUN_API_PARAM_BCC, bcc);

		if (!StringUtils.isEmpty(cc))
			form.field(MAILGUN_API_PARAM_CC, cc);

		form.field(MAILGUN_API_PARAM_SUBJECT, subject);

		form.field(MAILGUN_API_PARAM_TEXT_BODY, text + " ");

		// If reply to email does not exist
		if (StringUtils.isEmpty(replyTo))
			replyTo = fromEmail;

		form.field(MAILGUN_API_PARAM_REPLY_TO, replyTo);

		if (!StringUtils.isEmpty(html))
			form.field(MAILGUN_API_PARAM_HTML_BODY, html);

		if (!StringUtils.isEmpty(metadata))
			form.field(MAILGUN_API_PARAM_METADATA, metadata);
		return form;
	}

	/**
	 * This method will send blob type attachment via Mailgun.
	 * 
	 * @param fromEmail
	 * @param fromName
	 * @param to
	 * @param cc
	 * @param bcc
	 * @param subject
	 * @param replyTo
	 * @param html
	 * @param text
	 * @param metadata
	 * @param blobKey
	 * @param apiKey
	 * @param domainName
	 */
	/*private static void sendBlobAsMailAttachment(String fromEmail,
			String fromName, String to, String cc, String bcc, String subject,
			String replyTo, String html, String text, String metadata,
			BlobKey blobKey, String apiKey, String domainName) {
		// Task for sending mail and blob as mail attachment
		IFileInputStream blobStream = new BlobFileInputStream(blobKey);

		MailgunSendDeferredTask task = new MailgunSendDeferredTask(apiKey,
				domainName, fromEmail, fromName, to, cc, bcc, subject, replyTo,
				html, text, metadata, blobStream);
		// Add to queue
		Queue queue = QueueFactory.getQueue(AgileQueues.EMAIL_ATTACHEMNT_QUEUE);
		queue.add(TaskOptions.Builder.withPayload(task));
		System.out.println("Mailgun email attachment task added to queue ");
	}*/

	/**
	 * This method is used for send a mail with Document type attachment via
	 * Mailgun.
	 * 
	 * @param fromEmail
	 * @param fromName
	 * @param to
	 * @param cc
	 * @param bcc
	 * @param subject
	 * @param replyTo
	 * @param html
	 * @param text
	 * @param metadata
	 * @param documentId
	 */
	private static void sendDocumentAsMailAttachment(String fromEmail,
			String fromName, String to, String cc, String bcc, String subject,
			String replyTo, String html, String text, String metadata,
			long documentId, String apiKey, String domainName) {
		// Task for sending mail and document as mail attachment
		Document document = DocumentUtil.getDocument(documentId);
		String fileName = document.extension;
		String Url = document.url;

		if (StringUtils.isEmpty(document.url)
				|| StringUtils.isEmpty(document.extension))
			return;

		IFileInputStream documentStream = new DocumentFileInputStream(fileName,
				Url);

		MailgunSendDeferredTask task = new MailgunSendDeferredTask(apiKey,
				domainName, fromEmail, fromName, to, cc, bcc, subject, replyTo,
				html, text, metadata, documentStream);
		// Add to queue
		Queue queue = QueueFactory.getQueue(AgileQueues.EMAIL_ATTACHEMNT_QUEUE);
		queue.add(TaskOptions.Builder.withPayload(task));

		System.out.println(" Mailgun email attachment task added to queue");

	}
	
	/**
	 * Send mail using attachment from S3 URL
	 */
	private static void sendUploadedMailAttachment(String fromEmail, String fromName, String to,
			String cc, String bcc, String subject, String replyTo, String html, String text,
			String metadata, String fileName, String Url, String apiKey, String domainName) {
		
		IFileInputStream documentStream = new DocumentFileInputStream(fileName, Url);

		MailgunSendDeferredTask task = new MailgunSendDeferredTask(apiKey, domainName, fromEmail,
				fromName, to, cc, bcc, subject, replyTo, html, text, metadata, documentStream);
		// Add to queue
		Queue queue = QueueFactory.getQueue(AgileQueues.EMAIL_ATTACHEMNT_QUEUE);
		queue.add(TaskOptions.Builder.withPayload(task));
		System.out.println("Mailgun email attachment task added to queue ");
	}

}
