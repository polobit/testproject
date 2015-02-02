package com.agilecrm.contact.email.util;

import java.net.URLEncoder;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.OfficeEmailPrefs;
import com.agilecrm.user.util.OfficeEmailPrefsUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class ContactOfficeUtil
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
    public static String getOfficeURL(AgileUser agileUser, String searchEmail, String offset, String count)
    {
	// Get Office Exchange Prefs
	OfficeEmailPrefs officePrefs = OfficeEmailPrefsUtil.getOfficePrefs(agileUser);

	if (officePrefs == null)
	    return null;

	return ContactOfficeUtil.getOfficeURLForPrefs(officePrefs, searchEmail, offset, count);
    }

    /**
     * Returns url to fetch emails from given "fromemail" office account.
     * 
     * @param searchEmail
     *            - search email-id.
     * @param fromEmail
     *            - username of the office365 account
     * 
     * @param offset
     *            - offset.
     * @param count
     *            - count or limit to number of emails.
     * @return String
     */
    public static String getOfficeURL(AgileUser agileUser, String fromEmail, String searchEmail, String offset,
	    String count)
    {
	// Get Office Exchange Prefs
	Objectify ofy = ObjectifyService.begin();
	OfficeEmailPrefs officePrefs = ofy.query(OfficeEmailPrefs.class).filter("user_name", fromEmail).get();

	if (officePrefs == null)
	    return null;

	return ContactOfficeUtil.getOfficeURLForPrefs(officePrefs, searchEmail, offset, count);
    }

    /**
     * Returns Office url
     * 
     * @param officePrefs
     *            - OfficeEmailPrefs
     * @param searchEmail
     *            - email
     * @param offset
     *            - offset
     * @param count
     *            - emails count
     * @return String
     */

    public static String getOfficeURLForPrefs(OfficeEmailPrefs OfficePrefs, String searchEmail, String offset,
	    String count)
    {

	String userName = OfficePrefs.user_name;
	String host = OfficePrefs.server_url;
	String password = OfficePrefs.password;

	String protocal = "http://";
	if (OfficePrefs.is_secure)
	    protocal = "https://";

	String url = null;

	String namespace = NamespaceManager.get();

	if (StringUtils.isBlank(namespace))
	    namespace = "localhost";

	try
	{
	    url = "http://54.87.153.50:8080/exchange-app/exchange?user_name=" + URLEncoder.encode(userName, "UTF-8")
		    + "&search_email=" + searchEmail + "&host=" + URLEncoder.encode(protocal + host, "UTF-8")
		    + "&offset=" + offset + "&count=" + count + "&password=" + URLEncoder.encode(password, "UTF-8")
		    + "&domain=" + URLEncoder.encode(namespace, "UTF-8");
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in getOfficeURLForPrefs " + e.getMessage());
	    e.printStackTrace();
	}

	return url;
    }

    public static void main(String[] args) throws Exception
    {
	String namespace = "";
	String s = URLEncoder.encode(namespace, "UTF-8");
	System.out.println(s);
	System.out.println("Hello");
    }

}
