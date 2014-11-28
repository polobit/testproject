package com.agilecrm.workflows.triggers.util;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.Trigger.Type;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;

/**
 * @author naresh
 *
 */
public class EmailTrackingTriggerUtil
{

    public static void executeEmailOpenTrigger(String subscriberId, String campaignId)
    {
	List<Trigger> triggers = TriggerUtil.getTriggersByCondition(Trigger.Type.EMAIL_OPENED);

	if (triggers == null || triggers.size() == 0)
	    return;

	Long contactId = null;
	Long workflowId = null;

	if (!StringUtils.isBlank(subscriberId))
	    contactId = Long.parseLong(subscriberId);

	if (!StringUtils.isBlank(campaignId))
	    workflowId = Long.parseLong(campaignId);

	for (Trigger trigger : triggers)
	    executeEmailOpenTrigger(trigger, contactId, workflowId);
    }

    public static void executeEmailOpenTrigger(Trigger trigger, Long contactId, Long workflowId)
    {
	if (trigger == null)
	    return;

	Contact contact = null;

	if (contactId != null)
	    contact = ContactUtil.getContact(contactId);

	// If contact null
	if (contact == null)
	{
	    System.err.print("Contact doesn't exist that opened email...");
	    return;
	}

	if (!trigger.email_tracking_type.equals("CAMPAIGNS"))
	{
	    WorkflowSubscribeUtil.subscribe(contact, trigger.campaign_id);
	    return;
	}

	// Trigger only if email opened belongs to Given Campaign
	if (!trigger.email_tracking_campaign_id.equals(trigger.campaign_id)
	        && trigger.email_tracking_campaign_id.equals(workflowId))
	    WorkflowSubscribeUtil.subscribe(contact, trigger.campaign_id);
    }

    public static void executeLinkClickedTrigger(String subscriberId, String campaignId, String linkClicked)
    {
	List<Trigger> triggers = TriggerUtil.getTriggersByCondition(Trigger.Type.EMAIL_LINK_CLICKED);

	Long contactId = null;
	Long workflowId = null;

	if (!StringUtils.isBlank(subscriberId))
	    contactId = Long.parseLong(subscriberId);

	if (!StringUtils.isBlank(campaignId))
	    workflowId = Long.parseLong(campaignId);

	for (Trigger trigger : triggers)
	    executeLinkClickedTrigger(trigger, contactId, workflowId, linkClicked);
    }

    public static void executeLinkClickedTrigger(Trigger trigger, Long subscriberId, Long campaignId, String linkClicked)
    {
	if (trigger == null)
	    return;

	if (!(trigger.type.equals(Type.EMAIL_LINK_CLICKED)))
	    return;

	Contact contact = null;

	if (subscriberId != null)
	    contact = ContactUtil.getContact(subscriberId);

	if (contact == null)
	{
	    System.err.print("Contact doesn't exist that clicked link...");
	    return;
	}

	if (!StringUtils.contains(linkClicked, trigger.custom_link_clicked))
	{
	    System.err.println("Link clicked didn't contains trigger url...");
	    return;
	}

	if (!trigger.email_tracking_type.equals("CAMPAIGNS"))
	{
	    WorkflowSubscribeUtil.subscribe(contact, trigger.campaign_id);
	    return;
	}

	if (!trigger.email_tracking_campaign_id.equals(trigger.campaign_id)
	        && trigger.email_tracking_campaign_id.equals(campaignId))
	    WorkflowSubscribeUtil.subscribe(contact, trigger.campaign_id);

    }
}
