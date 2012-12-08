package com.agilecrm.workflows.util;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.workflows.Workflow;
import com.campaignio.tasklets.TaskletManager;

/**
 * <code>WorkflowUtil</code> provides various static methods to convert contact
 * and workflow objects into json objects.WorkflowUtil class uses
 * {@link TaskletManager} to run campaign with contact.
 * <p>
 * <code>WorkflowUtil</code> is used whenever single contact or bulk contacts
 * are subscribed to campaign.It subscribes contacts to campaigns and runs
 * campaign with the contact details.WorkflowUtil class is used for triggers
 * too.Whenever trigger fires,trigger calls WorkflowUtil class to run the
 * campaign.
 * </p>
 * 
 * @author Manohar
 * 
 */
public class WorkflowUtil
{

    /**
     * Converts contact object into json object.
     * 
     * @param contact
     *            Contact object that subscribes to workflow
     * @return JsonObject of contact
     */
    static JSONObject getSubscriberJSON(Contact contact)
    {

	try
	{
	    JSONObject subscriberJSON = new JSONObject();

	    List<ContactField> properties = contact.getProperties();
	    System.out.println("List properties" + properties);
	    for (ContactField field : properties)
	    {
		System.out.println(field);
		if (field.name != null && field.value != null)
		    subscriberJSON.put(field.name, field.value);

	    }

	    // Add Id and data
	    return new JSONObject().put("data", subscriberJSON).put("id",
		    contact.id);
	}
	catch (Exception e)
	{

	    return null;
	}
    }

    /**
     * Converts list of contacts into JSONArray
     * 
     * @param contacts
     *            List of Contact objects subscribed to campaign
     * @return JSONArray of list of contacts
     */
    static JSONArray convertContactIntoJSON(List<Contact> contacts)
    {
	JSONArray subscriberJSONArray = new JSONArray();

	for (Contact contact : contacts)
	{
	    subscriberJSONArray.put(getSubscriberJSON(contact));
	}

	return subscriberJSONArray;
    }

    /**
     * Converts workflow object into json object
     * 
     * @param workflowId
     *            Id of a workflow
     * @return JSONObject of campaign
     */
    static JSONObject getWorkflowJSON(Long workflowId)
    {
	try
	{
	    // Get Workflow JSON
	    Workflow workflow = Workflow.getWorkflow(workflowId);
	    if (workflow == null)
		return null;

	    // Campaign JSON
	    JSONObject campaignJSON = new JSONObject();
	    JSONObject workflowJSON = new JSONObject(workflow.rules);

	    campaignJSON.put(TaskletManager.CAMPAIGN_WORKFLOW_JSON,
		    workflowJSON);
	    campaignJSON.put("id", workflow.id);

	    return campaignJSON;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Subscribe list of contacts into a campaign and runs workflow in
     * {@link TaskletManager} executeCampaign method which runs using
     * DeferredTask to execute workflow
     * 
     * @param contacts
     *            List of contact objects subscribe to campaign
     * @param workflowId
     *            Id of a workflow
     */
    public static void subscribeDeferred(List<Contact> contacts, Long workflowId)
    {

	// Convert Contacts into JSON Array
	JSONArray subscriberJSONArray = convertContactIntoJSON(contacts);

	// Get Campaign JSON
	JSONObject campaignJSON = getWorkflowJSON(workflowId);
	if (campaignJSON == null)
	    return;

	TaskletManager.executeCampaign(campaignJSON, subscriberJSONArray);
    }

    /**
     * Subscribe a single contact into a campaign and runs
     * {@link TaskletManager} executeWorkflow method that doesn't uses
     * DeferredTask to execute workflow
     * 
     * @param contact
     *            Contact object subscribed to workflow
     * @param workflowId
     *            Id of a workflow
     */
    public static void subscribe(Contact contact, Long workflowId)
    {
	try
	{
	    // Convert Contacts into JSON Array
	    JSONObject subscriberJSONObject = getSubscriberJSON(contact);

	    // Get Campaign JSON
	    JSONObject campaignJSON = getWorkflowJSON(workflowId);
	    if (campaignJSON == null)
		return;

	    TaskletManager.executeWorkflow(campaignJSON, subscriberJSONObject);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Unsubscribe a contact into a campaign
     */
    public static void unsubscribe()
    {

    }
}