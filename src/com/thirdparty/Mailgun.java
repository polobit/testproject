package com.thirdparty;

import java.net.URLEncoder;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.Globals;
import com.agilecrm.util.HTTPUtil;

/**
 * <code>Mailgun</code> is the base class that sends email using mailgun api
 * 
 * @author Naresh
 * 
 */
public class Mailgun
{
    /**
     * Mailgun API key
     */
    public static final String MAILGUN_API_KEY = "api";

    /**
     * Mailgun API url
     */
    public static final String MAILGUN_API_POST_URL = "https://api.mailgun.net/v2/agilecrm.com/messages";

    /**
     * Post param to
     */
    public static final String MAILGUN_API_PARAM_TO = "to";

    /**
     * Post param cc
     */
    public static final String MAILGUN_API_PARAM_CC = "cc";

    /**
     * Post param bcc
     */
    public static final String MAILGUN_API_PARAM_BCC = "bcc";

    /**
     * Post param replyto
     */
    public static final String MAILGUN_API_PARAM_REPLY_TO = "h:Reply-To";

    /**
     * Post param from email
     */
    public static final String MAILGUN_API_PARAM_FROM = "from";

    /**
     * Post param subject
     */
    public static final String MAILGUN_API_PARAM_SUBJECT = "subject";

    /**
     * Post param text body
     */
    public static final String MAILGUN_API_PARAM_TEXT_BODY = "text";

    /**
     * Post param html body
     */
    public static final String MAILGUN_API_PARAM_HTML_BODY = "html";

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
     * @return String
     */
    public static void sendMail(String fromEmail, String fromName, String to, String cc, String bcc, String subject, String replyTo, String html, String text)
    {
	String data = MAILGUN_API_PARAM_FROM + "=" + URLEncoder.encode(getFromEmail(fromName, fromEmail)) + "&" + MAILGUN_API_PARAM_TO + "="
		+ URLEncoder.encode(to) + "&" + MAILGUN_API_PARAM_SUBJECT + "=" + URLEncoder.encode(subject);

	if (!StringUtils.isEmpty(text))
	    data += "&" + MAILGUN_API_PARAM_TEXT_BODY + "=" + URLEncoder.encode(text);

	if (!StringUtils.isEmpty(html))
	    data += "&" + MAILGUN_API_PARAM_HTML_BODY + "=" + URLEncoder.encode(html);

	if (!StringUtils.isEmpty(cc))
	    data += "&" + MAILGUN_API_PARAM_CC + "=" + URLEncoder.encode(cc);

	if (!StringUtils.isEmpty(bcc))
	    data += "&" + MAILGUN_API_PARAM_BCC + "=" + URLEncoder.encode(bcc);

	// insert replyTo if not same as from
	if (!StringUtils.isEmpty(replyTo) && !fromEmail.equals(replyTo))
	    data += "&" + MAILGUN_API_PARAM_REPLY_TO + "=" + URLEncoder.encode(replyTo);

	try
	{
	    // MailGun uses Base64 Authentication
	    String response = HTTPUtil.accessURLUsingAuthentication(MAILGUN_API_POST_URL, MAILGUN_API_KEY, Globals.MAILGUN_API_KEY_VALUE, "POST", data, false,
		    null, null);

	    System.out.println("Response is " + response);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Returns from email in the form of "Naresh <naresh@agilecrm.com>" if
     * fromName is not empty, otherwise simply returns email.
     * 
     * @param fromName
     *            - from name.
     * @param fromEmail
     *            - from email.
     * @return String
     */
    private static String getFromEmail(String fromName, String fromEmail)
    {
	// if fromName is empty, simply return email
	if (StringUtils.isEmpty(fromName))
	    return fromEmail;

	String from = fromName + " <" + fromEmail + ">";

	return from;
    }
}