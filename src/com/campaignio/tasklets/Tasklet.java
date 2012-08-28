package com.campaignio.tasklets;

import org.json.JSONObject;

public interface Tasklet
{
	// Run - normal execution
	public void run(JSONObject campaignJSONData, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception;
	
	// Interrupted - when an event happens
	public void interrupted(JSONObject campaignJSONData, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON, JSONObject interruptCustomData) throws Exception;
	
	// Task complete
	public void timeOutComplete(JSONObject campaignJSONData, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception;
	
}
