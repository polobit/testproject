package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.campaignio.cron.Cron;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Wait</code> class represents wait node in workflow. Wait is to set
 * duration period in the workflow. It consists of duration period and duration
 * type. Wait class uses {@link Cron} to set for that duration period.
 * 
 * @author Manohar
 * 
 */
public class Wait extends TaskletAdapter
{
	/**
	 * Duration period
	 */
	public static String DURATION = "duration";

	/**
	 * Duration type such as Days,Hours and Minutes
	 */
	public static String DURATION_TYPE = "duration_type";

	/*
	 * Default value in the drop down of wait
	 */
	public static String DEFAULT_AT = "any_time";

	/*
	 * Default timezone in the drop down of wait node
	 */
	public static String DEFAULT_TIMEZONE = "empty_timezone";

	/*
	 * Timezone of the node
	 */
	public static String TIMEZONE = "timezone";

	/*
	 * Time for wake up
	 */
	public static String AT = "at";

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
	 * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
	 */
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		// Get Duration, Type
		String duration = getStringValue(nodeJSON, subscriberJSON, data, DURATION);
		String durationType = getStringValue(nodeJSON, subscriberJSON, data, DURATION_TYPE);
		String timezone = getStringValue(nodeJSON, subscriberJSON, data, TIMEZONE);
		String at = getStringValue(nodeJSON, subscriberJSON, data, AT);

		System.out.println("Waiting for " + duration + " " + durationType);

		try
		{
			// Creates log for wait
			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
					"Wait duration - " + duration + " " + durationType, LogType.WAIT.toString());

			// Add ourselves to Cron Queue
			long timeout = CronUtil.getTimer(duration, durationType, timezone, at);

			// Add the task to the cron
			CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout, null, null, null);
		}
		catch (Exception e)
		{
			System.out.println("Exception in wait :" + e.getMessage());
		}

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.campaignio.tasklets.TaskletAdapter#timeOutComplete(org.json.JSONObject
	 * , org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
	 */
	public void timeOutComplete(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		System.out.println("Wake up from wait. Executing next one.");

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}
}