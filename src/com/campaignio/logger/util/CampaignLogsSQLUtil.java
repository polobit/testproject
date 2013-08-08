package com.campaignio.logger.util;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;
import com.agilecrm.db.util.SQLUtil;

/**
 * <code>CampaignLogsSQLUtil</code> is the SQL Utility class for campaign logs.
 * It provides SQL queries to insert, fetch and delete campaign logs
 * 
 * @author Naresh
 * 
 */
public class CampaignLogsSQLUtil
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
    public static void addToCampaignLogs(String domain, String campaignId, String campaignName, String subscriberId, String message, String type)
    {
	String insertToLogs = "INSERT INTO campaign_logs (domain, campaign_id, campaign_name, subscriber_id, log_time, message, log_type) VALUES("
		+ SQLUtil.encodeSQLColumnValue(domain) + "," + SQLUtil.encodeSQLColumnValue(campaignId) + "," + SQLUtil.encodeSQLColumnValue(campaignName)
		+ "," + SQLUtil.encodeSQLColumnValue(subscriberId) + ",NOW()" + "," + SQLUtil.encodeSQLColumnValue(message) + ","
		+ SQLUtil.encodeSQLColumnValue(type) + ")";

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
    public static JSONArray getLogs(String campaignId, String subscriberId, String domain, String limit)
    {
	String logs = "SELECT *, UNIX_TIMESTAMP(log_time) AS time FROM campaign_logs WHERE log_type <> 'EMAIL_SLEEP' AND "
		+ getWhereConditionOfLogs(campaignId, subscriberId, domain) + " ORDER BY log_time DESC" + SQLUtil.appendLimitToQuery(limit);
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
    public static void deleteLogsFromSQL(String campaignId, String subscriberId, String domain)
    {
	String deleteCampaignLogs = "DELETE FROM campaign_logs WHERE" + getWhereConditionOfLogs(campaignId, subscriberId, domain);
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
     * Returns where clause for campaign logs query.
     * 
     * @param campaignId
     *            - campaignId.
     * @param subscriberId
     *            - subscriberId.
     * @param domain
     *            - domain.
     * @return String
     */
    private static String getWhereConditionOfLogs(String campaignId, String subscriberId, String domain)
    {
	String condition = null;

	if (!StringUtils.isEmpty(campaignId))
	{
	    condition = " campaign_id = " + SQLUtil.encodeSQLColumnValue(campaignId);

	    // If both are not null
	    if (!StringUtils.isEmpty(subscriberId))
		return condition += " AND " + " subscriber_id = " + SQLUtil.encodeSQLColumnValue(subscriberId) + " AND " + SQLUtil.appendDomainToQuery(domain);
	}

	if (!StringUtils.isEmpty(subscriberId))
	    condition = " subscriber_id = " + SQLUtil.encodeSQLColumnValue(subscriberId);

	// if both campaignId and subscriberId are null
	if (StringUtils.isEmpty(campaignId) && StringUtils.isEmpty(subscriberId))
	    return SQLUtil.appendDomainToQuery(domain);

	condition += " AND " + SQLUtil.appendDomainToQuery(domain);

	return condition;
    }

    /**
     * Deletes logs based on domain from SQL.
     * 
     * @param namespace
     *            - namespace.
     */
    public static void deleteLogsBasedOnDomain(String namespace)
    {
	String deleteLogs = "DELETE FROM campaign_logs WHERE" + SQLUtil.appendDomainToQuery(namespace);

	try
	{
	    GoogleSQL.executeNonQuery(deleteLogs);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

}
