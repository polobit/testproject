package com.agilecrm.gmap;

import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.campaignio.reports.DateUtil;

public class GmapQueryUtil {
	
	 public static JSONArray getVisitorsLatLong(String userDomain, String startDate, String endDate, String timeZone)
	 {
	    String convertedStartDate = DateUtil.getMySQLNowDateFormat(Long.parseLong(startDate), timeZone);
	    String convertedEndDate = DateUtil.getMySQLNowDateFormat(Long.parseLong(endDate), timeZone);
	    
		// Returns (sign)HH:mm from total minutes.
		String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);

		String q2 = "SELECT p1.guid, p1.email, max(mx2_time) as visit_time, p1.city_lat_long, "
				+ "p1.user_agent, p1.city, p1.region, p1.country FROM "
				+ "(SELECT guid, email, max(stats_time) as mx2_time, city_lat_long, user_agent, city, region, country FROM " 
				+ "page_views WHERE domain = "
				+ GoogleSQLUtil.encodeSQLColumnValue(userDomain)
				+ " AND DATE(" + addConvertTZ(timeZoneOffset)
				+ ") BETWEEN DATE(" + GoogleSQLUtil.encodeSQLColumnValue(convertedStartDate) 
				+ ")  AND DATE(" + GoogleSQLUtil.encodeSQLColumnValue(convertedEndDate) + ")"
				+ " group by email "
				+ "UNION "
				+ "SELECT guid, email, max(stats_time), city_lat_long, user_agent, city, region, country FROM " 
				+ "page_views WHERE domain = " 
				+ GoogleSQLUtil.encodeSQLColumnValue(userDomain)
				+ " AND DATE(" + addConvertTZ(timeZoneOffset)
				+ ") BETWEEN DATE(" + GoogleSQLUtil.encodeSQLColumnValue(convertedStartDate) 
				+ ")  AND DATE(" + GoogleSQLUtil.encodeSQLColumnValue(convertedEndDate) + ")"
				+ " GROUP BY guid) p1 "
				+ "group by guid order by visit_time desc";

		
		System.out.println("sids query is: " + q2);

    	try
    	{
    	    return GoogleSQL.getJSONQuery(q2);
    	}
    	catch (Exception e1)
    	{
    	    e1.printStackTrace();
    	    return null;
    	}
    }
	 
	 public static String addConvertTZ(String timeZoneOffset)
	    {
		return "CONVERT_TZ(stats_time,'+00:00'," + GoogleSQLUtil.encodeSQLColumnValue(timeZoneOffset) + ")";
	    }
}
