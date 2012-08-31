package com.campaignio.cron;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.DBUtil;
import com.campaignio.tasklets.Tasklet;
import com.campaignio.tasklets.TaskletManager;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;

@SuppressWarnings("serial")
public class Cron extends HttpServlet {
	// Key
	@Id
	public Long id;

	// DB Names and fields
	public static final String CRON_DB = "crons";
	public static final String CRON_DB_USER_ID = "user_id";

	// Time out (in seconds) - when should the tasklet wake up
	@Indexed
	public Long timeout = 0L;

	// Campaign Data/ID
	@NotSaved
	public JSONObject campaign_json;

	// Workflow Data
	@NotSaved
	public JSONObject data;

	// Current Node
	@NotSaved
	public JSONObject node_json;

	// Subscriber JSON/ID
	@NotSaved
	public JSONObject subscriber_json;

	// JSON Strings
	private String campaign_json_string, data_string, node_json_string,
			subscriber_json_string;

	// Custom Values
	public String custom1;
	public String custom2;
	public String custom3;

	// Store Subscriber ID and Campaign ID to dequeue
	public String campaign_id;
	public String subscriber_id;

	// Store NameSpace
	public String namespace;

	// Duration Type
	public static final String DURATION_TYPE_MINS = "mins";
	public static final String DURATION_TYPE_SECONDS = "secs";
	public static final String DURATION_TYPE_HOURS = "hours";
	public static final String DURATION_TYPE_DAYS = "days";
	public static final String DURATION_TYPE_WEEK = "week";

	// Wake up or Interrupt
	public static final String CRON_TYPE_INTERRUPT = "interrupt";
	public static final String CRON_TYPE_TIME_OUT = "timeout";

	// Dao
	private static ObjectifyGenericDao<Cron> dao = new ObjectifyGenericDao<Cron>(
			Cron.class);

	public Cron() {

	}

	Cron(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data,
			JSONObject nodeJSON, long timeOut, String custom1, String custom2,
			String custom3) {
		this.campaign_json = campaignJSON;
		this.subscriber_json = subscriberJSON;
		this.data = data;
		this.node_json = nodeJSON;
		this.timeout = timeOut;
		this.custom1 = custom1;
		this.custom2 = custom2;
		this.custom3 = custom3;

		// Store Campaign and Subscriber ID for dequeueing while deletion
		this.campaign_id = DBUtil.getId(campaignJSON);
		this.subscriber_id = DBUtil.getId(subscriberJSON);
	}

	@PrePersist
	void PrePersist() {
		campaign_json_string = campaign_json.toString();
		data_string = data.toString();
		node_json_string = node_json.toString();
		subscriber_json_string = subscriber_json.toString();
	}

	@PostLoad
	void PostLoad() {
		try {
			if (campaign_json_string != null)
				campaign_json = new JSONObject(campaign_json_string);

			if (data_string != null)
				data = new JSONObject(data_string);

			if (node_json_string != null)
				node_json = new JSONObject(node_json_string);

			if (subscriber_json_string != null)
				subscriber_json = new JSONObject(subscriber_json_string);

		} catch (Exception e) {

		}

		// System.out.println("Logs " + logs);
	}

	// Delete Contact
	public void delete() {
		dao.delete(this);
	}

	public void save() {

		// Set the namespace
		namespace = NamespaceManager.get();

		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");
		try {
			dao.put(this);
		} finally {
			NamespaceManager.set(oldNamespace);
		}
	}

	// Enqueue Task
	public static void enqueueTask(JSONObject campaignJSON,
			JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON,
			long timeOut, String custom1, String custom2, String custom3)
			throws Exception {
		Cron cron = new Cron(campaignJSON, subscriberJSON, data, nodeJSON,
				timeOut, custom1, custom2, custom3);
		cron.save();
	}

	public static List<Cron> getCrons(String campaignId, String subscriberId) {
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("subscriber_id", subscriberId);
		searchMap.put("campaign_id", campaignId);

		return dao.listByProperty(searchMap);
	}

	// Enqueue Task
	public static void removeTask(String campaignId, String subscriberId) {

		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("subscriber_id", subscriberId);
		searchMap.put("campaign_id", campaignId);
		searchMap.put("namespace", NamespaceManager.get());

		List<Key<Cron>> keys = dao.listKeysByProperty(searchMap);
		dao.deleteKeys(keys);
	}

	// Stop Campaign
	public static void stopCampaign(String campaignId) {

		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("campaign_id", campaignId);
		searchMap.put("namespace", NamespaceManager.get());

		List<Key<Cron>> keys = dao.listKeysByProperty(searchMap);

		dao.deleteKeys(keys);
	}

	// Delete Contact
	public static void deleteContact(String subscriberId) {

		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("subscriber_id", subscriberId);
		searchMap.put("namespace", NamespaceManager.get());

		List<Key<Cron>> keys = dao.listKeysByProperty(searchMap);
		dao.deleteKeys(keys);
	}

	// Dequeue Tasks
	public static void executeTasklets(List<Cron> cronJobs,
			String wakeupOrInterrupt, JSONObject customData) {
		System.out.println("Jobs dequeued - " + wakeupOrInterrupt + " ["
				+ cronJobs.size() + "]" + cronJobs);

		// Iterate through all tasks
		for (Cron cron : cronJobs) {
			if (customData == null)
				customData = new JSONObject();

			CronDeferredTask cronDeferredTask = new CronDeferredTask(
					cron.namespace, cron.campaign_json_string,
					cron.data_string, cron.subscriber_json_string,
					cron.node_json_string, wakeupOrInterrupt,
					customData.toString());
			Queue queue = QueueFactory.getDefaultQueue();
			queue.add(TaskOptions.Builder.withPayload(cronDeferredTask));
		}
	}

