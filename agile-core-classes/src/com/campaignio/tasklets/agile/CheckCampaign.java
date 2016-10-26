package com.campaignio.tasklets.agile;

import java.util.List;

import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.status.CampaignStatus;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>CheckCampaign</code> class represents Check Campaign node in campaigns.
 * Check campaign checks if a campaign exists for a given status for a contact.
 * 
 * @author Kona
 */
public class CheckCampaign extends TaskletAdapter
{
	/**
	 * Campaign ID of the selected campaign in select
	 */
	public static final String CAMPAIGN_ID = "campaign_id";

	/**
	 * Campaign status of the selected campaign in select
	 */
	public static final String CAMPAIGN_STATUS = "campaign_status";

	/**
	 * Option any in select dropdown for campaign name
	 */
	public static final String ANY_CAMPAIGN = "any_campaign";

	/**
	 * Branch Yes
	 */
	public static final String BRANCH_YES = "Yes";

	/**
	 * Branch No
	 */
	public static final String BRANCH_NO = "No";

	/**
	 * Option any in select dropdown for campaign status
	 */
	public static final String ANY_STATUS = "any_status";

	/**
	 * Campaign status which is active
	 */
	public static final String STATUS_ACTIVE = "ACTIVE";

	/**
	 * Campaign status which is done
	 */
	public static final String STATUS_DONE = "DONE";

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
	 * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
	 */
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		// Campaign ID and status
		String campaignID = getStringValue(nodeJSON, subscriberJSON, data, CAMPAIGN_ID);
		String campaignStatus = getStringValue(nodeJSON, subscriberJSON, data, CAMPAIGN_STATUS);
		List<CampaignStatus> campaignStatusList = null;
		try
		{	
			// Checks if there are any campaigns in the given status
			if(campaignID.equals(ANY_CAMPAIGN)){	
				// getting list of Campaigns of the Contact
				campaignStatusList = ContactUtil.workflowListOfAContact(Long.parseLong(AgileTaskletUtil.getId(subscriberJSON)),
						null, campaignStatus);
				// getting current Campaign object
				CampaignStatus currentCampaignStatus = new CampaignStatus(0l, 0l, AgileTaskletUtil.getId(campaignJSON), null, AgileTaskletUtil.getId(campaignJSON) + "-"+ STATUS_ACTIVE);
				// delete current Campaign object from campaignStatusList
				campaignStatusList.remove(currentCampaignStatus);
			}else{				
				campaignStatusList = ContactUtil.workflowListOfAContact(Long.parseLong(AgileTaskletUtil.getId(subscriberJSON)),
						Long.parseLong(campaignID), campaignStatus);
			}
			if (campaignStatusList.size() > 0)
			{
				TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_YES);
				return;
			}
		}
		catch (Exception e)
		{
			System.out.println("Inside CheckCampaign.java and the message is: " + e.getMessage());
		}

		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, BRANCH_NO);

	}

}