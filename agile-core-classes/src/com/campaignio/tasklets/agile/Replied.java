package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.campaignio.cron.Cron;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.CampaignConstants;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Replied</code> represents email replied node in workflow. Email Replied uses
 * {@link Cron} to manages the timeout or interrupt events.
 * 
 * 
 * @author Ramesh
 * 
 */
public class Replied extends TaskletAdapter
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
					AgileTaskletUtil.getId(campaignJSON),CampaignConstants.EMAIL_REPLIED,AgileTaskletUtil.getId(subscriberJSON));
		}
		catch (Exception e)
		{
			System.out.println("Exception raised in Replied node" + e.getMessage());
		}

	}

	/**
	 * Executes when email replied within the given period.
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
	 *            - null.
	 * 
	 **/
	public void interrupted(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON,
			JSONObject customData) throws Exception
	{		
		
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
				"Email replied within given duration.", LogType.EMAIL_REPLIED.toString());
		// Execute Next One in Loop (Yes)
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_YES);
	}

	/**
	 * Executes after given time-period in the email replied node completes.
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
		// Creates log for replied when there are email replies
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
				"Email not replied within given duration.", LogType.EMAIL_NOT_REPLIED.toString());

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_NO);
	}
}
