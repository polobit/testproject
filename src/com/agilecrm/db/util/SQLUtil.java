package com.agilecrm.db.util;

import org.apache.commons.lang.StringUtils;
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
	    String campaignName, String subscriberId, String message,
	    String type)
    {
	String insertToLogs = "INSERT INTO campaign_logs (domain, campaign_id, campaign_name, subscriber_id, log_time, message, log_type) VALUES("
		+ encodeSQLColumnValue(domain)
		+ ","
		+ encodeSQLColumnValue(campaignId)
		+ ","
		+ encodeSQLColumnValue(campaignName)
		+ ","
		+ encodeSQLColumnValue(subscriberId)
		+ ",NOW()"
		+ ","
		+ encodeSQLColumnValue(message)
		+ ","
		+ encodeSQLColumnValue(type) + ")";

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
	    String domain, String limit)
    {
	String logs = "SELECT *, UNIX_TIMESTAMP(log_time) AS time FROM campaign_logs WHERE log_type <> 'EMAIL_SLEEP' AND "
		+ getWhereConditionOfLogs(campaignId, subscriberId, domain)
		+ " ORDER BY log_time DESC" + appendLimitToQuery(limit);
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
    private static String getWhereConditionOfLogs(String campaignId,
	    String subscriberId, String domain)
    {
	String condition = null;

	if (!StringUtils.isEmpty(campaignId))
	{
	    condition = " campaign_id = " + encodeSQLColumnValue(campaignId);

	    // If both are not null
	    if (!StringUtils.isEmpty(subscriberId))
		condition += " AND ";
	}

	if (!StringUtils.isEmpty(subscriberId))
	    condition = " subscriber_id = "
		    + encodeSQLColumnValue(subscriberId);

	// if both campaignId and subscriberId are null
	if (StringUtils.isEmpty(campaignId)
		&& StringUtils.isEmpty(subscriberId))
	    return appendDomainToQuery(domain);

	condition += " AND " + appendDomainToQuery(domain);

	return condition;
    }

    /**
     * Append limit to query to retrieve recent results.
     * 
     * @param limit
     *            - required limit.
     * @return String.
     */
    private static String appendLimitToQuery(String limit)
    {
	if (StringUtils.isEmpty(limit))
	    return "";

	return " LIMIT " + limit;
    }

    /**
     * Deletes logs based on domain from SQL.
     * 
     * @param namespace
     *            - namespace.
     */
    public static void deleteLogsBasedOnDomain(String namespace)
    {
	String deleteLogs = "DELETE FROM campaign_logs WHERE"
		+ appendDomainToQuery(namespace);

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
	if (value == null)
	    return null;

	// Removes single quotation on start and end.
	String replaceSingleQuote = value.replaceAll("(^')|('$)", "");

	// Removes double quotes
	String replaceDoubleQuote = replaceSingleQuote.replaceAll(
		"(^\")|(\"$)", "");

	// Replace ' with \' within the value. To avoid error while insertion
	// into table
	if (replaceDoubleQuote.contains("'"))
	    replaceDoubleQuote = replaceDoubleQuote.replace("'", "\\'");

	return "\'" + replaceDoubleQuote + "\'";
    }
}
