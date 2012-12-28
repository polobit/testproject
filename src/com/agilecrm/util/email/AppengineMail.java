package com.agilecrm.util.email;

import java.util.Properties;
import java.util.StringTokenizer;

import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;

public class AppengineMail
{
    public static final String FROM = "agilecrm@agile-crm-cloud.appspotmail.com";
    public static final String FRIENDLY_NAME = "AgileCRM";

    public static boolean sendHTMLEmail(String to, String subject,
	    String textBody, String htmlBody)
    {

	String from = FROM;
	String friendlyName = FRIENDLY_NAME;

	// Send Email (HTML Email and Plain Text)
	try
	{

	    Properties props = System.getProperties();
	    Session session = Session.getDefaultInstance(props, null);

	    // -- Create a new message --
	    MimeMessage message = new MimeMessage(session);

	    // -- Set the FROM and TO fields --
	    if (friendlyName != null)
		message.setFrom(new InternetAddress(from, friendlyName));
	    else
		message.setFrom(new InternetAddress(from));

	    // Set reply to (testing)
	    message.setReplyTo(new InternetAddress[] { new InternetAddress(from) });

	    if (to.contains(","))
	    {
		// Tokenize
		StringTokenizer st = new StringTokenizer(to, ",");
		boolean isFirstToken = true;
		while (st.hasMoreTokens())
		{
		    if (isFirstToken)
		    {
			message.addRecipient(Message.RecipientType.TO,
				new InternetAddress(st.nextToken().trim()));
			isFirstToken = false;
		    }
		    else
			message.addRecipient(Message.RecipientType.CC,
				new InternetAddress(st.nextToken().trim()));
		}
	    }
	    else
		message.addRecipient(Message.RecipientType.TO,
			new InternetAddress(to));

	    if (htmlBody != null && htmlBody.length() != 0)
	    {

		// Create MimeMultipart
		MimeMultipart content = new MimeMultipart("alternative");

		// Create two mime parts - html and plain text
		MimeBodyPart text = new MimeBodyPart();
		MimeBodyPart html = new MimeBodyPart();

		// Set plain text
		text.setText(textBody);

		// Set HTML
		html.setContent(htmlBody, "text/html");

		// Add Body
		content.addBodyPart(text);

		// Add HTML
		content.addBodyPart(html);

		message.setContent(content);
		message.setHeader("MIME-Version", "1.0");
		message.setHeader("Content-Type", content.getContentType());
	    }
	    else
	    {
		message.setText(textBody);
	    }

	    try
	    {
		message.setSubject(subject, "UTF-8");
	    }
	    catch (Exception e)
	    {
		// TODO: handle exception
		System.out.println(e.getMessage());
		message.setSubject(subject);
	    }

	    System.out.println("From: " + from + " - " + friendlyName + " To:"
		    + to + " Sub:" + subject + " Html:" + htmlBody + " Text:"
		    + textBody);

	    Transport.send(message);

	    return true;

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Email could not go 1 " + e.getMessage());

	}

	return false;
    }

    public static void sendMail(String to, String subject, String template,
	    Object object)
    {

	System.out.println(template + SendMail.TEMPLATE_HTML_EXT);

	ObjectMapper mapper = new ObjectMapper();

	try
	{
	    String objectJson = mapper.writeValueAsString(object);

	    JSONObject[] jsonObjectArray;

	    // If object to mail template is array then data of array can be
	    // accessed with "class name" key in template
	    if (object instanceof Object[])
	    {
		JSONObject content = new JSONObject();
		for (Object eachObject : (Object[]) object)
		{
		    String className = eachObject.getClass().getSimpleName();
		    content.put(
			    className,
			    new JSONObject(new ObjectMapper()
				    .writeValueAsString(eachObject)));
		}

		jsonObjectArray = new JSONObject[] { content };

	    }

	    else
	    {
		jsonObjectArray = new JSONObject[] { new JSONObject(objectJson) };
	    }

	    // Merge JSONObjects as a single JSONObject in order to get all
	    // values in a single object
	    JSONObject mergedJSON = MustacheUtil.mergeJSONs(jsonObjectArray);

	    // Read template - HTML
	    String emailHTML = MustacheUtil.templatize(template
		    + SendMail.TEMPLATE_HTML_EXT, mergedJSON);

	    // Read template - Body
	    String emailBody = MustacheUtil.templatize(template
		    + SendMail.TEMPLATE_BODY_EXT, mergedJSON);

	    if (StringUtils.isEmpty(emailBody))
		emailBody = " ";
	    sendHTMLEmail(to, subject, emailBody, emailHTML);

	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }
}
