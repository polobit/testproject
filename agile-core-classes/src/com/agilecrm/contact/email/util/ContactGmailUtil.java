package com.agilecrm.contact.email.util;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.SocialPrefs.Type;
import com.agilecrm.user.util.SocialPrefsUtil;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.thirdparty.google.GoogleServiceUtil;

public class ContactGmailUtil
{

    /**
     * Returns GmailURL to fetch emails from given gmail user-account.
     * 
     * @param searchEmail
     *            - search email-id.
     * @param offset
     *            - offset.
     * @param count
     *            - count or limit to number of emails.
     * @return String
     */
    @SuppressWarnings("deprecation")
    public static String getGmailURL(AgileUser agileUser, String searchEmail, String offset, String count)
    {
	// Get Gmail Social Prefs
	Type socialPrefsTypeEnum = SocialPrefs.Type.GMAIL;
	List<SocialPrefs> gmailPrefsList = SocialPrefsUtil.getPrefsList(agileUser, socialPrefsTypeEnum);
	if (gmailPrefsList == null || gmailPrefsList.size() <= 0)
	    return null;
	SocialPrefs gmailPrefs = gmailPrefsList.get(0);
	if (gmailPrefs.expires_at > 0l && gmailPrefs.expires_at <= System.currentTimeMillis())
	{
	    resetAccessToken(gmailPrefs);
	}
	
	return ContactGmailUtil.getGmailURLForPrefs(gmailPrefs,searchEmail, offset, count);
    }

    /**
     * Returns GmailURL to fetch emails from given "from-email" gmail
     * user-account.
     * 
     * @param fromEmail
     *            -gmail username
     * 
     * @param searchEmail
     *            - search email-id.
     * @param offset
     *            - offset.
     * @param count
     *            - count or limit to number of emails.
     * @return String
     */
    @SuppressWarnings("deprecation")
    public static String getGmailURL(String fromEmail, String searchEmail, String offset, String count)
    {
	// Get Gmail Social Prefs
	Type socialPrefsTypeEnum = SocialPrefs.Type.GMAIL;
	Objectify ofy = ObjectifyService.begin();
	SocialPrefs gmailPrefs = ofy.query(SocialPrefs.class).filter("email", fromEmail)
	        .filter("type", socialPrefsTypeEnum).get();

	if (gmailPrefs == null)
	    return null;

	if (gmailPrefs.expires_at > 0l && gmailPrefs.expires_at <= System.currentTimeMillis())
	{
	    resetAccessToken(gmailPrefs);
	}

	return ContactGmailUtil.getGmailURLForPrefs(gmailPrefs,searchEmail, offset, count);

    }

    public static void resetAccessToken(SocialPrefs prefs)
    {

	String response = GoogleServiceUtil.refreshTokenInGoogle(prefs.refresh_token);

	// Creates HashMap from response JSON string
	HashMap<String, Object> properties;
	try
	{
	    properties = new ObjectMapper().readValue(response, new TypeReference<HashMap<String, Object>>()
	    {
	    });
	}
	catch (IOException e)
	{
	    properties = new HashMap<String, Object>();
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	System.out.println(properties.toString());

	if (properties.containsKey("access_token"))
	{
	    prefs.token = String.valueOf(properties.get("access_token"));
	    prefs.expires_at = System.currentTimeMillis()
		    + Integer.parseInt(String.valueOf(properties.get("expires_in"))) * 1000;
	    prefs.save();
	}
    }

    /**
     * Returns Gmail URL
     * 
     * @param gmailPrefs
     *            - SocialPrefs
     * @param searchEmail
     *            - search email
     * @param offset
     *            - offset
     * @param count
     *            - emails count
     * @return String
     */
    public static String getGmailURLForPrefs(SocialPrefs gmailPrefs,String searchEmail, String offset, String count)
    {
	String userName = gmailPrefs.email;
	String host = "imap.gmail.com";
	String port = "993";
	String consumerKey = "anonymous";
	String consumerSecret = "anonymous";

	String oauth_key = gmailPrefs.token;
	String oauth_secret = gmailPrefs.secret;

	String command = "oauth_email";

	// Gmail Prefs has been updated from oauth1 (deprecated) to oauth2. For
	// oauth2, we store secret as v2
	if (StringUtils.equalsIgnoreCase(gmailPrefs.secret, "v2"))
	{
	    return "https://agile-imap.appspot.com/imap?command=oauth_email2&user_name=" + URLEncoder.encode(userName)
		    + "&search_email=" + searchEmail + "&fetch_items=mails&host=" + URLEncoder.encode(host) + "&port="
		    + URLEncoder.encode(port) + "&offset=" + offset + "&count=" + count + "&oauth_key="
		    + URLEncoder.encode(oauth_key);
	}

	return "https://agile-imap.appspot.com/imap?command=oauth_email&user_name=" + URLEncoder.encode(userName)
	        + "&search_email=" + searchEmail + "&fetch_items=mails&host=" + URLEncoder.encode(host) + "&port="
	        + URLEncoder.encode(port) + "&offset=" + offset + "&count=" + count + "&consumer_key="
	        + URLEncoder.encode(consumerKey) + "&consumer_secret=" + URLEncoder.encode(consumerSecret)
	        + "&oauth_key=" + URLEncoder.encode(oauth_key) + "&oauth_secret=" + URLEncoder.encode(oauth_secret);
    }
}
