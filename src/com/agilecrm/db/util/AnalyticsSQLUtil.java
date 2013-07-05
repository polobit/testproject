package com.agilecrm.db.util;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;
import com.campaignio.tasklets.agile.URLVisited;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>AnalyticsUtil</code> is the base class for handling SQL queries to
 * insert and get page-views analytics data. It also handles campaigns
 * URLVisited query.
 * 
 * @author Naresh
 * 
 */
public class AnalyticsSQLUtil
{
    /**
     * Inserts values into page_views table.
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
     * @param isNew
     *            - if new
     * @param ref
     *            -reference.
     * @param userAgent
     *            - userAgent header.
     * @param country
     *            - appengine header country value.
     * @param region
     *            - appengine header region (or state) value
     * @param city
     *            - appengine header city value.
     * @param cityLatLong
     *            - appengine header city latitudes and longitudes.
     */
    public static void addToPageViews(String domain, String guid, String email,
	    String sid, String url, String ip, String isNew, String ref,
	    String userAgent, String country, String region, String city,
	    String cityLatLong)
    {
	String insertToPageViews = "INSERT INTO page_views (domain,guid,email,sid,url,ip,is_new,ref,user_agent,country,region,city,city_lat_long,stats_time) VALUES("
		+ SQLUtil.encodeSQLColumnValue(domain)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(guid)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(email)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(sid)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(url)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(ip)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(isNew)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(ref)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(userAgent)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(country)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(region)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(city)
		+ ","
		+ SQLUtil.encodeSQLColumnValue(cityLatLong) + ", NOW()" + ")";

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
     * Gets all sessions from table having sids equal with given email
     * 
     * @param email
     *            - email-id
     */
    public static JSONArray getPageViews(String email)
    {
	String domain = NamespaceManager.get();

	// Gets sessions based on Email from database
	String sessions = "(SELECT sid FROM page_views WHERE email ="
		+ SQLUtil.encodeSQLColumnValue(email) + " AND domain = "
		+ SQLUtil.encodeSQLColumnValue(domain) + ")";

	System.out.println("sids query is: " + sessions);

	// Gets all Sessions based on above obtained sids and required email
	String pageViews = "SELECT *, UNIX_TIMESTAMP(stats_time) AS created_time FROM page_views WHERE sid IN "
		+ sessions + " GROUP BY sid, url";

	System.out.println("Select query: " + pageViews);

	try
	{
	    return GoogleSQL.getJSONQuery(pageViews);
	}
	catch (Exception e1)
	{
	    e1.printStackTrace();
	    return null;
	}
    }

    /**
     * Removes stats from SQL based on namespace.
     * 
     * @param namespace
     *            - namespace
     */
    public static void deleteStatsBasedOnNamespace(String namespace)
    {
	String deleteQuery = "DELETE FROM page_views WHERE"
		+ SQLUtil.appendDomainToQuery(namespace);

	try
	{
	    GoogleSQL.executeNonQuery(deleteQuery);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Returns count for the given url.
     * 
     * @param url
     *            - URL given in URL Visited node.
     * @param domain
     *            - domain.
     * @param email
     *            - Subscriber email.
     * @param type
     *            - Exact or Like
     * @return int
     */
    public static int getCountForGivenURL(String url, String domain,
	    String email, String type)
    {
	String urlCountQuery = "SELECT COUNT(*) FROM page_views WHERE domain = "
		+ SQLUtil.encodeSQLColumnValue(domain)
		+ " AND email = "
		+ SQLUtil.encodeSQLColumnValue(email) + " AND url LIKE ";

	if (type.equals(URLVisited.EXACT_MATCH))
	    urlCountQuery += SQLUtil.encodeSQLColumnValue(url);
	else
	    urlCountQuery += " \'%" + url + "%\'";

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
     * Returns page-views count if any with respect to domain.
     * 
     * @param domain
     *            - domain name.
     * @return int
     */
    public static int getPageViewsCountForGivenDomain(String domain)
    {
	String pageViewsCount = "SELECT COUNT(*) FROM page_views WHERE domain = "
		+ SQLUtil.encodeSQLColumnValue(domain);

	int count = 0;

	ResultSet rs = GoogleSQL.executeQuery(pageViewsCount);

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
