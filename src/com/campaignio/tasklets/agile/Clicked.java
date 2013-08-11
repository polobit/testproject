package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.util.AccountDeleteUtil;
import com.campaignio.cron.Cron;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

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

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get Duration, Type
	String duration = getStringValue(nodeJSON, subscriberJSON, data, DURATION);
	String durationType = getStringValue(nodeJSON, subscriberJSON, data, DURATION_TYPE);

	// Add ourselves to Cron Queue
	long timeout = CronUtil.getTimer(duration, durationType);

	// Get Tracker Id
	if (data.has(SendEmail.TRACKING_ID))
	{
	    CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout, data.getString(SendEmail.TRACKING_ID), null, null);
	}
	else
	{
	    CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout, null, null, null);
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
    public void interrupted(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON, JSONObject customData) throws Exception
    {
	// Creates log for clicked node when interrupted
	LogUtil.addLogToSQL(AccountDeleteUtil.getId(campaignJSON), AccountDeleteUtil.getId(subscriberJSON), "Link clicked - " + customData.getString("long_url"),
		LogType.CLICKED.toString());

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
    public void timeOutComplete(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Creates log for clicked when there are no clicks
	LogUtil.addLogToSQL(AccountDeleteUtil.getId(campaignJSON), AccountDeleteUtil.getId(subscriberJSON), "No Clicks", LogType.CLICKED.toString());

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_NO);
    }
}
