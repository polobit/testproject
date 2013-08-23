package com.agilecrm.workflows.status.util;

import java.util.Calendar;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.status.CampaignStatus;
import com.agilecrm.workflows.status.CampaignStatus.Status;
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
    public static void setStatusOfCampaign(String contactId, String campaignId, Status status)
    {
	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

	if (contact == null)
	    return;

	// ACTIVE status
	if (status.equals(Status.ACTIVE))
	{
	    setCampaignStatusActive(contact, campaignId);
	    return;
	}

	// DONE
	setCampaignStatusDone(contact, campaignId);
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
    private static void setCampaignStatusActive(Contact contact, String campaignId)
    {
	boolean isNew = true;

	Long statusTime = Calendar.getInstance().getTimeInMillis() / 1000;

	List<CampaignStatus> campaignStatusList = contact.campaignStatus;

	// if subscribed once again, update campaign status.
	for (CampaignStatus campaignStatus : campaignStatusList)
	{
	    if (campaignStatus.campaign_id.equals(campaignId))
	    {
		campaignStatus.start_time = statusTime;
		campaignStatus.end_time = null;
		campaignStatus.status = campaignId + "-" + Status.ACTIVE;

		// False to avoid new CampaignStatus to be created
		isNew = false;
		break;
	    }
	}

	// if subscribed first-time, add campaignStatus to the list.
	if (isNew)
	{
	    CampaignStatus campaignStatus = new CampaignStatus(statusTime, null, campaignId, (campaignId + "-" + Status.ACTIVE));
	    contact.campaignStatus.add(campaignStatus);
	}

	contact.save();
    }

    /**
     * Sets campaign-status of contact to DONE, when campaign completed for that
     * contact. Campaign status done is set when campaign came to hang-up node
     * which is set in TaskletUtil.
     * 
     * @param contact
     *            - Contact subscribed to campaign.
     * @param campaignId
     *            - CampaignId of done campaign.
     */
    private static void setCampaignStatusDone(Contact contact, String campaignId)
    {
	Long statusTime = Calendar.getInstance().getTimeInMillis() / 1000;

	List<CampaignStatus> campaignStatusList = contact.campaignStatus;

	// Sets end-time and updates status from ACTIVE to DONE.
	for (CampaignStatus campaignStatus : campaignStatusList)
	{
	    if (campaignStatus.campaign_id.equals(campaignId))
	    {
		campaignStatus.end_time = statusTime;
		campaignStatus.status = (campaignStatus.campaign_id) + "-" + Status.DONE;
		break;
	    }
	}

	contact.save();
    }

}