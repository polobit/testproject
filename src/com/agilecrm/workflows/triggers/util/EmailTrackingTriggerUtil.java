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

	executeCampaign(trigger, workflowId, contact);
    }

    public static void executeTrigger(String subscriberId, String campaignId, String linkClicked, Type type)
    {
	try
	{
	    List<Trigger> triggers = TriggerUtil.getTriggersByCondition(type);

	    Long contactId = null;
	    Long workflowId = null;
 
	    if (!StringUtils.isBlank(subscriberId))
		contactId = Long.parseLong(subscriberId);

	    if (!StringUtils.isBlank(campaignId))
		workflowId = Long.parseLong(campaignId);

	    for (Trigger trigger : triggers)
	    {
		if (type.equals(Type.EMAIL_OPENED))
		    executeEmailOpenTrigger(trigger, contactId, workflowId);
		else if(type.equals(Type.EMAIL_LINK_CLICKED))
		    executeLinkClickedTrigger(trigger, contactId, workflowId, linkClicked);
		else
		    executeUnsubscribedTrigger(trigger, contactId, workflowId);
		
	    }
	}
	catch(Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occurred while executing email tracking trigger..."+ e.getMessage());
	}
    }

    public static void executeUnsubscribedTrigger(Trigger trigger, Long subscriberId, Long campaignId)
    {
	
	if(trigger == null)
	    return;
	
	if(!trigger.type.equals(Type.UNSUBSCRIBED))
	    return;
	
	Contact contact = null;
	
	if (subscriberId != null)
	    contact = ContactUtil.getContact(subscriberId);

	if (contact == null)
	{
	    System.err.print("Contact doesn't exist that clicked link...");
	    return;
	}
	
	// Execute campaign if Any or matches respective campaign
        if(trigger.email_tracking_campaign_id == 0 || trigger.email_tracking_campaign_id.equals(campaignId))
            WorkflowSubscribeUtil.subscribe(contact, trigger.campaign_id);
	
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

	System.out.println("Link Clicked " + linkClicked + " trigger custom url " + trigger.custom_link_clicked);

	// Trim trailing spaces
	linkClicked = StringUtils.trim(linkClicked);
	String triggerCustomLink = StringUtils.trim(trigger.custom_link_clicked);

	// Verify Link URLs contains
	if (StringUtils.isBlank(linkClicked) || StringUtils.isBlank(trigger.custom_link_clicked)
	        || !StringUtils.contains(linkClicked, triggerCustomLink))
	{
	    System.err.println("Link clicked didn't contains trigger url...");
	    return;
	}

	// Execute campaign
	executeCampaign(trigger, campaignId, contact);

    }

    /**
     * @param trigger
     * @param workflowId
     * @param contact
     */
    private static void executeCampaign(Trigger trigger, Long workflowId, Contact contact)
    {
	// If ANY trigger campaign
	if (trigger.email_tracking_type.equals("ANY"))
	{
	    WorkflowSubscribeUtil.subscribe(contact, trigger.campaign_id);
	    return;
	}

	// For personal emails, workflowId is null
	if (trigger.email_tracking_type.equals("PERSONAL") && workflowId == null)
	{
	    WorkflowSubscribeUtil.subscribe(contact, trigger.campaign_id);
	    return;
	}

	// Trigger only if email opened belongs to Given Campaign
	if (trigger.email_tracking_type.equals("CAMPAIGNS")
	        && (trigger.email_tracking_campaign_id == 0 || trigger.email_tracking_campaign_id.equals(workflowId))
	        && !trigger.email_tracking_campaign_id.equals(trigger.campaign_id))
	    WorkflowSubscribeUtil.subscribe(contact, trigger.campaign_id);
    }
}
