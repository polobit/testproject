package com.thirdparty;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.Globals;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;

/**
 * <code>SendGrid</code> is the core class that sends email using Send Grid API.
 * Required parameters to send email like from, to, subject and body are added
 * as query paramaters to Send Grid api URL.
 * <p>
 * SendGrid provides various options for sending email. Options can be viewed in
 * http://sendgrid.com/docs/API_Reference/Web_API/mail.html.
 * </p>
 * 
 */
public class SendGrid
{
    /**
     * Send grid REST API URL
     */
    public static final String SENDGRID_API_POST_URL = "https://sendgrid.com/api/mail.send.json";

    /**
     * Post param api_user
     */
    public static final String SENDGRID_API_PARAM_API_USER = "api_user";

    /**
     * Post param api_key
     */
    public static final String SENDGRID_API_PARAM_API_KEY = "api_key";

    /**
     * Post param to
     */
    public static final String SENDGRID_API_PARAM_TO = "to";

    /**
     * Post param cc
     */
    public static final String SENDGRID_API_PARAM_CC = "cc";

    /**
     * Post param bcc
     */
    public static final String SENDGRID_API_PARAM_BCC = "bcc";

    /**
     * Post param to[] - to add multiple to emails
     */
    public static final String SENDGRID_API_PARAM_MULTIPLE_TO = "to[]";

    /**
     * Post param cc[] - to add multiple cc emails
     */
    public static final String SENDGRID_API_PARAM_MULTIPLE_CC = "cc[]";

    /**
     * Post param bcc[] - to add multiple bcc emails
     */
    public static final String SENDGRID_API_PARAM_MULTIPLE_BCC = "bcc[]";

    /**
     * Post param replyto
     */
    public static final String SENDGRID_API_PARAM_REPLY_TO = "replyto";

    /**
     * Post param from email
     */
    public static final String SENDGRID_API_PARAM_FROM = "from";

    /**
     * Post param from name
     */
    public static final String SENDGRID_API_PARAM_FROM_NAME = "fromname";

    /**
     * Post param subject
     */
    public static final String SENDGRID_API_PARAM_SUBJECT = "subject";

    /**
     * Post param text body
     */
    public static final String SENDGRID_API_PARAM_TEXT_BODY = "text";

    /**
     * Post param html body
     */
    public static final String SENDGRID_API_PARAM_HTML_BODY = "html";

    /**
     * SMTP Header
     */
    public static final String SENDGRID_API_PARAM_X_SMTPAPI = "x-smtpapi";

    /**
     * Post Param file attachment
     */
    public static final String SENDGRID_API_PARAM_FILES = "files";

    /**
     * Sends email by adding required fields to Send Grid Api.
     * 
     * @param fromEmail
     *            - from email-id
     * @param fromName
     *            - from name.
     * @param to
     *            - to email-id.
     * @param subject
     *            - email subject.
     * @param replyTo
     *            - email-id to reply
     * @param html
     *            - html body.
     * @param text
     *            - text body.
     * @param subscriberJSON
     *            - Contact object in json.
     * @param campaignJSON
     *            - Workflow object in json.
     * @return String
     */
    public static String sendMail(String apiUser, String apiKey, String fromEmail, String fromName, String to,
	    String cc, String bcc, String subject, String replyTo, String html, String text, String SMTPHeaderJSON,
	    String... attachmentData)
    {

	// If both are null, use Agile SendGrid Keys
	if (apiUser == null && apiKey == null)
	{
	    apiUser = Globals.SENDGRID_API_USER_NAME;
	    apiKey = Globals.SENDGRID_API_KEY;
	}

	// Email response
	String response = "";

	try
	{
	    String queryString = getSendGridQueryString(apiUser, apiKey, fromEmail, fromName, to, cc, bcc, subject,
		    replyTo, html, text, SMTPHeaderJSON, attachmentData);

	    response = HTTPUtil.accessURLUsingPost(SENDGRID_API_POST_URL, queryString);

	    System.out.println("Response " + response);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return e.getMessage();
	}

	return response;
    }

