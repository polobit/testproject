package com.agilecrm.workflows.triggers.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.Trigger.Type;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * TriggerUtil class consists of static methods required for {@link Trigger}. It
 * can fetch triggers from data store based upon trigger-id or all triggers at a
 * time. TriggerUtil can delete triggers in a bulk that are selected.
 */
public class TriggerUtil
{
	/**
	 * Initializes DataAccessObject.
	 */
	public static ObjectifyGenericDao<Trigger> dao = new ObjectifyGenericDao<Trigger>(Trigger.class);

	/**
	 * Removes multiple triggers.
	 * 
	 * @param triggersJSONArray
	 *            Model-ids of triggers that are selected for delete.
	 */
	public static void deleteTriggersBulk(JSONArray triggersJSONArray)
	{
		dao.deleteBulkByIds(triggersJSONArray);
	}

	/**
	 * Locates trigger based on id.
	 * 
	 * @param id
	 *            Trigger id.
	 * @return Trigger with respect to that id.
	 */
	public static Trigger getTrigger(Long id)
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
	 * Returns all triggers.
	 * 
	 * @return All triggers that are saved.
	 */
	public static List<Trigger> getAllTriggers()
	{
		return dao.fetchAll();
	}

	// returns all triggers count
	public static int getCount()
	{

		return Trigger.dao.count();
	}

	/*
	 * /** Returns all triggers based on condition.
	 * 
	 * @param condition Trigger condition.
	 * 
	 * @return List of triggers retrieved based on condition.
	 */
	public static List<Trigger> getTriggersByCondition(Type condition)
	{
		Map<String, Object> conditionsMap = new HashMap<String, Object>();
		conditionsMap.put("type", condition);
		return dao.listByProperty(conditionsMap);
	}

	/**
	 * Returns all triggers based on period.
	 * 
	 * @param Period
	 *            period (DAILY/WEEKLY/MONTHLY).
	 * 
	 * @return List of triggers retrieved based on condition.
	 */
	public static List<Trigger> getTriggersByPeriod(String period)
	{
		Map<String, Object> conditionsMap = new HashMap<String, Object>();
		if (period.equalsIgnoreCase("DAILY"))
			conditionsMap.put("type", Trigger.Type.RUNS_DAILY);
		else if (period.equalsIgnoreCase("WEEKLY"))
			conditionsMap.put("type", Trigger.Type.RUNS_WEEKLY);
		else if (period.equalsIgnoreCase("MONTHLY"))
			conditionsMap.put("type", Trigger.Type.RUNS_MONTHLY);
		return dao.listByProperty(conditionsMap);
	}

	/**
	 * Returns Triggers count based on period type
	 * 
	 * @param duration
	 * @return
	 */
	public static int getTriggerCountByPeriod(String period)
	{
		Map<String, Object> conditionsMap = new HashMap<String, Object>();
		if (period.equalsIgnoreCase("DAILY"))
			conditionsMap.put("type", Trigger.Type.RUNS_DAILY);
		else if (period.equalsIgnoreCase("WEEKLY"))
			conditionsMap.put("type", Trigger.Type.RUNS_WEEKLY);
		else if (period.equalsIgnoreCase("MONTHLY"))
			conditionsMap.put("type", Trigger.Type.RUNS_MONTHLY);
		return dao.getCountByProperty(conditionsMap);
	}

	/**
	 * Returns triggers based on milestone.
	 * 
	 * @param milestone
	 *            - milestone given in deal milestone trigger.
	 * @return List of triggers
	 */
	public static List<Trigger> getTriggersByMilestone(String milestone)
	{
		Map<String, Object> conditionsMap = new HashMap<String, Object>();

		conditionsMap.put("trigger_deal_milestone", milestone);
		conditionsMap.put("type", Trigger.Type.DEAL_MILESTONE_IS_CHANGED);

		return dao.listByProperty(conditionsMap);
	}

	/**
	 * Returns list of triggers with respect to campaign-id
	 * 
	 * @param campaignId
	 *            - Campaign Id.
	 * @return List
	 */
	public static List<Trigger> getTriggersByCampaignId(Long campaignId)
	{
		Map<String, Object> campaignIdMap = new HashMap<String, Object>();
		campaignIdMap.put("campaign_id", campaignId);
		return dao.listByProperty(campaignIdMap);
	}

	public static JSONObject getJSONObject(Object object)
	{
		try
		{
			ObjectMapper mapper = new ObjectMapper();
			String objectStr = null;

			try
			{
				objectStr = mapper.writeValueAsString(object);
			}
			catch (Exception e)
			{
				e.printStackTrace();
				System.err.println("Exception occured while serializing object..." + e.getMessage());
			}

			return new JSONObject(objectStr);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured while conver ting to json..." + e.getMessage());
			return null;
		}
	}

	public static JSONObject getTriggerCustomJSON(JSONObject subscriberJSON)
	{
		JSONObject customTriggerJSON = null;

		try
		{
			if (subscriberJSON.has(TaskletUtil._AGILE_CUSTOM_TRIGGER_JSON))
			{
				// To add data json
				customTriggerJSON = subscriberJSON.getJSONObject(TaskletUtil._AGILE_CUSTOM_TRIGGER_JSON);

				// Remove from subscriberJSON
				subscriberJSON.remove(TaskletUtil._AGILE_CUSTOM_TRIGGER_JSON);
			}

		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		return customTriggerJSON;
	}

	public static Boolean getTriggerRunStatus(Trigger trigger)
	{
		try
		{
			if (StringUtils.equals("INBOUND_MAIL_EVENT", trigger.type.toString()))
				return trigger.new_email_trigger_run_on_new_contacts;
			else
				return trigger.trigger_run_on_new_contacts;
		}
		catch (Exception e)
		{
			if (StringUtils.equals("INBOUND_MAIL_EVENT", trigger.type.toString()))
				return true;
			else
				return false;
		}
	}

	public static int getTriggersCountByCondition(Type condition)
	{
		Map<String, Object> conditionsMap = new HashMap<String, Object>();
		conditionsMap.put("type", condition);

		return dao.getCountByProperty(conditionsMap);
	}
}