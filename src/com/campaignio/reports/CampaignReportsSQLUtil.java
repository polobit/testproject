package com.campaignio.reports;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;
import com.agilecrm.db.util.SQLUtil;
import com.google.appengine.api.NamespaceManager;

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

	if (StringUtils.isEmpty(domain))
	    return null;

	String uniqueClicks = "(SELECT campaign_name,log_type,COUNT(DISTINCT subscriber_id) AS count  FROM campaign_logs WHERE log_type IN ('EMAIL_SENT', 'EMAIL_CLICKED', 'EMAIL_OPENED') AND "
		+ SQLUtil.appendDomainToQuery(domain) + " GROUP BY log_type,campaign_name)";

	String totalClicks = "(SELECT campaign_name,log_type,COUNT(subscriber_id) AS total  FROM campaign_logs WHERE log_type IN ('EMAIL_CLICKED') AND "
		+ SQLUtil.appendDomainToQuery(domain) + " GROUP BY log_type,campaign_name)";

	String campaignStats = "SELECT A.campaign_name, A.log_type, A.count,B.total FROM " + uniqueClicks + " A LEFT OUTER JOIN " + totalClicks
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
    public static JSONArray getEachEmailCampaignStats(String campaignId, String startDate, String endDate, String timeZone, String type)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return null;

	// Returns (sign)HH:mm from total minutes.
	String timeZoneOffset = SQLUtil.convertMinutesToTime(timeZone);

	// Returns minimum of log-time for given date-range.
	String subQuery = "(SELECT log_type, MIN(" + SQLUtil.addConvertTZ(timeZoneOffset) + ") AS minTime FROM campaign_logs WHERE "
		+ SQLUtil.appendDomainToQuery(domain) + " AND campaign_id=" + SQLUtil.encodeSQLColumnValue(campaignId)
		+ " AND log_type IN ('EMAIL_SENT', 'EMAIL_CLICKED', 'EMAIL_OPENED') AND DATE(" + SQLUtil.addConvertTZ(timeZoneOffset) + ") BETWEEN " + "DATE("
		+ SQLUtil.encodeSQLColumnValue(startDate) + ") AND DATE(" + SQLUtil.encodeSQLColumnValue(endDate)
		+ ") GROUP BY subscriber_id,log_type) subQuery";

	String uniqueClicks = "(SELECT DATE_FORMAT(minTime," + SQLUtil.getDateFormatBasedOnType(type) + ")  AS log_date, log_type, COUNT(*) AS count FROM "
		+ subQuery + " GROUP BY log_type, log_date)";

	String totalClicks = "(SELECT DATE_FORMAT(" + SQLUtil.addConvertTZ(timeZoneOffset) + "," + SQLUtil.getDateFormatBasedOnType(type)
		+ ")  AS log_date,log_type, COUNT(*) AS total  FROM campaign_logs WHERE domain=" + SQLUtil.encodeSQLColumnValue(domain) + " AND campaign_id="
		+ SQLUtil.encodeSQLColumnValue(campaignId) + "  AND log_type IN ('EMAIL_CLICKED') AND DATE(" + SQLUtil.addConvertTZ(timeZoneOffset)
		+ ") BETWEEN DATE(" + SQLUtil.encodeSQLColumnValue(startDate) + ")  AND DATE(" + SQLUtil.encodeSQLColumnValue(endDate)
		+ ") GROUP BY log_type,log_date)";

	String emailLogs = "SELECT  A.log_date,A.log_type, A.count, B.total FROM " + uniqueClicks + " A   LEFT OUTER JOIN  " + totalClicks
		+ " B ON A.log_type = B.log_type and A.log_date=B.log_date";

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

}
