package com.agilecrm.db.util;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>SQLUtil</code> is the base class for adding, getting and deleting rows
 * from SQL table.
 * 
 */
public class SQLUtil
{
    /**
     * Inserts obtained fields into campaign logs table.
     * 
     * @param domain
     *            - Domain.
     * @param campaignId
     *            - Campaign Id.
     * @param subscriberId
     *            - Subscriber Id.
     * @param logTime
     *            - Log Time.
     * @param message
     *            - Log Message.
     * @param type
     *            - Log Type.
     */
    public static void addToCampaignLogs(String domain, String campaignId,
	    String subscriberId, String message, String type)
    {
	String insertToLogs = "INSERT INTO campaign_logs (domain, campaign_id, subscriber_id, log_time, message, log_type) VALUES("
		+ StatsUtil.encodeSQLColumnValue(domain)
		+ ","
		+ StatsUtil.encodeSQLColumnValue(campaignId)
		+ ","
		+ StatsUtil.encodeSQLColumnValue(subscriberId)
		+ ",NOW()"
		+ ","
		+ StatsUtil.encodeSQLColumnValue(message)
		+ ","
		+ StatsUtil.encodeSQLColumnValue(type) + ")";

	System.out.println("Insert Query to CampaignLogs: " + insertToLogs);

	try
	{
	    GoogleSQL.executeNonQuery(insertToLogs);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Returns logs with respect to campaign-id or subscriber-id.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param subscriberId
     *            - Subscriber Id.
     * @param domain
     *            - Domain
     * @return JSONArray of logs.
     */
    public static JSONArray getLogs(String campaignId, String subscriberId,
	    String domain)
    {
	String logs = "SELECT *, UNIX_TIMESTAMP(log_time) AS time FROM campaign_logs WHERE";

	if (!StringUtils.isEmpty(campaignId))
	{
	    logs += " campaign_id = "
		    + StatsUtil.encodeSQLColumnValue(campaignId);

	    // if both are not null
	    if (!StringUtils.isEmpty(subscriberId))
		logs += " AND subscriber_id = "
			+ StatsUtil.encodeSQLColumnValue(subscriberId);
	}
	else if (!StringUtils.isEmpty(subscriberId))
	    logs += " subscriber_id = "
		    + StatsUtil.encodeSQLColumnValue(subscriberId);

	logs += appendDomainToQuery(domain);

	try
	{
	    return GoogleSQL.getJSONQuery(logs);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Deletes logs with respect to campaign.
     * 
     * @param campaignId
     *            - Campaign id.
     * @param domain
     *            - Domain.
     */
    public static void deleteLogsFromSQL(String campaignId,
	    String subscriberId, String domain)
    {
	String deleteCampaignLogs = "DELETE FROM campaign_logs WHERE";

	if (!StringUtils.isEmpty(campaignId))
	{
	    deleteCampaignLogs += " campaign_id = "
		    + StatsUtil.encodeSQLColumnValue(campaignId);

	    // If both are not null
	    if (!StringUtils.isEmpty(subscriberId))
		deleteCampaignLogs += " AND subscriber_id = "
			+ StatsUtil.encodeSQLColumnValue(subscriberId);

	}

	else if (!StringUtils.isEmpty(subscriberId))
	    deleteCampaignLogs += " subscriber_id = "
		    + StatsUtil.encodeSQLColumnValue(subscriberId);

	deleteCampaignLogs += appendDomainToQuery(domain);

	try
	{
	    GoogleSQL.executeNonQuery(deleteCampaignLogs);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Returns email sent,clicked, opened and total clicks data for email graphs
     * with respect to campaign.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param startTime
     *            - Start Time.
     * @param endTime
     *            - End Time.
     * @param type
     *            - day or hour or date.
     * @return JSONArray
     */
    public static JSONArray getEmailLogsForGraph(String campaignId,
	    String startTime, String endTime, String type)
    {
	String domain = NamespaceManager.get();

	// Get logs of type Send E-mail
	String subQuery1 = "(SELECT log_type, (UNIX_TIMESTAMP(log_time) * 1000) as logTime FROM campaign_logs WHERE domain="
		+ StatsUtil.encodeSQLColumnValue(domain)
		+ " AND campaign_id="
		+ StatsUtil.encodeSQLColumnValue(campaignId)
		+ " AND log_type IN ('Send E-mail')"
		+ " AND (UNIX_TIMESTAMP(log_time) * 1000) BETWEEN "
		+ StatsUtil.encodeSQLColumnValue(startTime)
		+ " AND "
		+ StatsUtil.encodeSQLColumnValue(endTime) + ")";

	// Get unique logs of type Email Clicked and Email Opened w.r.t
	// subscriber.
	String subQuery2 = "(SELECT log_type, MIN(UNIX_TIMESTAMP(log_time) * 1000) as logTime FROM campaign_logs WHERE domain="
		+ StatsUtil.encodeSQLColumnValue(domain)
		+ " AND campaign_id="
		+ StatsUtil.encodeSQLColumnValue(campaignId)
		+ " AND log_type IN ('Email Clicked', 'Email Opened')"
		+ " AND (UNIX_TIMESTAMP(log_time) * 1000) BETWEEN "
		+ StatsUtil.encodeSQLColumnValue(startTime)
		+ " AND "
		+ StatsUtil.encodeSQLColumnValue(endTime)
		+ " GROUP BY log_type,subscriber_id)";

	// Get logs of type Send E-mail, Email Clicked and Email Opened
	String uniqueClicksQuery = subQuery1 + " UNION ALL" + subQuery2;

	// Get total clicks
	String totalClicksQuery = "(SELECT log_type, (UNIX_TIMESTAMP(log_time) * 1000) as logTime, COUNT(*) as total FROM campaign_logs WHERE domain="
		+ StatsUtil.encodeSQLColumnValue(domain)
		+ " AND campaign_id="
		+ StatsUtil.encodeSQLColumnValue(campaignId)
		+ " AND log_type IN ('Email Clicked')"
		+ " AND (UNIX_TIMESTAMP(log_time) * 1000) BETWEEN "
		+ StatsUtil.encodeSQLColumnValue(startTime)
		+ " AND "
		+ StatsUtil.encodeSQLColumnValue(endTime)
		+ " GROUP BY log_type, " + groupByType(type) + ")";

	// Apply join for both unique clicks and total clicks
	String joinQuery = "(" + uniqueClicksQuery + ") A LEFT OUTER JOIN "
		+ totalClicksQuery + " B";

	// Get logs of unique clicked and total clicks.
	String neededQuery = "SELECT A.log_type,A.logTime, B.total FROM "
		+ joinQuery
		+ " ON A.log_type = B.log_type and A.logTime = B.logTime";

	try
	{
	    return GoogleSQL.getJSONQuery(neededQuery);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

    }

    /**
     * Returns query part based on given type.
     * 
     * @param type
     *            day or hour or date.
     * @return String.
     */
    private static String groupByType(String type)
    {
	if (type.equals("day"))
	    return "DAY(log_time)";
	else if (type.equals("hour"))
	    return "HOUR(log_time)";

	return "DATE(log_time)";
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
	return " AND domain = " + StatsUtil.encodeSQLColumnValue(domain);
    }

}
