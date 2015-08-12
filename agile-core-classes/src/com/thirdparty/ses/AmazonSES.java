package com.thirdparty.ses;


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
import com.amazonaws.services.simpleemail.model.SendEmailRequest;


public class AmazonSES
{
	String accessKey = null; 
	String secretKey = null;
	String region = null;
	
	private AmazonSES(String accessKey, String secretKey, String region)
	{
		this.accessKey = accessKey;
		this.secretKey = secretKey;
		this.region = region;
	}
	
	public static AmazonSES getInstance(String accessKey, String secretKey, String region)
	{
		return new AmazonSES(accessKey, secretKey, region);
	}
	
	public static void sendEmail(String accessKey, String secretKey, String region, String fromEmail, String fromName,
		    String to, String cc, String bcc, String subject, String replyTo, String html, String text)
	{
		AmazonSES ses = AmazonSES.getInstance(accessKey, secretKey, region);
		ses.sendEmail(fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text);
	}
	
	public void sendEmail(String fromEmail, String fromName,
		    String to, String cc, String bcc, String subject, String replyTo, String html, String text)
	{
		// Construct an object to contain the recipient address.
        Destination destination = new Destination();
        
        // To
        if(StringUtils.isNotBlank(to))
        	destination.withToAddresses(EmailUtil.getStringTokenSet(to, ","));
        
        // CC
        if(StringUtils.isNotBlank(cc))
        	destination.withCcAddresses(EmailUtil.getStringTokenSet(cc, ","));
        
        //BCC
        if(StringUtils.isNotBlank(bcc))
        	destination.withBccAddresses(EmailUtil.getStringTokenSet(bcc, ","));
        
        
        // Create the subject and body of the message.
        Content subjectContent = new Content().withData(subject);
        
        Body body = new Body();
        
        // Text
        if(StringUtils.isNotBlank(text))
        {
        	Content textBody = new Content().withData(text);
        	textBody.setCharset("UTF-8");
        	body.withText(textBody);
        }
        
        // HTML
        if(StringUtils.isNotBlank(html))
        {
        	Content htmlBody = new Content().withData(html);
        	htmlBody.setCharset("UTF-8");
        	body.withHtml(htmlBody);
        }
        
        // Create a message with the specified subject and body.
        Message message = new Message().withSubject(subjectContent).withBody(body);

        // Assemble the email.
        SendEmailRequest request = new SendEmailRequest().withSource(fromName + " <"+fromEmail+">").withDestination(destination).withMessage(message);
        
        
        // Reply To
        if(StringUtils.isNotBlank(replyTo))
        	request.withReplyToAddresses(replyTo);
        
        try
        {        
            // For more information, see http://docs.aws.amazon.com/AWSSdkDocsJava/latest/DeveloperGuide/credentials.html
            BasicAWSCredentials bws = new BasicAWSCredentials(accessKey, secretKey);
            AmazonSimpleEmailServiceClient client = new AmazonSimpleEmailServiceClient(bws);
               
            // For a complete list, see http://docs.aws.amazon.com/ses/latest/DeveloperGuide/regions.html 
            Region REGION = Region.getRegion(Regions.fromName(region));
            client.setRegion(REGION);
       
            long startTime = System.currentTimeMillis();
            
            // Send the email.
            client.sendEmail(request);
            
            System.out.println("Time taken to send email..." + (System.currentTimeMillis() - startTime));
        }
        catch (Exception ex) 
        {
            System.out.println("The email was not sent.");
            System.out.println("Error message: " + ex.getMessage());
        }
	}
	
	public static void main(String[] args)
	{
		AmazonSES ses = new AmazonSES("AKIAIGD3AZW6HNQNNKWQ", "RFJaxJr9utec7I6PkcubyRi6HaBA/bF0apC03pYP", "us-west-2");
		ses.sendEmail("naresh@agilecrm.com", "Naresh Agile", "naresh@faxdesk.com, naresh@agilecrm.com", null, null, "Test email from localhost", "naresh@agilecrm.com", "Html email", "Text email");
	}
}
