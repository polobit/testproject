package com.agilecrm.util;

/*
 * Funambol is a mobile platform developed by Funambol, Inc. 
 * Copyright (C) 2003 - 2007 Funambol, Inc.
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by
 * the Free Software Foundation with the addition of the following permission 
 * added to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED
 * WORK IN WHICH THE COPYRIGHT IS OWNED BY FUNAMBOL, FUNAMBOL DISCLAIMS THE 
 * WARRANTY OF NON INFRINGEMENT  OF THIRD PARTY RIGHTS.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU Affero General Public License 
 * along with this program; if not, see http://www.gnu.org/licenses or write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301 USA.
 * 
 * You can contact Funambol, Inc. headquarters at 643 Bair Island Road, Suite 
 * 305, Redwood City, CA 94063, USA, or at email address info@funambol.com.
 * 
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 * 
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Powered by Funambol" logo. If the display of the logo is not reasonably 
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Powered by Funambol".
 */

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;

/**
 * Utility class for date manipulation. This class gives a simple interface for
 * common Date, Calendar and Timezone operations. It is possible to apply
 * subsequent transformations to an initial date, and retrieve the changed Date
 * object at any point.
 * 
 */
public class DateUtil
{

	// --------------------------------------------------------------- Attributes
	private Calendar cal;
	public static final String WaiTillDateRegEx = "(0?[1-9]|1[012])/(0?[1-9]|[12][0-9]|3[01])/((19|20)\\d\\d)";

	public static final String WaitTillDateFormat = "MM/dd/yyyy";

	 public static final String CustomFieldDateRegEx = "(0?[1-9]|[12][0-9]|3[01])\\s([a-zA-Z]{3})\\s((19|20)\\d\\d)";

	 public static final String CustomFieldDateFormat = "dd MMM yyyy";

	private static final String CustomFieldCSVDateRegEx = "(0?[1-9]|[12][0-9]|3[01])\\s([a-zA-Z]{3})\\s((19|20)\\d\\d)";

	private static final String CustomFieldCSVDateFormat = "dd/MM/yyyy";

	// dd/MM/yyyy
	// ------------------------------------------------------------ Constructors

	/** Inizialize a new instance with the current date */
	public DateUtil()
	{
		this(new Date());
	}

	/** Inizialize a new instance with the given date */
	public DateUtil(Date d)
	{
		cal = Calendar.getInstance();
		cal.setTime(d);
	}

	// ---------------------------------------------------------- Public methods

	/** Set a new time */
	public void setTime(Date d)
	{
		cal.setTime(d);
	}

	/** Get the current time */
	public Date getTime()
	{
		return cal.getTime();
	}

	/** Get the current TimeZone */
	public String getTZ()
	{
		return cal.getTimeZone().getID();
	}

	public Calendar getCalendar()
	{
		return cal;
	}

	/**
	 * Convert the time to the midnight of the currently set date. The internal
	 * date is changed after this call.
	 * 
	 * @return a reference to this DateUtil, for concatenation.
	 */
	public DateUtil toMidnight()
	{

		cal.set(Calendar.HOUR_OF_DAY, 0);
		cal.set(Calendar.MINUTE, 0);
		cal.set(Calendar.SECOND, 0);
		cal.set(Calendar.MILLISECOND, 0);

		return this;
	}

	/**
	 * Make the date go back of the specified amount of days The internal date
	 * is changed after this call.
	 * 
	 * @return a reference to this DateUtil, for concatenation.
	 */
	public DateUtil removeDays(int days)
	{

		Date d = cal.getTime();
		long time = d.getTime();
		time -= days * 24 * 3600 * 1000l;
		d.setTime(time);
		cal.setTime(d);

		return this;
	}

	/**
	 * Make the date go back of the specified amount of days The internal date
	 * is changed after this call.
	 * 
	 * @return a reference to this DateUtil, for concatenation.
	 */
	public DateUtil addDays(int days)
	{

		Date d = cal.getTime();
		long time = d.getTime();
		time += days * 24 * 3600 * 1000;
		d.setTime(time);
		cal.setTime(d);

		return this;
	}

