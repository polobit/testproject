package com.agilecrm.util;

import org.codehaus.jackson.map.ObjectMapper;

import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Template;
import com.thirdparty.SendGridEmail;

public class SendMail
{
    public static final String NEW_USER_INVITED = "new_user_invited";

    public static final String AGILE_FROM_NAME = "Agile CRM";
    public static final String AGILE_FROM_EMAIL = "noreply@agilecrm.com";

    public static final String TEMPLATES_PATH = "misc/email/";

    public static final String TEMPLATE_HTML_EXT = "_html.html";
    public static final String TEMPLATE_BODY_EXT = "_body.html";

    public static void sendMail(String to, String subject, String template,
	    Object object, String from, String fromName)
    {

	System.out.println("Sending email " + template + " " + object);

	// Serialize, Use ObjectMapper
	String json = null;
	try
	{
	    ObjectMapper mapper = new ObjectMapper();
	    json = mapper.writeValueAsString(object);
	    System.out.println(json);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return;
	}

	// Read template - HTML
	String emailHTML = handleBarsTemplatize(template + TEMPLATE_HTML_EXT,
		json);

	// Read template - Body
	String emailBody = handleBarsTemplatize(template + TEMPLATE_BODY_EXT,
		json);

	// If both are null, nothing to be sent
	if (emailHTML == null && emailBody == null)
	{
	    System.err
		    .println("Email could not be sent as no matching templates were found "
			    + template);
	    return;
	}

	// Send Email
	SendGridEmail.sendMail(from, fromName, to, subject, from, emailHTML,
		emailBody, null, null);

    }

    public static void sendMail(String to, String subject, String template,
	    Object object)
    {
	sendMail(to, subject, template, object, AGILE_FROM_EMAIL,
		AGILE_FROM_NAME);

    }

    private static String handleBarsTemplatize(String path, String object)
    {

	// Read from path
	String emailTemplate = Util.readResource(TEMPLATES_PATH + path);
	if (emailTemplate == null)
	    return null;

	// Compile
	try
	{
	    Handlebars handlebars = new Handlebars();
	    Template template = handlebars.compile(emailTemplate);
	    System.out.println(template.apply(object));
	}
	catch (Exception e)
	{
	    System.out.println("Exception " + e);
	}

	// Apply

	return emailTemplate;
    }
}