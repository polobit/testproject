package com.thirdparty.mandrill;

import java.util.Iterator;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.util.Base64Encoder;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;
import com.thirdparty.mandrill.exception.ReTryException;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

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
     * Mandrill core REST API URL
     */
    public static final String MANDRILL_API_POST_URL = "https://mandrillapp.com/api/1.0/";

    /**
     * Mandrill Message Call URL to send mail
     */
    public static final String MANDRILL_API_MESSAGE_CALL = "messages/send.json";

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
     * Mandrill array of supported attachments to add to the message
     */
    public static final String MANDRILL_ATTACHMENTS = "attachments";

    /**
     * MIME type of the attachment
     */
    public static final String MANDRILL_ATTACHMENT_MIME_TYPE = "type";

    /**
     * File name of the attachment
     */
    public static final String MANDRILL_ATTACHMENT_FILE_NAME = "name";

    /**
     * Content of the attachment as a base64-encoded string
     */
    public static final String MANDRILL_ATTACHMENT_FILE_CONTENT = "content";

    /**
     * Sends email using Mandrill API with the given parameters.
     * 
     * @param subaccount
     *            - Namespace is set as Mandrill subaccount id.
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
    public static String sendMail(String subaccount, String fromEmail, String fromName, String to, String subject, String replyTo, String html, String text,
	    String... attachments)
    {
	try
	{
	    // Complete mail json to be sent
	    JSONObject mailJSON = new JSONObject();

	    // api-key
	    mailJSON.put(MANDRILL_API_KEY, Globals.MANDRIL_API_KEY_VALUE);

	    // All email params are inserted into Message json
	    JSONObject messageJSON = getMessageJSON(subaccount, fromEmail, fromName, to, replyTo, subject, html, text, attachments);

	    mailJSON.put(MANDRILL_MESSAGE, messageJSON);

	    String response = null;
	    try
	    {
		response = HTTPUtil.accessURLUsingPost(MANDRILL_API_POST_URL + MANDRILL_API_MESSAGE_CALL, mailJSON.toString());

		System.out.println("Response for first attempt " + response);

		// Mandrill returns 'Unknown_Subaccount' error message when the
		// provided subaccount id does not exist.
		if (StringUtils.contains(response, "Unknown_Subaccount"))
		{
		    // throw retry exception and create new subaccount
		    throw new ReTryException("Unknown Mandrill Subaccount");
		}
	    }
	    catch (ReTryException e)
	    {
		// Creates new subaccount
		MandrillSubAccounts.createMandrillSubAccount(subaccount);

		System.out.println("Resending email with subaccount " + subaccount + "...");

		// Send email again.
		response = HTTPUtil.accessURLUsingPost(MANDRILL_API_POST_URL + MANDRILL_API_MESSAGE_CALL, mailJSON.toString());

		System.out.println("Response for second attempt " + response);
	    }

	    return response;
	}

	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in sendMail of Mandrill " + e.getMessage());
	    return e.getMessage();
	}
    }

    /**
     * Returns message json built upon from-email, from-name, to, subject,html
     * and text.
     * 
     * @param subaccount
     *            TODO
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
     * 
     * @return JSONObject
     */
    private static JSONObject getMessageJSON(String subaccount, String fromEmail, String fromName, String to, String replyTo, String subject, String html,
	    String text, String... attachments)
    {
	JSONObject messageJSON = new JSONObject();

	try
	{
	    messageJSON.put(MANDRILL_FROM_EMAIL, fromEmail);
	    messageJSON.put(MANDRILL_FROM_NAME, fromName);

	    // returns To JSONArray of recipient json objects
	    messageJSON.put(MANDRILL_TO, getRecipientsJSON(to));

	    // returns ReplyTo Header JSON
	    messageJSON.put(MANDRILL_HEADERS, getHeadersJSON(fromEmail, replyTo));

	    // Mandrill throws validation error if mail json consists of
	    // non-unicode characters
	    messageJSON.put(MANDRILL_SUBJECT, subject);

	    messageJSON.put(MANDRILL_HTML, html);

	    messageJSON.put(MANDRILL_TEXT, text);

	    messageJSON.put(MANDRILL_ATTACHMENTS, getAttachmentsJSON(attachments));

	    // Domain as subaccount
	    messageJSON.put(MandrillSubAccounts.MANDRILL_SUBACCOUNT, subaccount);
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
     *            - to email (or) to email string separated by commas
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
     * Returns JSONArray of attachment JSON. Mandrill attachment should have
     * type, filename and file content.
     * 
     * @param attachments
     * @return JSONArray
     */
    private static JSONArray getAttachmentsJSON(String... attachments)
    {
	// If no attachment is given then return
	if (attachments.length == 0)
	    return null;

	JSONArray attachmentsArray = new JSONArray();

	try
	{
	    // MIME Type
	    String mimeType = attachments[0];

	    // Attachment File name
	    String fileName = attachments[1];

	    // Attachment File Content
	    String fileContent = attachments[2];

	    JSONObject attachment = new JSONObject();
	    attachment.put(MANDRILL_ATTACHMENT_MIME_TYPE, mimeType);
	    attachment.put(MANDRILL_ATTACHMENT_FILE_NAME, fileName);

	    // Mandrill accepts only Base64 encoded content
	    attachment.put(MANDRILL_ATTACHMENT_FILE_CONTENT, Base64Encoder.encode(fileContent));

	    attachmentsArray.put(attachment);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in getAttachmentsJSON " + e.getMessage());
	}

	return attachmentsArray;
    }

    /**
     * Returns header json by inserting replyTo email into it. Any other header
     * values can also be inserted.
     * 
     * @param fromEmail
     *            - from email
     * @param replyTo
     *            - replyTo email.
     * @return JSONObject
     */
    private static JSONObject getHeadersJSON(String fromEmail, String replyTo)
    {
	JSONObject headersJSON = new JSONObject();
	try
	{
	    // insert replyTo if not empty and not equals to from.
	    if (!StringUtils.isBlank(replyTo) && !fromEmail.equals(replyTo))
		headersJSON.put(MANDRILL_REPLY_TO, replyTo);

	    headersJSON.put("Content-Type", "application/json; charset=UTF-8");

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in Mandrill headerJSON " + e.getMessage());
	    e.printStackTrace();
	}

	return headersJSON;
    }
}
