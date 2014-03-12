package com.agilecrm.contact.email.util;

import java.net.URLEncoder;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.SocialPrefs;
import com.agilecrm.user.SocialPrefs.Type;
import com.agilecrm.user.util.SocialPrefsUtil;

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
    public static String getGmailURL(String searchEmail, String offset, String count)
    {
	// Get Gmail Social Prefs
	Type socialPrefsTypeEnum = SocialPrefs.Type.GMAIL;
	SocialPrefs gmailPrefs = SocialPrefsUtil.getPrefs(AgileUser.getCurrentAgileUser(), socialPrefsTypeEnum);

	if (gmailPrefs == null)
	    return null;

	return ContactGmailUtil.getGmailURLForPrefs(gmailPrefs, searchEmail, offset, count);

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
    public static String getGmailURLForPrefs(SocialPrefs gmailPrefs, String searchEmail, String offset, String count)
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
	    return "https://agile-imap.appspot.com/imap?command=oauth_email2&user_name=" + URLEncoder.encode(userName) + "&search_email=" + searchEmail
		    + "&host=" + URLEncoder.encode(host) + "&port=" + URLEncoder.encode(port) + "&offset=" + offset + "&count=" + count + "&oauth_key="
		    + URLEncoder.encode(oauth_key);
	}

	return "https://agile-imap.appspot.com/imap?command=oauth_email&user_name=" + URLEncoder.encode(userName) + "&search_email=" + searchEmail + "&host="
		+ URLEncoder.encode(host) + "&port=" + URLEncoder.encode(port) + "&offset=" + offset + "&count=" + count + "&consumer_key="
		+ URLEncoder.encode(consumerKey) + "&consumer_secret=" + URLEncoder.encode(consumerSecret) + "&oauth_key=" + URLEncoder.encode(oauth_key)
		+ "&oauth_secret=" + URLEncoder.encode(oauth_secret);
    }
}