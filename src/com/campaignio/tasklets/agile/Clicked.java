package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.campaignio.cron.Cron;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

public class Clicked extends TaskletAdapter
{
    // Fields
    public static String DURATION = "duration";
    public static String DURATION_TYPE = "duration_type";

    // Branches - Yes/No
    public static String BRANCH_YES = "Yes";
    public static String BRANCH_NO = "No";

    // Interrupt Data - Visitor Data
    public static String LINK_CLICKED_LONG = "link_clicked_long";
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
	long timeout = Cron.getTimer(duration, durationType);

	// Get Tracker Id
	if (data.has(SendEmail.TRACKING_ID))
	{
	    Cron.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON,
		    timeout, data.getString(SendEmail.TRACKING_ID), null, null);
	}
	else
	{
	    Cron.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON,
		    timeout, null, null, null);
	}
    }

    // TimeOut - Cron Job Wakes it up
    public void interrupted(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON, JSONObject customData)
	    throws Exception
    {
	// Log
	log(campaignJSON, subscriberJSON, "Interrupted - we got clicked - "
		+ customData);

	// Execute Next One in Loop (Yes)
	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_YES);
    }

    // TimeOut - Cron Job Wakes it up
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

	// Execute Next One in Loop
	log(campaignJSON, subscriberJSON, "No Clicks");

	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_NO);
    }
}
