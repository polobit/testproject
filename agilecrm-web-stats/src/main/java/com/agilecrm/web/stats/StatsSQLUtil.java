package com.agilecrm.web.stats;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;

/**
 * <code>AnalyticsUtil</code> is the base class for handling SQL queries to
 * insert and get page-views analytics data. It also handles campaigns
 * URLVisited query.
 * 
 * @author Naresh
 * 
 */
public class StatsSQLUtil
{
    /**
     * Inserts values into page_visits table.
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
    public static void addToPageViews(String domain, String guid, String email, String sid, String url, String ip,
	    String isNew, String refUrl, String userAgent, String country, String region, String city,
	    String cityLatLong)
    {
	domain = StatsGoogleSQLUtil.encodeSQLColumnValue(domain);
	guid = StatsGoogleSQLUtil.encodeSQLColumnValue(guid);
	sid = StatsGoogleSQLUtil.encodeSQLColumnValue(sid);
	url = StatsGoogleSQLUtil.encodeSQLColumnValue(url);
	ip = StatsGoogleSQLUtil.encodeSQLColumnValue(ip);
	refUrl = StatsGoogleSQLUtil.encodeSQLColumnValue(refUrl);
	userAgent = StatsGoogleSQLUtil.encodeSQLColumnValue(userAgent);
	country = StatsGoogleSQLUtil.encodeSQLColumnValue(country);
	region = StatsGoogleSQLUtil.encodeSQLColumnValue(region);
	city = StatsGoogleSQLUtil.encodeSQLColumnValue(city);
	cityLatLong = StatsGoogleSQLUtil.encodeSQLColumnValue(cityLatLong);
	email = StatsGoogleSQLUtil.encodeSQLColumnValue(email);
	
	String insertToPageViews = "INSERT INTO page_visits (domain,guid,sid,url,ip,is_new,ref_url,user_agent,stats_time,country,region,city,city_lat_long,email) VALUES("
		+ domain
		+ ",unhex(replace("
		+ guid
		+ ",'-','')) ,unhex(replace("
		+ sid
		+ ",'-','')),"
		+ url
		+ ",inet6_aton("
		+ ip
		+ "),"
		+ isNew
		+ ","
		+ refUrl
		+ ","
		+ userAgent
		+ ",now(),"
		+ country
		+ ","
		+ region + "," + city + "," + cityLatLong + "," + email + ")";
	
	System.out.println("Query:+ " + insertToPageViews);
	
	try
	{
	    StatsSQL.executeNonQuery(insertToPageViews);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
    
    /**
     * Responsible for fetching Analytics related to a contact
     * 
     * @param req
     * @param res
     * @param domain
     */
    public static void getAnalyticsOfAContact(HttpServletRequest req, HttpServletResponse res, String domain)
    {
	try
	{
	    JSONArray result = null;
	    String searchEmail = req.getParameter("search_email");
	    if (StringUtils.isNotBlank(searchEmail))
	    {
		result = StatsSQLUtil.getAnalyticsGroupedBySessions(domain, searchEmail);
		if (result != null)
		    StatsUtil.sendResponse(req, res, result.toString());
	    }
	}
	catch (Exception e)
	{
	    System.out.println("Exception occured while fetching page_visits " + e.getMessage());
	}
    }
    
    /***
     * Sub Method Responsible for Fetches all page views related to a contact
     * 
     * @param domain
     * @param searchEmail
     * @return
     */
    public static JSONArray getAnalyticsGroupedBySessions(String domain, String searchEmail)
    {
	
	JSONArray pageViewsList = getPageViewsOfAllEmails(domain, searchEmail);
	
	JSONArray mergedStats = StatsUtil.mergePageViewsBasedOnSessions(pageViewsList);
	
	if (mergedStats == null)
	    return null;
	
	return mergedStats;
    }
    