    /**
     * Returns query string required for send grid post data
     * 
     * @param apiUser
     *            - send grid api user
     * @param apiKey
     *            - send grid api key
     * @param fromEmail
     *            - from email
     * @param fromName
     *            - from name
     * @param to
     *            - to email
     * @param cc
     *            - cc
     * @param bcc
     *            - bcc
     * @param subject
     *            - subject
     * @param replyTo
     *            - reply to
     * @param html
     *            - html body
     * @param text
     *            - text body
     * @param SMTPHeaderJSON
     *            - SMTP header json
     * @return
     * @throws UnsupportedEncodingException
     */
    public static String getSendGridQueryString(String apiUser, String apiKey, String fromEmail, String fromName,
	    String to, String cc, String bcc, String subject, String replyTo, String html, String text,
	    String SMTPHeaderJSON, String... attachmentData) throws UnsupportedEncodingException
    {
	// Query string
	String queryString = SENDGRID_API_PARAM_API_USER + "=" + apiUser + "&" + SENDGRID_API_PARAM_API_KEY + "="
	        + apiKey + "&" + SENDGRID_API_PARAM_SUBJECT + "=" + URLEncoder.encode(subject, "UTF-8") + "&"
	        + SENDGRID_API_PARAM_FROM + "=" + URLEncoder.encode(fromEmail, "UTF-8") + "&"
	        + SENDGRID_API_PARAM_FROM_NAME + "=" + URLEncoder.encode(fromName, "UTF-8");

	// Appends To emails
	queryString += "&" + addToEmailsToParams(EmailUtil.getStringTokenSet(to, ","), SENDGRID_API_PARAM_MULTIPLE_TO);

	// Appends CC
	if (!StringUtils.isEmpty(bcc))
	    queryString += "&"
		    + addToEmailsToParams(EmailUtil.getStringTokenSet(cc, ","), SENDGRID_API_PARAM_MULTIPLE_CC);

	// Appends BCC
	if (!StringUtils.isEmpty(bcc))
	    queryString += "&"
		    + addToEmailsToParams(EmailUtil.getStringTokenSet(bcc, ","), SENDGRID_API_PARAM_MULTIPLE_BCC);

	// Reply To
	if (!StringUtils.isEmpty(replyTo) && !fromEmail.equals(replyTo))
	    queryString += "&" + SENDGRID_API_PARAM_REPLY_TO + "=" + URLEncoder.encode(replyTo, "UTF-8");

	// Text body
	if (text != null)
	    queryString += "&" + SENDGRID_API_PARAM_TEXT_BODY + "=" + URLEncoder.encode(text, "UTF-8");

	// HTML body
	if (html != null)
	    queryString += "&" + SENDGRID_API_PARAM_HTML_BODY + "=" + URLEncoder.encode(html, "UTF-8");

	// Add SMTP Header
	if (SMTPHeaderJSON != null)
	    queryString += "&" + SENDGRID_API_PARAM_X_SMTPAPI + "=" + URLEncoder.encode(SMTPHeaderJSON, "UTF-8");

	if (attachmentData != null && attachmentData.length != 0)
	    queryString += "&" + getAttachmentQueryString(attachmentData);

	System.out.println("QueryString  \n" + queryString + "\n\n");

	return queryString;
    }

    /**
     * Adds emails of the set to the params of Send Grid Api. Send Grid provides
     * to[] option inorder to append multiple emails.
     * 
     * @param emails
     *            - Set consisting of emails.
     * @return String
     * @throws UnsupportedEncodingException
     */
    private static String addToEmailsToParams(Set<String> emails, String param) throws UnsupportedEncodingException
    {
	String multipleTo = "";

	Iterator<String> itr = emails.iterator();

	// Adds multiple - to[]="email1" & to[]="email2"
	while (itr.hasNext())
	{
	    multipleTo += param + "=" + URLEncoder.encode(itr.next(), "UTF-8");

	    // appends '&' except for last one.
	    if (itr.hasNext())
		multipleTo += "&";
	}

	return multipleTo;
    }

    public static String sendMail(String fromEmail, String fromName, String to, String cc, String bcc, String subject,
	    String replyTo, String html, String text)
    {
	return sendMail(null, null, fromEmail, fromName, to, cc, bcc, subject, replyTo, html, text, null);
    }

    private static String getAttachmentQueryString(String... attachmentData)
    {

	String queryString = "";

	try
	{

	    // Validate attachments
	    if ((attachmentData == null || attachmentData.length == 0))
		return null;

	    String fileName = getFileName(attachmentData);

	    // Get extension
	    String fileExt = attachmentData[1].contains(".") ? attachmentData[1].split("\\.")[1] : attachmentData[1];

	    String fileContent = attachmentData[2];

	    if (StringUtils.isBlank(fileName) || StringUtils.isBlank(fileExt) || StringUtils.isBlank(fileContent))
		return null;

	    System.out.println("FileName: " + fileName + " FileExtension: " + fileExt);

	    queryString += "&" + SENDGRID_API_PARAM_FILES + "[" + URLEncoder.encode(fileName, "UTF-8") + "." + fileExt
		    + "]=" + URLEncoder.encode(fileContent, "UTF-8");

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while getting attachment string..." + e.getMessage());
	}

	return queryString;
    }

    private static String getFileName(String[] attachmentData)
    {
	// For Mandrill attachment, 0 index value is mime-type like text/html
	if (attachmentData[0].contains("/"))
	{
	    // If file name contains extension like 'file.txt', then return
	    // 'file'
	    if (attachmentData[1].contains("."))
		return attachmentData[1].split("\\.")[0];

	    return attachmentData[1];
	}

	return attachmentData[0];
    }
}
