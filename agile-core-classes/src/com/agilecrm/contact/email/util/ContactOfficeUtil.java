package com.agilecrm.contact.email.util;

import java.net.URLEncoder;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.OfficeEmailPrefs;
import com.agilecrm.user.util.OfficeEmailPrefsUtil;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
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
	List<OfficeEmailPrefs> officePrefs = OfficeEmailPrefsUtil.getOfficePrefsList(agileUser);

	if (officePrefs == null || officePrefs.size() <= 0)
	    return null;

	return ContactOfficeUtil.getOfficeURLForPrefs(officePrefs.get(0), searchEmail, offset, count, "");
    }

    /**
     * Returns url to fetch emails with respect to "fromemail" office account.
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
    public static String getOfficeURL(String fromEmail, String searchEmail, String offset, String count)
    {
	// Get Office Exchange Prefs
	Objectify ofy = ObjectifyService.begin();
	OfficeEmailPrefs officePrefs = ofy.query(OfficeEmailPrefs.class).filter("user_name", fromEmail).get();

	if (officePrefs == null)
	    return null;

	String fetchItems = "mails";
	
	return ContactOfficeUtil.getOfficeURLForPrefs(officePrefs, searchEmail, offset, count, fetchItems);
    }
    
    /**
     * Returns url to fetch emails with respect to "fromemail" office account.
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
    public static String getNewOfficeURL(String fromEmail, String folder_name, String offset, String count,String search_content,String falg,String messageid)
    {
	// Get Office Exchange Prefs
	Objectify ofy = ObjectifyService.begin();
	OfficeEmailPrefs officePrefs = ofy.query(OfficeEmailPrefs.class).filter("user_name", fromEmail).get();

	if (officePrefs == null)
	    return null;

	return ContactOfficeUtil.geNewtOfficeURLForPrefs(officePrefs, folder_name, offset, count, search_content, falg, messageid);
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
	    String count, String fetch_items)

    {

	String userName = OfficePrefs.user_name;
	String host = OfficePrefs.server_url;
	String password = OfficePrefs.password;
	List<String> folderList = OfficePrefs.folders;
	String foldersString = "";

	String protocal = "http://";
	if (OfficePrefs.is_secure)
	    protocal = "https://";
	
	if (folderList != null && fetch_items.equalsIgnoreCase("mails"))
	{
	    StringBuffer buffer = new StringBuffer();
	    for (int i = 0; i < folderList.size(); i++)
	    {
		buffer.append(folderList.get(i));
		if (i < folderList.size() - 1)
		    buffer.append(",");
	    }
	    foldersString = buffer.toString();
	    
	    if(foldersString != null && 
	    		(foldersString.equalsIgnoreCase("{\"default_folders\":[\"AllItems\"]}") || foldersString.equalsIgnoreCase("All Mail"))){
	    	foldersString = "";
	    }
	}
	
	String applicationId = SystemProperty.applicationId.get();

	System.out.println("Application id is " + applicationId);

	String hostUrl = "http://54.87.153.50:8080/exchange-app";
	
	if (StringUtils.equals(applicationId, "agilecrmbeta"))
		hostUrl = "http://54.87.153.50:8080/exchange-app-beta";
	
	String url = null;

	String namespace = NamespaceManager.get();

	if (StringUtils.isBlank(namespace))
	    namespace = "localhost";

	try
	{
		if(fetch_items.equalsIgnoreCase("mails"))
		{
			url  = 	hostUrl+"/exchange?user_name=" + URLEncoder.encode(userName, "UTF-8")
					+ "&search_email=" + searchEmail + "&host=" + URLEncoder.encode(protocal + host, "UTF-8")
				    + "&offset=" + offset + "&count=" + count + "&password=" + URLEncoder.encode(password, "UTF-8")
				    + "&domain=" + URLEncoder.encode(namespace, "UTF-8") + "&fetch_items=mails&folder_names=" + URLEncoder.encode(foldersString, "UTF-8");;
		}
		else if(fetch_items.equalsIgnoreCase("folders"))
		{
			url  = 	hostUrl+"/exchange?user_name=" + URLEncoder.encode(userName, "UTF-8")
					+ "&search_email=" + searchEmail + "&host=" + URLEncoder.encode(protocal + host, "UTF-8")
				    + "&offset=" + offset + "&count=" + count + "&password=" + URLEncoder.encode(password, "UTF-8")
				    + "&domain=" + URLEncoder.encode(namespace, "UTF-8") + "&fetch_items=folders";
		}
		else
		{
			url  = 	hostUrl+"/exchange?user_name=" + URLEncoder.encode(userName, "UTF-8")
					+ "&search_email=" + searchEmail + "&host=" + URLEncoder.encode(protocal + host, "UTF-8")
				    + "&offset=" + offset + "&count=" + count + "&password=" + URLEncoder.encode(password, "UTF-8")
				    + "&domain=" + URLEncoder.encode(namespace, "UTF-8") + "&fetch_items=default_folders";
		}
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in getOfficeURLForPrefs " + e.getMessage());
	    e.printStackTrace();
	}

	return url;
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

    public static String geNewtOfficeURLForPrefs(OfficeEmailPrefs OfficePrefs, String foldername, String offset, String count,String search_content,String flag,  String messageid){

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
		//http://54.87.153.50:8080/exchange-app-beta/inbox-exchange
		//http://localhost:8080/DemoProject/inboxexchange
		
		if(flag != null && !flag.equals("") && flag != ""){
			url = "http://54.87.153.50:8080/exchange-app-beta/inbox-exchange?user_name=" + URLEncoder.encode(userName, "UTF-8")
				    + "&foldername=" + foldername + "&host=" + URLEncoder.encode(protocal + host, "UTF-8")
				    + "&offset=" + offset + "&count=" + count + "&password=" + URLEncoder.encode(password, "UTF-8")
				    + "&domain=" + URLEncoder.encode(namespace, "UTF-8")+"&flag="+URLEncoder.encode(flag)+"&mesnum="+URLEncoder.encode(messageid);
		}else{
		    url = "http://54.87.153.50:8080/exchange-app-beta/inbox-exchange?user_name=" + URLEncoder.encode(userName, "UTF-8")
			    + "&foldername=" + foldername + "&host=" + URLEncoder.encode(protocal + host, "UTF-8")
			    + "&offset=" + offset + "&count=" + count + "&password=" + URLEncoder.encode(password, "UTF-8")
			    + "&domain=" + URLEncoder.encode(namespace, "UTF-8")+ "&search_content="+ URLEncoder.encode(search_content);
		}
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in getOfficeURLForPrefs " + e.getMessage());
	    e.printStackTrace();
	}

	return url;
    }

	public static String getOfficeURLForFetchingDefaultFolders(OfficeEmailPrefs officeEmailPrefs) {
		// TODO Auto-generated method stub
		if (officeEmailPrefs == null)
		    return null;
		return ContactOfficeUtil.getOfficeURLForPrefs(officeEmailPrefs, "info@agilecrm.com", "0", "1", "default_folders");
	}

	public static JSONArray getOfficeFoldersFromServer(String officeURL) {
		// TODO Auto-generated method stub
		JSONArray foldersArray = null;
		try
		{
		    // Returns imap folders, usually in form of {folders:[]}, if not
		    // build result like that.
		    String jsonResult = HTTPUtil.accessURL(officeURL);
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

	public static String getOfficeURLForFetchingFolders(OfficeEmailPrefs officeEmailPrefs, String fetchItems) {
		if (officeEmailPrefs == null)
		    return null;

		return ContactOfficeUtil.getOfficeURLForPrefs(officeEmailPrefs, "info@agilecrm.com", "0", "1", fetchItems);
	}

	

}
