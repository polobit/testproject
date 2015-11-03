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
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskCore;
import com.campaignio.tasklets.util.TaskletUtil;
import com.campaignio.tasklets.util.deferred.TaskletWorkflowDeferredTask;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>WorkflowSubscribeUtil</code> is the utility class that handles
 * subscribing contacts to workflows. It handles subscribing workflow with list
 * of contacts, single contact and subscriberJSON.
 * 
 */
public class WorkflowSubscribeUtil
{

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
}