    /**
     * Gets all sessions from table having sids equal with given email
     * 
     * @param email
     *            - email-idcheckOriginalRef
     */
    public static JSONArray getPageViews(String domain, String email)
    {
	
	String q1 = "SELECT p1.*, UNIX_TIMESTAMP(stats_time) AS created_time FROM page_visits p1";
	
	// Gets UNIQUE session ids based on Email from database
	String sessions = "(SELECT DISTINCT sid FROM page_visits WHERE email ="
		+ StatsGoogleSQLUtil.encodeSQLColumnValue(email) + " AND domain = "
		+ StatsGoogleSQLUtil.encodeSQLColumnValue(domain) + ") p2";
	
	String joinQuery = q1 + " INNER JOIN " + sessions + " ON p1.sid=p2.sid AND p1.domain = "
		+ StatsGoogleSQLUtil.encodeSQLColumnValue(domain);
	
	String pageViews = "SELECT domain,lcase(hex(guid)) as guid,lcase(hex(sid)) as sid,url,inet6_ntoa(ip) as ip,is_new,ref_url,user_agent,stats_time,country,region,city,city_lat_long,email,created_time FROM ("
		+ joinQuery + ") pg";
	
	System.out.println("sids query is: " + sessions);
	System.out.println("Select query: " + pageViews);
	
	try
	{
	    return StatsSQL.getJSONQuery(pageViews);
	}
	catch (Exception e1)
	{
	    e1.printStackTrace();
	    return null;
	}
    }
    
    /**
     * Gets all sessions from table having sids equal with given email
     * 
     * @param email
     *            - string with or without comma
     */
    public static JSONArray getPageViewsOfAllEmails(String domain, String email)
    {
	
	String q1 = "SELECT p1.*, UNIX_TIMESTAMP(stats_time) AS created_time FROM page_visits p1";
	
	// Gets UNIQUE session ids based on Email from database
	String sessions = "(SELECT DISTINCT guid FROM page_visits WHERE email IN ('" + email + "') AND domain = "
		+ StatsGoogleSQLUtil.encodeSQLColumnValue(domain) + ") p2";
	
	String joinQuery = q1 + " INNER JOIN " + sessions + " ON p1.guid=p2.guid AND p1.domain = "
		+ StatsGoogleSQLUtil.encodeSQLColumnValue(domain);
	
	String pageViews = "SELECT domain,lcase(hex(guid)) as guid,lcase(hex(sid)) as sid,url,inet6_ntoa(ip) as ip,is_new,ref_url,user_agent,stats_time,country,region,city,city_lat_long,email,created_time FROM ("
		+ joinQuery + ") pg";
	
	System.out.println("sids query is: " + sessions);
	System.out.println("Select query: " + pageViews);
	
	try
	{
	    return StatsSQL.getJSONQuery(pageViews);
	}
	catch (Exception e1)
	{
	    e1.printStackTrace();
	    return null;
	}
	
    }
    
    /**
     * Get contact activities from page views table
     * 
     * @param log_type
     * @param cursor
     * @param page_size
     * @return
     */
    public static void getContactActivitiesLogs(HttpServletRequest req, HttpServletResponse res, String domain)
    {
	String offsetString = req.getParameter("offset");
	String limitString = req.getParameter("limit");
	int limit = StatsUtil.getIntegerValue(limitString, 20);
	int offset = StatsUtil.getIntegerValue(offsetString, 0);
	JSONArray result = null;
	String pageViewsQuery = "SELECT url,inet6_ntoa(ip) as ip,stats_time,email,"
		+ "NULL AS campaign_id,NULL AS subscriber_id ,NULL AS campaign_name,NULL AS log_time,NULL AS log_type, NULL AS message, UNIX_TIMESTAMP(stats_time) AS time"
		+ " FROM page_visits AS pageViewAlias WHERE DOMAIN = '" + domain
		+ "' AND URL !='' AND EMAIL != '' ORDER BY stats_time DESC" + appendLimitToQuery(offset, limit);
	try
	{
	    result = StatsSQL.getJSONQuery(pageViewsQuery);
	    if (result != null)
		StatsUtil.sendResponse(req, res, result.toString());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while fetching contact activities");
	}
    }
    
