package com.campaignio.tasklets.sms;

import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

public class Start extends TaskletAdapter
{

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, "start");
    }

}
