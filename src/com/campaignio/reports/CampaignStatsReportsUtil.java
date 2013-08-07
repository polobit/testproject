package com.campaignio.reports;

import java.util.Calendar;
import java.util.LinkedHashMap;

import org.apache.commons.lang.StringUtils;

/**
 * <code>CampaignStatsReportsUtil</code> is the utility class that initializes
 * graphs with default data. Inorder to built bar-charts with the values
 * obtained, first need to intialize the X-axis and Y-axis values with default
 * values.
 * <p>
 * <code>CampaignStatsReportsUtil</code> initializes the X-axis with hour or
 * week-day or date values based on type. Under each value, EmailsSent,
 * EmailsOpened, Clicks and Total Clicks are initialized with zero each.
 * </p>
 * 
 * @author Naresh
 */
public class CampaignStatsReportsUtil
{
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

	Calendar startCalendar = Calendar.getInstance();
	startCalendar.setTimeInMillis(Long.parseLong(startTime));
	long startTimeMilli = startCalendar.getTimeInMillis();

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
	for (String string : variable)
	{
	    countHashtable.put(string, 0);
	}
	return countHashtable;
    }

}
