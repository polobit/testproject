package com.campaignio.tasklets.sms;

import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

public class GetNWord extends TaskletAdapter
{

    // Fields
    public static String N_WORD = "n_word";
    public static String VARIABLE_NAME = "variable_name";

    // Branches
    public static String BRANCH_TIMEOUT = "timeout";
    public static String BRANCH_SUCCESS = "success";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get From, Message
	String nWord = getStringValue(nodeJSON, subscriberJSON, data, N_WORD);
	String variableName = getStringValue(nodeJSON, subscriberJSON, data,
		VARIABLE_NAME);

	System.out
		.println("NWord " + nWord + " Variable Name: " + variableName);

	// Split Message, Check Len
	// Put it data and run

	data.put(variableName, "variable split value here");

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }

    // TimeOut - Cron Job Wakes it up
    public void interrupted(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON, JSONObject interruptCustomData)
	    throws Exception
    {

	// Get Actual Message

	//

	System.out.println("Woke up from wait. Executing next one.");

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_SUCCESS);
    }

    // TimeOut - Cron Job Wakes it up
    public void timeOutComplete(JSONObject campaignJSON,
	    JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {

	System.out.println("Woke up from wait. Executing next one.");

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, BRANCH_TIMEOUT);
    }

}
