package com.campaignio.tasklets.agile;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
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
public class BusinessHours extends TaskletAdapter
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
	 * (non-Javadoc)
	 * 
	 * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
	 * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
	 */
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		// Get Duration, Type
		String duration = getStringValue(nodeJSON, subscriberJSON, data, "timegrid");

		JSONArray arrayDuration = new JSONArray(duration);
		List<String> campaignIDs = new ArrayList<String>();
		JSONArray jsonArray;
		try
		{
			jsonArray = nodeJSON.getJSONArray(JSON_VALUES);
			int jsonArrayLength = jsonArray.length();

			// Iterate through name/value pairs. First one is the select option
			// ID and multi select ID

			for (int i = 1; i < jsonArrayLength; i++)
			{
				// Get the each JSON data

				JSONObject json = jsonArray.getJSONObject(i);

				// For Serialized data from ui - you will get name, value
				// pairs
				if (json.has("name"))
					campaignIDs.add((String) json.get("value"));

			}
		}
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		String durationType = getStringValue(nodeJSON, subscriberJSON, data, DURATION_TYPE);

		System.out.println("Waiting for " + duration + " " + durationType);

		// Creates log for sending email
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
				"Wait duration - " + duration + " " + durationType, LogType.WAIT.toString());

		// Add ourselves to Cron Queue
		long timeout = CronUtil.getTimer(duration, durationType);
		CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout, null, null, null);
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