	/**
	 * Make the date go forward of the specified amount of minutes The internal
	 * date is changed after this call.
	 * 
	 * @return a reference to this DateUtil, for concatenation.
	 */
	public DateUtil addMinutes(int minutes)
	{
		Date d = cal.getTime();
		long time = d.getTime();
		time += minutes * 60 * 1000;
		d.setTime(time);
		cal.setTime(d);

		return this;
	}

	/**
	 * Convert the date to GMT. The internal date is changed
	 * 
	 * @return a reference to this DateUtil, for concatenation.
	 */
	public DateUtil toGMT()
	{
		return toTZ("GMT");
	}

	/**
	 * Convert the date to the given timezone. The internal date is changed.
	 * 
	 * @param tz
	 *            The name of the timezone to set
	 * 
	 * @return a reference to this DateUtil, for concatenation.
	 */
	public DateUtil toTZ(String tz)
	{
		cal.setTimeZone(TimeZone.getTimeZone(tz));

		return this;
	}

	public DateUtil setHoursAndMinutes(int hours, int minutes)
	{
		cal.set(Calendar.HOUR_OF_DAY, hours);
		cal.set(Calendar.MINUTE, minutes);

		return this;
	}

	/**
	 * Get the days passed from the specified date up to the date provided in
	 * the constructor
	 * 
	 * @param date
	 *            The starting date
	 * 
	 * @return number of days within date used in constructor and the provided
	 *         date
	 */
	public int getDaysSince(Date date)
	{
		long millisecs = date.getTime();
		Date d = cal.getTime();
		long time = d.getTime();
		long daysMillisecs = time - millisecs;
		int days = (int) ((((daysMillisecs / 1000) / 60) / 60) / 24);
		return days;
	}

	/**
	 * Utility method wrapping Calendar.after method Compares the date field
	 * parameter with the date provided with the constructor answering the
	 * question: date from constructor is after the given param date ?
	 * 
	 * @param date
	 *            The date to be used for comparison
	 * 
	 * @return true if date from constructor is after given param date
	 */
	public boolean isAfter(Date date)
	{
		Calendar cal2 = Calendar.getInstance();
		cal2.setTime(date);
		return cal.after(cal2);
	}

	public void setCalendar(Calendar cal)
	{
		this.cal = cal;
	}

	/**
	 * Gets Calendar in Pacific. Returns date in specified format and time zone
	 * for the give epoch time.
	 * 
	 * @param timeout
	 * @return date string
	 */
	public static String getCalendarString(long timeout)
	{
		// Defines output format and print
		SimpleDateFormat sdf = new SimpleDateFormat("d MMM yyyy hh:mm aaa");
		TimeZone pst = TimeZone.getTimeZone("PST");

		sdf.setTimeZone(pst);
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(timeout);

		String date = sdf.format(calendar.getTime());
		return date;
	}

	/**
	 * Gets Calendar in server timezone.
	 * 
	 * @param timeout
	 * @return
	 */
	public static String getCalendarString(long timeout, String format, String timezone)
	{
		// Defines output format and print
		SimpleDateFormat sdf = new SimpleDateFormat(format);

		if (StringUtils.isEmpty(timezone))
			timezone = "GMT";

		sdf.setTimeZone(TimeZone.getTimeZone(timezone));
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(timeout);

		String date = sdf.format(calendar.getTime());
		return date;
	}

