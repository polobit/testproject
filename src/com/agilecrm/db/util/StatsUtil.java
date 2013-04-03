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
	String insertToPageViews = "INSERT INTO page_views (domain,guid,email,sid,url,ip,new_one,ref,user_agent,country,region,city,city_lat_long,created_time) VALUES(\'"
		+ domain
		+ "\',\'"
		+ guid
		+ "\',\'"
		+ email
		+ "\',\'"
		+ sid
		+ "\',\'"
		+ url
		+ "\',\'"
		+ ip
		+ "\',"
		+ newOne
		+ ","
		+ ref
		+ ",\'"
		+ userAgent
		+ "\',\'"
		+ country
		+ "\',\'"
		+ region
		+ "\',\'"
		+ city
		+ "\',\'"
		+ cityLatLong
		+ "\',"
		+ created_time
		+ ") ON DUPLICATE KEY UPDATE email = \'" + email + "\'";

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
    public static String getFromPageViews(String email, String domain)
    {
	domain = "_test_";
	// Gets Guids (clients) based on Email from database
	String guids = "(SELECT guid FROM page_views WHERE email =\'" + email
		+ "\' AND domain = \'" + domain + "\')";

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
	String urlCountQuery = "SELECT COUNT(*) FROM page_views WHERE url = \'"
		+ url + "\' AND domain = \'" + domain + "\' AND email = \'"
		+ email + "\'";

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

}
