package com.agilecrm.workflows.triggers.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.deals.CustomFieldData;
import com.agilecrm.deals.Milestone;
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

		executeTriggerForDealsBasedOnCondition(opportunity.relatedContacts(), null, opportunity, Trigger.Type.DEAL_IS_ADDED);
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
		try
		{
			// if no change in pipeline and milestone, return
			if (oldOpportunity.getPipeline_id().equals(updatedOpportunity.getPipeline_id())
				&& oldOpportunity.milestone.equals(updatedOpportunity.milestone))
			return;

			System.out.println("Milestone changed from " + oldOpportunity.milestone + " to " + updatedOpportunity.milestone
				+ " of deal " + updatedOpportunity.name);

			// execute trigger for deal milestone change.
			executeTriggerForDealsBasedOnCondition(updatedOpportunity.relatedContacts(), oldOpportunity, updatedOpportunity,
				Trigger.Type.DEAL_MILESTONE_IS_CHANGED);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured while checking milestone change..." + e.getMessage());
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

				// Fetches triggers based on delete deal condition and runs
				// each trigger campaign
				executeTriggerForDealsBasedOnCondition(opportunityObject.relatedContacts(), null, opportunityObject,
						Trigger.Type.DEAL_IS_DELETED);
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
	public static void executeTriggerForDealsBasedOnCondition(List<Contact> contactsList, Opportunity oldOpportunity,
			Opportunity updatedOpportunity, Type condition)
	{

		// if deal has no related contacts
		if (contactsList.size() == 0)
			return;

		// Gets triggers with deal condition.
		List<Trigger> triggersList = new ArrayList<Trigger>();

		String oldMilestone = null;

		// If milestone is not empty, fetch triggers based on changed milestone
		if (oldOpportunity != null)
		{
			triggersList = getTriggersForMilestoneChange(updatedOpportunity, null);
			oldMilestone = oldOpportunity.milestone;
		}
		else
			triggersList = TriggerUtil.getTriggersByCondition(condition);

		// Trigger campaign
		triggerCampaign(contactsList, updatedOpportunity, oldMilestone, triggersList);
	}

	public static void triggerCampaign(List<Contact> contactsList, Opportunity updatedOpportunity, String oldMilestone,
			List<Trigger> triggersList)
	{
		// if deal has no related contacts
		if (contactsList.size() == 0)
			return;

		try
		{
			for (Trigger trigger : triggersList)
			{
				WorkflowSubscribeUtil.subscribeDeferred(contactsList, trigger.campaign_id,
						new JSONObject().put("deal", getOpportunityJSONForTrigger(updatedOpportunity, oldMilestone)));
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

			if (opportunity.close_date != null)
			{
				opportunityJSON.put("close_date",
						DateUtil.getGMTDateInGivenFormat(opportunity.close_date * 1000, "MM/dd/yyyy"));
			}

			opportunityJSON.put("expected_value", getLongFromDouble(opportunity.expected_value));

			// If deal milestone is changed, add old one
			if (oldMilestone != null)
				opportunityJSON.put("old_milestone", oldMilestone);

			return opportunityJSON;
		}
		catch (Exception e)
		{
			System.err.println("Exception occured while getting opportunity json for trigger..." + e.getMessage());
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
		try
		{
			List<CustomFieldData> customFields = opportunity.custom_data;

			JSONObject customJSON = new JSONObject();

			for (CustomFieldData customField : customFields)
				customJSON.put(customField.name, customField.value);

			return customJSON;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured while getting deal custom json..." + e.getMessage());
			return null;
		}
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

	public static List<Trigger> getTriggersForMilestoneChange(Opportunity opportunity, List<Trigger> triggers)
	{

		// If triggers are not passed
		if (triggers == null)
			triggers = TriggerUtil.getTriggersByCondition(Type.DEAL_MILESTONE_IS_CHANGED);

		List<Trigger> updatedTriggers = new ArrayList<Trigger>();

		boolean isDefault = false;
		String trackAndMilestone = null;

		try
		{
			
			isDefault =  OpportunityUtil.getOpportunityPipeline(opportunity).isDefault;
			trackAndMilestone = opportunity.getPipeline_id() + "_" + opportunity.milestone;

			for (Trigger trigger : triggers)
			{
				if (StringUtils.isBlank(trigger.trigger_deal_milestone))
					continue;

				String[] idAndMilestone = StringUtils.split(trigger.trigger_deal_milestone, "_", 2);

				// For compatibility of Old Triggers
				if (idAndMilestone.length == 1 && isDefault)
				{
					if (StringUtils.equals(opportunity.milestone, idAndMilestone[0]))
						updatedTriggers.add(trigger);
				}

				if (idAndMilestone.length == 2)
				{
					if (StringUtils.equals(trackAndMilestone, trigger.trigger_deal_milestone))
						updatedTriggers.add(trigger);
				}
			}

		}
		catch (Exception e)
		{
			System.err.println("Exception occured in getting triggers for milestone..." + e.getMessage());
			e.printStackTrace();
		}

		return updatedTriggers;
	}

	public static void triggerBulkDealMilestoneChange(List<Opportunity> updatedDeals, List<Trigger> triggers)
	{
		for (Opportunity updatedDeal : updatedDeals)
			triggerDealMilestoneChange(updatedDeal, triggers);
	}

	private static void triggerDealMilestoneChange(Opportunity updatedDeal, List<Trigger> triggers)
	{
		try
		{
			if (triggers.size() == 0)
				return;

			// Verifies trigger milestone with updated milestone
			List<Trigger> milestoneTriggers = DealTriggerUtil.getTriggersForMilestoneChange(updatedDeal, triggers);

			if (!milestoneTriggers.isEmpty())
				DealTriggerUtil.triggerCampaign(updatedDeal.relatedContacts(), updatedDeal, null, milestoneTriggers);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured while triggering bulk milestone change..." + e.getMessage());
		}
	}

}