	/**
	 * Gets the difference in number of months between two dates
	 * 
	 * @param first
	 *            date and second date
	 * @return difference in double
	 */
	public static double monthsBetween(String endTime, String startTime)
	{
		// Get all the months first. Then create a filter monthly for tag1 while
		// running monthly reports on tags2
		Calendar date1 = Calendar.getInstance();
		date1.setTimeInMillis(Long.parseLong(endTime));

		Calendar date2 = Calendar.getInstance();
		date2.setTimeInMillis(Long.parseLong(startTime));

		double monthsBetween = 0;
		// difference in month for years
		monthsBetween = (date1.get(Calendar.YEAR) - date2.get(Calendar.YEAR)) * 12;
		// difference in month for months
		monthsBetween += date1.get(Calendar.MONTH) - date2.get(Calendar.MONTH);
		// difference in month for days
		if (date1.get(Calendar.DAY_OF_MONTH) != date1.getActualMaximum(Calendar.DAY_OF_MONTH)
				&& date1.get(Calendar.DAY_OF_MONTH) != date1.getActualMaximum(Calendar.DAY_OF_MONTH))
		{
			monthsBetween += ((date1.get(Calendar.DAY_OF_MONTH) - date2.get(Calendar.DAY_OF_MONTH)) / 31d);
		}
		return monthsBetween;
	}

	/**
	 * Returns calendar for given date with its timezone at given time
	 * 
	 * @param duration
	 *            Date string. Eg: 18-08-2014
	 * @param timeZoneString
	 *            Timezone in string. Eg: IST
	 * @param at
	 *            Time in string. Eg: 21:00
	 * @return
	 */
	public static Calendar getCalendar(String duration, String timeZoneString, String at)
	{
		SimpleDateFormat sdf = null;
		TimeZone timeZone = TimeZone.getTimeZone(timeZoneString);
		Calendar calendar = Calendar.getInstance(timeZone);
		String hours = at.substring(0, 2);
		String mins = at.substring(3);
		try
		{
			// Pattern for MM/dd/yyyy - From calendar of wait till node
			Pattern calendarPattern = Pattern.compile(WaiTillDateRegEx);
			Matcher calendarMatcher = calendarPattern.matcher(duration);

			// Pattern for dd MMM yyyy - From custom field in admin settings
			Pattern customFieldPattern = Pattern.compile(CustomFieldDateRegEx);
			Matcher customFieldMatcher = customFieldPattern.matcher(duration);

			// Pattern for dd/MM/yyyy - From csv import CSVUtil reference
			Pattern customFieldCSVPattern = Pattern.compile(CustomFieldCSVDateRegEx);
			Matcher customFieldCSVMatcher = customFieldCSVPattern.matcher(duration);

			if (calendarMatcher.matches())
				sdf = new SimpleDateFormat(WaitTillDateFormat);
			else if (customFieldMatcher.matches())
				sdf = new SimpleDateFormat(CustomFieldDateFormat);
			else if (customFieldCSVMatcher.matches())
				sdf = new SimpleDateFormat(CustomFieldCSVDateFormat);
			else
				return null;
			//Set timezone to the simple date format
			sdf.setTimeZone(timeZone);
			calendar.setTime(sdf.parse(duration));
		}
		catch (Exception e)
		{
			System.out.println("Inside getCalender in DateUtil");
			e.printStackTrace();
		}
		calendar.set(Calendar.HOUR_OF_DAY, Integer.parseInt(hours));
		calendar.set(Calendar.MINUTE, Integer.parseInt(mins));

		return calendar;

	}
	/**
	 * Returns time zone offset in minutes as {String} 
	 * to add to UTC to get standard time in this 
	 * time zone for current user
	 * 
	 */
	public static String getCurrentUserTimezoneOffset()
	{
		String timeZone = null;
		try
		{
			UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();
			if(userPrefs!=null && userPrefs.timezone!=null)
			{
				TimeZone current_timezone = TimeZone.getTimeZone(userPrefs.timezone);
				if(current_timezone!=null)
				{
					timeZone = String.valueOf(((current_timezone.getRawOffset()/1000)/60));
				}
			}
		}
		catch (Exception e)
		{
			System.out.println("Inside getCurrentUserTimezoneId in DateUtil");
			e.printStackTrace();
		}
		return timeZone;

	}

}