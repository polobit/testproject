package com.thirdparty.mailgun;

import java.io.InputStream;

import javax.ws.rs.core.MediaType;

import com.agilecrm.file.readers.IFileInputStream;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.multipart.BodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;
import com.sun.jersey.multipart.file.StreamDataBodyPart;

/**
 * <code>MailgunnSendDeferredTask</code> sends emails included with attachments
 * to Mailgun server. It uses streams for writing/reading data, it sends data in
 * Multipart encoded format.
 * 
 * @author Prashannjeet
 * 
 */

public class MailgunSendDeferredTask implements DeferredTask {
	/**
      * 
      */
	private static final long serialVersionUID = -4648054298508104500L;
	private IFileInputStream inputStream = null;
	public String fromEmail = null;
	public String fromName = null;
	public String to = null;
	public String cc = null;
	public String bcc = null;
	public String subject = null;
	public String replyTo = null;
	public String html = null;
	public String text = null;
	public String metadata = null;
	public String apiKey = null;
	public String domainName = null;

	public MailgunSendDeferredTask(String apiKey, String domainName,
			String fromEmail, String fromName, String to, String cc,
			String bcc, String subject, String replyTo, String html,
			String text, String metadata, IFileInputStream inputStream) {
		this.inputStream = inputStream;
		this.fromEmail = fromEmail;
		this.fromName = fromName;
		this.to = to;
		this.cc = cc;
		this.bcc = bcc;
		this.subject = subject;
		this.replyTo = replyTo;
		this.html = html;
		this.text = text;
		this.metadata = metadata;
		this.apiKey = apiKey;
		this.domainName = domainName;
	}

	@Override
	public void run() {
		int maxTries = 3;
		for (int count = 0; count < maxTries; count++) {
			try {
				System.out.println("Calling sendMail2Mailgun method...");
				sendMail2Mailgun();
				break;
			} catch (Exception e) {
				System.out
						.println("Error occured while sending email with attachment "
								+ e.getMessage());
			}
		}
	}

	/**
	 * Reads the input from url and converts it into Multipart format then sends
	 * it to Mailgun server
	 */
	private void sendMail2Mailgun() throws Exception {
		InputStream is = null;
		try {
			is = inputStream.getInputStream();
			String fileNameWithExtension = inputStream.getFileName();

			StreamDataBodyPart streamDataBodyPart = new StreamDataBodyPart(
					"attachment", is, fileNameWithExtension);
			streamDataBodyPart
					.setMediaType(MediaType.APPLICATION_OCTET_STREAM_TYPE);

			BodyPart bodyPart = (BodyPart) streamDataBodyPart;
			FormDataMultiPart form = MailgunNew.getMailgunMessage(fromEmail,
					fromName, to, cc, bcc, subject, replyTo, html, text,
					metadata);

			form.bodyPart(bodyPart);

			ClientResponse cr = MailgunNew.sendMailWithAttachment(form, apiKey,
					domainName);
			System.out.println("Mailgun Response : " + cr.toString());

		} catch (Exception e) {
			System.out.print(e);
			throw e;
		} finally {
			try {
				inputStream.closeResources();
				if (is != null)
					is.close();
			} catch (Exception e) {
				System.out.println(e.getMessage());
			}
		}
	}
}