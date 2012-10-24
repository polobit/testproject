package com.agilecrm.util;

import java.util.Iterator;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.map.MappingJsonFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;

import com.thirdparty.SendGridEmail;

public class SendMail
{
    public static final String NEW_USER_INVITED = "new_user_invited";
    public static final String NEW_USER_INVITED_SUBJECT = "New User Invitation";

    public static final String FORGOT_PASSWORD = "forgot_password";
    public static final String FORGOT_PASSWORD_SUBJECT = "Your new Password";

    public static final String AGILE_FROM_NAME = "Agile CRM";
    public static final String AGILE_FROM_EMAIL = "noreply@agilecrm.com";

    public static final String TEMPLATES_PATH = "misc/email/";

    public static final String TEMPLATE_HTML_EXT = "_html.html";
    public static final String TEMPLATE_BODY_EXT = "_body.html";

    private static final JsonFactory JSON_FACTORY = new MappingJsonFactory();

    public static void sendMail(String to, String subject, String template,
	    Object object, String from, String fromName)
    {

	try
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

	    // Add email properties
	    JSONObject email = new JSONObject();
	    email.put("email_to", to);
	    email.put("email_subject", subject);
	    email.put("email_from", from);
	    email.put("email_from_name", fromName);

	    JSONObject mergedJSON = mergeJSONs(new JSONObject[] { email,
		    new JSONObject(json) });

	    // Read template - HTML
	    String emailHTML = handleBarsTemplatize(template
		    + TEMPLATE_HTML_EXT, mergedJSON);

	    // Read template - Body
	    String emailBody = handleBarsTemplatize(template
		    + TEMPLATE_BODY_EXT, mergedJSON);

	    // If both are null, nothing to be sent
	    if (emailHTML == null && emailBody == null)
	    {
		System.err
			.println("Email could not be sent as no matching templates were found "
				+ template);
		return;
	    }

	    // Send Email
	    SendGridEmail.sendMail(from, fromName, to, subject, from,
		    emailHTML, emailBody, null, null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    public static void sendMail(String to, String subject, String template,
	    Object object)
    {
	sendMail(to, subject, template, object, AGILE_FROM_EMAIL,
		AGILE_FROM_NAME);

    }

    private static String handleBarsTemplatize(String path, JSONObject json)
	    throws Exception
    {

	// Read from path
	String emailTemplate = Util.readResource(TEMPLATES_PATH + path);
	String value = null;
	if (emailTemplate == null)
	    return null;

	// Compile
	return MustacheUtil.compile(emailTemplate, json);
    }

    private static JSONObject mergeJSONs(JSONObject[] objs)
    {
	JSONObject merged = new JSONObject();
	try
	{
	    for (JSONObject obj : objs)
	    {
		Iterator it = obj.keys();
		while (it.hasNext())
		{
		    String key = (String) it.next();
		    merged.put(key, obj.get(key));
		}
	    }
	}
	catch (Exception e)
	{

	}

	return merged;
    }
}