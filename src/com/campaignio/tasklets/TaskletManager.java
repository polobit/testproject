package com.campaignio.tasklets;

import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.util.DBUtil;

public class TaskletManager
{
	// Start, Hangup Nodes
	public static final String START_NODE_ID = "PBXNODE1";
	public static final String HANGUP_NODE_ID = "hangup";
	

	// Default Branch Value
	static final String DEFAULT_NEXT_NODE_BRANCH_DATA = "yes";

	// Campaign Data - workflow and campaign
	public static final String CAMPAIGN_WORKFLOW_ID = "workflow_id";
	public static final String CAMPAIGN_WORKFLOW_JSON = "workflow_json";
	public static final String CAMPAIGN_LIST_ID = "list_id";
	public static final String CAMPAIGN_LIST_JSON = "list_json";

	// Workflow - Tasklet Class Name
	public static final String WORKFLOW_NODE_DEFINITION = "NodeDefinition";
	public static final String WORKFLOW_TASKLET_CLASS_NAME = "workflow_tasklet_class_name";

	// Execute workflow - collection of tasklets
	public static void executeWorkflow(JSONObject campaignJSON, JSONObject subscriberJSON) throws Exception
	{
		// Start from null currentNode
		executeTasklet(campaignJSON, subscriberJSON, null, null, null);
	}

	// Execute Tasklet
	public static void executeTasklet(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data,
			JSONObject currentNodeJSON, String branch) throws Exception
	{

		if (data == null)
			data = new JSONObject();

		String nextNode = "";

		// Assign to Start
		if (currentNodeJSON == null)
		{
			nextNode = START_NODE_ID;
			data = new JSONObject();
		}
		else
		{
			// Default Branch is Yes
			if (branch == null)
				branch = DEFAULT_NEXT_NODE_BRANCH_DATA;

			// Get Next Node Id
			nextNode = getNextNodeId(campaignJSON, currentNodeJSON, branch);
			
			// Check if it is hangup node - we are done.
			if(nextNode == null || nextNode.equalsIgnoreCase(HANGUP_NODE_ID))
			{
				System.out.println("Job Complete");
				return;
			}
		}

		// Get Node JSOn
		JSONObject nodeJSON = getNodeJSON(campaignJSON, nextNode);

		// Get Tasklet
		Tasklet tasklet = getTasklet(nodeJSON);
		
		System.out.println("Executing Tasklet " + getNodeDefinitionValue(nodeJSON, "name"));

		// Execute tasklet
		if (tasklet != null)
			tasklet.run(campaignJSON, subscriberJSON, data, nodeJSON);
	}

	// Execute Campaign
	public static void executeCampaign(JSONObject campaignJSON, JSONArray subscriberJSONArray)
	{

		// Iterate through JSONArray
		for (int i = 0; i < subscriberJSONArray.length(); i++)
		{

			JSONObject subscriberJSON;
			try
			{
				// Get Subscriber
				subscriberJSON = subscriberJSONArray.getJSONObject(i);
	
			} catch (Exception e)
			{
				System.err.println(e);
				continue;
			}

			System.out.println("Executing " + subscriberJSON);
			
			String key = DBUtil.getId(subscriberJSON) + " " + DBUtil.getId(campaignJSON);
			
			if(key.contains("null"))
				continue;
			
			System.out.println("Checking for duplicates " + key);
			
			// Check if this campaign has been executed for this user
			/*if(CacheUtil.isPresent(key))
			{
				System.out.println("Duplicate found " + key + " " + subscriberJSON + " " + campaignJSON);
				continue;
			}
			else
			{
				// Campaign is new to new subscriber - let's add them to Cache
				CacheUtil.put(key, new Boolean("true"));
			}*/
			
			try
			{
				// Check in memcache if it is already executing
				executeWorkflow(campaignJSON, subscriberJSON);

			} catch (Exception e)
			{
				System.err.println("Exception " + e);
			}

			System.out.println("Done Executing " + subscriberJSON);
		}

		System.out.println("Campaign Completed ");

		// If not
		// executeWorkflow
	}

	// Get Current Tasklet
	public static Tasklet getTasklet(JSONObject nodeJSON) throws Exception
	{
		// Get Name
		String className = getNodeDefinitionValue(nodeJSON, WORKFLOW_TASKLET_CLASS_NAME);
		if (className == null)
			throw new Exception("Cannot find tasklet class name " + nodeJSON);

		// Class.for.name
		Class taskletClass = Class.forName(className);

		return (Tasklet) taskletClass.newInstance();
	}

	// Read Node Definition Values
	public static String getNodeDefinitionValue(JSONObject nodeJSON, String key) throws Exception
	{

		// Get Name
		if (!nodeJSON.has(WORKFLOW_NODE_DEFINITION))
			throw new Exception("Node Definitoin Missing" + nodeJSON);

		JSONObject nodeDefinitionJSON = nodeJSON.getJSONObject(WORKFLOW_NODE_DEFINITION);

		if (!nodeDefinitionJSON.has(key))
			return null;

		return nodeDefinitionJSON.getString(key);
	}

	// Get Next Node ID
	public static String getNextNodeId(JSONObject campaignJSON, JSONObject currentNodeJSON, String branch)
			throws Exception
	{

		// Get the States
		JSONArray states = currentNodeJSON.getJSONArray("States");

		// Read the JSON for states
		for (int i = 0; i < states.length(); i++)
		{
			JSONObject eachStateJSON = states.getJSONObject(i);

			Iterator it = eachStateJSON.keys();
			while (it.hasNext())
			{

				String key = (String) it.next();
				if (key.equalsIgnoreCase(branch))
					return (String) eachStateJSON.getString(key);
			}
		}

		return null;

	}

	// Get Node JSON
	public static JSONObject getNodeJSON(JSONObject campaignJSON, String nodeId) throws Exception
	{
		// Get Workflow Json
		if (!campaignJSON.has(CAMPAIGN_WORKFLOW_JSON))
			return null;

		JSONObject workflowJSON = campaignJSON.getJSONObject(CAMPAIGN_WORKFLOW_JSON);

		// Iterate through all keys and find if it matches currentNodeId

		// Get the total Arrays (Nodes) present in that object
		JSONArray nodes = workflowJSON.getJSONArray("nodes");

		// Read the Phone System
		for (int i = 0; i < nodes.length(); i++)
		{

			// Get the each node data
			JSONObject nodedata = nodes.getJSONObject(i);

			// Get the NodeId
			String formId = nodedata.getString("id");

			// check whether the currentNodeID is same as the formId
			if (nodeId.equalsIgnoreCase(formId))
				return nodedata;
		}

		return null;

	}
}
