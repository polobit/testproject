package com.agilecrm.db.util;

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
     * Returns obtained logs with respect to campaign id and domain.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param domain
     *            - Domain.
     * @return json array.
     */
    public static JSONArray getLogsOfCampaign(String campaignId, String domain)
    {
	String campaignLogs = "SELECT * FROM campaign_logs WHERE campaign_id = "
		+ StatsUtil.encodeSQLColumnValue(campaignId)
		+ " AND domain = "
		+ StatsUtil.encodeSQLColumnValue(domain);

	JSONArray arr = new JSONArray();

	try
	{
	    arr = GoogleSQL.getJSONQuery(campaignLogs);

	    if (arr == null)
		return null;

	    System.out.println("Campaign logs of domain - " + domain + " are: "
		    + arr);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

	return arr;
    }

    /**
     * Returns logs of campaign with respect to subscriber id.
     * 
     * @param subscriberId
     *            - Subscriber Id.
     * @param domain
     *            - Domain.
     * @return json array of logs.
     */
    public static JSONArray getLogsOfSubscriber(String subscriberId,
	    String domain)
    {
	String campaignLogs = "SELECT * FROM campaign_logs WHERE subscriber_id = "
		+ StatsUtil.encodeSQLColumnValue(subscriberId)
		+ " AND domain = " + StatsUtil.encodeSQLColumnValue(domain);

	JSONArray arr = new JSONArray();

	try
	{
	    arr = GoogleSQL.getJSONQuery(campaignLogs);

	    if (arr == null)
		return null;

	    System.out.println("Subscriber Logs of Domain - " + domain
		    + " are: " + arr);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

	return arr;
    }

    /**
     * Returns logs with respect to both campaign-id and subscriber-id.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param subscriberId
     *            - Subscriber Id.
     * @param domain
     *            - Domain
     * @return JSONArray of logs.
     */
    public static JSONArray getLogsOfCampaignSubscriber(String campaignId,
	    String subscriberId, String domain)
    {
	String campaignContactLogs = "SELECT * FROM campaign_logs WHERE campaign_id = "
		+ StatsUtil.encodeSQLColumnValue(campaignId)
		+ " AND subscriber_id = "
		+ StatsUtil.encodeSQLColumnValue(subscriberId)
		+ " AND domain = " + StatsUtil.encodeSQLColumnValue(domain);

	JSONArray arr = new JSONArray();

	try
	{
	    arr = GoogleSQL.getJSONQuery(campaignContactLogs);

	    if (arr == null)
		return null;

	    System.out.println("Campaign-Subscriber Logs of Domain - " + domain
		    + " are: " + arr);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

	return arr;
    }

    /**
     * Deletes logs with respect to campaign.
     * 
     * @param campaignId
     *            - Campaign id.
     * @param domain
     *            - Domain.
     */
    public static void deleteLogsOfCampaign(String campaignId, String domain)
    {
	String deleteCampaignLogs = "DELETE FROM campaign_logs WHERE campaign_id = "
		+ StatsUtil.encodeSQLColumnValue(campaignId)
		+ " AND domain = "
		+ StatsUtil.encodeSQLColumnValue(domain);

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
     * Deletes logs with respect to subscriber.
     * 
     * @param subscriberId
     *            - Subscriber id.
     * @param domain
     *            - Domain.
     */
    public static void deleteLogsOfSubscriber(String subscriberId, String domain)
    {
	String deleteSubscriberLogs = "DELETE FROM campaign_logs WHERE subscriber_id = "
		+ StatsUtil.encodeSQLColumnValue(subscriberId)
		+ " AND domain = " + StatsUtil.encodeSQLColumnValue(domain);
	try
	{
	    GoogleSQL.executeNonQuery(deleteSubscriberLogs);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

}
