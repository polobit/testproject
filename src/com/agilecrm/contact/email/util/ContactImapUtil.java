package com.agilecrm.contact.email.util;

import java.net.URLEncoder;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.util.IMAPEmailPrefsUtil;
import com.google.appengine.api.utils.SystemProperty;

public class ContactImapUtil
{

    /**
     * Returns url to fetch emails from given imap account.
     * 
     * @param searchEmail
     *            - search email-id.
     * @param offset
     *            - offset.
     * @param count
     *            - count or limit to number of emails.
     * @return String
     */
    public static String getIMAPURL(AgileUser agileUser, String searchEmail, String offset, String count)
    {
	// Get Imap Prefs
	IMAPEmailPrefs imapPrefs = IMAPEmailPrefsUtil.getIMAPPrefs(agileUser);

	if (imapPrefs == null)
	    return null;

	return ContactImapUtil.getIMAPURLForPrefs(imapPrefs, searchEmail, offset, count);
    }

    /**
     * Returns IMAP url
     * 
     * @param imapPrefs
     *            - IMAPEmailPrefs
     * @param searchEmail
     *            - email
     * @param offset
     *            - offset
     * @param count
     *            - emails count
     * @return String
     */

    public static String getIMAPURLForPrefs(IMAPEmailPrefs imapPrefs, String searchEmail, String offset, String count)
    {

	String userName = imapPrefs.user_name;
	String host = imapPrefs.server_name;
	String password = imapPrefs.password;

	String port = "143";
	if (imapPrefs.is_secure)
	    port = "993";

	String url = null;

	String hostUrl = "https://agile-imap.appspot.com";

	String applicationId = SystemProperty.applicationId.get();

	System.out.println("Application id is " + applicationId);

	if (StringUtils.equals(applicationId, "agilecrmbeta"))
	    hostUrl = "https://naresh-dot-imap-dot-agilecrmbeta.appspot.com";

	try
	{
	    url = hostUrl + "/imap?user_name=" + URLEncoder.encode(userName, "UTF-8") + "&search_email=" + searchEmail
		    + "&host=" + URLEncoder.encode(host, "UTF-8") + "&port=" + URLEncoder.encode(port, "UTF-8")
		    + "&offset=" + offset + "&count=" + count + "&command=imap_email&password="
		    + URLEncoder.encode(password, "UTF-8");
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in getIMAPURLForPrefs " + e.getMessage());
	    e.printStackTrace();
	}

	return url;
    }

}
