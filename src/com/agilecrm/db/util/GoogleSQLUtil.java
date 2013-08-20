package com.agilecrm.db.util;

import org.apache.commons.lang.StringUtils;

/**
 * <code>GoogleSQLUtil</code> is the base class for adding, getting and deleting rows
 * from SQL table.
 * 
 */
public class GoogleSQLUtil
{
    /**
     * Append limit to query to retrieve recent results.
     * 
     * @param limit
     *            - required limit.
     * @return String.
     */
    public static String appendLimitToQuery(String limit)
    {
	if (StringUtils.isEmpty(limit))
	    return "";

	return " LIMIT " + limit;
    }

    /**
     * Appends domain to SQL query.
     * 
     * @param domain
     *            - domain name.
     * @return domain query string.
     */
    public static String appendDomainToQuery(String domain)
    {
	return " domain = " + encodeSQLColumnValue(domain);
    }

    /**
     * Returns string value appended by quotations if not null. It is used to
     * avoid 'null' values(having quotations) being inserted instead of null.
     * 
     * @param value
     *            - given string.
     * @return encoded string if not null, otherwise null.
     */
    public static String encodeSQLColumnValue(String value)
    {
	// If value is null, insert empty but not null
	if (value == null)
	    return "\'\'";

	// Removes single quotation on start and end.
	String replaceSingleQuote = value.replaceAll("(^')|('$)", "");

	// Removes double quotes
	String replaceDoubleQuote = replaceSingleQuote.replaceAll("(^\")|(\"$)", "");

	// Replace ' with \' within the value. To avoid error while insertion
	// into table
	if (replaceDoubleQuote.contains("'"))
	    replaceDoubleQuote = replaceDoubleQuote.replace("'", "\\'");

	return "\'" + replaceDoubleQuote + "\'";
    }

    /**
     * Adds mysql CONVERT_TZ for logTime inorder to convert into required
     * timezone offset
     * 
     * @param timeZoneOffset
     *            - Timezone offset.
     * @return String.
     */
    public static String addConvertTZ(String timeZoneOffset)
    {
	return "CONVERT_TZ(log_time,'+00:00'," + GoogleSQLUtil.encodeSQLColumnValue(timeZoneOffset) + ")";
    }

    /**
     * Converts total minutes to (+/-)HH:mm
     * 
     * @param timeZone
     *            - total minutes.
     * @return String
     */
    public static String convertMinutesToTime(String timeZone)
    {
	String time = timeZone;
	String sign = "-";

	// Change sign to '+' if '-'
	if (timeZone.charAt(0) == '-')
	{
	    time = timeZone.split("-")[1];
	    sign = "+";
	}

	else if (timeZone.charAt(0) == '+')
	{
	    time = timeZone.split("+")[1];
	}

	int hours = Integer.parseInt(time) / 60;
	int minutes = Integer.parseInt(time) % 60;

	String timez = String.format("%02d:%02d", hours, minutes);
	return sign + timez;
    }

    /**
     * Returns mysql date format based on type.
     * 
     * @param type
     *            - hour,day or date.
     * @return
     */
    public static String getDateFormatBasedOnType(String type)
    {
	// 1 to 12 AM or PM Eg. 1 AM
	if (type.equals("hour"))
	    return GoogleSQLUtil.encodeSQLColumnValue("%l %p");

	// Sun to Sat Eg. Mon
	else if (type.equals("day"))
	    return GoogleSQLUtil.encodeSQLColumnValue("%a");

	// Jan to Dec 01 to 31 Eg. Jan 04
	return GoogleSQLUtil.encodeSQLColumnValue("%b %d");
    }
}