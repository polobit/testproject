package com.agilecrm.web.stats;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import static com.googlecode.objectify.ObjectifyService.ofy;

/**
 * <code>AnalyticsUtil</code> is the utility class for Analytics. It merges page
 * views based on sessions. It combines the urls with their timespent.
 * 
 */
public class StatsUtil
{
    
    public static final String STATS_SEREVR_HTTP_REQUEST_PWD = "blAster432";
    
    public static void insertPageVisit(HttpServletRequest req, HttpServletResponse res) throws IOException
    {
	// Domain
	// String domain = NamespaceManager.get();
	String domain = req.getParameter("domain");
	
	// Differentiates clients (browsers).
	String guid = req.getParameter("guid");
	
	// Session Id.
	String sid = req.getParameter("sid");
	
	// Request URL
	String url = req.getParameter("url");
	
	// Email if set in cookie. Removes trailing spaces if exists.
	String email = req.getParameter("email");
	
	// Trim
	email = StringUtils.trim(email);
	
	// Client IP Address
	String ip = getClientIP(req);
	System.out.println("Client IP is " + ip);
	
	// For New Session
	String isNew = null;
	
	// Reference URL
	String ref = null;
	
	// UserAgent to know browser, OS etc
	String userAgent = req.getHeader("User-Agent");
	
	// AppEngine Headers
	String country = req.getHeader("X-AppEngine-Country");
	String region = req.getHeader("X-AppEngine-Region");
	String city = req.getHeader("X-AppEngine-City");
	String cityLatLong = req.getHeader("X-AppEngine-CityLatLong");
	
	// If new session only, we get new and ref as query params.
	if (!StringUtils.isEmpty(req.getParameter("new")))
	{
	    isNew = req.getParameter("new");
	    ref = req.getParameter("ref");
	    
	    // If ref is empty
	    if (StringUtils.isEmpty(ref))
		ref = null;
	}
	
	if (StringUtils.isBlank(isNew))
	    isNew = "0";
	
	// if domain is empty, avoid adding to SQL.
	if (StringUtils.isBlank(domain))
	    return;
	
	if (isBlockedIp(ip, domain))
	    return;
	
	Long timeBeforeLog = System.currentTimeMillis();
	System.out.println("Before log " + timeBeforeLog);
	
	// Insert into table
	StatsSQLUtil.addToPageViews(domain, guid, email, sid, url, ip, isNew, ref, userAgent, country, region, city,
		cityLatLong);
	
	Long timeAfterLog = System.currentTimeMillis();
	System.out.println("After log " + timeAfterLog + " Diff " + (timeAfterLog - timeBeforeLog));
	
	// Show notification with url
	if (StringUtils.isNotBlank(email) && !StringUtils.equals(email, "null"))
	{
	    JSONObject json = new JSONObject();
	    try
	    {
		// If not null or empty - remove query params from urls
		if (!StringUtils.isEmpty(url))
		    url = StringUtils.split(url, '?')[0];
		json.put("custom_value", url);
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	    timeBeforeLog = System.currentTimeMillis();
	    System.out.println("Before log " + timeBeforeLog);
	    
	    sendNotification(domain, "IS_BROWSING", email, json);
	    
	    timeAfterLog = System.currentTimeMillis();
	    System.out.println("After log " + timeAfterLog + " Diff " + (timeAfterLog - timeBeforeLog));
	}
    }
    
    public static Boolean isBlockedIp(String clientIp, String domain)
    {
	try
	{
	    StatsAccess statsAccess = null;
	    statsAccess = ofy().load().type(StatsAccess.class).filter("domain", domain).first().now();
	    String[] blockedIps = statsAccess.blocked_ips.split(",");
	    
	    for (int i = 0; i < blockedIps.length; i++)
	    {
		if (ipMatch(clientIp, blockedIps[i].trim()))
		    return true;
	    }
	    return false;
	}
	catch (Exception e)
	{
	    return false;
	}
    }
    
    public static Boolean ipMatch(String clientIp, String blockedIp)
    {
	String[] clientIpTokens = clientIp.split("\\.");
	String[] blockedIpTokens = blockedIp.split("\\.");
	for (int i = 0; i < clientIpTokens.length; i++)
	{
	    if (!(StringUtils.equals("*", blockedIpTokens[i]) || StringUtils.equals(clientIpTokens[i],
		    blockedIpTokens[i])))
		return false;
	}
	return true;
    }
    
    /**
     * This method responsible for sending pubnub message when contact browsing
     * our customer web site. We will show this message as noty message when
     * customer browsing his agilecrm domain.
     * 
     * @param domain
     * @param type
     * @param email
     * @param customValue
     */
    public static void sendNotification(String domain, String type, String email, JSONObject customValue)
    {
	JSONObject json = new JSONObject();
	json.put("custom_value", customValue.get("custom_value"));
	json.put("type", type);
	json.put("email", email);
	PubNub.pubNubPush(domain, json);
    }
    
    /**
     * Gets client IP address using request header 'X-Forwarded-For'. If it is
     * not empty, gets ip address from forwarded ip, otherwise gets remote
     * address.
     * 
     * @param req
     *            - HttpRequest
     * @return ip address string.
     */
    public static String getClientIP(HttpServletRequest req)
    {
	String ipAddress = null;
	
	/*
	 * String forwardedIpsStr = req.getHeader("X-Forwarded-For");
	 * 
	 * // Check if forwardedIps not empty if
	 * (!StringUtils.isEmpty(forwardedIpsStr)) { // 'x-forwarded-for' header
	 * may return multiple IP addresses in // the format:
	 * "client IP, proxy 1 IP, proxy 2 IP" so take the // the first one
	 * String[] forwardedIps = forwardedIpsStr.split(","); ipAddress =
	 * forwardedIps[0]; }
	 * 
	 * // If ipAddress is empty, get remote address if
	 * (StringUtils.isEmpty(ipAddress)) ipAddress = req.getRemoteAddr();
	 */
	
	ipAddress = req.getRemoteAddr();
	
	return ipAddress;
    }
    
    /**
     * Merges pagesViews based on session-ids. Mostly urls are different having
     * same session-ids. So it merges all urls separated by commas having same
     * session-ids into one single json-object.
     * 
     * @param pageViews
     *            - pageViews.
     * @return JSONArray
     */
    public static JSONArray mergePageViewsBasedOnSessions(JSONArray pageViews)
    {
	if (pageViews == null)
	    return null;
	
	// Merge pages based on sid.
	Map<String, JSONObject> mergedPageViewsMap = new LinkedHashMap<String, JSONObject>();
	
	// JSONArray with {url:'url', time_spent:'seconds'}
	JSONArray urlsWithTimeSpent = new JSONArray();
	
	// Groups urlsWithTimeSpent JSONArray with respect to sid.
	Map<String, JSONArray> pageSpentWithSid = new LinkedHashMap<String, JSONArray>();
	
	JSONArray tempJSONArray = new JSONArray();
	
	try
	{
	    // Iterates over pageViews
	    for (int i = 0, len = pageViews.length(); i < len; i++)
	    {
		JSONObject currentPageView = pageViews.getJSONObject(i);
		
		String currentSid = currentPageView.getString("sid");
		
		String currentUrl = currentPageView.getString("url");
		
		// If not null or empty - remove query params from urls
		if (!StringUtils.isEmpty(currentUrl))
		    currentUrl = StringUtils.split(currentUrl, '?')[0];
		
		// Retrieves timeSpent of url by subtracting time from next
		// consecutive url.
		if (i < (len - 1))
		{
		    JSONObject nextPageView = pageViews.getJSONObject(i + 1);
		    String nextSid = nextPageView.getString("sid");
		    
		    // Need urls with timespent of same session.
		    if (currentSid.equals(nextSid))
		    {
			long timeSpent = Long.parseLong(nextPageView.getString("created_time"))
				- Long.parseLong(currentPageView.getString("created_time"));
			
			// [{url:'http://agilecrm.com',timeSpent:'total_secs'}]
			urlsWithTimeSpent.put(new JSONObject().put("url", currentUrl).put("time_spent", timeSpent));
		    }
		    else
		    {
			// By Default we are assuming timespent of last url in a
			// session to be 10secs
			urlsWithTimeSpent.put(new JSONObject().put("url", currentUrl).put("time_spent", 10L));
			tempJSONArray = urlsWithTimeSpent;
			
			// Reset JSONArray after end of session.
			urlsWithTimeSpent = new JSONArray();
		    }
		    
		    // Adds jsonArray with sid
		    pageSpentWithSid.put(currentSid, tempJSONArray);
		}
		
		else
		{
		    // inserts last row of pageViews with default timespent
		    // 10secs.
		    pageSpentWithSid.put(currentSid,
			    urlsWithTimeSpent.put(new JSONObject().put("url", currentUrl).put("time_spent", 10L)));
		}
		
		// Verify for sid and updates respective sid JSONObject
		if (!mergedPageViewsMap.containsKey(currentSid))
		{
		    currentPageView.put("urls_with_time_spent", pageSpentWithSid.get(currentSid).toString());
		    
		    // Insert new session
		    mergedPageViewsMap.put(currentSid, currentPageView);
		}
		else
		{
		    JSONObject sessionJSON = mergedPageViewsMap.get(currentSid);
		    
		    // Inserts last row's stats_time and created_time of that
		    // session
		    sessionJSON.put("stats_time", currentPageView.getString("stats_time"));
		    
		    // Stats epoch time
		    sessionJSON.put("created_time", currentPageView.getString("created_time"));
		    
		    sessionJSON.put("urls_with_time_spent", pageSpentWithSid.get(currentSid).toString());
		    mergedPageViewsMap.put(currentSid, sessionJSON);
		}
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in AnalyticsUtil " + e.getMessage());
	}
	
	// Return JSONArray of merged map values
	return new JSONArray(mergedPageViewsMap.values());
    }
    
    /**
     * Verifies whether domain having any web stats
     * 
     * @return boolean
     */
    // public static boolean hasJSAPIForDomain()
    // {
    // JSONArray pageViews = AnalyticsSQLUtil1.getLimitedPageViews(5);
    //
    // if (pageViews != null && pageViews.length() > 0)
    // return true;
    //
    // return false;
    //
    // }
    
    /***
     * Converts String into integer value. If error occurs it puts default
     * integer value
     * 
     * @param value
     * @param defaultValue
     * @return
     */
    public static int getIntegerValue(String value, int defaultValue)
    {
	int result = defaultValue;
	if (StringUtils.isNotBlank(value))
	{
	    try
	    {
		result = Integer.parseInt(value);
	    }
	    catch (Exception e)
	    {
		result = defaultValue;
		return result;
	    }
	}
	return result;
    }
    
    /**
     * Sends servlet response to the client. Response format is JSON
     * 
     * @param request
     * @param response
     * @param responseJSON
     * @throws Exception
     */
    public static void sendResponse(HttpServletRequest httpRequest, HttpServletResponse httpResponse, String response)
    {
	try
	{
	    
	    PrintWriter out = httpResponse.getWriter();
	    out.println(response);
	    out.close();
	    
	}
	catch (Exception e)
	{
	    try
	    {
		System.out.println(e.getMessage());
		PrintWriter out = httpResponse.getWriter();
		out.println(e.getMessage());
		out.close();
	    }
	    catch (Exception e1)
	    {
		System.out.println(e.getMessage());
	    }
	}
    }
    
    /**
     * This method vaildates the http request
     * 
     * @param password
     * @return
     */
    public static boolean isValidRequest(String password)
    {
	boolean result = false;
	if (StringUtils.isNotBlank(STATS_SEREVR_HTTP_REQUEST_PWD) && password.equals("blAster432"))
	{
	    result = true;
	}
	return result;
    }
    
    /**
     * Responsible for reading data from http post request and converts data
     * into map object
     * 
     * @param req
     * @return
     * @throws Exception
     */
    public static Map<String, String> readPostData(HttpServletRequest req) throws Exception
    {
	StringBuilder stringBuilder = new StringBuilder();
	Map<String, String> params = new LinkedHashMap<String, String>();
	try
	{
	    BufferedReader bufferedReader = req.getReader();
	    if (bufferedReader != null)
	    {
		char[] charBuffer = new char[128];
		int bytesRead = -1;
		while ((bytesRead = bufferedReader.read(charBuffer)) > 0)
		{
		    stringBuilder.append(charBuffer, 0, bytesRead);
		}
	    }
	    else
		stringBuilder.append("");
	    
	    String[] paramsArray = stringBuilder.toString().split("&");
	    for (int i = 0; i < paramsArray.length; i++)
	    {
		String param = URLDecoder.decode(paramsArray[i], "UTF-8");
		String[] paramSplit = param.split("=");
		params.put(paramSplit[0], paramSplit[1]);
	    }
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	    return null;
	}
	return params;
    }
    
}
