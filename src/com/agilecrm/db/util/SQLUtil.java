package com.agilecrm.db.util;

import org.datanucleus.util.StringUtils;
import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;

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
