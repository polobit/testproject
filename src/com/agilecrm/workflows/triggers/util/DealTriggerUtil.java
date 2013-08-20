package com.agilecrm.workflows.triggers.util;

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
	    executeTriggerForDeals(opportunity.getContacts(), Trigger.Type.DEAL_IS_ADDED);
	    return;
	}
    }

    /**
     * Executes trigger when deal is deleted.
     * 
     * @param opportunityIds
     *            Opportunity Ids of deals that are selected for deletion.
     */
    public static void executeTriggerForDeleteDeal(JSONArray opportunityIds)
    {
	// if null
	if (opportunityIds == null)
	    return;

	try
	{
	    // Iterates over selected deal-ids for deletion
	    for (int i = 0; i < opportunityIds.length(); i++)
	    {
		String id = opportunityIds.get(i).toString();

		// Gets Opportunity based on id
		Opportunity opportunityObject = OpportunityUtil.getOpportunity(Long.parseLong(id));

		// if opportunity is null skip
		if (opportunityObject == null)
		    continue;

		executeTriggerForDeals(opportunityObject.getContacts(), Trigger.Type.DEAL_IS_DELETED);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Got Exception in executeTriggerForDeleteDeal " + e.getMessage());
	}
    }

    /**
     * Executes trigger when deal is created or deal is deleted based on the
     * trigger called.
     * 
     * @param contactsList
     *            Contact related to deals.
     * @param condition
     *            Trigger condition for deals.
     */
    public static void executeTriggerForDeals(List<Contact> contactsList, Type condition)
    {

	// if deal has no related contacts
	if (contactsList.size() == 0)
	    return;

	// Gets triggers with deal condition.
	List<Trigger> triggersList = TriggerUtil.getTriggersByCondition(condition);

	try
	{
	    for (Trigger trigger : triggersList)
	    {
		WorkflowSubscribeUtil.subscribeDeferred(contactsList, trigger.campaign_id);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
}
