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
    public static void setStatusOfCampaign(String contactId, String campaignId, String status)
    {
	// Temporary flag to know old or new campaign-status.
	boolean flag = false;

	Long recordTime = Calendar.getInstance().getTimeInMillis() / 1000;

	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

	if (contact == null)
	    return;

	List<CampaignStatus> campaignStatusList = contact.campaignStatus;

	// Search for status of required campaign-id.
	for (CampaignStatus campaignStatus : campaignStatusList)
	{
	    if (!campaignStatus.campaign_id.equals(campaignId))
		continue;

	    // If same campaign runs again, update campaign-status.
	    if (status.equals(((campaignStatus.campaign_id)) + "-" + Status.ACTIVE))
	    {
		campaignStatus.start_time = recordTime;
		campaignStatus.end_time = null;
		campaignStatus.status = (campaignStatus.campaign_id) + "-" + Status.ACTIVE;

		// True to avoid new CampaignStatus to be created
		flag = true;
		break;
	    }

	    // Updates status from ACTIVE to DONE when campaign is completed.
	    if (status.equals(((campaignStatus.campaign_id) + "-" + Status.DONE)))
	    {
		campaignStatus.end_time = recordTime;
		campaignStatus.status = ((campaignStatus.campaign_id) + "-" + Status.DONE);
		break;
	    }
	}

	// When campaign runs for the first-time
	if (status.equals((campaignId + "-" + Status.ACTIVE)) && !flag)
	{
	    CampaignStatus campaignStatus = new CampaignStatus(recordTime, null, campaignId, (campaignId + "-" + Status.ACTIVE));
	    contact.campaignStatus.add(campaignStatus);
	}

	contact.save();
    }
}