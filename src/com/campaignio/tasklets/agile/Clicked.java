package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.campaignio.cron.Cron;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Clicked</code> represents Clicked node in a workflow.It takes duration
 * period and duration type such as Days, Hours and Minutes.It fires when any
 * click event occurs in sent mail.The duration is to make next node wait for
 * required duration in a workflow.The branches Yes and No separates workflow
 * for click events.Clicked uses {@link Cron} to manages the timeout or
 * interrupt events.
 * 
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

    // Branches - Yes/No
    /**
     * If clicked then Yes
     */
    public static String BRANCH_YES = "Yes";
    /**
     * If not clicked then No
     */
    public static String BRANCH_NO = "No";

    // Interrupt Data - Visitor Data
    /**
     * Long URL
     */
    public static String LINK_CLICKED_LONG = "link_clicked_long";
    /**
     * Short URL
     */
    public static String LINK_CLICKED_SHORT = "link_clicked_short";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get Duration, Type
	String duration = getStringValue(nodeJSON, subscriberJSON, data,
		DURATION);
	String durationType = getStringValue(nodeJSON, subscriberJSON, data,
		DURATION_TYPE);

	// Add ourselves to Cron Queue
	long timeout = CronUtil.getTimer(duration, durationType);

	// Get Tracker Id
	if (data.has(SendEmail.TRACKING_ID))
	{
	    CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON,
		    timeout, data.getString(SendEmail.TRACKING_ID), null, null);
	}
	else
	{
	    CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON,
		    timeout, null, null, null);
	}
    }


    // Executes when link clicked
    /*
     * (non-Javadoc)
     * 
     * @see
     * com.campaignio.tasklets.TaskletAdapter#interrupted(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject,
     * org.json.JSONObject)
     */
    public void interrupted(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON, JSONObject customData)
	    throws Exception
    {
	// Creates log for clicked node when interrupted
	log(campaignJSON, subscriberJSON, "Interrupted - we got clicked - "
		+ customData);

	// Execute Next One in Loop (Yes)
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_YES);
    }

    // TimeOut - Cron Job Wakes it up
    // Executes when there are no clicks

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.campaignio.tasklets.TaskletAdapter#timeOutComplete(org.json.JSONObject
     * , org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void timeOutComplete(JSONObject campaignJSON,
	    JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {

	/*
	 * 
	 * NOT USED ANYMORE. INTERRUPTED IS PROVIDED IMMEDIATELy
	 */

	/*
	 * // Checking if the link is clicked if
	 * (data.has(SendEmail.URLS_SHORTENED)) {
	 * 
	 * JSONArray urls = data.getJSONArray(SendEmail.URLS_SHORTENED); for
	 * (int i = 0; i < urls.length(); i++) { log(campaignJSON,
	 * subscriberJSON, "Checking if email is clicked " + urls.getString(i));
	 * if (Uti.isURLClicked(urls.getString(i))) {
	 * 
	 * log(campaignJSON, subscriberJSON, "Clicked URL: " +
	 * urls.getString(i));
	 * 
	 * // Execute Next One in Loop
	 * TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
	 * nodeJSON, BRANCH_YES); return; } } }
	 */

	// Creates log for clicked when there are no clicks
	log(campaignJSON, subscriberJSON, "No Clicks");

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_NO);
    }
}
