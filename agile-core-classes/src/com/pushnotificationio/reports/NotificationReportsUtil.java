package com.pushnotificationio.reports;

import java.util.Calendar;
import java.util.LinkedHashMap;

import net.sf.json.JSONSerializer;

import com.campaignio.reports.CampaignReportsUtil;
import com.campaignio.reports.DateUtil;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * <code>NotificationReportsUtil</code> is the utility class that initializes graphs
 * with default data. Inorder to built bar-charts with the values obtained,
 * first need to intialize the X-axis and Y-axis values with default values.
 * <p>
 * <code>NotificationReportsUtil</code> initializes the X-axis with hour or week-day
 * or date values based on type. Under each value, EmailsSent, EmailsOpened,
 * Clicks and Total Clicks are initialized with zero each.
 * </p>
 * 
 * @author Poulami
 */
public class NotificationReportsUtil
{

    /**
     * CampaignStats are grouped based on campaign-name and log-date. The names
     * are matched with SQL column names i.e., campaign-name and log_date
     */
    public static final String GROUP_BY_CAMPAIGN_NAME = "campaign_name";
    public static final String GROUP_BY_LOG_DATE = "log_date";
    
    
    
    /**
     * Returns campaign stats data required for graph. It groups data based on
     * campaign-name for Campaigns Comparison, otherwise based on log date.
     * 
     * @param startDate
     *            - start date, otherwise null for Campaigns Comparison
     * @param endDate
     *            - end date, otherwise null for Campaigns Comparison
     * @param type
     *            - hourly or weekly or daily.
     * @param timeZone
     *            - TimeZone Id obtained from client side. E.g. -330
     * @param sqlData
     *            - Obtained sql data.
     * @return LinkedHashMap
     */
    public static LinkedHashMap<String, LinkedHashMap<String, Integer>> getEachNotificationStatsData(String startDate, String endDate, String type, String timeZone,
	    JSONArray sqlData)
    {
	// Types of bars in a bar graph
	String[] barTypes = { "NOTIFICATION_CLICKED", "NOTIFICATION_SENT", "NOTIFICATION_SHOWN", "NOTIFICATION_SKIPPED"};

	// Campaigns Comparison need no initialization as there is no duration.
	LinkedHashMap<String, LinkedHashMap<String, Integer>> groupByMap = new LinkedHashMap<String, LinkedHashMap<String, Integer>>();

	String groupBy = GROUP_BY_LOG_DATE;

	// Initialize with default date duration.
	groupByMap = CampaignReportsUtil.getDefaultDateTable(startDate, endDate, type, timeZone, barTypes);

	try
	{
	    // Arrange sqlData as required to Graph
	    for (int index = 0; index < sqlData.length(); index++)
	    {
	    LinkedHashMap<String, Integer> countMap = CampaignReportsUtil.getDefaultCountTable(barTypes);
		JSONObject logJSON = sqlData.getJSONObject(index);

		// Reset countMap values before entering new
		if (!groupByMap.containsKey(logJSON.getString(groupBy)))
		    countMap = CampaignReportsUtil.getDefaultCountTable(barTypes);

		// Assigns total count to respective type except EMAIL_OPENED,
	    // for EMAIL_OPENED giving only unique count
		if(logJSON.getString("log_type").equals("EMAIL_OPENED"))
			countMap.put(logJSON.getString("log_type"), Integer.parseInt(logJSON.getString("count")));
		else
			countMap.put(logJSON.getString("log_type"), Integer.parseInt(logJSON.getString("total")));
		
		// Get Unique clicks
		if (logJSON.getString("log_type").equals("EMAIL_CLICKED"))
		    countMap.put("count", Integer.parseInt(logJSON.getString("count")));

		// insert new
		if (!(groupByMap.containsKey(logJSON.getString(groupBy))))
		{
		    groupByMap.put(logJSON.getString(groupBy), countMap);
		}
		// update old
		else
		{
			if(logJSON.getString("log_type").equals("EMAIL_OPENED"))
				groupByMap.get(logJSON.getString(groupBy)).put(logJSON.getString("log_type"), Integer.parseInt(logJSON.getString("count")));
			else
				groupByMap.get(logJSON.getString(groupBy)).put(logJSON.getString("log_type"), Integer.parseInt(logJSON.getString("total")));
			// Get Unique clicks
		    if (logJSON.getString("log_type").equals("EMAIL_CLICKED"))
		    {
		    	groupByMap.get(logJSON.getString(groupBy)).put("count", Integer.parseInt(logJSON.getString("count")));
		    }
		}
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println(e.getMessage());
	}

	return groupByMap;
    }

    
    /**
     * Returns compare campaign stats data required for graph. It groups data based on
     * campaign-name for Campaigns Comparison, otherwise based on log date.
     * 
     * @param startDate
     *            - start date, otherwise null for Campaigns Comparison
     * @param endDate
     *            - end date, otherwise null for Campaigns Comparison
     * @param type
     *            - hourly or weekly or daily.
     * @param timeZone
     *            - TimeZone Id obtained from client side. E.g. -330
     * @param sqlData
     *            - Obtained sql data.
     * @return LinkedHashMap
     */
    public static LinkedHashMap<String, LinkedHashMap<String, Integer>> getNotificationStatsData(String startDate, String endDate, String type, String timeZone,
	    JSONArray sqlData)
    {
	// Types of bars in a bar graph
	String[] barTypes = { "NOTIFICATION_CLICKED", "NOTIFICATION_SENT", "NOTIFICATION_SHOWN", "NOTIFICATION_SKIPPED" };
	LinkedHashMap<String, Integer> countMap = CampaignReportsUtil.getDefaultCountTable(barTypes);

	// Campaigns Comparison need no initialization as there is no duration.
	LinkedHashMap<String, LinkedHashMap<String, Integer>> groupByMap = new LinkedHashMap<String, LinkedHashMap<String, Integer>>();

	// Group by Campaign Name for Campaigns Comparison
	String groupBy = GROUP_BY_CAMPAIGN_NAME;

	// If not Camapaigns Comparison, initialize groupByMap with duration.
	if (!(startDate == null && endDate == null && type == null && timeZone == null))
	{
	    // Initialize with default date duration.
	    groupByMap = CampaignReportsUtil.getDefaultDateTable(startDate, endDate, type, timeZone, barTypes);

	    // group by log date
	    groupBy = GROUP_BY_LOG_DATE;
	}

	try
	{
	    // Arrange sqlData as required to Graph
	    for (int index = 0; index < sqlData.length(); index++)
	    {
		JSONObject logJSON = sqlData.getJSONObject(index);

		// Reset countMap values before entering new
		if (!groupByMap.containsKey(logJSON.getString(groupBy)))
		    countMap = CampaignReportsUtil.getDefaultCountTable(barTypes);

		// Assigns count to respective type.
		countMap.put(logJSON.getString("log_type"), Integer.parseInt(logJSON.getString("count")));

		// Get Total clicks, if not null
		if (!logJSON.getString("total").equals("null"))
		    countMap.put("total", Integer.parseInt(logJSON.getString("total")));

		// insert new
		if (!(groupByMap.containsKey(logJSON.getString(groupBy))))
		{
		    groupByMap.put(logJSON.getString(groupBy), countMap);
		}
		// update old
		else
		{
		    groupByMap.get(logJSON.getString(groupBy)).put(logJSON.getString("log_type"), Integer.parseInt(logJSON.getString("count")));

		    // Get Total clicks, if not null
		    if (!logJSON.getString("total").equals("null"))
		    {
			groupByMap.get(logJSON.getString(groupBy)).put("total", Integer.parseInt(logJSON.getString("total")));
		    }
		}

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println(e.getMessage());
	}

	return groupByMap;
    }   

    /**
     * Replaces names in stats as required for graph. For e.g., replaces.
     * EMAIL_SENT to Email Sent
     * 
     * @param campaignStats
     *            - CampaignStats data.
     * @return String
     */
    
    public static String replaceNamesInStats(LinkedHashMap<String, LinkedHashMap<String, Integer>> campaignStats)
    {
	String replacedCampaignStats = JSONSerializer.toJSON(campaignStats).toString().replace("NOTIFICATION_CLICKED", "Clicks")
		.replace("NOTIFICATION_SENT", "Sent").replace("NOTIFICATION_SHOWN", "Shown").replace("NOTIFICATION_SKIPPED", "Skipped");

	return replacedCampaignStats;
    }
}