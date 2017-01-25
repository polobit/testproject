package com.campaignio.cron.util;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.util.CacheUtil;
import com.campaignio.cron.Cron;
import com.campaignio.cron.deferred.CronDeferredTask;
import com.campaignio.tasklets.agile.Wait;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.DatastoreTimeoutException;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

/**
 * <code>CronUtil</code> is the base class to save and delete crons. It is used
 * to get crons with respect to campaign and subscribers data. CronUtil is used
 * to calculate timeout period if duration period and type is given. CronUtil
 * execute tasklets based upon interrupt or timeout condition.
 * 
 * @author Manohar
 * 
 */
public class CronUtil
{
	
	private Map<String, Boolean> cacheMap = new HashMap<String, Boolean>();
	private long startTime = 0l;
	
	/**
	 * Dao of Cron class.
	 */
	private static ObjectifyGenericDao<Cron> dao = new ObjectifyGenericDao<Cron>(Cron.class);

	CronUtil()
	{
		startTime = System.currentTimeMillis();
	}
	
	/**
	 * Creates a new Cron object and enqueue task in cron.
	 * 
	 * @param campaignJSON
	 *            Campaign Data.
	 * @param subscriberJSON
	 *            Contact Data that subscribes to Campaign.
	 * @param data
	 *            Workflow Data.
	 * @param nodeJSON
	 *            Current Node.
	 * @param timeOut
	 *            Timeout period.
	 * @param custom1
	 *            Custom value.
	 * @param custom2
	 *            Custom value.
	 * @param custom3
	 *            Custom value.
	 * @throws Exception
	 */
	public static void enqueueTask(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data,
			JSONObject nodeJSON, long timeOut, String custom1, String custom2, String custom3) throws Exception
	{
		Cron cron = new Cron(campaignJSON, subscriberJSON, data, nodeJSON, timeOut, custom1, custom2, custom3);
		cron.save();
	}

	/**
	 * Gets list of Crons that are saved.
	 * 
	 * @param campaignId
	 *            Campaign ID.
	 * @param subscriberId
	 *            Contact ID.
	 * @return list of Crons.
	 */
	public static List<Cron> getCrons(String campaignId, String subscriberId)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("subscriber_id", subscriberId);
		searchMap.put("campaign_id", campaignId);

