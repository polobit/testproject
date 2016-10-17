package com.webruleio.reports;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;


import java.sql.*;

import com.webruleio.reports.AnalyticsDBConnectionFetcher;

/**
 * <code>WebruleReportsSQLUtil</code> is the base class for webrule stats
 * reports. It builds required sql query and return respective results. It
 * compares all the available campaigns and also gets individual webrule
 * reports.
 * 
 * @author Poulami
 * 
 */
public class WebruleReportsSQLUtil
{

    public static void insertData(String email, String domain, String id, String action)
    {
	Statement stmt = null;
	AnalyticsDBConnectionFetcher fetch = new AnalyticsDBConnectionFetcher();

	Connection conn = fetch.getConnection();
	try
	{
	    stmt = conn.createStatement();
	}
	catch (SQLException e1)
	{
	    // TODO Auto-generated catch block
	    e1.printStackTrace();
	}
	if (conn != null)
	{
	    String sql = "insert into webrule_reports(email,domain,webrule_id,webrule_type,log_time) values('" + email
		    + "','" + domain + "','" + id + "','" + action + "',NOW())";
	    System.out.println("Statement is " + sql);
	    try
	    {
		stmt.executeUpdate(sql);
		System.out.println("successfully saved");
		stmt.close();

	    }
	    catch (SQLException e)
	    {
		System.err.println("Exception occured while inserting into table " + e.getMessage());
		System.out.println(ExceptionUtils.getFullStackTrace(e));
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    // con.close();

	}
    }

    /**
     * Gets email logs with respect to webrule-id and given date range.
     * 
     * @param id
     *            - webrule-id.
     * @param startDate
     *            - start date.
     * @param endDate
     *            - end date.
     * @param timeZone
     *            - timezone offset.
     * @param type
     *            - hour, day or date.
     * @return JSONArray.
     */
    public static JSONArray getWebruleStats4Graph(String id, String startDate, String endDate, String timeZone,
	    String type)
    {
	String domain = NamespaceManager.get();
	AnalyticsDBConnectionFetcher fetch = new AnalyticsDBConnectionFetcher();
	Connection cont = fetch.getConnection();

	// For develoment
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	    domain = "localhost";

	if (StringUtils.isEmpty(domain))
	    return null;

	// Returns (sign)HH:mm from total minutes.
	String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);

	// NOTE::For optimal use of index , doing union all instead of using
	// IN/OR conditions

	String query = "SELECT webrule_type,DATE_FORMAT("
		+ GoogleSQLUtil.addConvertTZ(timeZoneOffset)
		+ ","
		+ GoogleSQLUtil.getDateFormatBasedOnType(type)
		+ ") AS log_date,"
		+ "count(DISTINCT webrule_id) AS count,count(webrule_id) AS total "
		+ "FROM webrule_reports "
		+ "WHERE DOMAIN="
		+ GoogleSQLUtil.encodeSQLColumnValue(domain)
		+ " AND webrule_id="
		+ GoogleSQLUtil.encodeSQLColumnValue(id)
		+ " AND webrule_type in( 'MODAL_POPUP','FORM_SUBMITTED','CALL_POPUP','SITE_BAR','REQUEST_PUSH_POPUP','CORNER_NOTY') "
		+ "AND log_time BETWEEN CONVERT_TZ(" + GoogleSQLUtil.encodeSQLColumnValue(startDate) + ","
		+ GoogleSQLUtil.getConvertTZ2(timeZoneOffset) + ") " + "AND CONVERT_TZ("
		+ GoogleSQLUtil.encodeSQLColumnValue(endDate) + "," + GoogleSQLUtil.getConvertTZ2(timeZoneOffset)
		+ ") GROUP BY log_date,webrule_type order by log_date";

	System.out.println(query);
	try
	{
	    return WebruleReportsUtil.getWebruleJSONQuery(query, cont);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static JSONArray getWebruleStats4Table(String id, String startDate, String endDate, String timeZone,
	    String type)
    {
	String domain = NamespaceManager.get();
	AnalyticsDBConnectionFetcher fetch = new AnalyticsDBConnectionFetcher();
	Connection cont = fetch.getConnection();
	// For development
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	    domain = "localhost";

	if (StringUtils.isEmpty(domain))
	    return null;

	// Returns (sign)HH:mm from total minutes.
	String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);

	// NOTE::For optimal use of index , doing union all instead of using
	// IN/OR conditions

	String query = "SELECT webrule_type,count(DISTINCT webrule_id) AS count,count(webrule_id) AS total "
		+ "FROM webrule_reports "
		+ "WHERE DOMAIN="
		+ GoogleSQLUtil.encodeSQLColumnValue(domain)
		+ " AND webrule_id="
		+ GoogleSQLUtil.encodeSQLColumnValue(id)
		+ " AND webrule_type in('MODAL_POPUP','FORM_SUBMITTED','NOTY_MESSAGE','CALL_POPUP','SITE_BAR','REQUEST_PUSH_POPUP','CORNER_NOTY')"
		+ "AND log_time BETWEEN CONVERT_TZ(" + GoogleSQLUtil.encodeSQLColumnValue(startDate) + ","
		+ GoogleSQLUtil.getConvertTZ2(timeZoneOffset) + ") " + "AND CONVERT_TZ("
		+ GoogleSQLUtil.encodeSQLColumnValue(endDate) + "," + GoogleSQLUtil.getConvertTZ2(timeZoneOffset)
		+ ") GROUP BY webrule_type ";

	System.out.println(query);
	try
	{
	    return WebruleReportsUtil.getWebruleJSONQuery(query, cont);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return new JSONArray();
	}

    }

}
