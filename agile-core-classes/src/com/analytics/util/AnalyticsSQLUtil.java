package com.analytics.util;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.agilecrm.util.EmailUtil;
import com.campaignio.tasklets.agile.URLVisited;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

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
	public static void addToPageViews(String domain, String guid, String email, String sid, String url, String ip,
			String isNew, String ref, String userAgent, String country, String region, String city, String cityLatLong)
	{
		String insertToPageViews = "INSERT INTO page_views (domain,guid,email,sid,url,ip,is_new,ref,user_agent,country,region,city,city_lat_long,stats_time) VALUES("
				+ GoogleSQLUtil.encodeSQLColumnValue(domain)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(guid)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(email)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(sid)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(url)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(ip)
				+ ","
				+ isNew
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(ref)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(userAgent)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(country)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(region)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(city)
				+ ","
				+ GoogleSQLUtil.encodeSQLColumnValue(cityLatLong) + ", NOW()" + ")";

		// System.out.println("Insert Query to PageViews: " +
		// insertToPageViews);

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
	 *            - email-idcheckOriginalRef
	 */
	public static JSONArray getPageViews(String email)
	{
		String domain = NamespaceManager.get();

		String q1 = "SELECT p1.*, UNIX_TIMESTAMP(stats_time) AS created_time FROM page_views p1";

		// Gets UNIQUE session ids based on Email from database
		String sessions = "(SELECT DISTINCT sid FROM page_views WHERE email ="
				+ GoogleSQLUtil.encodeSQLColumnValue(email) + " AND domain = "
				+ GoogleSQLUtil.encodeSQLColumnValue(domain) + ") p2";

		String joinQuery = q1 + " INNER JOIN " + sessions + " ON p1.sid=p2.sid AND p1.domain = "
				+ GoogleSQLUtil.encodeSQLColumnValue(domain);

		String pageViews = "SELECT * FROM (" + joinQuery + ") pg";

		// System.out.println("sids query is: " + sessions);
		// System.out.println("Select query: " + pageViews);

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
	 * Gets all sessions from table having sids equal with given email
	 * 
	 * @param email
	 *            - string with or without comma
	 */
	public static JSONArray getPageViewsOfAllEmails(String email)
	{
		String domain = NamespaceManager.get();

		String q1 = "SELECT p1.*, UNIX_TIMESTAMP(stats_time) AS created_time FROM page_views p1";

		// Gets UNIQUE session ids based on Email from database
		String sessions = "(SELECT DISTINCT sid FROM page_views WHERE email IN ("
				+ getEmails(EmailUtil.getStringTokenSet(email, ",")) + ") AND domain = "
				+ GoogleSQLUtil.encodeSQLColumnValue(domain) + ") p2";

		String joinQuery = q1 + " INNER JOIN " + sessions + " ON p1.sid=p2.sid AND p1.domain = "
				+ GoogleSQLUtil.encodeSQLColumnValue(domain);

		String pageViews = "SELECT * FROM (" + joinQuery + ") pg";

		// System.out.println("sids query is: " + sessions);
		// System.out.println("Select query: " + pageViews);

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
	 * Returns page views based on given count
	 * 
	 * @param limit - fetch count
	 */
	public static JSONArray getLimitedPageViews(int limit)
	{
		String domain = NamespaceManager.get();

		String query = "SELECT * FROM page_views WHERE domain = " + GoogleSQLUtil.encodeSQLColumnValue(domain) + " LIMIT " + limit;

		try
		{
			return GoogleSQL.getJSONQuery(query);
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
		String deleteQuery = "DELETE FROM page_views WHERE" + GoogleSQLUtil.appendDomainToQuery(namespace);

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
	 * @param durationType
	 * @param duration
	 * @return int
	 */
	public static int getCountForGivenURL(String url, String domain, String email, String type, String duration,
			String durationType)
	{

		// If domain or email empty return
		if (StringUtils.isBlank(domain) || StringUtils.isBlank(email))
			return 0;

		int count = 0;
		ResultSet rs = null;
		try
		{
			String urlCountQuery = "SELECT COUNT(*) FROM page_views WHERE domain = "
					+ GoogleSQLUtil.encodeSQLColumnValue(domain) + " AND email = "
					+ GoogleSQLUtil.encodeSQLColumnValue(email) + " AND url LIKE ";

			if ((URLVisited.EXACT_MATCH).equals(type))
				urlCountQuery += GoogleSQLUtil.encodeSQLColumnValue(url);
			else
				urlCountQuery += " \'%" + url + "%\'";

			// User doesn't want date and time or old url visited node
			if (!("0").equals(duration) && !StringUtils.isEmpty(duration))
				urlCountQuery += " AND stats_time BETWEEN DATE_SUB(DATE(NOW())," + " INTERVAL " + duration + " "
						+ durationType + ") AND NOW() ";

			System.out.println("URL count query is: " + urlCountQuery);

			rs = GoogleSQL.executeQuery(urlCountQuery);

			if (rs.next())
			{
				// Gets first column
				count = rs.getInt(1);
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
			GoogleSQL.closeResultSet(rs);
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
				+ GoogleSQLUtil.encodeSQLColumnValue(domain);

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
		finally
		{
			// Closes the connection and ResultSet Objects
			GoogleSQL.closeResultSet(rs);
		}

		return count;
	}

	public static int isVisitedInTime(String url, String domain, String email, String type, String duration,
			String durationType)
	{
		// If domain or email empty return

		if (StringUtils.isBlank(domain) || StringUtils.isBlank(email))
			return 0;

		String urlCountQuery = "SELECT COUNT(*) FROM page_views WHERE domain = "
				+ GoogleSQLUtil.encodeSQLColumnValue(domain) + " AND email = "
				+ GoogleSQLUtil.encodeSQLColumnValue(email) + " AND url LIKE ";

		if (type.equals(URLVisited.EXACT_MATCH))
			urlCountQuery += GoogleSQLUtil.encodeSQLColumnValue(url);
		else
			urlCountQuery += " \'%" + url + "%\'";

		urlCountQuery += " AND stats_time BETWEEN DATE_SUB(DATE(NOW())," + " INTERVAL " + duration + " " + durationType
				+ ") AND NOW() ";

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
		finally
		{
			// Closes the Connection and ResultSet Objects
			GoogleSQL.closeResultSet(rs);
		}
		System.out.println("count is " + count);
		return count;

	}
	
	public static JSONArray getPageSessionsCountForDomain(String startDate, String endDate, String timeZone)
	{
		String domain = NamespaceManager.get();

    	// For development
    	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
    	    domain = "localhost";
    	
		if (StringUtils.isBlank(domain))
			return null;
		
		// Returns (sign)HH:mm from total minutes.
    	String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);
    	
		String urlCountQuery = "SELECT count(DISTINCT sid) AS count,count(sid) AS total FROM page_views WHERE domain = "
				+ GoogleSQLUtil.encodeSQLColumnValue(domain);

	    urlCountQuery += " AND stats_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
    	                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+")";

		System.out.println("URL count query is: " + urlCountQuery);

		try
    	{
    	    return GoogleSQL.getJSONQuery(urlCountQuery);
    	}
    	catch (Exception e)
    	{
    	    e.printStackTrace();
    	    return new JSONArray();
    	}

	}
	
	private static String getEmails(Set<String> emails)
	{
		String emailString = "";
		
		if(emails == null || emails.size()==0)
			return emailString;
		
		for(String email : emails)
		{
			if(StringUtils.isNotBlank(email))
				emailString += GoogleSQLUtil.encodeSQLColumnValue(email) + ",";
		}
		
		return StringUtils.removeEnd(emailString, ",");
		
	}
}
