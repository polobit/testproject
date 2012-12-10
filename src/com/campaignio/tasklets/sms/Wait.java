package com.campaignio.tasklets.sms;

import org.json.JSONObject;

import com.campaignio.cron.util.CronUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

public class Wait extends TaskletAdapter
{
    // Fields
    public static String DURATION = "duration";
    public static String DURATION_TYPE = "duration_type";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get Duration, Type
	String duration = getStringValue(nodeJSON, subscriberJSON, data,
		DURATION);
	String durationType = getStringValue(nodeJSON, subscriberJSON, data,
		DURATION_TYPE);

	System.out.println("Waiting for " + duration + " " + durationType);

	// Add ourselves to Cron Queue
	long timeout = CronUtil.getTimer(duration, durationType);
	CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON,
		timeout,
		null, null, null);
    }

    // TimeOut - Cron Job Wakes it up
    public void timeOutComplete(JSONObject campaignJSON,
	    JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {

	System.out.println("Wake up from wait. Executing next one.");

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }
}
