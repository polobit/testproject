package com.campaignio.tasklets.sms;

import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

public class Menu extends TaskletAdapter
{
    // Fields
    public static String GRID_KEY = "States";

    public static String GRID_NO_MATCH_KEY = "Nomatch";

    public static String VARIABLE_NAME = "variable_name";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Various Grid Values
	JSONArray statesJSONArray = nodeJSON.getJSONArray(GRID_KEY);

	// Get Variable
	String variableName = getStringValue(nodeJSON, subscriberJSON, data,
		VARIABLE_NAME);

	System.out.println("Checking if variableName " + variableName
		+ " matches " + statesJSONArray);

	// Iterate through all states
	for (int i = 0; i < statesJSONArray.length(); i++)
	{
	    // Get State JSON
	    JSONObject stateJSON = statesJSONArray.getJSONObject(i);

	    // Get Iterator - we iterate because key can be in lower case
	    Iterator<String> itr = stateJSON.keys();
	    while (itr.hasNext())
	    {
		// Get Property Name
		String propertyName = itr.next();
		if (propertyName.equalsIgnoreCase(variableName))
		{
		    System.out.println("Matched " + stateJSON + " branch ");

		    // Get Next Branch
		    // Execute Next One in Loop
		    TaskletUtil.executeTasklet(campaignJSON, subscriberJSON,
			    data, nodeJSON, variableName);
		    return;
		}
	    }
	}

	// Go to No Match
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, GRID_NO_MATCH_KEY);

	// Answer did not match any of the menus..
	System.err.println("Answer did not match in menu :" + variableName
		+ " States: " + statesJSONArray);
    }

}
