package com.thirdparty;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.Globals;
import com.agilecrm.util.EmailUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.NamespaceManager;

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
     * Post param to
     */
    public static final String SENDGRID_API_PARAM_BCC = "bcc";

    /**
     * Post param to[] - to add multiple to emails
     */
    public static final String SENDGRID_API_PARAM_MULTIPLE_TO = "to[]";

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
     * Default query string
     */
    public static String defaultQueryString = getSendGridAPIParams();

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
    public static String sendMail(String fromEmail, String fromName, String to, String cc, String bcc, String subject, String replyTo, String html, String text)
    {

	// SendGrid doesn't support CC, so attaching with To
	if (!StringUtils.isEmpty(cc))
	    to += "," + cc;

	// String tokens obtained by delimiter are added to set
	Set<String> toEmailSet = EmailUtil.getStringTokenSet(to, ",");

	// Email response
	String response = "";

	try
	{
	    // Query string
	    String queryString = defaultQueryString + SENDGRID_API_PARAM_SUBJECT + "=" + URLEncoder.encode(subject, "UTF-8") + "&" + SENDGRID_API_PARAM_FROM
		    + "=" + URLEncoder.encode(fromEmail, "UTF-8") + "&" + SENDGRID_API_PARAM_FROM_NAME + "=" + URLEncoder.encode(fromName, "UTF-8");

	    // Appends To emails
	    queryString += "&" + addToEmailsToParams(toEmailSet);

	    // Appends BCC
	    if (!StringUtils.isEmpty(bcc))
		queryString += "&" + SENDGRID_API_PARAM_BCC + "=" + URLEncoder.encode(bcc, "UTF-8");

	    // Reply To
	    if (!StringUtils.isEmpty(replyTo) && !fromEmail.equals(replyTo))
		queryString += "&" + SENDGRID_API_PARAM_REPLY_TO + "=" + URLEncoder.encode(replyTo, "UTF-8");

	    // Text body
	    if (text != null)
	    {
		queryString += "&" + SENDGRID_API_PARAM_TEXT_BODY + "=" + URLEncoder.encode(text, "UTF-8");
	    }
	    // HTML body
	    if (html != null)
	    {
		queryString += "&" + SENDGRID_API_PARAM_HTML_BODY + "=" + URLEncoder.encode(html, "UTF-8");
	    }

	    System.out.println("QueryString  \n" + queryString + "\n\n");

	    response = HTTPUtil.accessURLUsingPost(SENDGRID_API_POST_URL, queryString);

	    System.out.println("Response " + response);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

	return response;
    }

    /**
     * Adds emails of the set to the params of Send Grid Api. Send Grid provides
     * to[] option inorder to append multiple emails.
     * 
     * @param toEmails
     *            - Set consisting of emails.
     * @return String
     * @throws UnsupportedEncodingException
     */
    private static String addToEmailsToParams(Set<String> toEmails) throws UnsupportedEncodingException
    {
	String multipleTo = "";

	Iterator<String> itr = toEmails.iterator();

	// Adds multiple - to[]="email1" & to[]="email2"
	while (itr.hasNext())
	{
	    multipleTo += SENDGRID_API_PARAM_MULTIPLE_TO + "=" + URLEncoder.encode(itr.next(), "UTF-8");

	    // appends '&' except for last one.
	    if (itr.hasNext())
		multipleTo += "&";
	}

	return multipleTo;
    }

    /**
     * Returns api key and username as query params
     * 
     * @return String
     */
    private static String getSendGridAPIParams()
    {
	String userName = Globals.SENDGRID_API_USER_NAME;
	String apiKey = Globals.SENDGRID_API_KEY;

	// For clickdesk
	if (StringUtils.equals(NamespaceManager.get(), Globals.CLICKDESK_ENGAGE_DOMAIN))
	{
	    userName = Globals.CLICKDESK_SENDGRID_API_USER_NAME;
	    apiKey = Globals.CLICKDESK_SENDGRID_API_KEY;
	}

	return SENDGRID_API_PARAM_API_USER + "=" + userName + "&" + SENDGRID_API_PARAM_API_KEY + "=" + apiKey + "&";
    }
}
