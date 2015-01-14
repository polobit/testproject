package com.agilecrm.workflows.status.util;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>CampaignStatusUtil</code> is the utility class for CampaignStatus. It
 * sets CampaignStatus based on campaign-id. When Start node of workflow runs,
 * campaign-status is set to ACTIVE. At the end of campaign, campaign-status is
 * set to DONE from {@link TaskletUtil}.
 * 
 */
public class CampaignStatusUtil
{
	/**
	 * Sets status of campaign. Start Node of campaign call this method each
	 * time it gets executed, to set status ACTIVE. When campaign completes,
	 * TaskletUtil set DONE status.
	 * 
	 * @param contactId
	 *            - Contact id.
	 * @param campaignId
	 *            - Campaign id.
	 * @param status
	 *            - Campaign Status.
	 */
	public static void setStatusOfCampaign(String contactId, String campaignId, String campaignName, Status status)
	{
		setStatusOfCampaignWithName(contactId, campaignId, campaignName, status);
	}

	/**
	 * Sets status of campaign. Start Node of campaign call this method each
	 * time it gets executed, to set status ACTIVE. When campaign completes,
	 * TaskletUtil set DONE status. Returns name of the campaign
	 * 
	 * @param contactId
	 *            - Contact id.
	 * @param campaignId
	 *            - Campaign id.
	 * @param status
	 *            - Campaign Status.
	 */
	public static String setStatusOfCampaignWithName(String contactId, String campaignId, String campaignName,
			Status status)
	{

		if (StringUtils.isBlank(contactId) || StringUtils.isBlank(campaignId))
			return null;

		// If campaign name is null or empty, get name
		if (StringUtils.isEmpty(campaignName))
			campaignName = WorkflowUtil.getCampaignName(campaignId);

		try
		{
			Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

			if (contact == null)
				return null;

			// ACTIVE status
			if (status.equals(Status.ACTIVE))
			{
				setActiveCampaignStatus(contact, campaignId, campaignName);
				return campaignName;
			}

			// DONE or REMOVED
			setEndCampaignStatus(contact, campaignId, campaignName, status);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.err.print("Exception occured while setting campaign-status " + e.getMessage());
		}
		return campaignName;

	}

	/**
	 * Sets campaign-status of contact to ACTIVE, when contact subscribes to
	 * campaign. The active status is set in Start node of campaign.
	 * <p>
	 * Here we have two conditions: 1. When contact subscribes to campaign for
	 * the first-time. 2. When contact subscribes once again to the same
	 * campaign.
	 * </p>
	 * 
	 * @param contact
	 *            - Contact subscribed to campaign.
	 * @param campaignId
	 *            - CampaignId of active campaign.
	 */
	private static void setActiveCampaignStatus(Contact contact, String campaignId, String campaignName)
	{
		boolean isNew = true;

		long statusTime = System.currentTimeMillis() / 1000;

		List<CampaignStatus> campaignStatusList = contact.campaignStatus;

		// if subscribed once again, update campaign status.
		for (CampaignStatus campaignStatus : campaignStatusList)
		{

			// if null
			if (campaignStatus == null)
				continue;

			if (campaignId.equals(campaignStatus.campaign_id))
			{
				campaignStatus.start_time = statusTime;
				campaignStatus.end_time = 0L;
				campaignStatus.status = campaignId + "-" + Status.ACTIVE;
				campaignStatus.campaign_name = campaignName;

				// False to avoid new CampaignStatus to be created
				isNew = false;
				break;
			}
		}

		// if subscribed first-time, add campaignStatus to the list.
		if (isNew)
		{
			CampaignStatus campaignStatus = new CampaignStatus(statusTime, 0, campaignId, campaignName, (campaignId
					+ "-" + Status.ACTIVE));
			contact.campaignStatus.add(campaignStatus);
		}

		contact.save();
	}

	/**
	 * Sets campaign-status of contact to DONE or REMOVED, when campaign
	 * completed or cancelled for that contact respectively. Campaign status
	 * done is set when campaign came to hang-up node which is set in
	 * TaskletUtil. REMOVED is set when active contacts are removed from
	 * campaign.
	 * 
	 * @param contact
	 *            - Contact subscribed to campaign.
	 * @param campaignId
	 *            - CampaignId of done campaign.
	 */
	private static void setEndCampaignStatus(Contact contact, String campaignId, String campaignName, Status status)
	{
		long statusTime = System.currentTimeMillis() / 1000;

		List<CampaignStatus> campaignStatusList = contact.campaignStatus;

		// Sets end-time and updates status from ACTIVE to given status
		for (CampaignStatus campaignStatus : campaignStatusList)
		{
			if (campaignStatus == null)
				continue;

			if (campaignId.equals(campaignStatus.campaign_id))
			{
				campaignStatus.end_time = statusTime;
				campaignStatus.status = (campaignStatus.campaign_id) + "-" + status;
				break;
			}
		}

		contact.save();
	}

}