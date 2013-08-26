package com.thirdparty;

import java.util.Iterator;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;

/**
 * <code>Mandrill</code> is the core class to send mail using Mandrill API. The
 * Mandrill API is a mostly RESTful API. All API calls should be made with HTTP
 * POST.
 * 
 * @author Naresh
 * 
 */
public class Mandrill
{

    /**
     * Mandrill REST API URL to send mail
     */
    public static final String MANDRILL_API_POST_URL = "https://mandrillapp.com/api/1.0/messages/send.json";

    /**
     * Mandrill API key param
     */
    public static final String MANDRILL_API_KEY = "key";

    /**
     * Mandrill Message param. Fields like html, text, subject, to, from_name,
     * from_email are inserted into message json.
     */
    public static final String MANDRILL_MESSAGE = "message";

    /**
     * Mandrill HTML body param
     */
    public static final String MANDRILL_HTML = "html";

    /**
     * Mandrill Text body param
     */
    public static final String MANDRILL_TEXT = "text";

    /**
     * Mandrill subject param
     */
    public static final String MANDRILL_SUBJECT = "subject";

    /**
     * Mandrill from email param
     */
    public static final String MANDRILL_FROM_EMAIL = "from_email";

    /**
     * Mandrill from name param
     */
    public static final String MANDRILL_FROM_NAME = "from_name";

    /**
     * Mandrill to param. Mandrill to param is an array of recipient
     * information. Each recipient is a JSONObject of email and name.
     */
    public static final String MANDRILL_TO = "to";

    /**
     * Mandrill recipient email param
     */
    public static final String MANDRILL_RECIPIENT_EMAIL = "email";

    /**
     * Mandrill Headers param. Optional extra headers to add to the message
     * (most headers are allowed). ReplyTo is added to headers.
     */
    public static final String MANDRILL_HEADERS = "headers";

    /**
     * Mandrill ReplyTo email param.
     */
    public static final String MANDRILL_REPLY_TO = "Reply-To";

    /**
     * Sends email using Mandrill API with the given parameters.
     * 
     * @param fromEmail
     *            - from email.
     * @param fromName
     *            - from name.
     * @param to
     *            - to email
     * @param subject
     *            - email subject
     * @param replyTo
     *            - replyTo email
     * @param html
     *            - html body
     * @param text
     *            - text body
     */
    public static String sendMail(String fromEmail, String fromName, String to, String subject, String replyTo, String html, String text)
    {
	try
	{
	    // Complete mail json to be sent
	    JSONObject mailJSON = new JSONObject();

	    // api-key
	    mailJSON.put(MANDRILL_API_KEY, Globals.MANDRIL_API_KEY_VALUE);

	    // all given params except replyTo are inserted into message json.
	    JSONObject messageJSON = getMessageJSON(fromEmail, fromName, to, subject, html, text);
	    mailJSON.put(MANDRILL_MESSAGE, messageJSON);

	    // replyTo email in headers
	    JSONObject headersJSON = getHeadersJSON(replyTo);
	    mailJSON.put(MANDRILL_HEADERS, headersJSON);

	    String response = HTTPUtil.accessURLUsingPost(MANDRILL_API_POST_URL, mailJSON.toString());

	    System.out.println("Response: " + response);

	    return response;
	}

	catch (Exception e)
	{
	    e.printStackTrace();

	    System.out.println(e.getMessage());

	    return e.getMessage();
	}
    }

    /**
     * Returns message json built upon from-email, from-name, to, subject,html
     * and text.
     * 
     * @param fromEmail
     *            - from email.
     * @param fromName
     *            - from name.
     * @param to
     *            - to email (to email string separated by commas)
     * @param subject
     *            - email subject
     * @param html
     *            - html body
     * @param text
     *            - text body
     * @return JSONObject
     */
    private static JSONObject getMessageJSON(String fromEmail, String fromName, String to, String subject, String html, String text)
    {
	JSONObject messageJSON = new JSONObject();

	try
	{
	    messageJSON.put(MANDRILL_FROM_EMAIL, fromEmail);
	    messageJSON.put(MANDRILL_FROM_NAME, fromName);

	    // returns To JSONArray of recipient json objects
	    messageJSON.put(MANDRILL_TO, getRecipientsJSON(to));

	    messageJSON.put(MANDRILL_SUBJECT, subject);
	    messageJSON.put(MANDRILL_HTML, html);
	    messageJSON.put(MANDRILL_TEXT, text);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return messageJSON;
    }

    /**
     * Returns json array of recipients json. Recipient json consists of email
     * and name.
     * 
     * @param to
     *            - to email ( or to email string separated by commas)
     * @return JSONArray
     */
    private static JSONArray getRecipientsJSON(String to)
    {
	JSONArray toJSONArray = new JSONArray();
	try
	{
	    // String tokens obtained by delimiter are added to java.util.Set
	    // collection
	    Set<String> toEmails = EmailUtil.getStringTokenSet(to, ",");

	    Iterator<String> itr = toEmails.iterator();

	    // Inserts each to email into JSONObject and then that JSON to
	    // JSONArray
	    while (itr.hasNext())
	    {
		JSONObject eachToEmail = new JSONObject();
		toJSONArray.put(eachToEmail.put(MANDRILL_RECIPIENT_EMAIL, itr.next()));
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	}

	return toJSONArray;
    }

    /**
     * Returns header json by inserting replyTo email into it. Any other header
     * values can also be inserted.
     * 
     * @param replyTo
     *            - replyTo email.
     * @return JSONObject
     */
    private static JSONObject getHeadersJSON(String replyTo)
    {
	JSONObject headersJSON = new JSONObject();
	try
	{
	    headersJSON.put(MANDRILL_REPLY_TO, replyTo);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return headersJSON;
    }
}
