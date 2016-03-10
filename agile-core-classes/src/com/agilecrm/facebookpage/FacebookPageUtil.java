package com.agilecrm.facebookpage;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.googlecode.objectify.Query;

public class FacebookPageUtil
{
    // get these from your FB Dev App
    private static final String APP_ID = Globals.FACEBOOK_APP_ID;
    private static final String APP_SECRET = Globals.FACEBOOK_APP_SECRET;
    private static final String FB_END_POINT = "https://graph.facebook.com";
    private static final String FB_API_VERSION = "/v2.3";

    // set this to your servlet URL for the authentication servlet/filter (this
    // is used for local test)
    private static String redirect_uri = "https://my.agilecrm.com/backend/googleservlet";
    private static String state = "http://localhost:8888/fbpagecallback";
    
    // / set this to the list of extended permissions you want
    private static final String[] scopes = new String[] { "public_profile", "email", "manage_pages" };

    public static String getAPPID()
    {
	return APP_ID;
    }

    public static String getAPPSecret()
    {
	return APP_SECRET;
    }

    public static String getLoginRedirectURL()
    {
	setProductionCallbackURL();
	return FB_END_POINT + "/oauth/authorize?client_id=" + APP_ID + "&display=page&scope=" + StringUtils.join(scopes, ',') + "&redirect_uri=" + redirect_uri + "&state=" + state;
    }

    public static String getAuthURL(String authCode)
    {
	setProductionCallbackURL();
	return FB_END_POINT + "/oauth/access_token?client_id=" + APP_ID + "&redirect_uri=" + redirect_uri + "&client_secret=" + APP_SECRET + "&code="
		+ authCode;
    }

    public static void setProductionCallbackURL()
    {
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
	{
		state = "https://" + NamespaceManager.get() +  ".agilecrm.com/fbpagecallback";		
		//state = "https://" + NamespaceManager.get() + "-dot-17-7-dot-agile-crm-cloud.appspot.com/fbpagecallback";
	}
    }

    public static String getAccessToken(String code) throws UnsupportedEncodingException
    {
	String response = HttpRequest(getAuthURL(code));
	Map<String, String> queryPairs = new LinkedHashMap<String, String>();
	String[] pairs = response.split("&");
	for (String pair : pairs)
	{
	    int idx = pair.indexOf("=");
	    try {
	    	queryPairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
		} catch (StringIndexOutOfBoundsException e) {
			return "";
		}
	}

	return queryPairs.get("access_token").trim();
    }

    public static List<Map<String, String>> getUserPages(String accessToken) throws JSONException
    {
	String response = HttpRequest(FB_END_POINT + FB_API_VERSION + "/me/accounts?access_token=" + accessToken + "&limit=100");
	JSONObject accounts = new JSONObject(response);

	List<Map<String, String>> listOfpages = new ArrayList<Map<String, String>>();

	JSONArray pages = accounts.getJSONArray("data");
	int noOfPages = pages.length();
	for (int i = 0; i < noOfPages; i++)
	{
	    JSONObject page = pages.getJSONObject(i);
	    String perms = page.getString("perms");
	    if (perms.contains("ADMINISTER"))
	    {
		Map<String, String> pagesInfo = new LinkedHashMap<String, String>();
		pagesInfo.put("id", page.getString("id"));
		pagesInfo.put("name", page.getString("name"));
		pagesInfo.put("access_token", page.getString("access_token"));
		listOfpages.add(pagesInfo);
	    }
	}

	return listOfpages;
    }
    
    public static JSONObject getUserInfo(String accessToken) throws JSONException
    {
	String response = HttpRequest(FB_END_POINT + FB_API_VERSION + "/me?access_token=" + accessToken);
	JSONObject userInfo = new JSONObject(response);
	return userInfo;
    }

    public static boolean linkOurFacebookTab(String pageID, String accessToken, String formName) throws JSONException, UnsupportedEncodingException
    {
	String response = HttpRequest(FB_END_POINT + FB_API_VERSION + "/" + pageID + "/tabs?app_id=" + APP_ID + "&method=post&access_token=" + accessToken);
	JSONObject responseObj = new JSONObject(response);
	boolean status = responseObj.getBoolean("success");
	if (status)
	{
	    formName = formName.replaceAll("[()?:!.,;@/\\{}]+", "");
	    HttpRequest(FB_END_POINT + FB_API_VERSION + "/" + pageID + "/tabs/app_" + APP_ID + "?custom_name=" + URLEncoder.encode(formName, "UTF-8")
		    + "&method=post&access_token=" + accessToken);
	}
	return status;
    }
    
    public static boolean deleteOurFacebookTab(String pageID, String accessToken) throws JSONException
    {
	String response = HttpRequest(FB_END_POINT + FB_API_VERSION + "/" + pageID + "/tabs/app_" + APP_ID + "?method=delete&access_token=" + accessToken);
	JSONObject responseObj = new JSONObject(response);
	boolean status = responseObj.getBoolean("success");
	return status;
    }

    public static String HttpRequest(String url)
    {
	URL URL;
	try
	{
	    URL = new URL(url);
	    System.out.println(url);
	}
	catch (MalformedURLException e)
	{
	    e.printStackTrace();
	    throw new RuntimeException("Invalid URL " + e);
	}
	URLConnection connection;
	StringBuffer b = null;
	try
	{
	    connection = URL.openConnection();
	    BufferedReader in;
	    in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
	    String inputLine;
	    b = new StringBuffer();
	    while ((inputLine = in.readLine()) != null)
		b.append(inputLine + "\n");
	    in.close();
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	    throw new RuntimeException("Unable to connect " + e);
	}

	return b.toString();
    }

    public static FacebookPage getFacebookPageDetails(String pageID)
    {
	if (StringUtils.isBlank(pageID))
	    return null;
	
	Query<FacebookPage> q = null;
	String oldNameSpace = NamespaceManager.get();
	NamespaceManager.set("");
	
	try
	{
		ObjectifyGenericDao<FacebookPage> dao = new ObjectifyGenericDao<FacebookPage>(FacebookPage.class);
		q = dao.ofy().query(FacebookPage.class);
		q.filter("page_id", pageID);
	}
	finally
	{
		NamespaceManager.set(oldNameSpace);
	}
	
	return q.get();
    }

    public static List<Map<String, String>> getLinkedFacebookPages(String domain)
    {
    if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
    	if (StringUtils.isBlank(domain))
    	    return null;
	
	List<FacebookPage> facebookPages = null;
	
	try
	{
		NamespaceManager.set("");
		ObjectifyGenericDao<FacebookPage> dao = new ObjectifyGenericDao<FacebookPage>(FacebookPage.class);
		Query<FacebookPage> q = dao.ofy().query(FacebookPage.class);
		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
		{
			q.filter("domain", domain);
		}
		facebookPages = q.list();
	}
	finally
	{
		NamespaceManager.set(domain);
	}

	List<Map<String, String>> listOfpages = new ArrayList<Map<String, String>>();
	
	if(facebookPages != null) {
		for (Iterator<FacebookPage> iterator = facebookPages.iterator(); iterator.hasNext();)
		{
		    FacebookPage facebookPage = (FacebookPage) iterator.next();
		    Map<String, String> pagesInfo = new LinkedHashMap<String, String>();
		    pagesInfo.put("form_id", facebookPage.form_id);
		    pagesInfo.put("form_name", facebookPage.form_name);
		    pagesInfo.put("page_id", facebookPage.page_id);
		    pagesInfo.put("page_name", facebookPage.page_name);
		    listOfpages.add(pagesInfo);
		}
	}

	return listOfpages;

    }

}