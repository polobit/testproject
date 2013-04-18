package com.campaignio.logger.util;

import java.io.IOException;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;

import com.agilecrm.db.util.SQLUtil;
import com.campaignio.logger.Log;
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
     * Returns logs with respect to both campaign and subscriber.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param subscriberId
     *            - Subscriber Id.
     * @return logs array string.
     */
    public static List<Log> getSQLLogs(String campaignId, String subscriberId)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return null;

	JSONArray logs = null;

	if (!StringUtils.isEmpty(campaignId))
	{
	    logs = SQLUtil.getLogs(campaignId, null, domain);

	    // When both are not null
	    if (!StringUtils.isEmpty(subscriberId))
		logs = SQLUtil.getLogs(campaignId, subscriberId, domain);
	}

	else if (!StringUtils.isEmpty(subscriberId))
	{
	    logs = SQLUtil.getLogs(null, subscriberId, domain);
	}

	if (logs == null)
	    return null;

	try
	{
	    return new ObjectMapper().readValue(logs.toString(),
		    new TypeReference<List<Log>>()
		    {
		    });
	}
	catch (JsonParseException e1)
	{
	    e1.printStackTrace();
	}
	catch (JsonMappingException e1)
	{
	    e1.printStackTrace();
	}
	catch (IOException e1)
	{
	    e1.printStackTrace();
	}
	return null;
    }

    /**
     * Deletes campaign logs.
     * 
     * @param campaignId
     *            - Campaign Id.
     */
    public static void deleteSQLLogs(String campaignId, String subscriberId)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return;

	// Deletes campaign logs.
	if (!StringUtils.isEmpty(campaignId))
	{
	    SQLUtil.deleteLogsFromSQL(campaignId, null, domain);

	    // When both are not null
	    if (!StringUtils.isEmpty(subscriberId))
		SQLUtil.deleteLogsFromSQL(null, subscriberId, domain);
	}

	// Deletes subscriber logs.
	else if (!StringUtils.isEmpty(subscriberId))
	    SQLUtil.deleteLogsFromSQL(null, subscriberId, domain);
    }
}