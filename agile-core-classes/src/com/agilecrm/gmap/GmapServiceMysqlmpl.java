package com.agilecrm.gmap;

import java.sql.ResultSet;

import java.sql.ResultSetMetaData;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.db.GoogleSQL;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.campaignio.reports.DateUtil;
/**
 * Service implementation which queries the mysql table(page_views) for a 
 * User request
 * 
 * @author vinay
 */


public class GmapServiceMysqlmpl implements GmapService {

	@Override
	public List<GmapLogs> getLatestVisitors(String userDomain,
			String startDate, String endDate, String timeZone) {
		// TODO Auto-generated method stub
		if(userDomain == null || startDate == null || endDate == null || timeZone == null){
			System.out.println("None of the required input parameters should be null");
			return null;
		}
        	

	    

    	try
    	{
    		String convertedStartDate = DateUtil.getMySQLNowDateFormat(Long.parseLong(startDate), timeZone);
    	    String convertedEndDate = DateUtil.getMySQLNowDateFormat(Long.parseLong(endDate), timeZone);
    		
            //Two subqueries, one gets a list with all  anonymous visitors(email == "") and another with unique existing latest visitors(email != "")
    	    //UNION ALL joins both sets.
    		//Here CONVERT_TZ function has been removed to preserve the indexing on the table for this query.
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
    		
    		JSONArray visitorsArray = getJSONQuery(query);
    	    return new ObjectMapper().readValue(visitorsArray.toString(), new TypeReference<List<GmapLogs>>()
    			    {
    			    });
    	}
    	catch (NumberFormatException NFE)
    	{
    	    System.out.println("Exception while parsing the given dates "+NFE);
    	    return null;
    	}catch (Exception e) {
    		return null;
		}
    
	}

	@Override
	public List<GmapLogs> getPageViews(String userDomain,
			String startDate, String endDate, String timeZone,
			String queryOffset, String pageSize) {
		// TODO Auto-generated method stub
		
        if(userDomain == null || startDate == null || endDate == null || timeZone == null){
        	System.out.println("None of the required input parameters should be null");
        	return null;
        }

    	try
    	{
    		String convertedStartDate = DateUtil.getMySQLNowDateFormat(Long.parseLong(startDate), timeZone);
    	    String convertedEndDate = DateUtil.getMySQLNowDateFormat(Long.parseLong(endDate), timeZone);
    		
    	    String query=" select guid,email,city,region,country,user_agent,stats_time as visit_time,sid,ref from page_views where domain="+GoogleSQLUtil.encodeSQLColumnValue(userDomain)+" and stats_time BETWEEN " +GoogleSQLUtil.encodeSQLColumnValue(getStartDateTimeStamp(convertedStartDate))+"  AND "+GoogleSQLUtil.encodeSQLColumnValue(getEndDateTimeStamp(convertedEndDate))+" order by stats_time desc ";
    	    
    	    System.out.println("Query "+query);
    		
    	    /*Appends limit to the existing query if offset and pagesize were recieved from client */
    		if(queryOffset == null && pageSize != null){
    			query += GoogleSQLUtil.appendLimitToQuery(Integer.toString(0),pageSize);
    		}else if(queryOffset != null && pageSize != null){
    			query += GoogleSQLUtil.appendLimitToQuery(queryOffset,pageSize);
    		}
    		
           JSONArray visitorsArray = getJSONQuery(query);
    	    return new ObjectMapper().readValue(visitorsArray.toString(), new TypeReference<List<GmapLogs>>()
    			    {
    			    });
    	}
    	catch (NumberFormatException NFE)
    	{
    	    System.out.println("Exception while parsing the given dates "+NFE);
    	    return null;
    	}catch (Exception e) {
    		return null;
		}
    	
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
	private   JSONArray getJSONQuery(String query)
	{
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
					//This gives us the alias of a column if exists 
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
	
	private  String getStartDateTimeStamp(String startDate){
		if(startDate != null){
			startDate = startDate.substring(0, 10);
			startDate += " 00:00:00"; 
			return startDate;
		}
		return null;
	}
	
	private  String getEndDateTimeStamp(String endDate){
		if(endDate != null){
			endDate = endDate.substring(0, 10);
			endDate +=" 23:59:59";
			return endDate;
		}
		return null;
	}
	

}
