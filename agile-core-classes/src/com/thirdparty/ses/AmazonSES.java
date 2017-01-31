package com.thirdparty.ses;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.Message.RecipientType;
import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.apache.commons.lang.StringUtils;
import com.agilecrm.util.EmailUtil;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClient;
import com.amazonaws.services.simpleemail.model.Body;
import com.amazonaws.services.simpleemail.model.Content;
import com.amazonaws.services.simpleemail.model.Destination;
import com.amazonaws.services.simpleemail.model.Message;
import com.amazonaws.services.simpleemail.model.RawMessage;
import com.amazonaws.services.simpleemail.model.SendEmailRequest;
import com.amazonaws.services.simpleemail.model.SendRawEmailRequest;

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
	
	public final static String SUBACCOUNT_HEADER_NAME = "Agile-Domain";
	public final static String CAMPAIGN_ID_HEADER_NAME = "Agile-Campaign-Id";

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
	
	/**
	 * This method is used to send email through AmazonSES with custom headers
	 * or metadata
	 * @param fromEmail
	 * @param fromName
	 * @param to
	 * @param cc
	 * @param bcc
	 * @param subject
	 * @param replyTo
	 * @param html
	 * @param text
	 * @throws MessagingException 
	 */
	public void sendRawEmail(String fromEmail, String fromName, String to,
			String cc, String bcc, String subject, String replyTo, String html,
			String text, String campaignId, String domainName) throws MessagingException {
		
		 Session session = Session.getInstance(new Properties(), null);
         MimeMessage mimeMessage = new MimeMessage(session);
		// To
		if (StringUtils.isNotBlank(to))
			mimeMessage.setRecipients(RecipientType.TO, to);

		// CC
		if (StringUtils.isNotBlank(cc))
			mimeMessage.setRecipients(RecipientType.CC, cc);

		// BCC
		if (StringUtils.isNotBlank(bcc))
			mimeMessage.setRecipients(RecipientType.BCC, bcc);

		 //add subject of email         
         mimeMessage.setSubject(subject);
         
         if(fromName == null)
        	 fromName = "";
       
         //Add from address of email
	 	 mimeMessage.addFrom(new Address[]
    		 {
    		    new InternetAddress(fromName + " <" + fromEmail + ">")
    		});
		
	 	MimeMultipart mimeBodyPart = new MimeMultipart("alternative");
	 	
	  // add text part Text
	 	if (StringUtils.isNotBlank(text)) 
	 	{
	        BodyPart textPart = new MimeBodyPart();
	        
	        textPart.setContent(text, "text/plain; charset=utf-8");
	        
	        mimeBodyPart.addBodyPart(textPart);
	 	}
   
	 	if (StringUtils.isNotBlank(html))
	 	{
            BodyPart htmlPart = new MimeBodyPart();
	     
	        htmlPart.setContent(html,"text/html; charset=utf-8");
	        
	        mimeBodyPart.addBodyPart(htmlPart);
	 	}
        
	 	// Reply To
		if (StringUtils.isNotBlank(replyTo))
		{
		  mimeMessage.setReplyTo(new Address[]
		    	{
	    		    new InternetAddress(replyTo)
	    		});
		}
		
        //adding HTML or Text body part 
        mimeMessage.setContent(mimeBodyPart);
        
        
        //Add metadata
        if(StringUtils.isNotBlank(campaignId) && StringUtils.isNotBlank(domainName))
        {
	        mimeMessage.addHeader(SUBACCOUNT_HEADER_NAME, domainName);
	        
	        mimeMessage.addHeader(CAMPAIGN_ID_HEADER_NAME, campaignId);
        }
	 
        try
        {
	        // Create Raw message
	        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
	        mimeMessage.writeTo(outputStream);
	        
	        RawMessage rawMessage = new RawMessage(ByteBuffer.wrap(outputStream.toByteArray()));
	        
			// Assemble the email.
			SendRawEmailRequest request = new SendRawEmailRequest().withRawMessage(rawMessage);
			
			long startTime = System.currentTimeMillis();
	
			// Send the email.
			client.sendRawEmail(request);
	
			System.out.println("Time taken to send Bulk email..."
					+ (System.currentTimeMillis() - startTime));
			
		} catch (Exception ex) {
			System.out.println("The email was not sent.");
			System.out.println("Error message: " + ex.getMessage());
		}
	}
}