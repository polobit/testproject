package com.agilecrm.workflows.status.util;

import java.util.Calendar;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.status.CampaignStatus;

/**
 * <code>CampaignStatusUtil</code> is the utility class for CampaignStatus. It
 * sets CampaignStatus based on campaign-id.
 * 
 */
public class CampaignStatusUtil
{
    /**
     * Sets status of campaign.
     * 
     * @param contactId
     *            - Contact id.
     * @param campaignId
     *            - Campaign id.
     * @param status
     *            - Campaign Status.
     */
    public static void setStatusOfCampaign(String contactId, String campaignId,
	    String status)
    {
	boolean flag = false;
	Long recordTime = Calendar.getInstance().getTimeInMillis() / 1000;

	Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

	if (contact == null)
	    return;

	List<CampaignStatus> campaignStatusList = contact.campaignStatus;

	for (CampaignStatus campaignStatus : campaignStatusList)
	{
	    if (!campaignStatus.campaign_id.equals(campaignId))
		continue;

	    if (status.equals(((campaignStatus.campaign_id)) + "-ACTIVE"))
	    {
		campaignStatus.start_time = recordTime;
		campaignStatus.end_time = null;
		campaignStatus.status = (campaignStatus.campaign_id)
			+ "-ACTIVE";
		flag = true;
		break;
	    }

	    if (status.equals(((campaignStatus.campaign_id) + "-DONE")))
	    {
		campaignStatus.end_time = recordTime;
		campaignStatus.status = ((campaignStatus.campaign_id) + "-DONE");
		break;
	    }
	}

	if (status.equals((campaignId + "-ACTIVE")) && !flag)
	{
	    CampaignStatus campaignStatus = new CampaignStatus(recordTime,
		    null, campaignId, (campaignId + "-ACTIVE"));
	    contact.campaignStatus.add(campaignStatus);
	}

	contact.save();
    }
}
