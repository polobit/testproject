package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.util.DateUtil;
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
public class WaitTill extends TaskletAdapter
{
	/**
	 * Timezones
	 */
	private static final String TIME_ZONE = "time_zone";

	private static final String AT = "at";

	/**
	 * Duration period- Date
	 */
	public static String DURATION = "duration";

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
	 * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
	 */
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		// Get Duration, At, and Timezone
		String duration = getStringValue(nodeJSON, subscriberJSON, data, DURATION);
		String at = getStringValue(nodeJSON, subscriberJSON, data, AT);
		String timeZoneString = getStringValue(nodeJSON, subscriberJSON, data, TIME_ZONE);
		try
		{
			long timeout;

			timeout = DateUtil.getCalendar(duration, timeZoneString, at).getTimeInMillis();
			
			System.out.println("Waits till: " + timeout);

			// Creates log for sending email
			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
					"Waits till - " + at + " of " + duration, LogType.WAIT_TILL.toString());

			// Add ourselves to Cron Queue
			CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout, null, null, null);
		}
		catch (Exception e)
		{
			System.out.println("Exception while setting time in WaitTill Node.." + e.getMessage());
		}

	}

	public void timeOutComplete(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}
}