package com.agilecrm.gmap;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;

import org.json.JSONArray;
import org.json.JSONObject;

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
		            +" GROUP BY guid) pp ORDER BY visit_time desc";
		
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
	 
	 
	 /**This returns by page views of the visitors by session 
	  * 
	  *  
	  * */
	 public static JSONArray getVisitorsBySession(String userDomain, String startDate, String endDate, String timeZone,String queryOffset,String pageSize)
	 {
	    String convertedStartDate = DateUtil.getMySQLNowDateFormat(Long.parseLong(startDate), timeZone);
	    String convertedEndDate = DateUtil.getMySQLNowDateFormat(Long.parseLong(endDate), timeZone);
		
	    String query=" select guid,email,city,region,country,user_agent,stats_time as visit_time,sid,ref,count(*) as page_views, ref from page_views where domain="+GoogleSQLUtil.encodeSQLColumnValue(userDomain)+" and stats_time BETWEEN DATE("+GoogleSQLUtil.encodeSQLColumnValue(convertedStartDate)+")  AND DATE("+GoogleSQLUtil.encodeSQLColumnValue(convertedEndDate)+") group by sid";
		
	    /*Appends limit to the existing query if offset and pagesize were recieved from client */
		if(queryOffset == null && pageSize != null){
			query += GoogleSQLUtil.appendLimitToQuery(Integer.toString(0),pageSize);
		}else if(queryOffset != null && pageSize != null){
			query += GoogleSQLUtil.appendLimitToQuery(queryOffset,pageSize);
		}
		System.out.println("sids query is: " + query);

    	try
    	{
    		//Call a private method 
    	    return getJSONQuery(query);
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
	 
	 /**
		 * This is a similar implementation from the GoogleSql.getJSONQuery except that
		 * this returns column name by alias if provided in query .
		 * The small change can also be made in the common class(GoogleSql)
		 * 
		 * 
		 * Note :resultMetadata.getColumnLabel(i) method returns the alias name if given ,actual column name if not .
		 * 
		 * @param query
		 *            - query
		 * @return - json array
		 * @throws Exception
		 */
		private static  JSONArray getJSONQuery(String query)
		{
			System.out.println("Query " + query);
			ResultSet rs = GoogleSQL.executeQuery(query);
			if (rs == null)
				return null;

			System.out.println("Result set object  " + rs);

			JSONArray agentDetailsArray = new JSONArray();
			try
			{
				ResultSetMetaData resultMetadata = rs.getMetaData();

				int numColumns = resultMetadata.getColumnCount();

				String columnName = null;

				while (rs.next())
				{
					JSONObject eachAgentJSON = new JSONObject();

					for (int i = 1; i < numColumns + 1; i++)
					{
						columnName = resultMetadata.getColumnLabel(i);
						eachAgentJSON.put(columnName, "" + rs.getString(columnName));
					}

					agentDetailsArray.put(eachAgentJSON);
				}
			}
			catch (Exception e)
			{
				System.out.println("Exception while mapping result set"+e);
				return agentDetailsArray;
			}
			finally
			{
				// close the Connection and ResultSet objects
				GoogleSQL.closeResultSet(rs);
			}
			return agentDetailsArray;
			
		}
		
	
}
