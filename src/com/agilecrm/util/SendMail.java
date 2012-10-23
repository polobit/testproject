package com.agilecrm.util;

import java.util.Map;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.MappingJsonFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;

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

    private static final JsonFactory JSON_FACTORY = new MappingJsonFactory();

    public static void sendMail(String to, String subject, String template,
	    Object object, String from, String fromName) throws Exception
    {

	System.out.println("Sending email " + template + " " + object);

	// Serialize, Use ObjectMapper
	String json = null;
	String emailString = null;
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

	// Create JSONObject
	JSONObject email = new JSONObject();
	email.put("to", to);
	email.put("subject", subject);
	email.put("from", from);
	email.put("fromName", fromName);
	email.put("body", json);
	emailString = email.toString();

	// Read template - HTML
	String emailHTML = handleBarsTemplatize(template + TEMPLATE_HTML_EXT,
		emailString);

	// Read template - Body
	String emailBody = handleBarsTemplatize(template + TEMPLATE_BODY_EXT,
		emailString);

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
	    Object object) throws Exception
    {
	sendMail(to, subject, template, object, AGILE_FROM_EMAIL,
		AGILE_FROM_NAME);

    }

    private static String handleBarsTemplatize(String path, String emailString)
	    throws Exception
    {

	// Read from path
	String emailTemplate = Util.readResource(TEMPLATES_PATH + path);
	String value = null;
	if (emailTemplate == null)
	    return null;

	// Compile

	try
	{
	    Handlebars handlebars = new Handlebars();
	    Template template = handlebars.compile(emailTemplate);

	    // Convert String to JsonNode
	    JsonParser parser = JSON_FACTORY.createJsonParser(emailString);
	    JsonNode jsonNode = parser.readValueAsTree();

	    // Convert jsonNode to Map
	    Map jsonMap = (Map) handlebars.toObject(jsonNode);
	    value = template.apply(jsonMap);
	    System.out.println("The template after applying " + value);
	}
	catch (Exception e)
	{
	    System.out.println("Exception " + e);
	}

	// Apply

	return value;
    }
}