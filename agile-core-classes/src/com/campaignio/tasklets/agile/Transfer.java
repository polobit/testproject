package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Transfer</code> represents transfer node in campaigns to subscribe same
 * contact to different campaign. It considers campaign-id as input and
 * subscribes the current contact to given campaign.
 * 
 * @author Naresh
 * 
 */
public class Transfer extends TaskletAdapter
{
    // Fields
    public static String CAMPAIGN_ID = "campaign_id";

    // Run
    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {
	// Get CampaignId
	String campaignId = getStringValue(nodeJSON, subscriberJSON, data, CAMPAIGN_ID);

	// If both are same
	if (AgileTaskletUtil.getId(campaignJSON).equals(campaignId))
	{
	    System.out.println("Same workflow selected to transfer");
	    return;
	}

	String fromWorkflowName = null;
	String toWorkflowName = null;
	try
	{
	    String contactId = AgileTaskletUtil.getId(subscriberJSON);
	    
	    // Add contact to given campaign.
	    WorkflowSubscribeUtil.subscribe(ContactUtil.getContact(Long.parseLong(contactId)), Long.parseLong(campaignId));

	    // Current campaign
	    Workflow fromWorkflow = WorkflowUtil.getWorkflow(Long.parseLong(AgileTaskletUtil.getId(campaignJSON)));
	    fromWorkflowName = fromWorkflow.name;

	    // Given campaign
	    Workflow toWorkflow = WorkflowUtil.getWorkflow(Long.parseLong(campaignId));

	    if (toWorkflow == null)
	    {
		System.out.println("Selected workflow in transfer node do not exist.");

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
		return;
	    }

	    toWorkflowName = toWorkflow.name;

	    JSONObject dataJSON = subscriberJSON.getJSONObject("data");
	    
	    String name = dataJSON.has("first_name") ? dataJSON.getString("first_name") : "Contact";
	    
	    System.out.println(name + " is transferred from " + fromWorkflowName + " to "
		    + toWorkflowName);
	    
	    // Creates log for Transfer
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
			name + " transferred from " + fromWorkflowName + " to " + toWorkflowName,
			LogType.TRANSFER.toString());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Got exception in Transfer tasklet " + e);
	}

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }
}