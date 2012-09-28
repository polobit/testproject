package com.campaignio.tasklets.basic;

import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

public class Start extends TaskletAdapter
{

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Execute Next One in Loop
	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, "start");
    }

}
