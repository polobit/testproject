package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.DBUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
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

	// Get Contact
	String subscriberId = DBUtil.getId(subscriberJSON);
	Contact contact = ContactUtil.getContact(Long.parseLong(subscriberId));

	// Add contact to given campaign.
	WorkflowUtil.subscribe(contact, Long.parseLong(campaignId));

	// Current campaign
	Workflow fromWorkflow = WorkflowUtil.getWorkflow(Long.parseLong(DBUtil.getId(campaignJSON)));

	// Given campaign
	Workflow toWorkflow = WorkflowUtil.getWorkflow(Long.parseLong(campaignId));

	System.out.println(contact.getContactFieldValue("first_name") + " is transferred from " + fromWorkflow.name + " to " + toWorkflow.name);

	// Creates log for Transfer
	LogUtil.addLogToSQL(DBUtil.getId(campaignJSON), DBUtil.getId(subscriberJSON), contact.getContactFieldValue("first_name") + " transferred from "
		+ fromWorkflow.name + " to " + toWorkflow.name, LogType.TRANSFER.toString());

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }
}
