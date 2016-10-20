package com.formio.reports;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import java.sql.*;
import com.webruleio.reports.AnalyticsDBConnectionFetcher;

/**
 * <code>FormReportsSQLUtil</code> is the base class for Form stats reports. It
 * builds required sql query and return respective results.
 * 
 * @author Poulami
 * 
 */
public class FormReportsSQLUtil
{

    public static void insertData(String email, String domain, String id)
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
	    String sql = "insert into form_reports(email,domain,form_id,log_time) values('" + email + "','" + domain
		    + "','" + id + "',NOW())";
	    try
	    {
		stmt.executeUpdate(sql);
		System.out.println("successfully saved");
		stmt.close();

	    }
	    catch (SQLException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	    // con.close();

	}
    }

    /**
     * Gets email logs with respect to Form-id and given date range.
     * 
     * @param formId
     *            - Form-id.
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
    public static JSONArray getFormStats4Graph(String id, String startDate, String endDate, String timeZone, String type)
    {
	String domain = NamespaceManager.get();
	// AnalyticsDBConnectionFetcher fetch = new
	// AnalyticsDBConnectionFetcher();
	// Connection cont =fetch.getConnection();

	// For develoment
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	    domain = "localhost";

	if (StringUtils.isEmpty(domain))
	    return null;

	// Returns (sign)HH:mm from total minutes.
	String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);

	// NOTE::For optimal use of index , doing union all instead of using
	// IN/OR conditions

	String query = "SELECT DATE_FORMAT(" + GoogleSQLUtil.addConvertTZ(timeZoneOffset) + ","
		+ GoogleSQLUtil.getDateFormatBasedOnType(type) + ") AS log_date,"
		+ "count(form_id) AS TOTAL_SUBMISSIONS " + "FROM form_reports " + "WHERE DOMAIN="
		+ GoogleSQLUtil.encodeSQLColumnValue(domain) + " AND form_id=" + GoogleSQLUtil.encodeSQLColumnValue(id)
		+ "AND log_time BETWEEN CONVERT_TZ(" + GoogleSQLUtil.encodeSQLColumnValue(startDate) + ","
		+ GoogleSQLUtil.getConvertTZ2(timeZoneOffset) + ") " + "AND CONVERT_TZ("
		+ GoogleSQLUtil.encodeSQLColumnValue(endDate) + "," + GoogleSQLUtil.getConvertTZ2(timeZoneOffset)
		+ ") GROUP BY log_date";

	System.out.println(query);
	try
	{
	    return FormReportsUtil.getFormJSONQuery(query);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static JSONArray getFormStats4Table(String id, String startDate, String endDate, String timeZone)
    {
	String domain = NamespaceManager.get();
	// AnalyticsDBConnectionFetcher fetch = new
	// AnalyticsDBConnectionFetcher();
	// Connection cont =fetch.getConnection();
	// For development
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	    domain = "localhost";

	if (StringUtils.isEmpty(domain))
	    return null;

	// Returns (sign)HH:mm from total minutes.
	String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);

	// NOTE::For optimal use of index , doing union all instead of using
	// IN/OR conditions

	String query = "SELECT count(form_id) AS total  " + "FROM form_reports " + "WHERE DOMAIN="
		+ GoogleSQLUtil.encodeSQLColumnValue(domain) + " AND form_id=" + GoogleSQLUtil.encodeSQLColumnValue(id)
		+ "AND log_time BETWEEN CONVERT_TZ(" + GoogleSQLUtil.encodeSQLColumnValue(startDate) + ","
		+ GoogleSQLUtil.getConvertTZ2(timeZoneOffset) + ") " + "AND CONVERT_TZ("
		+ GoogleSQLUtil.encodeSQLColumnValue(endDate) + "," + GoogleSQLUtil.getConvertTZ2(timeZoneOffset) + ")";

	System.out.println(query);
	try
	{
	    return FormReportsUtil.getFormJSONQuery(query);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return new JSONArray();
	}

    }

}