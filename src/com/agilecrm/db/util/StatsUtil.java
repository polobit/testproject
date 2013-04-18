package com.agilecrm.db.util;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;

public class StatsUtil
{
    /**
     * Inserts values into page_views table. Guid is unique, so update when
     * duplicate guid is given.
     * 
     * @param domain
     *            - current namespace.
     * @param guid
     *            - guid.
     * @param email
     *            - email-id.
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
     * @param created_time
     *            - requested time.
     */
    public static void addToPageViews(String domain, String guid, String email,
	    String sid, String url, String ip, String newOne, String ref,
	    String userAgent, String country, String region, String city,
	    String cityLatLong, long created_time)
    {
	String insertToPageViews = "INSERT INTO page_views (domain,guid,email,sid,url,ip,new_one,ref,user_agent,country,region,city,city_lat_long,created_time) VALUES("
		+ encodeSQLColumnValue(domain)
		+ ","
		+ encodeSQLColumnValue(guid)
		+ ","
		+ encodeSQLColumnValue(email)
		+ ","
		+ encodeSQLColumnValue(sid)
		+ ","
		+ encodeSQLColumnValue(url)
		+ ","
		+ encodeSQLColumnValue(ip)
		+ ","
		+ newOne
		+ ","
		+ encodeSQLColumnValue(ref)
		+ ","
		+ encodeSQLColumnValue(userAgent)
		+ ","
		+ encodeSQLColumnValue(country)
		+ ","
		+ encodeSQLColumnValue(region)
		+ ","
		+ encodeSQLColumnValue(city)
		+ ","
		+ encodeSQLColumnValue(cityLatLong)
		+ ","
		+ created_time
		+ ") ON DUPLICATE KEY UPDATE email = "
		+ encodeSQLColumnValue(email) + "";

	System.out.println("Insert Query to PageViews: " + insertToPageViews);

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
     * Gets all sessions from table having guids equal with given email
     * 
     * @param email
     *            - email-id
     */
    public static String getPageViews(String email, String domain)
    {
	// Gets Guids (clients) based on Email from database
	String guids = "(SELECT guid FROM page_views WHERE email ="
		+ encodeSQLColumnValue(email) + " AND domain = "
		+ encodeSQLColumnValue(domain) + ")";

	System.out.println("guids query is: " + guids);

	// Gets all Sessions based on above obtained guids
	String pageViews = "SELECT * FROM page_views WHERE guid IN " + guids;

	System.out.println("Select query: " + pageViews);

	JSONArray arr = new JSONArray();
	try
	{
	    arr = GoogleSQL.getJSONQuery(pageViews);

	    if (arr == null)
		return "";

	    System.out.println("Sessions based on guids and email: " + arr);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	return arr.toString();
    }

    /**
     * Gets number of rows having the given url in a table 'page_views'.
     * 
     * @param url
     *            - given url.
     * @return integer count value.
     */
    public static int getCountForGivenURL(String url, String domain,
	    String email)
    {
	String urlCountQuery = "SELECT COUNT(*) FROM page_views WHERE url = "
		+ encodeSQLColumnValue(url) + " AND domain = "
		+ encodeSQLColumnValue(domain) + " AND email = "
		+ encodeSQLColumnValue(email) + "";

	System.out.println("URL count query is: " + urlCountQuery);

	int count = 0;

	ResultSet rs = GoogleSQL.executeQuery(urlCountQuery);

	try
	{
	    if (rs.next())
	    {
		// Gets first column
		count = rs.getInt(1);
	    }
	}
	catch (SQLException e)
	{
	    e.printStackTrace();
	}

	return count;
    }

    /**
     * Returns string value appended by quotations if not null. It is used to
     * avoid 'null' values(having quotations) being inserted instead of null.
     * 
     * @param value
     *            - given string.
     * @return encoded string if not null, otherwise null.
     */
    public static String encodeSQLColumnValue(String value)
    {
	if (value == null)
	    return null;

	// Removes single quotation on start and end.
	String replaceSingleQuote = value.replaceAll("(^')|('$)", "");

	// Removes double quotes
	String replaceDoubleQuote = replaceSingleQuote.replaceAll(
		"(^\")|(\"$)", "");

	// Replace ' with \' within the value. To avoid error while insertion
	// into table
	if (replaceDoubleQuote.contains("'"))
	    replaceDoubleQuote = replaceDoubleQuote.replace("'", "\\'");

	return "\'" + replaceDoubleQuote + "\'";
    }
}
