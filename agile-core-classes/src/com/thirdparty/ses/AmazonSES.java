package com.thirdparty.ses;

import java.net.URL;

import org.apache.commons.lang.StringUtils;
import org.apache.http.params.HttpConnectionParams;

import com.agilecrm.util.EmailUtil;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClient;
import com.amazonaws.services.simpleemail.model.Body;
import com.amazonaws.services.simpleemail.model.Content;
import com.amazonaws.services.simpleemail.model.Destination;
import com.amazonaws.services.simpleemail.model.Message;
import com.amazonaws.services.simpleemail.model.SendEmailRequest;

/**
 * <code>AmazonSES</code> is the base class for AmazonSES gateway to send agile emails through Amazon SES.
 * 
 * For more information, see http://docs.aws.amazon.com/AWSSdkDocsJava/latest/DeveloperGuide/credentials.html
 * 
 * For a complete list, see http://docs.aws.amazon.com/ses/latest/DeveloperGuide/regions.html
 * 
 * @author naresh
 *
 */
public class AmazonSES 
{
	private AmazonSimpleEmailServiceClient client = null;

	private AmazonSES(String accessKey,String secretKey, String region) throws IllegalArgumentException {
		
		// If any of the parameters is null or blank throws exception
		if(StringUtils.isBlank(accessKey) || StringUtils.isBlank(secretKey) || StringUtils.isBlank(region))
			throw new IllegalArgumentException("Authorization parameters access key, secret key and region can neither be 'null' nor 'blank space' is accepted");
		
		BasicAWSCredentials bws = new BasicAWSCredentials(accessKey,
							secretKey);

		client = new AmazonSimpleEmailServiceClient(bws);
		
		Region REGION = Region.getRegion(Regions.fromName(region));
		client.setRegion(REGION);
	}

	public static AmazonSES getInstance(String accessKey, String secretKey,
			String region) throws Exception {
		return new AmazonSES(accessKey, secretKey, region);
	}

	public void sendEmail(String fromEmail, String fromName, String to,
			String cc, String bcc, String subject, String replyTo, String html,
			String text) {
		
		// Construct an object to contain the recipient address.
		Destination destination = new Destination();

		// To
		if (StringUtils.isNotBlank(to))
			destination.withToAddresses(EmailUtil.getStringTokenSet(to, ","));

		// CC
		if (StringUtils.isNotBlank(cc))
			destination.withCcAddresses(EmailUtil.getStringTokenSet(cc, ","));

		// BCC
		if (StringUtils.isNotBlank(bcc))
			destination.withBccAddresses(EmailUtil.getStringTokenSet(bcc, ","));

		// Create the subject and body of the message.
		Content subjectContent = new Content().withData(subject);

		Body body = new Body();

		// Text
		if (StringUtils.isNotBlank(text)) {
			Content textBody = new Content().withData(text);
			textBody.setCharset("UTF-8");
			body.withText(textBody);
		}

		// HTML
		if (StringUtils.isNotBlank(html)) {
			Content htmlBody = new Content().withData(html);
			htmlBody.setCharset("UTF-8");
			body.withHtml(htmlBody);
		}

		// Create a message with the specified subject and body.
		Message message = new Message().withSubject(subjectContent).withBody(
				body);

		// Assemble the email.
		SendEmailRequest request = new SendEmailRequest()
				.withSource(fromName + " <" + fromEmail + ">")
				.withDestination(destination).withMessage(message);

		// Reply To
		if (StringUtils.isNotBlank(replyTo))
			request.withReplyToAddresses(replyTo);

		try {
			long startTime = System.currentTimeMillis();

			// Send the email.
			client.sendEmail(request);

			System.out.println("Time taken to send email..."
					+ (System.currentTimeMillis() - startTime));
			
		} catch (Exception ex) {
			System.out.println("The email was not sent.");
			System.out.println("Error message: " + ex.getMessage());
		}
	}
}