package com.campaignio.cron.util;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.queues.cron.CronPullServlet;
import com.agilecrm.queues.util.PullQueueUtil;
import com.campaignio.cron.Cron;
import com.campaignio.cron.deferred.CronDeferredTask;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.QueryResultIterator;
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
	/**
	 * Dao of Cron class.
	 */
	private static ObjectifyGenericDao<Cron> dao = new ObjectifyGenericDao<Cron>(Cron.class);

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
	 * Gets old cron job and run the cron job. Once fetched, delete that cron
	 * job.
	 */
	public static void getExpiredCronJobsAndRun()
	{
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		// Get all sessions with last_messg_rcvd_time
		Long milliSeconds = Calendar.getInstance().getTimeInMillis();
		System.out.println(milliSeconds + " " + NamespaceManager.get());

		Query<Cron> query = dao.ofy().query(Cron.class).filter("timeout <= ", milliSeconds);

		QueryResultIterator<Cron> iterator = query.iterator();

		while (iterator.hasNext())
		{
			Cron cron = iterator.next();
			dao.delete(cron);

			// Temporary list
			List<Cron> cronList = new ArrayList<Cron>();
			cronList.add(cron);

			// Run cron job
			executeTasklets(cronList, Cron.CRON_TYPE_TIME_OUT, null);
		}

		NamespaceManager.set(oldNamespace);
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

		// Execute in another tasklet
		executeTasklets(cronJobs, Cron.CRON_TYPE_INTERRUPT, interruptData);

		dao.deleteAll(cronJobs);
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
	 */
	public static void executeTasklets(List<Cron> cronJobs, String wakeupOrInterrupt, JSONObject customData)
	{
		System.out.println("Jobs dequeued - " + wakeupOrInterrupt + " [" + cronJobs.size() + "]" + cronJobs);

		int size = cronJobs.size();

		// Iterate through all tasks
		for (Cron cron : cronJobs)
		{
			if (customData == null)
				customData = new JSONObject();

			CronDeferredTask cronDeferredTask = new CronDeferredTask(cron.namespace, cron.campaign_id,
					cron.data_string, cron.subscriber_json_string, cron.node_json_string, wakeupOrInterrupt,
					customData.toString());

			// If bulk crons wake up from Wait, add to pull queue
			if (wakeupOrInterrupt.equalsIgnoreCase(Cron.CRON_TYPE_TIME_OUT))
			{
				PullQueueUtil.addToPullQueue(size >= CronPullServlet.FETCH_LIMIT ? AgileQueues.BULK_CAMPAIGN_PULL_QUEUE
						: AgileQueues.NORMAL_CAMPAIGN_PULL_QUEUE, cronDeferredTask, cron.namespace);
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

	public static void getActiveWorkflowCrons(Contact a, JSONObject subscriberJSON, JSONObject campaignJSON)
	{
		// TODO Auto-generated method stub
		System.out.println(a);
		List p = (List) dao.ofy().query(Contact.class).filter("campaign_status", a);

	}
}