    /**
     * Get contact activities from page views table
     * 
     * @param log_type
     * @param cursor
     * @param page_size
     * @return
     */
    public static void getLatestPageViewsOfDomain(HttpServletRequest req, HttpServletResponse res, String domain)
    {
	String offsetString = req.getParameter("offset");
	String limitString = req.getParameter("limit");
	int limit = StatsUtil.getIntegerValue(limitString, 20);
	int offset = StatsUtil.getIntegerValue(offsetString, 0);
	JSONArray result = null;
	String pageViewsQuery = "SELECT url, inet6_ntoa(ip) as ip, stats_time, email, UNIX_TIMESTAMP(stats_time) AS time FROM page_visits "
		+ "WHERE email != '' AND url != '' AND domain = '"
		+ domain
		+ "' ORDER BY stats_time DESC "
		+ appendLimitToQuery(offset, limit);
	try
	{
	    result = StatsSQL.getJSONQuery(pageViewsQuery);
	    if (result != null)
		StatsUtil.sendResponse(req, res, result.toString());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while fetching latest page views of a domain");
	}
    }
    
    /**
     * Returns page views based on given count
     * 
     * @param limit
     *            - fetch count
     */
    public static void getLimitedPageViews(HttpServletRequest req, HttpServletResponse res, String domain)
    {
	try
	{
	    String limitString = req.getParameter("limit");
	    int limit = StatsUtil.getIntegerValue(limitString, 5);
	    String query = "SELECT * FROM page_visits WHERE domain = "
		    + StatsGoogleSQLUtil.encodeSQLColumnValue(domain) + " LIMIT " + limit;
	    JSONArray result = StatsSQL.getJSONQuery(query);
	    if (result != null)
		StatsUtil.sendResponse(req, res, result.toString());
	}
	catch (Exception e1)
	{
	    e1.printStackTrace();
	    System.out.println("Exception while fetching limited page views " + e1.getMessage());
	    
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
	String deleteQuery = "DELETE FROM page_visits WHERE" + StatsGoogleSQLUtil.appendDomainToQuery(namespace);
	
	try
	{
	    StatsSQL.executeNonQuery(deleteQuery);
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
     * @param durationType
     * @param duration
     * @return int
     */
    public static void getCountForGivenURL(HttpServletRequest req, HttpServletResponse res, String domain)
    {
	
	String email = req.getParameter("email");
	// If domain or email empty return
	if (StringUtils.isBlank(domain) || StringUtils.isBlank(email))
	    StatsUtil.sendResponse(req, res, "0");
	
	int count = 0;
	ResultSet rs = null;
	try
	{
	    String url = req.getParameter("url");
	    url = java.net.URLDecoder.decode(url, "UTF-8");
	    String duration = req.getParameter("duration");
	    String durationType = req.getParameter("durationType");
	    String type = req.getParameter("type");
	    String urlCountQuery = "SELECT COUNT(*) FROM page_visits WHERE domain = "
		    + StatsGoogleSQLUtil.encodeSQLColumnValue(domain) + " AND email = "
		    + StatsGoogleSQLUtil.encodeSQLColumnValue(email) + " AND url LIKE ";
	    
	    if (("exact_match").equals(type))
		urlCountQuery += StatsGoogleSQLUtil.encodeSQLColumnValue(url);
	    else
		urlCountQuery += " \'%" + url + "%\'";
	    
	    // User doesn't want date and time or old url visited node
	    if (!("0").equals(duration) && !StringUtils.isEmpty(duration))
		urlCountQuery += " AND stats_time BETWEEN DATE_SUB(DATE(NOW())," + " INTERVAL " + duration + " "
			+ durationType + ") AND NOW() ";
	    
	    System.out.println("URL count query is: " + urlCountQuery);
	    
	    rs = StatsSQL.executeQuery(urlCountQuery);
	    
	    if (rs.next())
	    {
		// Gets first column
		count = rs.getInt(1);
		StatsUtil.sendResponse(req, res, Integer.toString(count));
	    }
	}
	catch (SQLException e)
	{
	    System.out.println("SQLException in AnalyTicsSQLUtil.." + e.getMessage());
	    e.printStackTrace();
	}
	catch (Exception e)
	{
	    System.out.println("Exception in AnalyTicsSQLUtil.." + e.getMessage());
	    e.printStackTrace();
	}
	finally
	{
	    // Closes the Connection and ResultSet Objects
	    StatsSQL.closeResultSet(rs);
	}
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
	String pageViewsCount = "SELECT COUNT(*) FROM page_visits WHERE domain = "
		+ StatsGoogleSQLUtil.encodeSQLColumnValue(domain);
	
	int count = 0;
	
	ResultSet rs = StatsSQL.executeQuery(pageViewsCount);
	
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
	finally
	{
	    // Closes the connection and ResultSet Objects
	    StatsSQL.closeResultSet(rs);
	}
	
	return count;
    }
    
    public static int isVisitedInTime(String url, String domain, String email, String type, String duration,
	    String durationType)
    {
	// If domain or email empty return
	
	if (StringUtils.isBlank(domain) || StringUtils.isBlank(email))
	    return 0;
	
	String urlCountQuery = "SELECT COUNT(*) FROM page_visits WHERE domain = "
		+ StatsGoogleSQLUtil.encodeSQLColumnValue(domain) + " AND email = "
		+ StatsGoogleSQLUtil.encodeSQLColumnValue(email) + " AND url LIKE ";
	
	if (type.equals("exact_match"))
	    urlCountQuery += StatsGoogleSQLUtil.encodeSQLColumnValue(url);
	else
	    urlCountQuery += " \'%" + url + "%\'";
	
	urlCountQuery += " AND stats_time BETWEEN DATE_SUB(DATE(NOW())," + " INTERVAL " + duration + " " + durationType
		+ ") AND NOW() ";
	
	System.out.println("URL count query is: " + urlCountQuery);
	
	int count = 0;
	
	ResultSet rs = StatsSQL.executeQuery(urlCountQuery);
	
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
	finally
	{
	    // Closes the Connection and ResultSet Objects
	    StatsSQL.closeResultSet(rs);
	}
	System.out.println("count is " + count);
	return count;
	
    }
    
    public static JSONArray getPageSessionsCountForDomain(String domain, String startDate, String endDate,
	    String timeZone)
    {
	
	// For development
	// if (SystemProperty.environment.value() ==
	// SystemProperty.Environment.Value.Development)
	// domain = "localhost";
	
	if (StringUtils.isBlank(domain))
	    return null;
	
	// Returns (sign)HH:mm from total minutes.
	String timeZoneOffset = StatsGoogleSQLUtil.convertMinutesToTime(timeZone);
	
	String urlCountQuery = "SELECT count(DISTINCT sid) AS count,count(sid) AS total FROM page_visits WHERE domain = "
		+ StatsGoogleSQLUtil.encodeSQLColumnValue(domain);
	
	urlCountQuery += " AND stats_time BETWEEN CONVERT_TZ(" + StatsGoogleSQLUtil.encodeSQLColumnValue(startDate)
		+ "," + StatsGoogleSQLUtil.getConvertTZ2(timeZoneOffset) + ") " + "AND CONVERT_TZ("
		+ StatsGoogleSQLUtil.encodeSQLColumnValue(endDate) + ","
		+ StatsGoogleSQLUtil.getConvertTZ2(timeZoneOffset) + ")";
	
	System.out.println("URL count query is: " + urlCountQuery);
	
	try
	{
	    return StatsSQL.getJSONQuery(urlCountQuery);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return new JSONArray();
	}
	
    }
    
    public static String getEmails(Set<String> emails)
    {
	String emailString = "";
	
	if (emails == null || emails.size() == 0)
	    return emailString;
	
	for (String email : emails)
	{
	    if (StringUtils.isNotBlank(email))
		emailString += StatsGoogleSQLUtil.encodeSQLColumnValue(email) + ",";
	}
	
	return StringUtils.removeEnd(emailString, ",");
	
    }
    
    /**
     * Appends offset and limit to query to retrieve results by page.
     * 
     * @param limit
     *            - required limit.
     * 
     * @param offset
     *            - offset of the required result set
     * @return String.
     */
    public static String appendLimitToQuery(int offset, int limit)
    {
	
	return " LIMIT " + offset + "," + limit;
    }
}
