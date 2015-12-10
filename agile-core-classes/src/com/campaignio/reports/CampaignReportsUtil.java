package com.campaignio.reports;

import java.util.Calendar;
import java.util.LinkedHashMap;

import net.sf.json.JSONSerializer;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * <code>CampaignReportsUtil</code> is the utility class that initializes graphs
 * with default data. Inorder to built bar-charts with the values obtained,
 * first need to intialize the X-axis and Y-axis values with default values.
 * <p>
 * <code>CampaignReportsUtil</code> initializes the X-axis with hour or week-day
 * or date values based on type. Under each value, EmailsSent, EmailsOpened,
 * Clicks and Total Clicks are initialized with zero each.
 * </p>
 * 
 * @author Naresh
 */
public class CampaignReportsUtil
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
    public static LinkedHashMap<String, LinkedHashMap<String, Integer>> getEachCampaignStatsData(String startDate, String endDate, String type, String timeZone,
	    JSONArray sqlData)
    {
	// Types of bars in a bar graph
	String[] barTypes = { "EMAIL_SENT", "EMAIL_OPENED", "count","EMAIL_CLICKED"};

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
     * Constructs a default LinkedHashMap for the dates between the given
     * duration and sets time value as key and getDefaultCountTable() as value.
     * For e.g.
     * {1AM={EmailSent=0,EmailOpened=0,UniqueClicks=0,TotalClicks=0},2AM={
     * EmailSent=0,EmailOpened=0,UniqueClicks=0,TotalClicks=0},....}
     * 
     * @param startTime
     *            - Start time of given duration.
     * @param endTime
     *            - End time of given duration.
     * @param type
     *            - Hour, Day or Date.
     * @param timeZone
     *            - timeZoneId received from client.
     * @param logTypes
     *            - EmailSent, EmailOpened, UniqueClicks and TotalClicks
     * @return LinkedHashMap
     */
    public static LinkedHashMap<String, LinkedHashMap<String, Integer>> getDefaultDateTable(String startTime, String endTime, String type, String timeZone,
	    String[] logTypes)
    {

	LinkedHashMap<String, LinkedHashMap<String, Integer>> dateHashtable = new LinkedHashMap<String, LinkedHashMap<String, Integer>>();

	// Sets calendar with start time.
	Calendar startCalendar = Calendar.getInstance();
	startCalendar.setTimeInMillis(Long.parseLong(startTime));
	long startTimeMilli = startCalendar.getTimeInMillis();

	// Sets calendar with end time.
	Calendar endCalendar = Calendar.getInstance();
	endCalendar.setTimeInMillis(Long.parseLong(endTime));
	long endTimeMilli = endCalendar.getTimeInMillis();

	do
	{
	    if (StringUtils.equalsIgnoreCase(type, "date"))
	    {
		// to get month and date ( example : Jan 12 )
		dateHashtable.put(DateUtil.getNearestDateOnlyFromEpoch(startTimeMilli, timeZone), getDefaultCountTable(logTypes));
		startCalendar.add(Calendar.DAY_OF_MONTH, 1);
		startTimeMilli = startCalendar.getTimeInMillis();
	    }
	    else if (StringUtils.equalsIgnoreCase(type, "hour"))
	    {
		// to get 12hours frame ( example : 7 AM )
		dateHashtable.put(DateUtil.getNearestHourOnlyFromEpoch(startTimeMilli, timeZone), getDefaultCountTable(logTypes));
		startCalendar.add(Calendar.HOUR, 1);
		startTimeMilli = startCalendar.getTimeInMillis();
	    }
	    else
	    {
		// to get day (example : mon , tue etc..)
		dateHashtable.put(DateUtil.getNearestDayOnlyFromEpoch(startTimeMilli, timeZone), getDefaultCountTable(logTypes));
		startCalendar.add(Calendar.DAY_OF_WEEK, 1);
		startTimeMilli = startCalendar.getTimeInMillis();
	    }
	}
	while (startTimeMilli <= endTimeMilli);

	return dateHashtable;
    }

    /**
     * Constructs a default LinkedHashMap for the String of arrays and sets
     * array value as key and '0' as value. For e.g., {EmailsSent=0,
     * EmailsOpened=0, UniqueClicks=0, TotalClicks=0}
     * 
     * @param variable
     *            - array of types like EmailsSent, Opened, Unique Clicks and
     *            TotalClicks
     * @return LinkedHashMap
     */
    public static LinkedHashMap<String, Integer> getDefaultCountTable(String[] variable)
    {
	LinkedHashMap<String, Integer> countHashtable = new LinkedHashMap<String, Integer>();

	// Initialize given varibles with zeros.
	for (String string : variable)
	{
	    countHashtable.put(string, 0);
	}
	return countHashtable;
    }

    /**
     * Returns start date in mysql date format based on type like hourly, weekly
     * or daily
     * 
     * @param startTime
     *            - Epoch time of start date.
     * @param endTime
     *            - Epoch time of end date. Required for weekly
     * @param type
     *            - hourly or weekly or daily.
     * @param timeZone
     *            - TimeZone Id obtained from client side. E.g. -330
     * @return String
     */
    public static String getStartDate(String startTime, String endTime, String type, String timeZone)
    {
	// Weekly
	if (StringUtils.equalsIgnoreCase(type, "day"))
	{
	    Calendar calendar = Calendar.getInstance();
	    calendar.setTimeInMillis(Long.parseLong(endTime));
	    calendar.add(Calendar.DAY_OF_MONTH, -6);
	    startTime = calendar.getTimeInMillis() + "";
	}

	// Converts epoch time to "yyyy-MM-dd HH:mm:ss" and set timezone.
	return DateUtil.getMySQLNowDateFormat(Long.parseLong(startTime), timeZone);
    }

    /**
     * Returns end date with mid-night time in mysql date format.
     * 
     * @param endTime
     *            - Epoch time of end date.
     * @param timeZone
     *            - TimeZone Id obtained from client side. E.g. -330
     * @return String
     */
    public static String getEndDate(String endTime, String timeZone)
    {
	Calendar endCal = Calendar.getInstance();
	endCal.setTimeInMillis(Long.parseLong(endTime));
	endCal.add(Calendar.HOUR, 23);
	endCal.add(Calendar.MINUTE, 59);
	endCal.add(Calendar.SECOND, 59);
	endTime = endCal.getTimeInMillis() + "";

	// Converts epoch time to "yyyy-MM-dd HH:mm:ss" and set timezone.
	return DateUtil.getMySQLNowDateFormat(Long.parseLong(endTime), timeZone);
    }
    
    /**
     * Returns end date with mid-night time in mysql date format.
     * 
     * @param endTime
     *            - Epoch time of end date.
     * @param timeZone
     *            - TimeZone Id obtained from client side. E.g. -330
     * @return String
     */
    public static String getEndDateForReports(String endTime, String timeZone)
    {
	// Converts epoch time to "yyyy-MM-dd HH:mm:ss" and set timezone.
	return DateUtil.getMySQLNowDateFormat(Long.parseLong(endTime), timeZone);
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
    public static LinkedHashMap<String, LinkedHashMap<String, Integer>> getCampaignStatsData(String startDate, String endDate, String type, String timeZone,
	    JSONArray sqlData)
    {
	// Types of bars in a bar graph
	String[] barTypes = { "EMAIL_SENT", "EMAIL_OPENED", "EMAIL_CLICKED", "total" };
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
	String replacedCampaignStats = JSONSerializer.toJSON(campaignStats).toString().replace("EMAIL_SENT", "Email Sent")
		.replace("EMAIL_OPENED", "Email Opened").replace("EMAIL_CLICKED", "Unique Clicks").replace("total", "Total Clicks");

	return replacedCampaignStats;
    }
}