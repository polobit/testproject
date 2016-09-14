package com.webruleio.reports;

import org.apache.commons.lang.StringUtils;
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
	        String sql="insert into stats2.webrule_reports(email,domain,webruleid,webrule_type,execution_time) values('"+email+"','"+domain+"','"+id+"','"+action+"',NOW())";
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
    
    
 }
