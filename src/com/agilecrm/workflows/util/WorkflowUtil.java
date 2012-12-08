package com.agilecrm.workflows.util;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.workflows.Workflow;
import com.campaignio.tasklets.TaskletManager;

public class WorkflowUtil
{

    // Convert Contact into JSON
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

    // Convert List of Contacts into JSONArray
    static JSONArray convertContactIntoJSON(List<Contact> contacts)
    {
	JSONArray subscriberJSONArray = new JSONArray();

	for (Contact contact : contacts)
	{
	    subscriberJSONArray.put(getSubscriberJSON(contact));
	}

	return subscriberJSONArray;
    }

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

    // Subscribe list of contacts into a campaign
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

    // Subscribe a single contact into a campaign
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

    // Subscribe a single contact into a campaign
    public static void unsubscribe(Contact contact, Long workflowId)
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

    // Unsubscribe a contact into a campaign
    public static void unsubscribe()
    {

    }
}