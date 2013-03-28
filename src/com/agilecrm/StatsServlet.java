package com.agilecrm;

import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.googlesql.GoogleSQL;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>StatsServlet</code> handles page-views analytics. It will store the
 * query parameters into google cloud sql.
 * 
 * @author Naresh
 * 
 */
public class StatsServlet extends HttpServlet
{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {
	doPost(request, response);
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res)
	    throws IOException
    {
	// Domain
	String domain = NamespaceManager.get();

	System.out.println("Namespace in StatsServlet: " + domain);

	String guid = req.getParameter("guid");
	String sid = req.getParameter("sid");
	String url = req.getParameter("url");

	String ip = null;
	String newOne = null;
	String ref = null;
	String userAgent = null;
	String appHeaderJson = null;

	// If new
	if (!StringUtils.isEmpty(req.getParameter("new")))
	{
	    newOne = req.getParameter("new");
	    ref = req.getParameter("ref");
	    ip = getClientIP(req);

	    // Get Visitor Info
	    userAgent = req.getHeader("User-Agent");

	    // App-Engine Headers
	    String country = req.getHeader("X-AppEngine-Country");
	    String region = req.getHeader("X-AppEngine-Region");
	    String city = req.getHeader("X-AppEngine-City");
	    String cityLatLong = req.getHeader("X-AppEngine-CityLatLong");

	    // Add app-engine headers to json
	    appHeaderJson = addAppEngineHeadersToJSON(country, region, city,
		    cityLatLong);

	}

	// Get request time
	Date date = new Date();
	long reqTime = date.getTime() / 1000;

	// Insert into table
	addToPageViews(domain, guid, sid, url, ip, newOne, ref, userAgent,
		appHeaderJson, reqTime);

	// If email
	if (!StringUtils.isEmpty(req.getParameter("email")))
	{
	    String gUid = req.getParameter("guid");
	    String email = req.getParameter("email");

	    // Add to map
	    addToMap(domain, gUid, email);
	}
    }

    /**
     * Gets client IP address using request header 'x-forwarded-for'. If it is
     * not empty, gets ip address from forwarded ip, otherwise gets remote
     * address.
     * 
     * @param req
     *            - HttpRequest
     * @return ip address string.
     */
    private static String getClientIP(HttpServletRequest req)
    {
	String ipAddress = null;

	String forwardedIpsStr = req.getHeader("x-forwarded-for");

	// Check if forwardedIps not empty
	if (!StringUtils.isEmpty(forwardedIpsStr))
	{
	    // 'x-forwarded-for' header may return multiple IP addresses in
	    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
	    // the first one
	    String[] forwardedIps = forwardedIpsStr.split(",");
	    ipAddress = forwardedIps[0];
	}

	// If ipAddress is empty, get remote address
	if (StringUtils.isEmpty(ipAddress))
	    ipAddress = req.getRemoteAddr();

	return ipAddress;
    }

    /**
     * Updates domain, guid and email in map table.
     * 
     * @param domain
     *            - current namespace.
     * @param guid
     *            - guid.
     * @param email
     *            - email
     */
    private static void addToMap(String domain, String guid, String email)
    {
	String insertToMap = "INSERT INTO map (domain,guid,email) VALUES(\'"
		+ domain + "\'," + guid + "," + email + ")";

	System.out.println("insertToMap query: " + insertToMap);

	try
	{
	    GoogleSQL.executeNonQuery(insertToMap);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Inserts values into page_views table
     * 
     * @param domain
     *            - current namespace.
     * @param guid
     *            - guid.
     * @param sid
     *            - sid.
     * @param url
     *            - url.
     * @param ip
     *            - ip address.
     * @param newOne
     *            - if new
     * @param ref
     *            -reference.
     * @param userAgent
     *            - userAgent header.
     * @param appHeader
     *            - appengine header values.
     * @param time
     *            - requested time.
     */
    private static void addToPageViews(String domain, String guid, String sid,
	    String url, String ip, String newOne, String ref, String userAgent,
	    String appHeader, long time)
    {
	String insertToPageViews = "INSERT INTO page_views (domain,guid,sid,url,ip,new_one,ref,user_agent,app_header,time) VALUES(\'"
		+ domain
		+ "\',"
		+ guid
		+ ","
		+ sid
		+ ","
		+ url
		+ ",\'"
		+ ip
		+ "\',"
		+ newOne
		+ ","
		+ ref
		+ ",\'"
		+ userAgent
		+ "\',\'"
		+ appHeader + "\'," + time + ")";

	try
	{
	    GoogleSQL.executeNonQuery(insertToPageViews);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Adds app-engine header data to json.
     * 
     * @param country
     *            - country
     * @param region
     *            - region
     * @param city
     *            - city
     * @param cityLatLong
     *            - city latitudes and longitudes.
     * @return
     */
    private static String addAppEngineHeadersToJSON(String country,
	    String region, String city, String cityLatLong)
    {
	JSONObject appHeaders = new JSONObject();
	try
	{
	    appHeaders.put("country", country);
	    appHeaders.put("region", region);
	    appHeaders.put("city", city);
	    appHeaders.put("cityLatLong", cityLatLong);
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	    return null;
	}

	return appHeaders.toString();
    }
}
