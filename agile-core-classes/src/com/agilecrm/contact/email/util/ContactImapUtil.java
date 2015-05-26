package com.agilecrm.contact.email.util;

import java.net.URLEncoder;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.IMAPEmailPrefs;
import com.agilecrm.user.util.IMAPEmailPrefsUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.utils.SystemProperty;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

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
	List<IMAPEmailPrefs> imapPrefsList = IMAPEmailPrefsUtil.getIMAPPrefsList(agileUser);

	if (imapPrefsList == null || imapPrefsList.size() <= 0)
	    return null;

	String fetchItems = "mails";

	return ContactImapUtil.getIMAPURLForPrefs(imapPrefsList.get(0), fetchItems, searchEmail, offset, count);
    }

    /**
     * Returns url to fetch emails from given "from-email" imap account.
     * 
     * @param fromEmail
     *            - imapPrefs userName
     * 
     * @param searchEmail
     *            - search email-id.
     * @param offset
     *            - offset.
     * @param count
     *            - count or limit to number of emails.
     * @return String
     */
    public static String getIMAPURL(String fromEmail, String searchEmail, String offset, String count)
    {
	// Fetching ImapPrefs
	Objectify ofy = ObjectifyService.begin();
	IMAPEmailPrefs imapPrefs = ofy.query(IMAPEmailPrefs.class).filter("user_name", fromEmail).get();
	if (imapPrefs == null)
	    return null;

	String fetchItems = "mails";

	return ContactImapUtil.getIMAPURLForPrefs(imapPrefs, fetchItems, searchEmail, offset, count);

    }

    /**
     * Fetches IMAP mail server all folders
     * 
     * @param agileUser
     * @param fetchItems
     * @return
     */
    public static String getIMAPURLForFetchingFolders(IMAPEmailPrefs imapPrefs, String fetchItems)
    {
	if (imapPrefs == null)
	    return null;

	return ContactImapUtil.getIMAPURLForPrefs(imapPrefs, fetchItems, null, null, null);
    }

    /**
     * Fetches IMAP mail server default folders
     * 
     * @param agileUser
     * @param fetchItems
     * @return
     */
    public static String getIMAPURLForFetchingDefaultFolders(IMAPEmailPrefs imapPrefs)
    {
	if (imapPrefs == null)
	    return null;
	return ContactImapUtil.getIMAPURLForPrefs(imapPrefs, "default_folders", null, null, null);
    }

    /**
     * 
     * @param url
     * @return
     */
    public static JSONArray getIMAPFoldersFromServer(String url)
    {
	JSONArray foldersArray = null;
	try
	{
	    // Returns imap folders, usually in form of {folders:[]}, if not
	    // build result like that.
	    String jsonResult = HTTPUtil.accessURL(url);
	    // Convert folders to json.
	    JSONObject folders = ContactEmailUtil.convertFoldersToJSON(jsonResult);
	    // Fetches JSONArray from {folders:[]}
	    foldersArray = folders.getJSONArray("folders");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    return null;
	}
	return foldersArray;
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

    public static String getIMAPURLForPrefs(IMAPEmailPrefs imapPrefs, String fetch_items, String searchEmail,
	    String offset, String count)
    {

	String userName = imapPrefs.user_name;
	String host = imapPrefs.server_name;
	String password = imapPrefs.password;
	List<String> folderList = imapPrefs.folders;
	String foldersString = "";

	String port = "143";
	if (imapPrefs.is_secure)
	    port = "993";

	String url = null;

	String hostUrl = "https://agile-imap.appspot.com";

	String applicationId = SystemProperty.applicationId.get();

	System.out.println("Application id is " + applicationId);

	if (folderList != null)
	{
	    StringBuffer buffer = new StringBuffer();
	    for (int i = 0; i < folderList.size(); i++)
	    {
		buffer.append(folderList.get(i));
		if (i < folderList.size() - 1)
		    buffer.append(",");
	    }
	    foldersString = buffer.toString();
	}

	if (StringUtils.equals(applicationId, "agilecrmbeta"))
	    hostUrl = "https://naresh-dot-imap-dot-agilecrmbeta.appspot.com";

	try
	{
	    if (fetch_items.equalsIgnoreCase("mails"))
	    {
		url = hostUrl + "/imap?user_name=" + URLEncoder.encode(userName, "UTF-8") + "&search_email="
		        + searchEmail + "&host=" + URLEncoder.encode(host, "UTF-8") + "&port="
		        + URLEncoder.encode(port, "UTF-8") + "&offset=" + offset + "&count=" + count
		        + "&command=imap_email&fetch_items=mails&password=" + URLEncoder.encode(password, "UTF-8")
		        + "&folder_names=" + URLEncoder.encode(foldersString, "UTF-8");
	    }
	    else if (fetch_items.equalsIgnoreCase("folders"))
	    {
		url = hostUrl + "/imap?user_name=" + URLEncoder.encode(userName, "UTF-8") + "&host="
		        + URLEncoder.encode(host, "UTF-8") + "&port=" + URLEncoder.encode(port, "UTF-8")
		        + "&fetch_items=folders&password=" + URLEncoder.encode(password, "UTF-8");
	    }
	    else
	    {
		url = hostUrl + "/imap?user_name=" + URLEncoder.encode(userName, "UTF-8") + "&host="
		        + URLEncoder.encode(host, "UTF-8") + "&port=" + URLEncoder.encode(port, "UTF-8")
		        + "&fetch_items=default_folders&password=" + URLEncoder.encode(password, "UTF-8");
	    }
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in getIMAPURLForPrefs " + e.getMessage());
	    e.printStackTrace();
	}
	return url;
    }

}
