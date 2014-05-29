package com.campaignio.logger.util;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.db.GoogleSQL;
import com.agilecrm.db.util.GoogleSQLUtil;

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
    public static void addToCampaignLogs(String domain, String campaignId, String campaignName, String subscriberId,
	    String message, String type)
    {
	String insertToLogs = "INSERT INTO campaign_logs (domain, campaign_id, campaign_name, subscriber_id, log_time, message, log_type) VALUES("
		+ GoogleSQLUtil.encodeSQLColumnValue(domain)
		+ ","
		+ GoogleSQLUtil.encodeSQLColumnValue(campaignId)
		+ ","
		+ GoogleSQLUtil.encodeSQLColumnValue(campaignName)
		+ ","
		+ GoogleSQLUtil.encodeSQLColumnValue(subscriberId)
		+ ",NOW()"
		+ ","
		+ GoogleSQLUtil.encodeSQLColumnValue(message) + "," + GoogleSQLUtil.encodeSQLColumnValue(type) + ")";

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
    public static JSONArray getLogs(String campaignId, String subscriberId, String domain, String limit,
	    String filterType)
    {
	String logs = "SELECT *, UNIX_TIMESTAMP(log_time) AS time FROM campaign_logs WHERE log_type <> 'EMAIL_SLEEP' AND "
		+ getWhereConditionOfLogs(campaignId, subscriberId, domain)
		+ getFilterType(filterType)
		+ " ORDER BY log_time DESC" + GoogleSQLUtil.appendLimitToQuery(limit);
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
	String deleteCampaignLogs = "DELETE FROM campaign_logs WHERE"
		+ getWhereConditionOfLogs(campaignId, subscriberId, domain);
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
	    condition = " campaign_id = " + GoogleSQLUtil.encodeSQLColumnValue(campaignId);

	    // If both are not null
	    if (!StringUtils.isEmpty(subscriberId))
		return condition += " AND " + " subscriber_id = " + GoogleSQLUtil.encodeSQLColumnValue(subscriberId)
			+ " AND " + GoogleSQLUtil.appendDomainToQuery(domain);
	}

	if (!StringUtils.isEmpty(subscriberId))
	    condition = " subscriber_id = " + GoogleSQLUtil.encodeSQLColumnValue(subscriberId);

	// if both campaignId and subscriberId are null
	if (StringUtils.isEmpty(campaignId) && StringUtils.isEmpty(subscriberId))
	    return GoogleSQLUtil.appendDomainToQuery(domain);

	condition += " AND " + GoogleSQLUtil.appendDomainToQuery(domain);

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
	String deleteLogs = "DELETE FROM campaign_logs WHERE" + GoogleSQLUtil.appendDomainToQuery(namespace);

	try
	{
	    GoogleSQL.executeNonQuery(deleteLogs);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Appends filter type to logs query
     * 
     * @param logFilterType
     *            - logFilterType like EMAIL_SENT
     * @return String
     */
    public static String getFilterType(String logFilterType)
    {
	// If logFilterType is empty
	if (StringUtils.isBlank(logFilterType))
	    return "";

	return " AND log_type=" + GoogleSQLUtil.encodeSQLColumnValue(logFilterType);
    }
}