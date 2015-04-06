package com.campaignio.tasklets.sms;

import org.json.JSONObject;

import com.campaignio.cron.util.CronUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

public class GetMessage extends TaskletAdapter
{
    // Fields
    public static String WORD_FROM = "word_from";
    public static String VARIABLE_NAME = "variable_name";

    // Duration
    public static String DURATION = "duration";
    public static String DURATION_TYPE = "duration_type";

    // Branches
    public static String BRANCH_TIMEOUT = "timeout";
    public static String BRANCH_SUCCESS = "success";

    // From, To
    public static String FROM = "from";
    public static String TO = "to";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Number and CallerId
	String from = getStringValue(nodeJSON, subscriberJSON, data, FROM);
	String to = getStringValue(nodeJSON, subscriberJSON, data, TO);

	// Get Duration, Type
	String duration = getStringValue(nodeJSON, subscriberJSON, data,
		DURATION);
	String durationType = getStringValue(nodeJSON, subscriberJSON, data,
		DURATION_TYPE);

	// Add ourselves to Cron Queue
	long timeout = CronUtil.getTimer(duration, durationType);

	// Add to cron
	if (from != null && to != null)
	    addToCron(campaignJSON, subscriberJSON, data, nodeJSON, timeout,
		    AgileTaskletUtil.changeNumber(to), AgileTaskletUtil.changeNumber(from), null);
	else
	{
	    System.out.println("Cannot send a message");
	}
    }

    // TimeOut - Cron Job Wakes it up
    public void interrupted(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON, JSONObject customData)
	    throws Exception
    {
	// Get Actual Message
	String message = customData.getString("message");

	// Log
	log(campaignJSON, subscriberJSON, nodeJSON,
		"Interrupted - we got new SMS - " + message);

	// Get From, Message
	String from = getStringValue(nodeJSON, subscriberJSON, data, WORD_FROM);
	String variableName = (String) getValue(nodeJSON, subscriberJSON, data,
		VARIABLE_NAME);

	// If the loop is being run for second time - variable name is update to
	// the first time value
	// From Second time, it would be searching for $value1 instead of
	// $originalkey

	// Remove if variable name is already available
	if (data.has(variableName))
	{
	    data.remove(variableName);
	    variableName = getStringValue(nodeJSON, subscriberJSON, data,
		    VARIABLE_NAME);
	    System.out.println("Duplicate found. Removing old value "
		    + variableName + " data " + data);
	}

	System.out.println("Setting Variable Name: " + variableName + " to "
		+ message);

	data.put(variableName, message);

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_SUCCESS);
    }

    // TimeOut - Cron Job Wakes it up
    public void timeOutComplete(JSONObject campaignJSON,
	    JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {

	System.out.println("Woke up from wait. Executing Timeout Branch.");

	// Log
	log(campaignJSON, subscriberJSON, nodeJSON, "SMS Timeout");

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_TIMEOUT);
    }

}
