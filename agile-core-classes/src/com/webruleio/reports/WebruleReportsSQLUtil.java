package com.webruleio.reports;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

import java.sql.*;

import com.webruleio.reports.AnalyticsDBConnectionFetcher;
import com.agile.WebruleServlet;

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
    /**
     * Returns campaign stats of webrules with respect to webrule-id and
     * domain.
     * 
     * @return JSONArray.
     */
  /*  public static JSONArray getAllWebruleStats()
    {
	String domain = NamespaceManager.get();

	// For Development
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	    domain = "localhost";

	if (StringUtils.isEmpty(domain))
	    return null;

	String uniqueClicks = "(SELECT campaign_name,webrule_type,COUNT(DISTINCT webruleid) AS count  FROM campaign_logs WHERE webrule_type IN ('EMAIL_SENT', 'EMAIL_CLICKED', 'EMAIL_OPENED') AND "
		+ GoogleSQLUtil.appendDomainToQuery(domain) + " GROUP BY webrule_type,campaign_name)";

	String totalClicks = "(SELECT campaign_name,webrule_type,COUNT(webruleid) AS total  FROM campaign_logs WHERE webrule_type IN ('EMAIL_CLICKED') AND "
		+ GoogleSQLUtil.appendDomainToQuery(domain) + " GROUP BY webrule_type,campaign_name)";

	String campaignStats = "SELECT A.campaign_name, A.webrule_type, A.count,B.total FROM " + uniqueClicks
		+ " A LEFT OUTER JOIN " + totalClicks
		+ " B ON A.campaign_name = B.campaign_name AND A.webrule_type = B.webrule_type ORDER BY A.campaign_name";

	try
	{
	    return GoogleSQL.getJSONQuery(campaignStats);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }*/

    /**
     * Gets email logs with respect to campaign-id and given date range.
     * 
     * @param id
     *            - Campaign-id.
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
   /* public static JSONArray getEachWebruleStats(String id, String startDate, String endDate,
	    String timeZone, String type)
    {
	String domain = NamespaceManager.get();

	// For develoment
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	    domain = "localhost";

	if (StringUtils.isEmpty(domain))
	    return null;

	// Returns (sign)HH:mm from total minutes.
	String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);
	
	//NOTE::For optimal use of index , doing union all instead of using IN/OR conditions
	
	String query = "SELECT webrule_type,DATE_FORMAT(" + GoogleSQLUtil.addConvertTZ(timeZoneOffset) + ","+ GoogleSQLUtil.getDateFormatBasedOnType(type)+") AS log_date,"+
		"count(DISTINCT webruleid) AS count,count(webruleid) AS total "+  
		"FROM stats3.page_report "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND webruleid="+GoogleSQLUtil.encodeSQLColumnValue(id)+" AND webrule_type = 'EMAIL_OPENED' "+
                "AND execution_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_date "+
	        "UNION ALL "+
	        "SELECT webrule_type,DATE_FORMAT(" + GoogleSQLUtil.addConvertTZ(timeZoneOffset) + ","+ GoogleSQLUtil.getDateFormatBasedOnType(type)+") AS log_date,"+
		"count(DISTINCT webruleid) AS count,count(webruleid) AS total "+  
		"FROM stats3.page_report "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND webruleid="+GoogleSQLUtil.encodeSQLColumnValue(id)+" AND webrule_type = 'EMAIL_SENT' "+
                "AND execution_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_date "+
                "UNION ALL "+
                "SELECT webrule_type,DATE_FORMAT(" + GoogleSQLUtil.addConvertTZ(timeZoneOffset) + ","+ GoogleSQLUtil.getDateFormatBasedOnType(type)+") AS log_date,"+
		"count(DISTINCT webruleid) AS count,count(webruleid) AS total "+  
		"FROM stats3.page_report "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND webruleid="+GoogleSQLUtil.encodeSQLColumnValue(id)+" AND webrule_type = 'EMAIL_CLICKED' "+
                "AND execution_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_date";
	try
	{
	    return GoogleSQL.getJSONQuery(query);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }*/
	public static void insertData(String email,String domain,String id,String action)
	{
		Statement stmt=null;
		AnalyticsDBConnectionFetcher fetch=new AnalyticsDBConnectionFetcher();
		
		Connection conn = fetch.getConnection();
		try 
		{
			stmt= conn.createStatement();
		} 
		catch (SQLException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
              if(conn!=null)
              {
	        String sql="insert into webrule_report(email,domain,webruleid,webrule_type,execution_time) values('"+email+"','"+domain+"','"+id+"','"+action+"',NOW())";
	        try {
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
	
    public static JSONArray getEachWebruleStatsForTable(String id, String startDate, String endDate,
	    String timeZone, String type)
    {
	String domain = NamespaceManager.get();
	AnalyticsDBConnectionFetcher fetch = new AnalyticsDBConnectionFetcher();
	Connection cont =fetch.getConnection();
	// For development
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	    domain = "localhost";

	if (StringUtils.isEmpty(domain))
	    return null;

	// Returns (sign)HH:mm from total minutes.
	String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);

	//NOTE::For optimal use of index , doing union all instead of using IN/OR conditions
        	
	String query = "SELECT webrule_type,count(DISTINCT webruleid) AS count,count(webruleid) AS total "+  
		"FROM stats3.webrule_report "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND webruleid="+GoogleSQLUtil.encodeSQLColumnValue(id)+" AND webrule_type in('MODAL_POPUP','FORM_SUBMITTED','NOTY_MESSAGE','CALL_POPUP','SITE_BAR','REQUEST_PUSH_POPUP','ADD_TO_CAMPAIGN','CORNER_NOTY')"+
                "AND execution_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY webrule_type ";
                            
	
	System.out.println(query);
	try
	{
	    return WebruleReportsUtil.getWebruleJSONQuery(query,cont);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return new JSONArray();
	}

    }
    
    
 /*  public static JSONArray getCountByexecutiontimes(String startDate, String endDate, String timeZone, String[] execution_time)
    {
    	String domain = NamespaceManager.get();

    	// For development
    	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
    	    domain = "localhost";

    	if (StringUtils.isEmpty(domain) ||  execution_time == null || execution_time.length == 0)
    	    return null;

    	// Returns (sign)HH:mm from total minutes.
    	String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);
    	
    	String query = "SELECT webrule_type,count(webruleid) AS count "+  
    			"FROM stats3.page_report "+
    	                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain) +" AND webrule_type = " + GoogleSQLUtil.encodeSQLColumnValue(execution_time[0]) + 
    	                " AND execution_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
    	                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY webrule_type ";
    	
    	         for(int i = 0; i < execution_time.length; i++)
    	         {
    	        	 if(i == 0)
    	        		 continue;
    	        	 
    	        	query += " UNION ALL ";
    	        	 
    	        	query +=  "SELECT webrule_type,count(webruleid) AS count "+  
    	    			"FROM stats3.page_report "+
    	    	                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+ " AND webrule_type = " + GoogleSQLUtil.encodeSQLColumnValue(execution_time[i]) + 
    	    	                " AND execution_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
    	    	                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY webrule_type ";
    	        	 
    	         }
    	         
//    	         System.out.println("Query is " + query);
    	
    	try
    	{
    	    return GoogleSQL.getJSONQuery(query);
    	}
    	catch (Exception e)
    	{
    	    e.printStackTrace();
    	    return new JSONArray();
    	}

    }*/
}
