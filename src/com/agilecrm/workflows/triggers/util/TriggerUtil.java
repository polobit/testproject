package com.agilecrm.workflows.triggers.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.document.Document;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.Trigger.Type;

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
    //returns all triggers count 
    public static int getCount(){
    	List<Trigger> li=dao.fetchAll();
    	return li.size();
    }
    /*
    /**
     * Returns all triggers based on condition.
     * 
     * @param condition
     *            Trigger condition.
     * @return List of triggers retrieved based on condition.
     */
    public static List<Trigger> getTriggersByCondition(Type condition)
    {
	Map<String, Object> conditionsMap = new HashMap<String, Object>();
	conditionsMap.put("type", condition);
	return dao.listByProperty(conditionsMap);
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
}