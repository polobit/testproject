package com.thirdparty;

import java.net.URLEncoder;
import java.util.HashSet;
import java.util.Set;
import java.util.StringTokenizer;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.util.HTTPUtil;

public class SendGridEmail
{

    // Send grid REST API URL
    public static final String SENDGRID_API_POST_URL = "https://sendgrid.com/api/mail.send.json";

    // Post param api_user
    public static final String SENDGRID_API_PARAM_API_USER = "api_user";

    // Post param api_key
    public static final String SENDGRID_API_PARAM_API_KEY = "api_key";

    // Post param to
    public static final String SENDGRID_API_PARAM_TO = "to";

    // Post param replyto
    public static final String SENDGRID_API_PARAM_REPLY_TO = "replyto";

    // Post param from
    public static final String SENDGRID_API_PARAM_FROM = "from";
    public static final String SENDGRID_API_PARAM_FROM_NAME = "fromname";

    // Post param subject
    public static final String SENDGRID_API_PARAM_SUBJECT = "subject";

    // Post param text body
    public static final String SENDGRID_API_PARAM_TEXT_BODY = "text";

    // Post param html body
    public static final String SENDGRID_API_PARAM_HTML_BODY = "html";

    // Default query string
    public static String defaultQueryString = SENDGRID_API_PARAM_API_USER + "="
	    + Globals.SENDGRID_API_USER_NAME + "&" + SENDGRID_API_PARAM_API_KEY
	    + "=" + Globals.SENDGRID_API_KEY + "&";

    public static String sendMail(String fromEmail, String fromName, String to,
	    String subject, String replyTo, String html, String text,
	    JSONObject subscriberJSON, JSONObject campaignJSON)
    {
	// Set to remove duplicates
	Set<String> toEmailSet = new HashSet<String>();
	// Tokenize
	StringTokenizer st = new StringTokenizer(to, ",");
	while (st.hasMoreTokens())
	{
	    String email = st.nextToken();
	    toEmailSet.add(email);
	}
	// Send email
	String response = "";

	for (String email : toEmailSet)
	{
	    try
	    {
		// Query string
		String queryString = "";

		queryString = defaultQueryString + SENDGRID_API_PARAM_TO + "="
			+ URLEncoder.encode(email.trim()) + "&"
			+ SENDGRID_API_PARAM_SUBJECT + "="
			+ URLEncoder.encode(subject) + "&"
			+ SENDGRID_API_PARAM_FROM + "="
			+ URLEncoder.encode(fromEmail) + "&"
			+ SENDGRID_API_PARAM_FROM_NAME + "="
			+ URLEncoder.encode(fromName);

		if (!StringUtils.isEmpty(replyTo))
		    queryString += "&" + SENDGRID_API_PARAM_REPLY_TO + "="
			    + URLEncoder.encode(replyTo);

		// Check type of email

		// Text email
		if (text != null)
		{
		    queryString += "&" + SENDGRID_API_PARAM_TEXT_BODY + "="
			    + URLEncoder.encode(text);
		}
		// HTML email
		if (html != null)
		{
		    queryString += "&" + SENDGRID_API_PARAM_HTML_BODY + "="
			    + URLEncoder.encode(html);
		}

		System.out.println("QueryString  \n" + queryString + "\n\n");

		response = HTTPUtil.accessURLUsingPost(SENDGRID_API_POST_URL,
			queryString);

		System.out.println("Response " + response);

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
		return null;
	    }
	}

	return response;
    }
}
