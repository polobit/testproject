package com.agilecrm.workflows.util;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.queues.backend.ModuleUtil;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.util.VersioningUtil;
import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskCore;
import com.campaignio.tasklets.util.TaskletUtil;
import com.campaignio.tasklets.util.deferred.TaskletWorkflowDeferredTask;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>WorkflowSubscribeUtil</code> is the utility class that handles
 * subscribing contacts to workflows. It handles subscribing workflow with list
 * of contacts, single contact and subscriberJSON.
 * 
 */
public class WorkflowSubscribeUtil
{
	public static final String _ACTIVE_STATUS_SET = "_active_status_set";
    /**
     * Subscribes list of contacts into a campaign and runs workflow in
     * {@link TaskletUtil} executeCampaign method which runs using DeferredTask
     * to execute workflow.
     * 
     * @param contacts
     *            List of contact objects subscribe to campaign.
     * @param workflowId
     *            Id of a workflow.
     */
    public static void subscribeDeferred(List<Contact> contacts, Long workflowId)
    {
	
	// Convert Contacts into JSON Array
	JSONArray subscriberJSONArray = AgileTaskletUtil.getSubscriberJSONArray(contacts, workflowId);

	subscribeCampaign(workflowId, subscriberJSONArray);

    }

    public static void subscribeDeferred(List<Contact> contacts, Long workflowId, JSONObject triggerJSON)
    {
	// Convert Contacts into JSON Array
	JSONArray subscriberJSONArray = AgileTaskletUtil.getSubscriberJSONArray(contacts, workflowId, triggerJSON);

	subscribeCampaign(workflowId, subscriberJSONArray);

    }

    public static void subscribeDeferred(Contact contact, Long workflowId, JSONObject triggerJSON)
    {
	List<Contact> contacts = new ArrayList<Contact>();
	contacts.add(contact);

	subscribeDeferred(contacts, workflowId, triggerJSON);

    }

    /**
     * @param workflowId
     * @param subscriberJSONArray
     */
    private static void subscribeCampaign(Long workflowId, JSONArray subscriberJSONArray)
    {
	// Get Campaign JSON
	JSONObject campaignJSON = WorkflowUtil.getWorkflowJSON(workflowId);

	if (campaignJSON == null)
	    return;

	TaskCore.executeCampaign(campaignJSON, subscriberJSONArray);
    }

    /**
     * Subscribes a single contact into a campaign and runs deferred task to
     * execute workflow.
     * 
     * @param contact
     *            Contact object subscribed to workflow.
     * @param workflowId
     *            Id of a workflow.
     */
    public static void subscribe(Contact contact, Long workflowId)
    {
	try
	{
	    if(CampaignStatusUtil.isActive(contact, workflowId))
	    {
		System.err.println("Contact is already active in current campaign..."+ workflowId);
		return;
	    }
	    
	    // Convert Contacts into JSON Array
	    JSONObject subscriberJSONObject = AgileTaskletUtil.getSubscriberJSON(contact);
	    subscribeWithSubscriberJSON(subscriberJSONObject, workflowId);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Subscribes subscriberJSON to the campaign of given workflow-id in
     * deferredtask.
     * 
     * @param subscriberJSON
     *            - SubscriberJSON.
     * @param workflowId
     *            - workflow-id.
     */
    public static void subscribeWithSubscriberJSON(JSONObject subscriberJSON, Long workflowId)
    {
	String namespace = NamespaceManager.get();

	try
	{
	    TaskletWorkflowDeferredTask taskletWorkflowDeferredTask = new TaskletWorkflowDeferredTask(
		    workflowId.toString(), subscriberJSON.toString(), namespace);

	    PullQueueUtil
		    .addToPullQueue(
		            VersioningUtil.isBackgroundThread() ? AgileQueues.BULK_CAMPAIGN_PULL_QUEUE
		                    : AgileQueues.NORMAL_CAMPAIGN_PULL_QUEUE, taskletWorkflowDeferredTask, namespace);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
    public static void subscribeDeferredCampaign(List<Contact> contacts,Long workflowId){
    	// Convert Contacts into JSON Array
    	JSONArray subscriberJSONArray = AgileTaskletUtil.getSubscriberJSONArray(contacts, workflowId);
    	subscribeCampaignDeferred(workflowId, subscriberJSONArray);
    }
    
    /**
     * @param workflowId
     * @param subscriberJSONArray
     */
    private static void subscribeCampaignDeferred(Long workflowId, JSONArray subscriberJSONArray)
    {
	// Get Campaign JSON
	JSONObject campaignJSON = WorkflowUtil.getWorkflowJSON(workflowId);

	if (campaignJSON == null)
	    return;

	executeCampaign(campaignJSON, subscriberJSONArray);
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
	String namespace = NamespaceManager.get();
	String campaignId = AgileTaskletUtil.getId(campaignJSON);
	String campaignName = AgileTaskletUtil.getCampaignNameFromJSON(campaignJSON);

	// Iterate through JSONArray
	for (int i = 0, len = subscriberJSONArray.length(); i < len; i++)
	{
	    JSONObject subscriberJSON;

	    try
	    {
		// Get Subscriber
		subscriberJSON = subscriberJSONArray.getJSONObject(i);

		// Set campaign-status as campaignId-ACTIVE.
		CampaignStatusUtil.setStatusOfCampaign(AgileTaskletUtil.getId(subscriberJSON), campaignId,
			campaignName, Status.ACTIVE);

		// To avoid setting status in Start Node again
		subscriberJSON.put(_ACTIVE_STATUS_SET, true);
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

		TaskletWorkflowDeferredTask taskletWorkflowDeferredTask = new TaskletWorkflowDeferredTask(
			AgileTaskletUtil.getId(campaignJSON), subscriberJSON.toString(), namespace);

		// taskletWorkflowDeferredTask.run();

		
		Queue queue = QueueFactory.getQueue(AgileQueues.NORMAL_CAMPAIGN_PUSH_QUEUE);
		queue.add(TaskOptions.Builder.withPayload(taskletWorkflowDeferredTask));	
		
		 
		// Add deferred tasks to pull queue with namespace as tag
		//PullQueueUtil.addToPullQueue((VersioningUtil.isBackgroundThread() || len >= 200) ? AgileQueues.BULK_CAMPAIGN_PULL_QUEUE
			//: AgileQueues.NORMAL_CAMPAIGN_PULL_QUEUE, taskletWorkflowDeferredTask, namespace);

	    }
	    catch (Exception e)
	    {
		System.err.println("Exception " + e);
	    }

	    System.out.println("Done Executing ");
	}

	System.out.println("Campaign Completed ");
    }
}