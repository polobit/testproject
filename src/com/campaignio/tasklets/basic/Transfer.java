package com.campaignio.tasklets.basic;

import org.json.JSONObject;

import com.agilecrm.util.DBUtil;
import com.agilecrm.util.Util;
import com.campaignio.tasklets.TaskletAdapter;

public class Transfer extends TaskletAdapter
{
    // Fields
    public static String LIST = "list";

    // Transfer link
    public static final String USER_TRACKER_URL = "http://usertracker.contactuswidget.appspot.com/cd?command=transfer&subscriber_id=$subscriberId&list_id=$listId";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get List
	String listId = getStringValue(nodeJSON, subscriberJSON, data, LIST);

	// Get Subscriber Id
	String subscriberId = DBUtil.getId(subscriberJSON);

	System.out.println("Transfer List for " + subscriberId
		+ " to new list: " + listId);

	// Transfer to a different list
	String url = USER_TRACKER_URL.replace("$subscriberId", subscriberId)
		.replace("$listId", listId);

	// Access URL
	String retVal = Util.accessURL(url);

	System.out.println(retVal);

	// We do not execute anything after transfer - we are done

    }
}
