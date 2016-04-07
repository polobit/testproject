package com.campaignio.reports;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;
import com.agilecrm.db.util.GoogleSQLUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

/**
 * <code>CampaignReportsSQLUtil</code> is the base class for campaign stats
 * reports. It builds required sql query and return respective results. It
 * compares all the available campaigns and also gets individual campaign
 * reports.
 * 
 * @author Naresh
 * 
 */
public class CampaignReportsSQLUtil
{
    /**
     * Returns campaign stats of email campaigns with respect to campaign-id and
     * domain.
     * 
     * @return JSONArray.
     */
    public static JSONArray getAllEmailCampaignStats()
    {
	String domain = NamespaceManager.get();

	// For Development
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	    domain = "localhost";

	if (StringUtils.isEmpty(domain))
	    return null;

	String uniqueClicks = "(SELECT campaign_name,log_type,COUNT(DISTINCT subscriber_id) AS count  FROM campaign_logs WHERE log_type IN ('EMAIL_SENT', 'EMAIL_CLICKED', 'EMAIL_OPENED') AND "
		+ GoogleSQLUtil.appendDomainToQuery(domain) + " GROUP BY log_type,campaign_name)";

	String totalClicks = "(SELECT campaign_name,log_type,COUNT(subscriber_id) AS total  FROM campaign_logs WHERE log_type IN ('EMAIL_CLICKED') AND "
		+ GoogleSQLUtil.appendDomainToQuery(domain) + " GROUP BY log_type,campaign_name)";

	String campaignStats = "SELECT A.campaign_name, A.log_type, A.count,B.total FROM " + uniqueClicks
		+ " A LEFT OUTER JOIN " + totalClicks
		+ " B ON A.campaign_name = B.campaign_name AND A.log_type = B.log_type ORDER BY A.campaign_name";

	try
	{
	    return GoogleSQL.getJSONQuery(campaignStats);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets email logs with respect to campaign-id and given date range.
     * 
     * @param campaignId
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
    public static JSONArray getEachEmailCampaignStats(String campaignId, String startDate, String endDate,
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
	
	String query = "SELECT log_type,DATE_FORMAT(" + GoogleSQLUtil.addConvertTZ(timeZoneOffset) + ","+ GoogleSQLUtil.getDateFormatBasedOnType(type)+") AS log_date,"+
		"count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
		"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignId)+" AND log_type = 'EMAIL_OPENED' "+
                "AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_date "+
	        "UNION ALL "+
	        "SELECT log_type,DATE_FORMAT(" + GoogleSQLUtil.addConvertTZ(timeZoneOffset) + ","+ GoogleSQLUtil.getDateFormatBasedOnType(type)+") AS log_date,"+
		"count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
		"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignId)+" AND log_type = 'EMAIL_SENT' "+
                "AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_date "+
                "UNION ALL "+
                "SELECT log_type,DATE_FORMAT(" + GoogleSQLUtil.addConvertTZ(timeZoneOffset) + ","+ GoogleSQLUtil.getDateFormatBasedOnType(type)+") AS log_date,"+
		"count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
		"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignId)+" AND log_type = 'EMAIL_CLICKED' "+
                "AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
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
    }

    public static JSONArray getEachCampaignStatsForTable(String campaignId, String startDate, String endDate,
	    String timeZone, String type)
    {
	String domain = NamespaceManager.get();

	// For development
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	    domain = "localhost";

	if (StringUtils.isEmpty(domain))
	    return null;

	// Returns (sign)HH:mm from total minutes.
	String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);

	//NOTE::For optimal use of index , doing union all instead of using IN/OR conditions
        	
	String query = "SELECT log_type,count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
		"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignId)+" AND log_type = 'EMAIL_OPENED' "+
                "AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type " +
                "UNION ALL "+
                "SELECT log_type,count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
		"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignId)+" AND log_type = 'EMAIL_SENT' "+
                "AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type "+ 
                "UNION ALL "+
                "SELECT log_type,count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
		"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignId)+" AND log_type = 'EMAIL_CLICKED' "+
                "AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type "+ 
                "UNION ALL "+
                "SELECT log_type,count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
		"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignId)+" AND log_type = 'EMAIL_SENDING_SKIPPED' "+
                "AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type "+ 
                "UNION ALL "+
                "SELECT log_type,count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
		"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignId)+" AND log_type = 'EMAIL_SPAM' "+
                "AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type "+ 
                "UNION ALL "+
                "SELECT log_type,count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
		"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignId)+" AND log_type = 'EMAIL_SOFT_BOUNCED' "+
                "AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type "+ 
                "UNION ALL "+
                "SELECT log_type,count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
		"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignId)+" AND log_type = 'EMAIL_HARD_BOUNCED' "+
                "AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type "+ 
                "UNION ALL "+
                "SELECT log_type,count(DISTINCT subscriber_id) AS count,count(subscriber_id) AS total "+  
		"FROM stats.campaign_logs USE INDEX(campid_domain_logtype_logtime_subid_index) "+
                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+" AND campaign_id="+GoogleSQLUtil.encodeSQLColumnValue(campaignId)+" AND log_type = 'UNSUBSCRIBED' "+
                "AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type ";
	                
	try
	{
	    return GoogleSQL.getJSONQuery(query);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return new JSONArray();
	}

    }
    
    
    public static JSONArray getCountByLogTypes(String startDate, String endDate, String timeZone, String[] logType)
    {
    	String domain = NamespaceManager.get();

    	// For development
    	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
    	    domain = "localhost";

    	if (StringUtils.isEmpty(domain) ||  logType == null || logType.length == 0)
    	    return null;

    	// Returns (sign)HH:mm from total minutes.
    	String timeZoneOffset = GoogleSQLUtil.convertMinutesToTime(timeZone);
    	
    	String query = "SELECT log_type,count(subscriber_id) AS count "+  
    			"FROM stats.campaign_logs USE INDEX(domain_logtype_logtime_index) "+
    	                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain) +" AND log_type = " + GoogleSQLUtil.encodeSQLColumnValue(logType[0]) + 
    	                " AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
    	                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type ";
    	
    	         for(int i = 0; i < logType.length; i++)
    	         {
    	        	 if(i == 0)
    	        		 continue;
    	        	 
    	        	query += " UNION ALL ";
    	        	 
    	        	query +=  "SELECT log_type,count(subscriber_id) AS count "+  
    	    			"FROM stats.campaign_logs USE INDEX(domain_logtype_logtime_index) "+
    	    	                "WHERE DOMAIN="+GoogleSQLUtil.encodeSQLColumnValue(domain)+ " AND log_type = " + GoogleSQLUtil.encodeSQLColumnValue(logType[i]) + 
    	    	                " AND log_time BETWEEN CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(startDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") " + 
    	    	                "AND CONVERT_TZ("+GoogleSQLUtil.encodeSQLColumnValue(endDate)+","+GoogleSQLUtil.getConvertTZ2(timeZoneOffset)+") GROUP BY log_type ";
    	        	 
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

    }
}