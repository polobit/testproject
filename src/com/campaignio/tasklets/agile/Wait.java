package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.campaignio.cron.Cron;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.tasklets.TaskletAdapter;
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
     * (non-Javadoc)
     * 
     * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
     * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
     */
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get Duration, Type
	String duration = getStringValue(nodeJSON, subscriberJSON, data,
		DURATION);
	String durationType = getStringValue(nodeJSON, subscriberJSON, data,
		DURATION_TYPE);

	System.out.println("Waiting for " + duration + " " + durationType);

	log(campaignJSON, subscriberJSON, nodeJSON, "Waiting for - " + duration
		+ " " + durationType);

	// Add ourselves to Cron Queue
	long timeout = CronUtil.getTimer(duration, durationType);
	CronUtil.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON,
		timeout, null, null, null);
    }

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
	System.out.println("Wake up from wait. Executing next one.");

	log(campaignJSON, subscriberJSON, nodeJSON, "Wait Duration Completed.");

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }
}
