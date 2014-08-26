package com.agilecrm.workflows.automation.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.automation.Automation;

/**
 * AutomationUtil class consists of static methods required for
 * {@link Automation}. It can fetch configurations from data store based upon
 * configuration-id or all configurations at a time. AutomationUtil can delete
 * configuration in a bulk that are selected.
 */
public class AutomationUtil
{
	/**
	 * Initializes DataAccessObject.
	 */
	public static ObjectifyGenericDao<Automation> dao = new ObjectifyGenericDao<Automation>(Automation.class);

	/**
	 * Removes multiple automations.
	 * 
	 * @param automationsJSONArray
	 *            Model-ids of automations that are selected for delete.
	 */
	public static void deleteAutomationsBulk(JSONArray configurationsJSONArray)
	{
		dao.deleteBulkByIds(configurationsJSONArray);
	}

	/**
	 * Locates automation based on id.
	 * 
	 * @param id
	 *            Automation id.
	 * @return Automation with respect to that id.
	 */
	public static Automation getAutomation(Long id)
	{
		try
		{
			return dao.get(id);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Returns all automations.
	 * 
	 * @return All automations that are saved.
	 */
	public static List<Automation> getAllAutomations()
	{
		return dao.fetchAll();
	}

	/**
	 * Return all automations count
	 * 
	 * @return
	 */
	public static int getCount()
	{

		return Automation.dao.count();
	}

	/**
	 * Returns list of automations with respect to campaign-id
	 * 
	 * @param campaignId
	 *            - Campaign Id.
	 * @return List
	 */
	public static List<Automation> getAutomationsByCampaignId(Long campaignId)
	{
		Map<String, Object> campaignIdMap = new HashMap<String, Object>();
		campaignIdMap.put("campaign_id", campaignId);
		return dao.listByProperty(campaignIdMap);
	}

	/**
	 * Returns list of configurations with respect to contact-filter-id
	 * 
	 * @param contactFilterId
	 *            - ContactFilter Id.
	 * @return List
	 */
	public static List<Automation> getAutomationsByContactFilterId(Long contactFilterId)
	{
		Map<String, Object> contactFilterIdMap = new HashMap<String, Object>();
		contactFilterIdMap.put("contactFilter_id", contactFilterId);
		return dao.listByProperty(contactFilterIdMap);
	}

	/**
	 * Returns Automations count based on duration type
	 * 
	 * @param duration
	 * @return
	 */
	public static int getAutomationCountByDuration(String duration)
	{
		Map<String, Object> conditionsMap = new HashMap<String, Object>();
		if (duration.equalsIgnoreCase("DAILY"))
			conditionsMap.put("durationType", Automation.Duration.DAILY);
		else if (duration.equalsIgnoreCase("WEEKLY"))
			conditionsMap.put("durationType", Automation.Duration.WEEKLY);
		else
			conditionsMap.put("durationType", Automation.Duration.MONTHLY);
		return dao.getCountByProperty(conditionsMap);
	}

	/**
	 * Returns Automations objects based on duration type
	 * 
	 * @param duration
	 * @return
	 */
	public static List<Automation> getAutomationsByDuration(String duration)
	{
		Map<String, Object> conditionsMap = new HashMap<String, Object>();
		if (duration.equalsIgnoreCase("DAILY"))
			conditionsMap.put("durationType", Automation.Duration.DAILY);
		else if (duration.equalsIgnoreCase("WEEKLY"))
			conditionsMap.put("durationType", Automation.Duration.WEEKLY);
		else
			conditionsMap.put("durationType", Automation.Duration.MONTHLY);
		return dao.listByProperty(conditionsMap);
	}

}