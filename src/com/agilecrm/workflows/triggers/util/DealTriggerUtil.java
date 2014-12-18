package com.agilecrm.workflows.triggers.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.deals.CustomFieldData;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.Trigger.Type;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.campaignio.reports.DateUtil;

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
     * Executes trigger for deals based on old opportunity. If old opportunity
     * is null, it means new deal is created.
     * 
     * @param oldOpportunity
     *            - Opportunity before save.
     * @param updatedOpportunity
     *            - Updated opportunity.
     */
    public static void executeTriggerToDeal(Opportunity oldOpportunity, Opportunity updatedOpportunity)
    {
	// new deal
	if (oldOpportunity == null)
	{
	    executeTriggerForNewDeal(updatedOpportunity);
	    return;
	}

	// checks milestone change in a deal.
	checkMilestoneChange(oldOpportunity, updatedOpportunity);

    }

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
	if (opportunity == null)
	    return;

	executeTriggerForDealsBasedOnCondition(opportunity.getContacts(), null, null, Trigger.Type.DEAL_IS_ADDED,
	        opportunity);
    }

    /**
     * Verifies whether milestone is changed for a deal.
     * 
     * @param oldOpportunity
     *            - Opportunity before save.
     * @param updatedOpportunity
     *            - Updated opportunity.
     */
    public static void checkMilestoneChange(Opportunity oldOpportunity, Opportunity updatedOpportunity)
    {
	// if no change in milestone return
	if ((oldOpportunity.milestone.equals(updatedOpportunity.milestone)))
	    return;

	System.out.println("Milestone changed from " + oldOpportunity.milestone + " to " + updatedOpportunity.milestone
	        + " of deal " + updatedOpportunity.name);

	// execute trigger for deal milestone change.
	executeTriggerForDealsBasedOnCondition(updatedOpportunity.getContacts(), oldOpportunity.milestone,
	        updatedOpportunity.milestone, Trigger.Type.DEAL_MILESTONE_IS_CHANGED, updatedOpportunity);
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

		// Fetches triggers based on delete deal condition and runs
		// each trigger campaign
		executeTriggerForDealsBasedOnCondition(opportunityObject.getContacts(), null, null,
		        Trigger.Type.DEAL_IS_DELETED, opportunityObject);
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
    public static void executeTriggerForDealsBasedOnCondition(List<Contact> contactsList, String oldMilestone,
	    String updatedMilestone, Type condition, Opportunity opportunity)
    {

	// if deal has no related contacts
	if (contactsList.size() == 0)
	    return;

	// Gets triggers with deal condition.
	List<Trigger> triggersList = new ArrayList<Trigger>();

	// If milestone is not empty, fetch triggers based on changed milestone
	if (!StringUtils.isBlank(updatedMilestone))
	    triggersList = TriggerUtil.getTriggersByMilestone(updatedMilestone);
	else
	    triggersList = TriggerUtil.getTriggersByCondition(condition);

	try
	{
	    for (Trigger trigger : triggersList)
	    {
		WorkflowSubscribeUtil.subscribeDeferred(contactsList, trigger.campaign_id,
		        new JSONObject().put("deal", getOpportunityJSONForTrigger(opportunity, oldMilestone)));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    public static JSONObject getOpportunityJSONForTrigger(Opportunity opportunity, String oldMilestone)
    {
	try
	{
	    JSONObject opportunityJSON = TriggerUtil.getJSONObject(opportunity);

	    // If null
	    if (opportunityJSON == null)
		return null;

	    opportunityJSON.remove("contacts");
	    opportunityJSON.remove("cursor");
	    opportunityJSON.remove("count");
	    opportunityJSON.remove("contact_ids");
	    opportunityJSON.remove("owner_id");
	    opportunityJSON.remove("notes");

	    JSONObject owner = null;

	    if (opportunityJSON.has("owner"))
		owner = opportunityJSON.getJSONObject("owner");

	    if (owner != null)
	    {
		JSONObject updatedOwner = new JSONObject();
		updatedOwner.put("id", owner.getString("id"));
		updatedOwner.put("name", owner.getString("name"));
		updatedOwner.put("email", owner.getString("email"));

		opportunityJSON.put("owner", updatedOwner);
	    }

	    opportunityJSON.put("custom_data", getDealCustomJSON(opportunity));

	    opportunityJSON.put("created_time",
		    DateUtil.getGMTDateInGivenFormat(opportunity.created_time * 1000, "MM/dd/yyyy"));

	    opportunityJSON.put("close_date",
		    DateUtil.getGMTDateInGivenFormat(opportunity.close_date * 1000, "MM/dd/yyyy"));

	    opportunityJSON.put("expected_value", getLongFromDouble(opportunity.expected_value));

	    // If deal milestone is changed, add old one
	    if (!StringUtils.isBlank(oldMilestone))
		opportunityJSON.put("old_milestone", oldMilestone);

	    return opportunityJSON;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}

    }

    /**
     * @param opportunity
     * @return
     * @throws JSONException
     */
    private static JSONObject getDealCustomJSON(Opportunity opportunity) throws JSONException
    {
	List<CustomFieldData> customFields = opportunity.custom_data;

	JSONObject customJSON = new JSONObject();

	for (CustomFieldData customField : customFields)
	    customJSON.put(customField.name, customField.value);

	return customJSON;
    }

    private static Long getLongFromDouble(Double value)
    {
	if (value == null)
	    return null;

	try
	{
	    return value.longValue();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while converting string to double..." + e.getMessage());
	    return null;
	}
    }
}
