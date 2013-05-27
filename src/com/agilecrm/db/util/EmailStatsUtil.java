package com.agilecrm.db.util;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>EmailStatsUtil</code> is the base class for email stats reports. It
 * builds required sql query and return respective results.
 * 
 * @author Naresh
 * 
 */
public class EmailStatsUtil
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

	if (StringUtils.isEmpty(domain))
	    return null;

	String uniqueClicks = "(SELECT campaign_name,log_type,COUNT(DISTINCT subscriber_id) AS count  FROM campaign_logs WHERE log_type IN ('EMAIL_SENT', 'EMAIL_CLICKED', 'EMAIL_OPENED') AND "
		+ SQLUtil.appendDomainToQuery(domain)
		+ " GROUP BY log_type,campaign_name)";

	String totalClicks = "(SELECT campaign_name,log_type,COUNT(subscriber_id) AS total  FROM campaign_logs WHERE log_type IN ('EMAIL_CLICKED') AND "
		+ SQLUtil.appendDomainToQuery(domain)
		+ " GROUP BY log_type,campaign_name)";

	String campaignStats = "SELECT A.campaign_name, A.log_type, A.count,B.total FROM "
		+ uniqueClicks
		+ " A LEFT OUTER JOIN "
		+ totalClicks
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
    public static JSONArray getEmailCampaignStats(String campaignId,
	    String startDate, String endDate, String timeZone, String type)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return null;

	// Returns (sign)HH:mm from total minutes.
	String timeZoneOffset = convertMinutesToTime(timeZone);

	// Returns minimum of log-time for given date-range.
	String subQuery = "(SELECT log_type, MIN("
		+ addConvertTZ(timeZoneOffset)
		+ ") AS minTime FROM campaign_logs WHERE "
		+ SQLUtil.appendDomainToQuery(domain)
		+ " AND campaign_id="
		+ SQLUtil.encodeSQLColumnValue(campaignId)
		+ " AND log_type IN ('EMAIL_SENT', 'EMAIL_CLICKED', 'EMAIL_OPENED') AND DATE("
		+ addConvertTZ(timeZoneOffset) + ") BETWEEN " + "DATE("
		+ SQLUtil.encodeSQLColumnValue(startDate) + ") AND DATE("
		+ SQLUtil.encodeSQLColumnValue(endDate)
		+ ") GROUP BY subscriber_id,log_type) subQuery";

	String uniqueClicks = "(SELECT DATE_FORMAT(minTime,"
		+ getDateFormatBasedOnType(type)
		+ ")  AS logDate, log_type, COUNT(*) AS count FROM " + subQuery
		+ " GROUP BY log_type, logDate)";

	String totalClicks = "(SELECT DATE_FORMAT("
		+ addConvertTZ(timeZoneOffset)
		+ ","
		+ getDateFormatBasedOnType(type)
		+ ")  AS logDate,log_type, COUNT(*) AS total  FROM campaign_logs WHERE domain="
		+ SQLUtil.encodeSQLColumnValue(domain) + " AND campaign_id="
		+ SQLUtil.encodeSQLColumnValue(campaignId)
		+ "  AND log_type IN ('EMAIL_CLICKED') AND DATE("
		+ addConvertTZ(timeZoneOffset) + ") BETWEEN DATE("
		+ SQLUtil.encodeSQLColumnValue(startDate) + ")  AND DATE("
		+ SQLUtil.encodeSQLColumnValue(endDate)
		+ ") GROUP BY log_type,logDate)";

	String emailLogs = "SELECT  A.logDate,A.log_type, A.count, B.total FROM "
		+ uniqueClicks
		+ " A   LEFT OUTER JOIN  "
		+ totalClicks
		+ " B ON A.log_type = B.log_type and A.logDate=B.logDate";

	try
	{
	    return GoogleSQL.getJSONQuery(emailLogs);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

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
	return "CONVERT_TZ(log_time,'+00:00',"
		+ SQLUtil.encodeSQLColumnValue(timeZoneOffset) + ")";
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
    private static String getDateFormatBasedOnType(String type)
    {
	// 1 to 12 AM or PM Eg. 1 AM
	if (type.equals("hour"))
	    return SQLUtil.encodeSQLColumnValue("%l %p");

	// Sun to Sat Eg. Mon
	else if (type.equals("day"))
	    return SQLUtil.encodeSQLColumnValue("%a");

	// Jan to Dec 01 to 31 Eg. Jan 04
	return SQLUtil.encodeSQLColumnValue("%b %d");
    }
}
