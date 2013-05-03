package com.campaignio.stats.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Hashtable;
import java.util.TimeZone;

import com.agilecrm.db.util.EmailStatsUtil;

public class DateUtil
{
    public static void main(String[] args)
    {
	Calendar cal = Calendar.getInstance();
	Date date = cal.getTime();
	DateFormat dateFormat = new SimpleDateFormat(
		"EEE, d MMM yyyy HH:mm:ss z");

	System.out.println(getGMTDateInMilliSecFromTimeZoneId("-330",
		1358879400000l, dateFormat));

    }

    // Get Next of the Month
    public static Date getNextDayOfTheMonth()
    {
	Calendar calendar = Calendar.getInstance();

	calendar.set(Calendar.HOUR_OF_DAY, 0);
	calendar.set(Calendar.MINUTE, 0);
	calendar.set(Calendar.SECOND, 0);
	calendar.set(Calendar.MILLISECOND, 0);
	calendar.add(Calendar.DATE, 1);
	return calendar.getTime();
    }

    // Get First Day of Month
    public static Date getFirstDayOfTheMonth()
    {
	Calendar calendar = Calendar.getInstance();

	calendar.set(Calendar.HOUR_OF_DAY, 0);
	calendar.set(Calendar.MINUTE, 0);
	calendar.set(Calendar.SECOND, 0);
	calendar.set(Calendar.MILLISECOND, 0);
	calendar.set(Calendar.DAY_OF_MONTH, 1);

	return calendar.getTime();
    }

    // Get First Day of Year
    public static Date getFirstDayOfTheYear()
    {
	Calendar calendar = Calendar.getInstance();

	calendar.set(Calendar.HOUR_OF_DAY, 0);
	calendar.set(Calendar.MINUTE, 0);
	calendar.set(Calendar.SECOND, 0);
	calendar.set(Calendar.MILLISECOND, 0);
	calendar.set(Calendar.DAY_OF_MONTH, 1);
	calendar.set(Calendar.MONTH, 0);

	return calendar.getTime();
    }

    // Get First Day of Month
    public static Date getEndDayOfTheMonth()
    {
	Calendar calendar = Calendar.getInstance();

	calendar.set(Calendar.HOUR_OF_DAY, 0);
	calendar.set(Calendar.MINUTE, 0);
	calendar.set(Calendar.SECOND, 0);
	calendar.set(Calendar.MILLISECOND, 0);
	calendar.set(Calendar.DAY_OF_MONTH,
		calendar.getActualMaximum(Calendar.DAY_OF_MONTH));

	return calendar.getTime();
    }

    // Get Nearest Date (12am)
    public static Date getNearestDateFromEpoch(long timeInMilliSecs)
    {
	Calendar calendar = Calendar.getInstance();
	calendar.clear();
	calendar.setTimeInMillis(timeInMilliSecs);
	calendar.set(Calendar.HOUR_OF_DAY, 0);
	calendar.set(Calendar.MINUTE, 0);
	calendar.set(Calendar.SECOND, 0);
	calendar.set(Calendar.MILLISECOND, 0);

	return calendar.getTime();
    }

    // Get Nearest Hour
    public static Date getNearestHourFromEpoch(long timeInMilliSecs)
    {
	Calendar calendar = Calendar.getInstance();
	calendar.clear();
	calendar.setTimeInMillis(timeInMilliSecs);
	calendar.set(Calendar.MINUTE, 0);
	calendar.set(Calendar.SECOND, 0);
	calendar.set(Calendar.MILLISECOND, 0);

	return calendar.getTime();
    }

    // Get Nearest Date in milli seconds(12am)
    public static long getNearestDateLongFromEpoch(long timeInMilliSecs)
    {

	// timeInMilliSecs = timeInMilliSecs * 1000;
	Calendar calendar = Calendar.getInstance();

	calendar.clear();
	calendar.setTimeInMillis(timeInMilliSecs);

	calendar.set(Calendar.HOUR_OF_DAY, 0);
	calendar.set(Calendar.MINUTE, 0);
	calendar.set(Calendar.SECOND, 0);
	calendar.set(Calendar.MILLISECOND, 0);

	return calendar.getTimeInMillis();
    }

    // Get Nearest Date only (12am)
    public static String getNearestDateOnlyFromEpoch(long timeInMilliSecs,
	    String timeZone)
    {
	DateFormat dateFormat = new SimpleDateFormat("MMM dd");
	return getGMTDateInMilliSecFromTimeZoneId(timeZone, timeInMilliSecs,
		dateFormat);
    }

    // Get Nearest Hour only
    public static String getNearestHourOnlyFromEpoch(long timeInMilliSecs,
	    String timeZone)
    {
	DateFormat dateFormat = new SimpleDateFormat("h a");
	return getGMTDateInMilliSecFromTimeZoneId(timeZone, timeInMilliSecs,
		dateFormat);
    }

    // Get Nearest day only
    public static String getNearestDayOnlyFromEpoch(long timeInMilliSecs,
	    String timeZone)
    {
	DateFormat dateFormat = new SimpleDateFormat("EEE");
	return getGMTDateInMilliSecFromTimeZoneId(timeZone, timeInMilliSecs,
		dateFormat);
    }

