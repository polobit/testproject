package com.campaignio.tasklets.util;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.queues.util.PullQueueUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.deferred.TaskletWorkflowDeferredTask;
import com.google.appengine.api.NamespaceManager;

public class TaskCore
{
    /**
     * Executes workflow for single contact starting with Start node.
     * 
     * @param campaignJSON
     *            Campaign json with workflow having nodes connected to each
     *            other.
     * @param subscriberJSON
     *            Contact that subscribes to campaign.
     * @throws Exception
     */
    public static void executeWorkflow(JSONObject campaignJSON, JSONObject subscriberJSON) throws Exception
    {
	// Start from null currentNode
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, null, null, null);
    }

    /**
     * Executes campaign when there is a list of subscribers.
     * 
     * @param campaignJSON
     *            nodes that are connected in a workflow.
     * @param subscriberJSONArray
     *            list of subscribers.
     */
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
	    }
	    catch (Exception e)
	    {
		System.err.println("Got Exception in executeCampaign " + e.getMessage());
		continue;
	    }

	    System.out.println("Executing " + subscriberJSON);

	    String key = AgileTaskletUtil.getId(subscriberJSON) + " " + AgileTaskletUtil.getId(campaignJSON);

	    if (key.contains("null"))
		continue;

	    System.out.println("Checking for duplicates " + key);

	    // Check if this campaign has been executed for this user
	    /*
	     * if(CacheUtil.isPresent(key)) {
	     * System.out.println("Duplicate found " + key + " " +
	     * subscriberJSON + " " + campaignJSON); continue; } else { //
	     * Campaign is new to new subscriber - let's add them to Cache
	     * CacheUtil.put(key, new Boolean("true")); }
	     */
	    try
	    {
		// Execute it in a task queue each batch
		// executeWorkflow(campaignJSON, subscriberJSON);

		String namespace = NamespaceManager.get();

		TaskletWorkflowDeferredTask taskletWorkflowDeferredTask = new TaskletWorkflowDeferredTask(AgileTaskletUtil.getId(campaignJSON),
			subscriberJSON.toString(), namespace);

		// Add deferred tasks to pull queue with namespace as tag
		PullQueueUtil.addToPullQueue("campaign-pull-queue", taskletWorkflowDeferredTask, namespace);

	    }
	    catch (Exception e)
	    {
		System.err.println("Exception " + e);
	    }

	    System.out.println("Done Executing " + subscriberJSON);
	}

	System.out.println("Campaign Completed ");
    }
}