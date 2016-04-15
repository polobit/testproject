package com.campaignio.reports;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.db.util.GoogleSQLUtil;

/**
 * <code>DateUtil</code> is the date utility class for
 * {@link CampaignReportsUtil}. It provides methods to get round values of date.
 * For e.g., if the time is 12:30 AM, it rounds to 12AM. Similarly for the
 * weekday and date values. It also provides method to convert date to MySql
 * date format, inorder to interact with mysql.
 * 
 * @author Naresh
 * 
 */
public class DateUtil
{
	/**
	 * Returns nearest date. It rounds the date value to nearest 12am time. For
	 * e.g., 2013-03-01 11:32 AM is rounded to 2013-03-01
	 * 
	 * @param timeInMilliSecs
	 *            - Epoch time of date value
	 * @param timeZone
	 *            - TimeZone Id obtained from client
	 * @return String.
	 */
	public static String getNearestDateOnlyFromEpoch(long timeInMilliSecs, String timeZone)
	{
		DateFormat dateFormat = new SimpleDateFormat("MMM dd");
		return getGMTDateInMilliSecFromTimeZoneId(timeZone, timeInMilliSecs, dateFormat);
	}

	/**
	 * Returns nearest hour. It rounds the time value to nearest hour value. For
	 * e.g., 11:30 AM is rounded to 11 AM
	 * 
	 * @param timeInMilliSecs
	 *            - Epoch time of time value.
	 * @param timeZone
	 *            - TimeZone Id obtained from client
	 * @return String
	 */
	public static String getNearestHourOnlyFromEpoch(long timeInMilliSecs, String timeZone)
	{
		DateFormat dateFormat = new SimpleDateFormat("h a");
		return getGMTDateInMilliSecFromTimeZoneId(timeZone, timeInMilliSecs, dateFormat);
	}

	/**
	 * Returns nearest week-day . It rounds the day to nearest weekday.For e.g.,
	 * Thu 11:30 AM is rounded to Thu
	 * 
	 * @param timeInMilliSecs
	 *            - Epoch time of day value.
	 * @param timeZone
	 *            - TimeZone Id obtained from client.
	 * @return String
	 */
	public static String getNearestDayOnlyFromEpoch(long timeInMilliSecs, String timeZone)
	{
		DateFormat dateFormat = new SimpleDateFormat("EEE");
		return getGMTDateInMilliSecFromTimeZoneId(timeZone, timeInMilliSecs, dateFormat);
	}

	/**
	 * Returns GMT epoch time based on timezone.
	 * 
	 * @param timeZoneId
	 *            - TimeZone Id.
	 * @param timeInMilliSecs
	 *            - Epoch time.
	 * @param dateFormat
	 *            - Date format.
	 * @return - String
	 */
	public static String getGMTDateInMilliSecFromTimeZoneId(String timeZoneId, long timeInMilliSecs,
			DateFormat dateFormat)
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
			System.out.println(e.getMessage());
		}

		return dateFormat.format(new Date());
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
	public static String getMySQLNowDateFormat(long timestamp, String timeZoneOffset)
	{
		Date date = new Date(timestamp);
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		format.setTimeZone(TimeZone.getTimeZone("GMT" + GoogleSQLUtil.convertMinutesToTime(timeZoneOffset)));
		return format.format(date);
	}

	/**
	 * Returns date in GMT timezone in given format.
	 * 
	 * @param timestamp
	 *            - epoch time
	 * @param dateFormat
	 *            - any date format
	 * @return String
	 */
	public static String getGMTDateInGivenFormat(long timestamp, String dateFormat)
	{
		Date date = new Date(timestamp);
		DateFormat format = new SimpleDateFormat(dateFormat);
		format.setTimeZone(TimeZone.getTimeZone("GMT"));
		return format.format(date);
	}

	public static String getDateInGivenFormat(long timestamp, String dateFormat, String timezone)
	{
		// If null or empty
		if(StringUtils.isBlank(timezone))
			timezone = "UTC";
		
		Date date = new Date(timestamp);
		DateFormat format = new SimpleDateFormat(dateFormat);
		format.setTimeZone(TimeZone.getTimeZone(timezone));
		return format.format(date);
	}
}