    // Date differnce
    public static String dateDiff(long newTimeInMill, long oldTimeInMill)
    {

	if (newTimeInMill == 0 || oldTimeInMill == 0)
	    return null;

	long diff = 0;

	if (newTimeInMill > oldTimeInMill)
	    diff = newTimeInMill - oldTimeInMill;
	else
	    diff = oldTimeInMill - newTimeInMill;

	long diffSeconds = diff / 1000;
	long diffMinutes = diff / (60 * 1000);
	long diffHours = diff / (60 * 60 * 1000);
	long diffDays = diff / (24 * 60 * 60 * 1000);

	if (diffDays > 0)
	{
	    if (diffDays == 1)
	    {
		return diffDays + "d";
	    }
	    else
	    {
		// TicketUtil.getFormattedTime(timestamp, timeZone);
		return diffDays + "d";
	    }

	}
	else if (diffHours > 0)
	{
	    return diffHours + "h";

	}
	else if (diffMinutes > 0)
	{
	    return diffMinutes + "m";

	}
	else
	    return "Just now";

    }

    // Get date based on timeZone
    public static Date getGMTDateFromTimeZoneId(String timeZoneId)
    {

	if (timeZoneId == null || timeZoneId.trim().length() == 0)
	    return null;

	try
	{

	    Calendar cal = Calendar.getInstance();
	    TimeZone tz = TimeZone.getTimeZone(timeZoneId);
	    cal.setTimeZone(tz);

	    int offset = tz.getRawOffset();
	    int offsetHrs = offset / 1000 / 60 / 60;
	    int offsetMins = offset / 1000 / 60 % 60;

	    cal.add(Calendar.HOUR_OF_DAY, (offsetHrs));
	    cal.add(Calendar.MINUTE, (offsetMins));

	    Date date = cal.getTime();
	    return date;

	}
	catch (Exception e)
	{
	    // TODO: handle exception
	    System.out.println(e.getMessage());
	}

	return null;
    }

    // Get string of date based on timeZone
    public static String getGMTDateInMilliSecFromTimeZoneId(String timeZoneId,
	    long timeInMilliSecs, DateFormat dateFormat)
    {
	if (dateFormat == null)
	    dateFormat = new SimpleDateFormat();

	if (timeZoneId == null || timeZoneId.trim().length() == 0)
	    return dateFormat.format(new Date());

	Calendar cal = Calendar.getInstance();
	cal.setTimeInMillis(timeInMilliSecs);
	try
	{
	    if (timeZoneId.contains("-"))
		timeZoneId = timeZoneId.replace("-", "");

	    // converting offset time to milliseconds
	    int offset = Integer.parseInt(timeZoneId) * 60 * 1000;

	    // zone id's based on offset
	    String[] idsArr = TimeZone.getAvailableIDs(offset);

	    TimeZone tz = TimeZone.getTimeZone(idsArr[0]);
	    dateFormat.setTimeZone(tz);
	    cal.setTimeZone(tz);

	    return dateFormat.format(cal.getTime());
	}
	catch (Exception e)
	{
	    // TODO: handle exception
	    System.out.println(e.getMessage());
	}

	return dateFormat.format(new Date());
    }

    // Get available time zones
    @SuppressWarnings("unchecked")
    public static ArrayList getTimeZones()
    {

	String[] timeZoneIds = TimeZone.getAvailableIDs();

	Hashtable timeZones = new Hashtable();

	for (final String id : timeZoneIds)
	{
	    Calendar cal = Calendar.getInstance();
	    TimeZone tz = TimeZone.getTimeZone(id);
	    cal.setTimeZone(tz);
	    String displayName = cal.getTimeZone().getDisplayName();

	    int offset = tz.getRawOffset();
	    timeZones.put(id, offset);

	}

	ArrayList myArrayList = new ArrayList(timeZones.entrySet());

	// Collections.sort(myArrayList, new MyComparator());

	return myArrayList;
    }

    /**
     * Convert time stamp into twitter formatted date
     * 
     * @param timestamp
     * @param timeZone
     * @return
     */
    public static String getTwitterFormattedTime(long timestamp, String timeZone)
    {

	TimeZone tz = TimeZone.getTimeZone(timeZone);
	Calendar agentCal = Calendar.getInstance(tz);

	agentCal.setTimeInMillis(timestamp);

	DateFormat dateFormat = DateFormat.getDateInstance();
	dateFormat.setTimeZone(tz);

	String fullDate = dateFormat.format(agentCal.getTime());

	if (fullDate.indexOf(",") == -1)
	    return fullDate;

	fullDate = fullDate.split(",")[0];

	if (fullDate.indexOf(" ") == -1)
	    return fullDate;

	String[] dateAndTimeArray = fullDate.split(" ");
	String formatedDate = dateAndTimeArray[1] + " " + dateAndTimeArray[0];
	return formatedDate;
    }

    // Convert time stamp into user time zone
    public static String getFormattedTime(long timestamp, String timeZone)
    {
	TimeZone tz = TimeZone.getTimeZone(timeZone);
	Calendar agentCal = Calendar.getInstance(tz);

	agentCal.setTimeInMillis(timestamp);

	DateFormat dateFormat = DateFormat.getDateInstance();
	dateFormat.setTimeZone(tz);

	DateFormat timeFormat = DateFormat.getTimeInstance(DateFormat.SHORT);
	timeFormat.setTimeZone(tz);

	return timeFormat.format(agentCal.getTime()) + " on "
		+ dateFormat.format(agentCal.getTime());

    }

    /**
     * Returns mysql NOW() date format after setting client's timezone.
     * 
     * @param timestamp
     *            - epochtime
     * @param timeZoneOffset
     *            - timezone offset received from client.
     * @return String
     */
    public static String getMySQLNowDateFormat(long timestamp,
	    String timeZoneOffset)
    {
	Date date = new Date(timestamp);
	DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	format.setTimeZone(TimeZone.getTimeZone("GMT"
		+ EmailStatsUtil.convertMinutesToTime(timeZoneOffset)));
	return format.format(date);
    }
}
