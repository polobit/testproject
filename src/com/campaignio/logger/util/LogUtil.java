package com.campaignio.logger.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.util.SQLUtil;
import com.agilecrm.util.DBUtil;
import com.google.appengine.api.NamespaceManager;

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
     * Adds logs to SQL.
     * 
     * @param campaignJSON
     *            JSONObject of campaign that runs at that instance.
     * @param subscriberJSON
     *            JSONObject of contact that subscribes to campaign.
     * @param message
     *            Message that is set in the tasklet.
     * @param logType
     *            - Type of log with respect to node.
     * @throws Exception
     */
    public static void addLog(JSONObject campaignJSON,
	    JSONObject subscriberJSON, String message, String logType)
	    throws Exception
    {
	// Campaign and SubscriberId
	String campaignId = DBUtil.getId(campaignJSON);
	String subscriberId = DBUtil.getId(subscriberJSON);

	addLogToSQL(campaignId, subscriberId, message, logType);
    }

    /**
     * Adds campaign-log to Google-SQL. It gets domain and logTime to add them
     * to table.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param subscriberId
     *            - Subscriber Id.
     * @param message
     *            - Message.
     * @param logType
     *            - Log Type.
     */
    public static void addLogToSQL(String campaignId, String subscriberId,
	    String message, String logType)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return;

	// Insert to SQL
	SQLUtil.addToCampaignLogs(domain, campaignId, subscriberId, message,
		logType);
    }

    /**
     * Returns campaign logs fetched from Google SQL with respect to campaign
     * id. Add contact name to each element of json array.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @return return json-array string.
     */
    public static String getSQLLogsOfCampaign(String campaignId)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return null;

	// Get from SQL.
	JSONArray campaignLogs = SQLUtil.getLogsOfCampaign(campaignId, domain);

	if (campaignLogs == null)
	    return null;

	// Embed contact-name for each log.
	try
	{
	    for (int i = 0; i < campaignLogs.length(); i++)
	    {
		// Get each from json-array
		JSONObject log = campaignLogs.getJSONObject(i);

		String subscriberId = log.getString("subscriber_id");

		String contactName = ContactUtil.getContactNameFromId(Long
			.parseLong(subscriberId));

		log.put("contactName", contactName);
	    }
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	System.out.println("Campaign Logs: " + campaignLogs);

	return campaignLogs.toString();
    }

    /**
     * Returns campaign logs of contact.
     * 
     * @param subscriberId
     *            Subscriber id.
     * @return logs array string.
     */
    public static String getSQLLogsOfContact(String subscriberId)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return null;

	// Get from SQL.
	JSONArray contactLogs = SQLUtil.getLogsOfSubscriber(subscriberId,
		domain);

	if (contactLogs == null)
	    return null;

	// Convert to epoch time
	try
	{
	    for (int i = 0; i < contactLogs.length(); i++)
	    {
		// Get each from json-array
		JSONObject log = contactLogs.getJSONObject(i);

		String logTime = log.getString("log_time");

		// verifies logtime is not null
		if (StringUtils.isEmpty(logTime))
		    continue;

		SimpleDateFormat df = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss");

		Date date = null;
		try
		{
		    date = df.parse(logTime);
		}
		catch (ParseException e)
		{
		    e.printStackTrace();
		}

		long epoch = date.getTime() / 1000;
		log.put("log_time", epoch);
	    }
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

	return contactLogs.toString();

    }

    /**
     * Returns logs with respect to both campaign and subscriber.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param subscriberId
     *            - Subscriber Id.
     * @return logs array string.
     */
    public static String getSQLLogsOfCampaignSubscriber(String campaignId,
	    String subscriberId)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return null;

	// Get from SQL.
	JSONArray campaigncontactLogs = SQLUtil.getLogsOfSubscriber(
		subscriberId, domain);

	if (campaigncontactLogs == null)
	    return null;

	return campaigncontactLogs.toString();
    }

    /**
     * Deletes campaign logs.
     * 
     * @param campaignId
     *            - Campaign Id.
     */
    public static void deleteSQLLogsOfCampaign(String campaignId)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return;

	// Delete from SQL
	SQLUtil.deleteLogsOfCampaign(campaignId, domain);
    }

    /**
     * Deletes logs of contact.
     * 
     * @param contactId
     *            - Contact Id.
     */
    public static void deleteSQLLogsOfSubscriber(String contactId)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return;

	// Delete from SQL
	SQLUtil.deleteLogsOfCampaign(contactId, domain);
    }
}
