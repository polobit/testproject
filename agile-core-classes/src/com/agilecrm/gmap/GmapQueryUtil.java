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
		//String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);
		
        //Two subqueries one gets a list with anonymous visitors(email == "") and with unique latest visiotors ab
		//Here CONVERT_TZ function has been removed to preserve the indexing on the table for this query.
	    //Instead there should be offset included for user selected dates .
	    //LIMIT is temporary here 
		String query="SELECT pp.guid, pp.email,visit_time, pp.city_lat_long, pp.user_agent, pp.city, pp.region, pp.country FROM "
		            +" (SELECT p1.guid, p1.email,MAX(mx_time) as visit_time, p1.city_lat_long, p1.user_agent, p1.city, p1.region, p1.country "
		            +" FROM "
		            +" (SELECT guid, email,MAX(stats_time)as mx_time, city_lat_long, user_agent, city, region, country FROM page_views WHERE domain ="+GoogleSQLUtil.encodeSQLColumnValue(userDomain)+" AND DATE(stats_time) BETWEEN DATE("+GoogleSQLUtil.encodeSQLColumnValue(convertedStartDate)+")  AND DATE("+GoogleSQLUtil.encodeSQLColumnValue(convertedEndDate)+") GROUP BY guid) p1 where p1.email !='' GROUP BY email "
		            +" UNION ALL "
		            +" SELECT guid, email,MAX(stats_time)as mx_time, city_lat_long, user_agent, city, region, country " 
		            +" FROM page_views " 
		            +" WHERE domain ="+GoogleSQLUtil.encodeSQLColumnValue(userDomain)+"" 
		            +" AND DATE(stats_time) " 
		            +" BETWEEN DATE("+GoogleSQLUtil.encodeSQLColumnValue(convertedStartDate)+")  AND DATE("+GoogleSQLUtil.encodeSQLColumnValue(convertedEndDate)+")"
		            +" AND email='' "
		            +" GROUP BY guid) pp ORDER BY visit_time desc LIMIT 500";
		
		System.out.println("sids query is: " + query);

    	try
    	{
    	    return GoogleSQL.getJSONQuery(query);
    	}
    	catch (Exception e1)
    	{
    	    e1.printStackTrace();
    	    System.out.println("Exception while executing query "+e1);
    	    return null;
    	}
    }
	 
	 public static String addConvertTZ(String timeZoneOffset)
	    {
		return "CONVERT_TZ(stats_time,'+00:00'," + GoogleSQLUtil.encodeSQLColumnValue(timeZoneOffset) + ")";
	    }
}
