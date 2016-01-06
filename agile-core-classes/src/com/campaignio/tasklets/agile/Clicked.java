package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.util.JSONUtil;
import com.campaignio.cron.Cron;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.sms.SendMessage;
import com.campaignio.tasklets.util.TaskletUtil;
import com.campaignio.urlshortener.URLShortener.ShortenURLType;

/**
 * <code>Clicked</code> represents Clicked node in a workflow. It takes duration
 * period and duration type such as Days, Hours and Minutes. It fires when any
 * click event occurs in sent mail. The duration is to make next node wait for
 * required duration in a workflow. The branches Yes and No separates workflow
 * for click events. Clicked uses {@link Cron} to manages the timeout or
 * interrupt events.
 * 
 * @author Manohar
 * 
 */
public class Clicked extends TaskletAdapter
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
	 * If clicked then Yes
	 */
	public static String BRANCH_YES = "Yes";

	/**
	 * If not clicked then No
	 */
	public static String BRANCH_NO = "No";

	/**
	 * Long URL
	 */
	public static String LINK_CLICKED_LONG = "link_clicked_long";

	/**
	 * Short URL
	 */
	public static String LINK_CLICKED_SHORT = "link_clicked_short";

	/**
	 * Executes clicked node based on wakeup time.
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
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		// Get Duration, Type
		String duration = getStringValue(nodeJSON, subscriberJSON, data, DURATION);
		String durationType = getStringValue(nodeJSON, subscriberJSON, data, DURATION_TYPE);

		try
		{
			// Wakeup clicked node too along with Opened node (for click event)
			// using email_click flag. Clicked node cannot wake up
			// simultaneously as
			// it did not exist in cron at the time of click event if Opened
			// node
			// precedes.
			if (data.has(SendEmail.EMAIL_CLICK) && data.getBoolean(SendEmail.EMAIL_CLICK))
			{
				// Reset email_click to not affect next Clicked node in
				// workflow.
				data.remove(SendEmail.EMAIL_CLICK);

				// Proceed to YES
				TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_YES);

				return;
			}

			// Add ourselves to Cron Queue
			long timeout = CronUtil.getTimer(duration, durationType);

			// Get Tracker Id
			if (data.has(SendEmail.CLICK_TRACKING_ID))
			{
				CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout, null,
						AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON));
			}
			else if (data.has(SendMessage.SMS_CLICK_TRACKING_ID))
			{
				CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout,
					data.getString(SendMessage.SMS_CLICK_TRACKING_ID), ShortenURLType.SMS.toString(), null);
			}
			else if(data.has(TwitterSendMessage.TWEET_CLICK_TRACKING_ID))
			{
				CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout,
						data.getString(SendMessage.SMS_CLICK_TRACKING_ID), ShortenURLType.TWEET.toString(), null);
			}
			else
			{
				CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout, null, null, null);
			}
		}
		catch (Exception e)
		{
			System.out.println("Exception occured while saving clicked node" + e.getMessage());
		}
	}

	/**
	 * Executes when link clicked within the given period.
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
	 *            - custom data if any like long-url.
	 * 
	 **/
	public void interrupted(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON,
			JSONObject customData) throws Exception
	{
		data = JSONUtil.mergeJSONs(new JSONObject[] { data, customData });

		// Execute Next One in Loop (Yes)
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_YES);
	}

	/**
	 * Executes after given time-period in the clicked node completes.
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
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "No Clicks",
				LogType.CLICKED.toString());

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_NO);
	}
}