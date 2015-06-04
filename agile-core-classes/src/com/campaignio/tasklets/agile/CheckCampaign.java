package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
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
	public static final String BRANCH_YES = "yes";

	/**
	 * Branch No
	 */
	public static final String BRANCH_NO = "no";

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

		try
		{
			// Checks if there are any campaigns in the given status
			if (ContactUtil.workflowListOfAContact(Long.parseLong(AgileTaskletUtil.getId(subscriberJSON)),
					campaignID.equals(ANY_CAMPAIGN) ? null : Long.parseLong(campaignID), campaignStatus).size() > 0)
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