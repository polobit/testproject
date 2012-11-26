package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.util.Util;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

public class URLVisited extends TaskletAdapter
{
    // Fields
    public static String URL = "url";
    public static String IDENTIFIER = "identifier";

    // Account Type
    public static String ACCOUNT = "account";
    public static String PIWIK = "piwik";
    public static String GETCLICKY = "getclicky";
    public static String MINUTES = "mins";

    public static String USERNAME = "username";
    public static String PASSWORD = "password";

    // Branches - Yes/No
    public static String BRANCH_YES = "yes";
    public static String BRANCH_NO = "no";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get Task Values
	String url = getStringValue(nodeJSON, subscriberJSON, data, URL);
	String identifier = getStringValue(nodeJSON, subscriberJSON, data,
		IDENTIFIER);
	String account = getStringValue(nodeJSON, subscriberJSON, data, ACCOUNT);
	String username = getStringValue(nodeJSON, subscriberJSON, data,
		USERNAME);
	String password = getStringValue(nodeJSON, subscriberJSON, data,
		PASSWORD);

	String output = Util.accessURL(url);

	// Execute Next One in Loop
	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }

}