	// Get Timer
	public static long getTimerAt(String durationString, String durationType)
			throws Exception {

		int duration = Integer.parseInt(durationString);

		Calendar calendar = Calendar.getInstance();

		// Days
		if (durationType.equalsIgnoreCase(DURATION_TYPE_DAYS))
			calendar.add(Calendar.DAY_OF_MONTH, duration);

		// Hours
		if (durationType.equalsIgnoreCase(DURATION_TYPE_HOURS))
			calendar.add(Calendar.HOUR_OF_DAY, duration);

		// Mins
		if (durationType.equalsIgnoreCase(DURATION_TYPE_MINS))
			calendar.add(Calendar.MINUTE, duration);

		System.out.print("Current Time: "
				+ Calendar.getInstance().getTimeInMillis());
		System.out.println(" Will wake up Time: " + calendar.getTimeInMillis());

		return calendar.getTimeInMillis();
	}

	// Get Timer
	public static long getTimer(String durationString, String durationType)
			throws Exception {

		int duration = Integer.parseInt(durationString);
		Calendar calendar = Calendar.getInstance();

		// Days
		if (durationType.equalsIgnoreCase(DURATION_TYPE_DAYS))
			calendar.add(Calendar.DAY_OF_MONTH, duration);

		// Hours
		if (durationType.equalsIgnoreCase(DURATION_TYPE_HOURS))
			calendar.add(Calendar.HOUR_OF_DAY, duration);

		// Mins
		if (durationType.equalsIgnoreCase(DURATION_TYPE_MINS))
			calendar.add(Calendar.MINUTE, duration);

		System.out.print("Current Time: "
				+ Calendar.getInstance().getTimeInMillis());
		System.out.println(" Will wake up Time: " + calendar.getTimeInMillis());

		return calendar.getTimeInMillis();
	}

	// Get Old Sessions & Deletes them all
	public static List<Cron> getExpiredCronJobs() {

		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		// Get all sessions with last_messg_rcvd_time
		Long milliSeconds = Calendar.getInstance().getTimeInMillis();
		System.out.println(milliSeconds + " " + NamespaceManager.get());

		List<Cron> cronJobs = dao.listByProperty("timeout <=", milliSeconds);

		System.out.println(cronJobs);

		cronJobs = dao.ofy().query(Cron.class)
				.filter("timeout <=", milliSeconds).list();

		System.out.println(cronJobs);

		// Delete them all
		dao.deleteAll(cronJobs);

		NamespaceManager.set(oldNamespace);

		return cronJobs;
	}

	// Interrupt a task
	public static void interrupt(String custom1, String custom2,
			String custom3, JSONObject interruptData) {

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
		executeTasklets(cronJobs, CRON_TYPE_INTERRUPT, interruptData);

		dao.deleteAll(cronJobs);

	}

	// Wakeup
	public static void wakeupOldTasks() {
		// Check for timeouts task and delete them after fetching
		List<Cron> cronJobs = getExpiredCronJobs();

		if (cronJobs.size() > 0) {
			System.out.println("Waking up " + cronJobs.size() + " jobs");
			executeTasklets(cronJobs, CRON_TYPE_TIME_OUT, null);
		} else {
			System.out.println("No jobs to wake up");
		}
	}

	// Get Request
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {

		// For registering all entities - AgileUser is a just a random class we
		// are using
		ObjectifyGenericDao<AgileUser> dao = new ObjectifyGenericDao<AgileUser>(
				AgileUser.class);
		System.out.println(dao.getClass());
		

		try {
			// Dequeue Tasks
			System.out.println("Cron init - ");
			wakeupOldTasks();
			System.out.println("Cron done - ");
			return;
		} catch (Exception e) {
			e.printStackTrace();
			resp.getWriter().println("Error " + e);
			System.out.println("Error " + e);
		}

	}

}

@SuppressWarnings("serial")
class CronDeferredTask implements DeferredTask {

	String wakeupOrInterrupt;
	String customDataString;
	String campaignJSONString, dataString, subscriberJSONString,
			nodeJSONString;
	String namespace;

	public CronDeferredTask(String namespace, String campaignJSONString,
			String dataString, String subscriberJSONString,
			String nodeJSONString, String wakeupOrInterrupt,
			String customDataString) {

		this.campaignJSONString = campaignJSONString;
		this.dataString = dataString;
		this.subscriberJSONString = subscriberJSONString;
		this.nodeJSONString = nodeJSONString;
		this.wakeupOrInterrupt = wakeupOrInterrupt;
		this.customDataString = customDataString;
	}

	@Override
	public void run() {
		String oldNameSpace = NamespaceManager.get();

		NamespaceManager.set(namespace);

		try {
			// Add in mem_cache
			JSONObject campaignJSON = new JSONObject(campaignJSONString);
			JSONObject data = new JSONObject(dataString);
			JSONObject subscriberJSON = new JSONObject(subscriberJSONString);
			JSONObject nodeJSON = new JSONObject(nodeJSONString);
			JSONObject customData = new JSONObject(customDataString);

			// Get Tasklet
			Tasklet tasklet = TaskletManager.getTasklet(nodeJSON);
			if (tasklet != null) {
				System.out.println("Executing tasklet from CRON ");

				if (wakeupOrInterrupt.equalsIgnoreCase(Cron.CRON_TYPE_TIME_OUT))
					tasklet.timeOutComplete(campaignJSON, subscriberJSON, data,
							nodeJSON);
				else
					tasklet.interrupted(campaignJSON, subscriberJSON, data,
							nodeJSON, customData);
			}

		} catch (Exception e) {
			System.err.println("Exception occured in Cron " + e.getMessage());
			e.printStackTrace();
		}

		NamespaceManager.set(oldNameSpace);
	}
}