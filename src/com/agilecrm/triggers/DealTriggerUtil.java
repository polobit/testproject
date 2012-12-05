package com.agilecrm.triggers;

import java.util.List;

import org.json.JSONArray;

import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.triggers.Trigger.Type;

public class DealTriggerUtil
{
    /**
     * Executes trigger for Deals when deal is created or deal is deleted.
     * 
     * @param opportunity
     *            Opportunity object when deal is created
     * @param OpportunityIds
     *            Opportunity Ids of deals that are selected for deletion
     */
    public static void executeTriggerForNewDeal(Opportunity opportunity)
    {
	// Executes trigger when deal is created
	if (opportunity != null && opportunity.id == null)
	{
	    for (Contact contact : opportunity.getContacts())

	    {
		executeTriggerForDeals(contact, Trigger.Type.DEAL_IS_ADDED);
	    }
	    return;
	}
    }

    public static void executeTriggerforDeleteDeal(JSONArray OpportunityIds)
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
		    Opportunity opportunityObject = Opportunity
			    .getOpportunity(Long.parseLong(id));

		    // Executes trigger for corresponding contacts
		    for (Contact contact : opportunityObject.getContacts())
		    {
			executeTriggerForDeals(contact,
				Trigger.Type.DEAL_IS_DELETED);
		    }

		}
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}
    }

    public static void executeTriggerForDeals(Contact contact, Type condition)
    {
	List<Trigger> triggersList = null;

	try
	{
	    triggersList = TriggerUtil.getTriggersByCondition(condition);

	    System.out.println(" Triggers with condition " + condition
		    + " are: " + triggersList);

	    if (triggersList != null)
	    {
		for (Trigger trigger : triggersList)

		{
		    TriggerUtil.executeTrigger(contact,
			    Long.parseLong(trigger.campaign_id));
		}

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

}
