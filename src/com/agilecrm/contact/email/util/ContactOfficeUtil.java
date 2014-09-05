package com.agilecrm.contact.email.util;

import java.net.URLEncoder;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.OfficeEmailPrefs;
import com.agilecrm.user.util.OfficeEmailPrefsUtil;

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

		try
		{
			url = "http://54.87.153.50:8080/exchange-app/exchange?user_name="
					+ URLEncoder.encode(userName, "UTF-8") + "&search_email=" + searchEmail + "&host="
					+ URLEncoder.encode(protocal + host, "UTF-8") + "&offset=" + offset + "&count=" + count
					+ "&password=" + URLEncoder.encode(password, "UTF-8");
		}
		catch (Exception e)
		{
			System.err.println("Exception occured in getOfficeURLForPrefs " + e.getMessage());
			e.printStackTrace();
		}

		return url;
	}

}
