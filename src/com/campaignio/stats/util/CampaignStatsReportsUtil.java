package com.campaignio.stats.util;

import java.util.Calendar;
import java.util.LinkedHashMap;

import org.apache.commons.lang.StringUtils;

/**
 * <code>CampaignStatsReportsUtil</code> initializes graphs with default data.
 * Initializes all values of bar-graph to zero.
 */
public class CampaignStatsReportsUtil
{
    /**
     * Constructs a default hash table for the dates between the duration and
     * time zone and sets date as key and getDefaultCountTable() as value
     * 
     * @return LinkedHashMap<String, LinkedHashMap>
     */
    public static LinkedHashMap<String, LinkedHashMap> getDefaultDateTable(
	    String startTime, String endTime, String type, String timeZone,
	    String[] logTypes)
    {

	LinkedHashMap<String, LinkedHashMap> dateHashtable = new LinkedHashMap<String, LinkedHashMap>();
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
		dateHashtable.put(DateUtil.getNearestDateOnlyFromEpoch(
			startTimeMilli, timeZone),
			getDefaultCountTable(logTypes));
		startCalendar.add(Calendar.DAY_OF_MONTH, 1);
		startTimeMilli = startCalendar.getTimeInMillis();
	    }
	    else if (StringUtils.equalsIgnoreCase(type, "hour"))
	    {
		// to get 12hours frame ( example : 7 AM )
		dateHashtable.put(DateUtil.getNearestHourOnlyFromEpoch(
			startTimeMilli, timeZone),
			getDefaultCountTable(logTypes));
		startCalendar.add(Calendar.HOUR, 1);
		startTimeMilli = startCalendar.getTimeInMillis();
	    }
	    else
	    {
		// to get day (example : mon , tue etc..)
		dateHashtable.put(DateUtil.getNearestDayOnlyFromEpoch(
			startTimeMilli, timeZone),
			getDefaultCountTable(logTypes));
		startCalendar.add(Calendar.DAY_OF_WEEK, 1);
		startTimeMilli = startCalendar.getTimeInMillis();
	    }
	}
	while (startTimeMilli <= endTimeMilli);

	return dateHashtable;
    }

    /**
     * Constructs a default hash table for the String of arrays and sets array
     * value as key and '0' as value
     * 
     * @return LinkedHashMap<String, Integer>
     */
    public static LinkedHashMap<String, Integer> getDefaultCountTable(
	    String[] variable)
    {
	LinkedHashMap<String, Integer> countHashtable = new LinkedHashMap<String, Integer>();
	for (String string : variable)
	{
	    countHashtable.put(string, 0);
	}
	return countHashtable;
    }

}
