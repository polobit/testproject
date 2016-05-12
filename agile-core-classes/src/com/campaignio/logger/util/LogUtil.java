package com.campaignio.logger.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.SerializationUtils;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;

import com.agilecrm.AgileQueues;
import com.agilecrm.db.GoogleSQL;
import com.agilecrm.mandrill.util.deferred.LogDeferredTask;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.wrapper.LogWrapper;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.TaskHandle;
import com.google.appengine.api.utils.SystemProperty;

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

		// For localhost
		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			domain = "localhost";

		if (StringUtils.isEmpty(domain) || StringUtils.isEmpty(campaignId) || StringUtils.isEmpty(subscriberId))
			return;

		// To know SQL process time
		long startTime = System.currentTimeMillis();
		
		//LogDeferredTask  logDeferredTask= new LogDeferredTask(campaignId, subscriberId, message
	    	//	, logType,domain);
		
		// Add to pull queue with from email as Tag
		//PullQueueUtil.addToPullQueue(AgileQueues.CAMPAIGN_LOG_QUEUE, logDeferredTask, domain+"_"+campaignId);

		// Insert to SQL
		CampaignLogsSQLUtil.addToCampaignLogs(domain, campaignId, WorkflowUtil.getCampaignName(campaignId),
				subscriberId, message, logType);

		long processTime = System.currentTimeMillis() - startTime;
		System.out.println("Process time for adding log is " + processTime + "ms");
	}
	
	public static void sendCampaignLogs(List<TaskHandle> tasks)
    {
    	
		addCampaignLogs(convertTaskHandlestoMailDeferredTasks(tasks));
    }

    public static List<LogDeferredTask> convertTaskHandlestoMailDeferredTasks(List<TaskHandle> tasks)
    {
	List<LogDeferredTask> logDeferredTasks = new ArrayList<LogDeferredTask>();
	for (TaskHandle handle : tasks)
	{
	    try
	    {
	    	logDeferredTasks.add((LogDeferredTask) SerializationUtils.deserialize(handle.getPayload()));
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}
	return logDeferredTasks;
    }
	public static void addCampaignLogs(List<LogDeferredTask> tasks)
    {
	Map<String, String> campaignNameMap = new HashMap<String, String>();
	List<Object[]> queryList = new ArrayList<Object[]>();
	for (LogDeferredTask logDeferredTask : tasks)
	{
	    String campaignName = null;
	    String oldNamespace = NamespaceManager.get();
	    try{	    
	    NamespaceManager.set(logDeferredTask.domain);
	    if (StringUtils.isEmpty(logDeferredTask.campaignId))
	    {
		continue;
	    }

	    if (!campaignNameMap.containsKey(logDeferredTask.campaignId + "-" + logDeferredTask.domain))
	    {
		campaignName = WorkflowUtil.getCampaignName(logDeferredTask.campaignId);
		campaignNameMap.put(logDeferredTask.campaignId + "-" + logDeferredTask.domain, campaignName);
	    }
	    else
	    {
		campaignName = campaignNameMap.get(logDeferredTask.campaignId + "-" + logDeferredTask.domain);
	    }

	    Object[] newLog = new Object[] { logDeferredTask.domain, logDeferredTask.campaignId, campaignName,
	    		logDeferredTask.subscriberId, GoogleSQL.getFutureDate(), logDeferredTask.message,
	    		logDeferredTask.logType };

	    queryList.add(newLog);
	    }
	    finally{
	    	NamespaceManager.set(oldNamespace);
	    }
	}
	
	if (queryList.size() > 0)
	{
	    Long start_time = System.currentTimeMillis();
	    CampaignLogsSQLUtil.addToCampaignLogs(queryList);
//	    CampaignLogsSQLUtil.addCampaignLogsToNewInstance(queryList);
	    System.out.println("batch request completed : " + (System.currentTimeMillis() - start_time));
	    System.out.println("Logs size : " + queryList.size());
	}

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
	public static List<LogWrapper> getSQLLogs(String campaignId, String subscriberId, String offset,String limit, String logType)
	{
		String domain = NamespaceManager.get();

		// For localhost
		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			domain = "localhost";

		if (StringUtils.isEmpty(domain))
			return null;

		// To know SQL process time
		long startTime = System.currentTimeMillis();

		// get SQL logs
		JSONArray logs = CampaignLogsSQLUtil.getLogs(campaignId, subscriberId, domain, offset,limit, logType);

		long processTime = System.currentTimeMillis() - startTime;
		System.out.println("Process time for getting logs is " + processTime + "ms");

		if (logs == null)
			return null;

		try
		{
			// to attach contact and campaign-name to each log.
		    List<LogWrapper> logsList =  new ObjectMapper().readValue(logs.toString(), new TypeReference<List<LogWrapper>>()
			    {
			    });
		    if(logsList!=null && logsList.size()>0)
		    {
			LogWrapper lastLog = logsList.get(logsList.size() - 1);
			lastLog.cursor = (Integer.parseInt(offset) + Integer.parseInt(limit)) + "";
		    }
		    return logsList;
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

		// For localhost
		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			domain = "localhost";

		if (StringUtils.isEmpty(domain) || (StringUtils.isEmpty(campaignId) && StringUtils.isEmpty(subscriberId)))
			return;

		// To know SQL process time
		long startTime = System.currentTimeMillis();
		CampaignLogsSQLUtil.deleteLogsFromSQL(campaignId, subscriberId, domain);

		long processTime = System.currentTimeMillis() - startTime;
		System.out.println("Process time for deleteing logs is " + processTime + "ms");

	}

	/**
	 * Deletes campaign logs.
	 * 
	 * @param campaignId
	 *            - Campaign Id.
	 * @param subscriberId
	 *            - subscriber Id
	 * @param logType
	 *            - campaign log type
	 */
	public static void deleteSQLLogs(String campaignId, String subscriberId, LogType logType)
	{
		String domain = NamespaceManager.get();

		// For localhost
		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			domain = "localhost";

		if (StringUtils.isEmpty(domain) || (StringUtils.isEmpty(campaignId) && StringUtils.isEmpty(subscriberId)))
			return;

		// To know SQL process time
		long startTime = System.currentTimeMillis();
		CampaignLogsSQLUtil.deleteLogsFromSQL(campaignId, subscriberId, domain, String.valueOf(logType));

		long processTime = System.currentTimeMillis() - startTime;
		System.out.println("Process time for deleteing logs is " + processTime + "ms");

	}

	/**
	 * Returns count of logs based on log type
	 * 
	 * @param campaignId
	 *            - Campaign Id
	 * @param subscriberId
	 *            - Subscriber Id
	 * @param logType
	 *            - log type
	 * @return integer
	 */
	public static int getLogsCount(String campaignId, String subscriberId, LogType logType)
	{
		String domain = NamespaceManager.get();

		// For localhost
		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
			domain = "localhost";

		if (StringUtils.isEmpty(domain) || (StringUtils.isEmpty(campaignId) && StringUtils.isEmpty(subscriberId)))
			return 0;

		return CampaignLogsSQLUtil.getCountByLogType(campaignId, subscriberId, String.valueOf(logType), domain);

	}

	/**
	 * 
	 * @param log_type
	 * @param cursor
	 * @param page_size
	 * @return
	 */
	/**
	 * 
	 * @param log_type
	 * @param cursor
	 * @param page_size
	 * @return
	 */
	public static List<LogWrapper> getConatctActivitiesSQLLogs(String log_type, String cursor, String page_size)
	{

		/*
		 * List<LogWrapper> a = new ArrayList<LogWrapper>();
		 * 
		 * try { LogWrapper a1 = new LogWrapper(); LogWrapper a2 = new
		 * LogWrapper("a"); LogWrapper a3 = new LogWrapper("a", "CLICKED");
		 * LogWrapper a4 = new LogWrapper("a", "a", "a");
		 * 
		 * LogWrapper a11 = new LogWrapper("a", "a", "a", "a", "a"); LogWrapper
		 * a12 = new LogWrapper("a", "a", "a", "a", "a"); LogWrapper a10 = new
		 * LogWrapper("a", "a", "a", "a", "a");
		 * 
		 * a.add(a1); a.add(a2); a.add(a3); a.add(a4);
		 * 
		 * a.add(a10); a.add(a11); a.add(a12);
		 * 
		 * } catch (Exception e) { System.out.println(e.getMessage()); }
		 * 
		 * return a;
		 */

		JSONArray logs = CampaignLogsSQLUtil.getContactActivitiesLogs(log_type, cursor, page_size);

		if (logs == null || "null".equals(logs) || logs.length() == 0)
			return null;

		try
		{ // to attach contact and campaign-name to each log.
			if (logs.length() < Integer.parseInt(page_size))
				return new ObjectMapper().readValue(logs.toString(), new TypeReference<List<LogWrapper>>()
				{
				});

			List<LogWrapper> logsList = new ObjectMapper().readValue(logs.toString(),
					new TypeReference<List<LogWrapper>>()
					{
					});
			
			if(log_type == null || ("All_Activities").equals(log_type))
			{
				Collections.sort(logsList, new TimeComparator());
			}

			LogWrapper lastLog = logsList.get(logsList.size() - 1);
			lastLog.cursor = (Integer.parseInt(cursor) + Integer.parseInt(page_size)) + "";

			return logsList; // Integer.parseInt(count) + "";

		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			return null;
		}

		/*
		 * List<LogWrapper> logsList = new ArrayList<LogWrapper>(); try { for
		 * (int i = 0; i < logs.length(); i++) {
		 * 
		 * logsList.add((LogWrapper) new
		 * ObjectMapperProvider().getContext(Log.class).readValue(
		 * logs.getJSONObject(i).toString(), new TypeReference<LogWrapper>() {
		 * })); }
		 * 
		 * if (logs.length() < Integer.parseInt(count)) return logsList; //
		 * contactsapi and contact LogWrapper lastLog =
		 * logsList.get(logsList.size() - 1); lastLog.cursor = logsList.size() +
		 * Integer.parseInt(count) + "";
		 * 
		 * System.out.println(logsList);
		 * 
		 * return logsList; } catch (Exception e) { e.printStackTrace(); return
		 * null; }
		 */}

}