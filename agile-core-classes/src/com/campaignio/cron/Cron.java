package com.campaignio.cron;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * <code>Cron</code> is the base class for scheduling in agilecrm. Cron is used
 * to send emails on prescribed date and time. Cron is responsible to wake up
 * tasks at right time.
 * 
 * @author Manohar
 * 
 */
@SuppressWarnings("serial")
@Cached
public class Cron extends HttpServlet
{
	/**
	 * Unique id for each cron.
	 */
	@Id
	public Long id;

	/**
	 * DB Names and fields.
	 */
	public static final String CRON_DB = "crons";
	public static final String CRON_DB_USER_ID = "user_id";

	/**
	 * Time out (in seconds) - when should the tasklet wake up.
	 */
	@Indexed
	public Long timeout = 0L;

	/**
	 * Time out in human readable format.
	 */
	@SuppressWarnings("unused")
	private String timeout_string = null;

	/**
	 * Campaign Data.
	 */
	@NotSaved
	public JSONObject campaign_json;

	/**
	 * Workflow data.
	 */
	@NotSaved
	public JSONObject data;

	/**
	 * Current Node.
	 */
	@NotSaved
	public JSONObject node_json;

	/**
	 * Subscriber JSON.
	 */
	@NotSaved
	public JSONObject subscriber_json;

	/**
	 * JSON Strings.
	 */
	@NotSaved
	public String campaign_json_string=null;
	
	public String data_string, node_json_string, subscriber_json_string;

	/**
	 * Custom Values.
	 */
	public String custom1;
	public String custom2;
	public String custom3;

	/**
	 * Store Subscriber ID and Campaign ID to dequeue.
	 */
	public String campaign_id;
	public String subscriber_id;

	/**
	 * Store NameSpace.
	 */
	@Indexed
	public String namespace;

	/**
	 * Duration Type.
	 */
	public static final String DURATION_TYPE_MINS = "mins";
	public static final String DURATION_TYPE_SECONDS = "secs";
	public static final String DURATION_TYPE_HOURS = "hours";
	public static final String DURATION_TYPE_DAYS = "days";
	public static final String DURATION_TYPE_WEEK = "week";
	public static final String DURATION_TYPE_BUSINESS_DAYS = "business days";
	/**
	 * Wake up or Interrupt.
	 */
	public static final String CRON_TYPE_INTERRUPT = "interrupt";
	public static final String CRON_TYPE_TIME_OUT = "timeout";

	/**
	 * Cron Dao.
	 */
	private static ObjectifyGenericDao<Cron> dao = new ObjectifyGenericDao<Cron>(Cron.class);

	/**
	 * Default Cron.
	 */
	public Cron()
	{

	}

	/**
	 * Constructs a new {@link Cron}.
	 * 
	 * @param campaignJSON
	 *            Campaign Data.
	 * @param subscriberJSON
	 *            Contact data that subscribes to Campaign.
	 * @param data
	 *            Workflow data.
	 * @param nodeJSON
	 *            Current Node.
	 * @param timeOut
	 *            Timeout time.
	 * @param custom1
	 *            Custom value1.
	 * @param custom2
	 *            Custom value2.
	 * @param custom3
	 *            Custom value3.
	 */
	public Cron(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON, long timeOut,
			String custom1, String custom2, String custom3)
	{
		this.campaign_json = campaignJSON;
		this.subscriber_json = subscriberJSON;
		this.data = data;
		this.node_json = nodeJSON;
		this.timeout = timeOut;
		this.custom1 = custom1;
		this.custom2 = custom2;
		this.custom3 = custom3;

		// Store Campaign and Subscriber ID for dequeueing while deletion
		this.campaign_id = AgileTaskletUtil.getId(campaignJSON);
		this.subscriber_id = AgileTaskletUtil.getId(subscriberJSON);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest
	 * , javax.servlet.http.HttpServletResponse)
	 */
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException
	{
		// For registering all entities - AgileUser is a just a random class we
		// are using
		ObjectifyGenericDao<AgileUser> dao = new ObjectifyGenericDao<AgileUser>(AgileUser.class);
		System.out.println(dao.getClass());

		try
		{
			// Dequeue Tasks
			System.out.println("Cron init - ");
			CronUtil.getExpiredCronJobsAndRun();
			System.out.println("Cron done - ");
			return;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			resp.getWriter().println("Error " + e);
			System.out.println("Error " + e);
		}
	}

	/**
	 * Sets the namespace to old namespace and save cron.
	 */
	public void save()
	{
		// Set the namespace
		namespace = NamespaceManager.get();
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		try
		{
			dao.put(this);
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}

	/**
	 * Deletes Cron.
	 */
	public void delete()
	{
		dao.delete(this);
	}

	/**
	 * Deletes cron by namespace.
	 * 
	 * @param namespace
	 *            Namespace.
	 */
	public void deleteByNameSpace(String namespace)
	{
		NamespaceManager.set(namespace);

		List<Key<Cron>> cronKeys = dao.ofy().query(Cron.class).filter("namespace", namespace).listKeys();

		dao.deleteKeys(cronKeys);
	}

	/**
	 * Sets json string variables before cron gets saved.
	 */
	@PrePersist
	void PrePersist()
	{
		campaign_json_string = null;
		data_string = data.toString();
		node_json_string = node_json.toString();
		subscriber_json_string = subscriber_json.toString();
		timeout_string = new Date(timeout * 1000).toString();
	}

	/**
	 * Sets json string to json string after crons have been retrieved.
	 */
	@PostLoad
	void PostLoad()
	{
		try
		{
			if (campaign_json_string != null)
				campaign_json = new JSONObject(campaign_json_string);

			if (data_string != null)
				data = new JSONObject(data_string);

			if (node_json_string != null)
				node_json = new JSONObject(node_json_string);

			if (subscriber_json_string != null)
				subscriber_json = new JSONObject(subscriber_json_string);
		}
		catch (Exception e)
		{

		}

		// System.out.println("Logs " + logs);
	}
}