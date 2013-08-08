package com.agilecrm.workflows.triggers.util;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;

import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.Trigger.Type;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;

/**
 * <code>DealTriggerUtil</code> executes trigger for deals with conditions deal
 * created and deal deleted. If trigger is created for deal created, then
 * trigger fires when any new deal is created. Similarly for when deal is
 * deleted. It considers related contacts for deals to run campaigns with
 * contacts.
 * 
 * @author Naresh
 * 
 */
public class DealTriggerUtil
{
    /**
     * Executes trigger for Deals when deal is created.
     * 
     * @param opportunity
     *            Opportunity object when deal is created.
     * 
     */
    public static void executeTriggerForNewDeal(Opportunity opportunity)
    {
	// Executes trigger when deal is created.
	if (opportunity != null && opportunity.id == null)
	{
	    for (Contact contact : opportunity.getContacts())
	    {
		executeTriggerForDeals(contact, Trigger.Type.DEAL_IS_ADDED);
	    }

	    return;
	}
    }

    /**
     * Executes trigger when deal is deleted.
     * 
     * @param OpportunityIds
     *            Opportunity Ids of deals that are selected for deletion.
     */
    public static void executeTriggerForDeleteDeal(JSONArray OpportunityIds)
    {
	// Executes trigger when deal is deleted
	if (OpportunityIds != null)
	{
	    try
	    {
		for (int i = 0; i < OpportunityIds.length(); i++)
		{
		    String id = OpportunityIds.get(i).toString();

		    // Gets Opportunity based on id
		    Opportunity opportunityObject = OpportunityUtil.getOpportunity(Long.parseLong(id));

		    // Executes trigger for corresponding contacts
		    for (Contact contact : opportunityObject.getContacts())
		    {
			executeTriggerForDeals(contact, Trigger.Type.DEAL_IS_DELETED);
		    }
		}
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
    }

    /**
     * Executes trigger when deal is created or deal is deleted based on the
     * trigger called.
     * 
     * @param contact
     *            Contact related to deals.
     * @param condition
     *            Trigger condition for deals.
     */
    public static void executeTriggerForDeals(Contact contact, Type condition)
    {
	List<Trigger> triggersList = null;

	/*
	 * Converts contact object to list, to send contact as list parameter to
	 * WorkflowManager.
	 */
	List<Contact> contactList = new ArrayList<Contact>();
	contactList.add(contact);

	// Gets triggers with deal condition.
	triggersList = TriggerUtil.getTriggersByCondition(condition);

	if (triggersList == null)
	{
	    return;
	}

	try
	{
	    for (Trigger trigger : triggersList)
	    {
		WorkflowSubscribeUtil.subscribeDeferred(contactList, trigger.campaign_id);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
}