		return dao.listByProperty(searchMap);
	}

	/**
	 * Removes crons by namespace and sets namespace to old.
	 * 
	 * @param namespace
	 *            Namespace.
	 */
	public static void deleteCronsByNamespace(String namespace)
	{
		// If namespace is empty return
		if (StringUtils.isEmpty(namespace))
			return;

		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		try
		{
			// Get cron key list related to given namespace
			List<Key<Cron>> cron_keys = dao.ofy().query(Cron.class).filter("namespace", namespace).listKeys();

			// Delete crons
			dao.ofy().delete(cron_keys);
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}

	/**
	 * Removes task with respect to campaign and contact.
	 * 
	 * @param campaignId
	 *            Campaign ID.
	 * @param subscriberId
	 *            Contact ID.
	 */
	public static void removeTask(String campaignId, String subscriberId)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();

		if (!StringUtils.isEmpty(subscriberId))
			searchMap.put("subscriber_id", subscriberId);

		if (!StringUtils.isEmpty(campaignId))
			searchMap.put("campaign_id", campaignId);

		String oldNamespace = NamespaceManager.get();

		// As Crons exist in empty namespace, namespace is must
		if (StringUtils.isBlank(oldNamespace))
			return;

		System.out.println("Deleting crons from namespace..." + oldNamespace);

		// namespace
		searchMap.put("namespace", oldNamespace);
		NamespaceManager.set("");

		try
		{
			List<Key<Cron>> keys = dao.listKeysByProperty(searchMap);
			dao.deleteKeys(keys);
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}

	/**
	 * Gets time after adding current time with specified duration and duration
	 * type.
	 * 
	 * @param durationString
	 *            Duration period.
	 * @param durationType
	 *            Duration type such as days, hours and minutes.
	 * @return time-out period.
	 * @throws Exception
	 */
	public static long getTimerAt(String durationString, String durationType) throws Exception
	{
		int duration = Integer.parseInt(durationString);

		Calendar calendar = Calendar.getInstance();

		// Days
		if (durationType.equalsIgnoreCase(Cron.DURATION_TYPE_DAYS))
			calendar.add(Calendar.DAY_OF_MONTH, duration);

		// Hours
		if (durationType.equalsIgnoreCase(Cron.DURATION_TYPE_HOURS))
			calendar.add(Calendar.HOUR_OF_DAY, duration);

		// Mins
		if (durationType.equalsIgnoreCase(Cron.DURATION_TYPE_MINS))
			calendar.add(Calendar.MINUTE, duration);

		System.out.print("Current Time: " + Calendar.getInstance().getTimeInMillis());
		System.out.println(" Will wake up Time: " + calendar.getTimeInMillis());

		return calendar.getTimeInMillis();
	}

	/**
	 * Gets time after adding current time with specified duration and duration
	 * type.
	 * 
	 * @param durationString
	 *            Duration period.
	 * @param durationType
	 *            Duration type such as Days, Hours, Minutes.
	 * @return resultant time after adding current time with the given
	 *         parameters.
	 * @throws Exception
	 */
	public static long getTimer(String durationString, String durationType) throws Exception
	{

		return getTimer(durationString, durationType, "", "");
	}

	/**
	 * Gets old cron job and run the cron job. Once fetched, delete that cron
	 * job.
	 */
	public static void getExpiredCronJobsAndRun()
	{
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		// Get all sessions with last_messg_rcvd_time
		//Long milliSeconds = System.currentTimeMillis();
		//System.out.println(milliSeconds + " " + NamespaceManager.get());
		
		CronUtil cronUtil = new CronUtil();
		
		while(cronUtil.doContinue()){
			try
			{
				cronUtil.fetchAndExecute(25);
			}
			catch (Exception e)
			{
				e.printStackTrace();
				System.err.println("Exception occured - " + e.getMessage() + " Exiting loop");
				break;
			}
		}
			
		NamespaceManager.set(oldNamespace);
	}

	/**
	 * Fetches crons from Datastore and executes
	 * 
	 * @param milliSeconds - Current time to check with timeout tasks
	 * @param limit - Number of tasks to be fetched
	 */
	public void fetchAndExecute(int limit) throws Exception
	{
		long timeout = System.currentTimeMillis() + 60000; // Added 60 secs to wake up 1 min early
		
		Query<Cron> query = dao.ofy().query(Cron.class).filter("timeout <= ", timeout).order("timeout");
		
		// Add limit to query
		if(limit > 0)
			query.limit(limit);
		
		// Delete crons immediately to make unavailable to other processes
		List<Cron> crons = query.list();
		
		if(crons == null || crons.isEmpty())
			throw new Exception("No expired cron exists with timeout " + timeout);
			
		dao.deleteAll(crons);
		
		// Iterates each cron and adds to Queue
		for(Cron cron: crons)
		{
			try
			{
				long start = System.currentTimeMillis();
				
				// Skips if duplicate cron
				if(isCronExists(cron))
					continue;
			
				// Run cron job
				executeTasklets(cron, Cron.CRON_TYPE_TIME_OUT, null);
				
				System.out.println("Took " + ((System.currentTimeMillis() - start)) + " milli seconds to process one cron record in queue");
			}
			catch(DatastoreTimeoutException e){
				e.printStackTrace();
				System.out.println("Data store time out exception occured while iterating the query result "+e.getMessage());
			}
		}
		
		// Clear the list object
		if(crons != null)
			crons.clear();
	}

	/**
	 * Interrupt a task.
	 * 
	 * @param custom1
	 *            custom value 1.
	 * @param custom2
	 *            custom value 2.
	 * @param custom3
	 *            custom value 3.
	 * @param interruptData
	 *            Interrupt data.
	 */
	public static void interrupt(String custom1, String custom2, String custom3, JSONObject interruptData)
	{
		String oldNamespace = NamespaceManager.get();
		
		NamespaceManager.set("");
		
		try
		{
			if (custom1 == null && custom2 == null && custom3 == null)
			return;

			Map<String, Object> searchMap = new HashMap<String, Object>();
	
			if (custom1 != null)
				searchMap.put("custom1", custom1);
	
			if (custom2 != null)
				searchMap.put("custom2", custom2);
	
			if (custom3 != null)
				searchMap.put("custom3", custom3);
	
		
			List<Cron> cronJobs = dao.listByProperty(searchMap);
			
			CronUtil cronUtil = new CronUtil();
			
			for(Cron cron : cronJobs)
			{
				cron.delete();
				
				// If duplicate cron obtained, skip
				if(cronUtil.isCronExists(cron))
					continue;

				// Execute in another tasklet
				executeTasklets(cron, Cron.CRON_TYPE_INTERRUPT, interruptData);
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured in interrupt of CronUtil - " + e.getMessage());
		}
		finally
		{
		    NamespaceManager.set(oldNamespace);
		}
	}

	public static void executeTasklets(Cron cron, String wakeupOrInterrupt, JSONObject customData)
	{
		List<Cron> cronList = new ArrayList<Cron>();
		cronList.add(cron);
		
		executeTasklets(cronList, wakeupOrInterrupt, customData);
	}
	/**
	 * Executes tasklets based upon wakeup or timeout using deferred task.
	 * 
	 * @param cronJobs
	 *            List of Cron jobs in the namespace.
	 * @param wakeupOrInterrupt
	 *            timeout or interrupt.
	 * @param customData
	 *            custom data.
	 * @param totalCronJobsCount
	 *            - Total matched cron jobs count to direct respective Queue
	 */
	public static void executeTasklets(List<Cron> cronJobs, String wakeupOrInterrupt, JSONObject customData)
	{
		System.out.println("Jobs dequeued - " + wakeupOrInterrupt + " [" + cronJobs.size() + "]" + cronJobs);

		// If customData null
		if(customData == null)
			customData = new JSONObject();
		
		// Iterate through all tasks
		for (Cron cron : cronJobs)
		{
			if (customData == null)
				customData = new JSONObject();

			CronDeferredTask cronDeferredTask = new CronDeferredTask(cron.namespace, cron.campaign_id,
					cron.data_string, cron.subscriber_json_string, cron.node_json_string, wakeupOrInterrupt,
					customData.toString());
			
			// If bulk crons wake up from Wait, add to pull queue. CronDeferredTask might exceed 100KB. Note: Push Queue task is limited to 100KB. Pull Queue task is upto 1 MB
			if (wakeupOrInterrupt.equalsIgnoreCase(Cron.CRON_TYPE_TIME_OUT)){
				PullQueueUtil.addToPullQueue(AgileQueues.NORMAL_CAMPAIGN_PULL_QUEUE, cronDeferredTask, cron.namespace);
//				Queue queue = QueueFactory.getQueue(AgileQueues.TIMEOUT_PUSH_QUEUE);
//				queue.addAsync(TaskOptions.Builder.withPayload(cronDeferredTask));	
			}
				
			else
			{
				// Interruptted crons like Click, Open
				Queue queue = QueueFactory.getQueue(AgileQueues.CRON_QUEUE);
				queue.add(TaskOptions.Builder.withPayload(cronDeferredTask));
			}
		}
	}

	/**
	 * Returns count of subscribers for that campaign.
	 * 
	 * @param campaignId
	 *            - campaign-id
	 * @return int
	 */
	public static int activeUsersCount(String campaignId)
	{
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");
		try
		{
			return dao.ofy().query(Cron.class).filter("campaign_id", campaignId).count();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}

	/**
	 * 
	 * Gets time after adding current time with specified duration and duration
	 * type.
	 * 
	 * @param durationString
	 *            Duration period.
	 * @param durationType
	 *            Duration type such as Days, Hours, Minutes.
	 * @param timezone
	 *            Selected timezone.
	 * @param at
	 *            At a given time.
	 * @return resultant time after adding current time with the given
	 *         parameters.
	 * @throws Exception
	 */

	public static long getTimer(String durationString, String durationType, String timezone, String at)
	{

		// TODO Auto-generated method stub
		int duration = Integer.parseInt(durationString);
		// TimeZone timeZone = TimeZone.getTimeZone(timezone);
		Calendar calendar = Calendar.getInstance();

		// Set timezone
		if (!Wait.DEFAULT_TIMEZONE.equals(timezone) && !StringUtils.isEmpty(timezone))
		{
			TimeZone timeZone = null;
			
			//check if there is any character with timezone variable or not at beginning
			//if present them we can split that string
			if(Character.isAlphabetic(timezone.charAt(0)))
				timeZone = TimeZone.getTimeZone(timezone);			
			else
				timeZone = TimeZone.getTimeZone(timezone.substring(1));
			
			calendar.setTimeZone(timeZone);
			System.out.println("timezone   :   "+timeZone);
		}

		// Days
		if (durationType.equalsIgnoreCase(Cron.DURATION_TYPE_DAYS))
			calendar.add(Calendar.DAY_OF_MONTH, duration);

		// Hours
		if (durationType.equalsIgnoreCase(Cron.DURATION_TYPE_HOURS))
			calendar.add(Calendar.HOUR_OF_DAY, duration);

		// Mins
		if (durationType.equalsIgnoreCase(Cron.DURATION_TYPE_MINS))
			calendar.add(Calendar.MINUTE, duration);

		// Business days - Bhasuri
		if ((Cron.DURATION_TYPE_BUSINESS_DAYS).equalsIgnoreCase(durationType))
		{
			int i = 1;
			while (i <= duration)
			{
				calendar.set(Calendar.DAY_OF_MONTH, calendar.get(Calendar.DAY_OF_MONTH) + 1);
				if (calendar.get(Calendar.DAY_OF_WEEK) == 7 || calendar.get(Calendar.DAY_OF_WEEK) == 1)
				{
					calendar.set(Calendar.DAY_OF_MONTH, calendar.get(Calendar.DAY_OF_MONTH) + 1);
					continue;
				}
				i++;
			}
			System.out.println(calendar.getTimeZone().getDisplayName());
		}

		// set wakeup time
		if (!Wait.DEFAULT_AT.equals(at) && !StringUtils.isEmpty(at))
		{
			calendar.set(Calendar.HOUR_OF_DAY, Integer.parseInt(at.substring(0, 2)));
			calendar.set(Calendar.MINUTE, Integer.parseInt(at.substring(3)));
		}

		System.out.print("Current Time: " + Calendar.getInstance().getTimeInMillis());
		System.out.println(" Will wake up Time: " + calendar.getTimeInMillis());

		return calendar.getTimeInMillis();
	}
	
	/**
	 * Instance method to verifies duplicate cron in the query
	 * 
	 * @param cron - Cron object
	 * 
	 * @return boolean
	 */
	private boolean isCronExists(Cron cron)
	{
		String nodeId = null, hopCount = null;
		
		try
		{
			JSONObject nodeJSON = new JSONObject(cron.node_json_string);
			nodeId = AgileTaskletUtil.getId(nodeJSON);
			
			JSONObject dataJSON = new JSONObject(cron.data_string);
			
			// Get Hop count.
			if(dataJSON.has(TaskletUtil.HOPS_COUNT))
				hopCount = dataJSON.getString(TaskletUtil.HOPS_COUNT);
			
		}
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		// Key that identifies duplicate crons
		String key = cron.namespace + "_"+ cron.campaign_id + "_" + cron.subscriber_id;
		
		// Add node Id 
		if(StringUtils.isNotEmpty(nodeId))
			key +=  "_" + nodeId;
		
		// Add hop count that separates node
		if(StringUtils.isNotEmpty(hopCount))
			key += "_" + hopCount;
		
		key += "_" + cron.custom1 + "_" + cron.custom2 + "_" + cron.custom3;
		
		if(CacheUtil.getCache(key) != null)
		{
			System.err.print("Duplicate cron exists..." + key);
			return true;
		}
		
		//cacheMap.put(key, true);
		
		// Sets in Memcache for 2 mins
		CacheUtil.setCache(key, true, 5 * 60 * 1000);
		
		return false;
	}
	
	/**
	 * Checks whether it reached max time or not
	 * 
	 * @return boolean
	 */
	private boolean doContinue()
	{
		Long time = System.currentTimeMillis() - startTime;

	    System.out.println("Time left in cron " + time);

	    if ((System.currentTimeMillis() - startTime) <= (8 * 60 * 1000))
	    	return true;
	    
		return false;
	}
}

