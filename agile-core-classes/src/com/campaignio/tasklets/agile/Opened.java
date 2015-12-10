package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.util.JSONUtil;
import com.campaignio.cron.Cron;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Opened</code> represents opened node in workflow. Opened uses
 * {@link Cron} to manages the timeout or interrupt events.
 * <p>
 * It is not always possible to track email open using 1X1 image, e.g., gmail.
 * So click event is also considered as open event in a workflow. When Open node
 * is followed by Clicked node, both nodes should be wakeup if open is tracked
 * by Clicked
 * </p>
 * 
 * @author Naresh
 * 
 */
public class Opened extends TaskletAdapter
{
	/**
	 * Duration period
	 */
	public static String DURATION = "duration";

	/**
	 * Duration type
	 */
	public static String DURATION_TYPE = "duration_type";

	/**
	 * If opened then Yes
	 */
	public static String BRANCH_YES = "Yes";

	/**
	 * If not opened then No
	 */
	public static String BRANCH_NO = "No";

	/**
	 * Executes opened node based on given duration.
	 * 
	 * @param campaignJSON
	 *            - complete campaign json.
	 * @param subscriberJSON
	 *            - contact json
	 * @param data
	 *            - workflow data
	 * @param nodeJSON
	 *            - current node json
	 **/
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		// Get Duration, Type
		String duration = getStringValue(nodeJSON, subscriberJSON, data, DURATION);
		String durationType = getStringValue(nodeJSON, subscriberJSON, data, DURATION_TYPE);

		try
		{
			// Add ourselves to Cron Queue
			long timeout = CronUtil.getTimer(duration, durationType);

			// Enqueue into Cron
			CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout,
					AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), null);
		}
		catch (Exception e)
		{
			System.out.println("Exception raised in Opened node" + e.getMessage());
		}

	}

	/**
	 * Executes when email opened within the given period.
	 * 
	 * @param campaignJSON
	 *            - CampaignJSON.
	 * @param subscriberJSON
	 *            - SubscriberJSON.
	 * @param data
	 *            - data json used within workflow.
	 * @param nodeJSON
	 *            - Node JSON.
	 * @param customData
	 *            - custom data like open tracking id.
	 * 
	 **/
	public void interrupted(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON,
			JSONObject customData) throws Exception
	{

		// Merge customData json with data json.
		data = JSONUtil.mergeJSONs(new JSONObject[] { data, customData });

		// Execute Next One in Loop (Yes)
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_YES);
	}

	/**
	 * Executes after given time-period in the email opened node completes.
	 * 
	 * @param campaignJSON
	 *            - CampaignJSON.
	 * @param subscriberJSON
	 *            - SubscriberJSON.
	 * @param data
	 *            - data json used within workflow.
	 * @param nodeJSON
	 *            - Node JSON.
	 **/
	public void timeOutComplete(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		// Creates log for clicked when there are no clicks
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
				"Email not opened within given duration.", LogType.OPENED.toString());

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_NO);
	}
}
