package com.campaignio.logger.util;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;

import com.agilecrm.util.DBUtil;
import com.campaignio.logger.Log;
import com.campaignio.logger.LogItem;
import com.googlecode.objectify.Key;

/**
 * <code>LogUtil</code> class adds logs with respect to campaigns and
 * subscribers. It gets logs based upon subscribers as well as campaigns. It
 * removes logs with respect to subscribers and campaigns.
 * 
 * @author Manohar
 * 
 */
public class LogUtil
{
    /**
     * Adds log with campaign id, subscriber id and respective message.
     * 
     * @param campaignId
     *            Id of a campaign.
     * @param subscriberId
     *            Contact id that subscribes to campaign.
     * @param message
     *            Message given in the tasklet while declaring log.
     * @param logType
     *            - Type of log with respect to node.
     * @param pic
     *            -Relative path of node image.
     */
    public static void addLogFromID(String campaignId, String subscriberId,
	    String message, String logType)
    {
	// System.out.println("Adding log " + campaignId + " " + subscriberId +
	// " " + message);

	long logTime = Calendar.getInstance().getTimeInMillis() / 1000;

	// Get existing Log
	Log log = getCampaignSubscriberLog(campaignId, subscriberId);

	if (log == null)
	{
	    System.out.println("Creating fresh log");

	    List<LogItem> logItemList = new ArrayList<LogItem>();

	    logItemList.add(new LogItem(logType, logTime, message));

	    log = new Log(campaignId, subscriberId, logItemList);
	    log.save();
	    return;
	}

	try
	{
	    log.logs.add(new LogItem(logType, logTime, message));
	    log.save();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Gets campaignId and contact id from the respective jsons and calls
     * addLogFromID method.
     * 
     * @param campaignJSON
     *            JSONObject of campaign that runs at that instance.
     * @param subscriberJSON
     *            JSONObject of contact that subscribes to campaign.
     * @param message
     *            Message that is set in the tasklet.
     * @param logType
     *            - Type of log with respect to node.
     * @param pic
     *            - Relative path of node image.
     * @throws Exception
     */
    public static void addLog(JSONObject campaignJSON,
	    JSONObject subscriberJSON, String message, String logType)
	    throws Exception
    {
	// Campaign and SubscriberId
	String campaignId = DBUtil.getId(campaignJSON);
	String subscriberId = DBUtil.getId(subscriberJSON);

	addLogFromID(campaignId, subscriberId, message, logType);
    }

    /**
     * Gets previous log if exists with respective to campaign and contact ids.
     * 
     * @param campaignId
     *            Id of a campaign.
     * @param subscriberId
     *            Id of a contact that subscribes to campaign.
     * @return Log if exists from the dao with respect to campaign and contact.
     */
    public static Log getCampaignSubscriberLog(String campaignId,
	    String subscriberId)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("subscriber_id", subscriberId);
	searchMap.put("campaign_id", campaignId);

	return Log.dao.getByProperty(searchMap);
    }

    /**
     * Gets log with respect to contact.
     * 
     * @param subscriberId
     *            Id of contact that subscribes to campaign.
     * @return List of logs if exists, from the dao with respect to contact.
     */
    public static List<Log> getSubscriberLog(String subscriberId)
    {
	return Log.dao.listByProperty("subscriber_id", subscriberId);
    }

    /**
     * Gets log with respect to campaign.
     * 
     * @param campaignId
     *            Id of a campaign.
     * @return List of logs if exists, from the dao with respect of campaign.
     */
    public static List<Log> getCampaignLog(String campaignId)
    {
	return Log.dao.listByProperty("campaign_id", campaignId);
    }

    /**
     * Returns logs count with respect to type.
     * 
     * @param type
     *            - log type.
     * @return count value.
     */
    public static int getLogsCountForType(String type)
    {
	return Log.dao.ofy().query(Log.class).filter("logs.type ", type)
		.count();
    }

    /**
     * Returns list of log-items by appending all log-items from different logs
     * into one list.
     * 
     * @param logs
     *            - Logs List.
     * @return list of logItems.
     */
    public static List<LogItem> getLogItemsFromLogs(List<Log> logs)
    {
	List<LogItem> logItems = new ArrayList<LogItem>();

	for (Log log : logs)
	{
	    if (log == null)
		continue;

	    // Add all logItems to a list.
	    for (LogItem logItem : log.logs)
		logItems.add(logItem);
	}

	return logItems;
    }

    /**
     * Removes subscriber logs.
     * 
     * @param subscriberID
     *            Id of contact that subscribes to campaign.
     */
    public static void removeSubscriberLogs(String subscriberID)
    {
	List<Key<Log>> logs = Log.dao.listKeysByProperty("subscriber_id",
		subscriberID);
	if (logs == null || logs.isEmpty())
	    return;

	// Read from database
	try
	{
	    Log.dao.deleteKeys(logs);
	}
	catch (Exception e)
	{

	}
    }

    /**
     * Removes campaign logs.
     * 
     * @param campaignID
     *            Id of a campaign.
     */
    public static void removeCampaignLogs(String campaignID)
    {
	List<Key<Log>> logs = Log.dao.listKeysByProperty("campaign_id",
		campaignID);
	if (logs == null || logs.isEmpty())
	    return;

	// Read from database
	try
	{
	    Log.dao.deleteKeys(logs);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
}
