package com.campaignio.tasklets;

import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.util.Util;
import com.campaignio.cron.Cron;
import com.campaignio.logger.Log;

public class TaskletAdapter implements Tasklet
{
    // JSON Values
    public static final String JSON_VALUES = "JsonValues";

    @Override
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {
	System.out.println("Dummy run");
    }

    @Override
    public void interrupted(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON, JSONObject interruptCustomData)
	    throws Exception
    {
	System.out.println("Dummy Interrupted");
    }

    @Override
    public void timeOutComplete(JSONObject campaignJSON,
	    JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
	    throws Exception
    {
	System.out.println("Dummy Timeout");

    }

    // Add to Cron
    public void addToCron(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON, long timeout, String custom1,
	    String custom2, String custom3) throws Exception
    {
	// Add Log
	log(campaignJSON, subscriberJSON,
		"Sleeping till " + Util.getCalendarString(timeout));

	// Enqueue Task
	Cron.enqueueTask(campaignJSON, subscriberJSON, data, nodeJSON, timeout,
		custom1, custom2, custom3);
    }

    // Remove from Cron
    public void removeFromCron(String campaignID, String subscriberID)
	    throws Exception
    {
	// Remove from Cron Task
	Cron.removeTask(campaignID, subscriberID);
    }

    // Get Value as String - gets value and replaces token if any
    public String getStringValue(JSONObject nodeJSON,
	    JSONObject subscriberJSON, JSONObject data, String keyName)
	    throws Exception
    {
	Object returnValue = getValue(nodeJSON, subscriberJSON, data, keyName);
	if (returnValue == null)
	    return null;

	return replaceTokens((String) returnValue, subscriberJSON, data);
    }

    // Returns Object from UI JSON Values
    public Object getValue(JSONObject nodeJSON, JSONObject subscriberJSON,
	    JSONObject data, String keyName) throws Exception
    {
	// Check if JSON Value is present
	if (!nodeJSON.has(JSON_VALUES))
	    return null;

	JSONArray jsonArray = nodeJSON.getJSONArray(JSON_VALUES);

	// Iterate through name/value pairs
	for (int i = 0; i < jsonArray.length(); i++)
	{
	    // Get the each JSON data
	    JSONObject json = jsonArray.getJSONObject(i);

	    if (json.has(keyName))
		return json.getString(keyName);

	    // For Serialized data from ui - you will get name, value
	    // pairs
	    if (json.has("name"))
	    {
		String name = (String) json.get("name");
		if (name.equalsIgnoreCase(keyName))
		{
		    return json.get("value");
		}
	    }
	}
	return null;
    }

    public String replaceTokens(String value, JSONObject subscriberJSON,
	    JSONObject data) throws Exception
    {

	boolean replaced = false;
	String originalString = value;

	// Modify the Keys in data
	Iterator it = data.keys();
	while (it.hasNext())
	{
	    String key = (String) it.next();

	    if (value.contains(key))
	    {
		value = value.replace(key, data.getString(key));
		System.out.println("Key:" + key + " Token:"
			+ data.getString(key) + " Value:" + value + " " + data);

		replaced = true;
	    }
	}

	// Modify Subscriber Information
	JSONObject subscriberDataJSON = subscriberJSON.getJSONObject("data");

	Iterator it2 = subscriberDataJSON.keys();
	while (it2.hasNext())
	{
	    String key = (String) it2.next();

	    if (value.contains("$subscriber." + key))
	    {
		System.out.println("Key: *" + key + "* Token: *"
			+ "$subscriber." + key + "* Value:" + value);
		value = value.replace("$subscriber." + key,
			subscriberDataJSON.getString(key));
		replaced = true;
	    }
	}

	if (replaced)
	{
	    System.out.println("Replaced "
		    + originalString.replaceAll("\n", " ")
			    .replaceAll("\r", " ") + " with "
		    + value.replaceAll("\n", " ").replaceAll("\r", " "));
	}

	return value;
    }

    // Replace Tokens - Tokenize the values and find $, find in data and then
    // replace
    public String replaceTokensOld(String value, JSONObject data)
	    throws Exception
    {
	boolean replaced = false;

	// Tokens
	String[] tokens = value.split(" ");
	for (int i = 0; i < tokens.length; i++)
	{
	    if (tokens[i].startsWith("$"))
	    {
		System.out.println("Converting param " + tokens[i] + " from "
			+ data);
		if (data.has(tokens[i]))
		{
		    tokens[i] = data.getString(tokens[i]);
		    replaced = true;
		}
	    }
	}

	String replacedString = "";
	for (int i = 0; i < tokens.length; i++)
	{
	    replacedString += (tokens[i] + " ");
	}

	if (replaced)
	    System.out.println("Replaced "
		    + value.replaceAll("\n", " ").replaceAll("\r", " ")
		    + " with "
		    + replacedString.replaceAll("\n", " ")
			    .replaceAll("\r", " "));

	return replacedString.trim();

    }

    public void log(JSONObject campaignJSON, JSONObject subscriberJSON,
	    String message) throws Exception
    {

	System.out.println("Log: "
		+ message.replaceAll("\n", " ").replaceAll("\r", " ") + " "
		+ subscriberJSON + " " + campaignJSON);

	// Add Log
	Log.addLog(campaignJSON, subscriberJSON, message);
    }
}
