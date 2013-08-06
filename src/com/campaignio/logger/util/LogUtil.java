package com.campaignio.logger.util;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;

import com.agilecrm.db.util.SQLUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
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
    public static void addLogToSQL(String campaignId, String subscriberId, String message, String logType)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain) || StringUtils.isEmpty(campaignId) || StringUtils.isEmpty(subscriberId))
	    return;

	// Insert to SQL
	SQLUtil.addToCampaignLogs(domain, campaignId, WorkflowUtil.getCampaignName(campaignId), subscriberId, message, logType);
    }

    /**
     * Returns logs with respect to both campaign and subscriber.
     * 
     * @param campaignId
     *            - Campaign Id.
     * @param subscriberId
     *            - Subscriber Id.
     * @param limit
     *            - limit to get number of logs.
     * @return logs array string.
     */
    public static List<Log> getSQLLogs(String campaignId, String subscriberId, String limit)
    {
	String domain = NamespaceManager.get();

	if (StringUtils.isEmpty(domain))
	    return null;

	// get SQL logs
	JSONArray logs = SQLUtil.getLogs(campaignId, subscriberId, domain, limit);

	if (logs == null)
	    return null;

	try
	{
	    // to attach contact and campaign-name to each log.
	    return new ObjectMapper().readValue(logs.toString(), new TypeReference<List<Log>>()
	    {
	    });
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
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

	if (StringUtils.isEmpty(domain) || (StringUtils.isEmpty(campaignId) && StringUtils.isEmpty(subscriberId)))
	    return;

	SQLUtil.deleteLogsFromSQL(campaignId, subscriberId, domain);
    }
}
