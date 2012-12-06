package com.agilecrm.workflows.triggers;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;

/**
 * TriggerUtil class consists of static methods required for {@link Trigger} .
 * It can fetch triggers from data store based upon trigger-id or all triggers
 * at a time. TriggerUtil can delete triggers in a bulk that are selected.
 */
public class TriggerUtil
{
    /**
     * Initializes DataAccessObject
     */
    public static ObjectifyGenericDao<Trigger> dao = new ObjectifyGenericDao<Trigger>(
	    Trigger.class);

    /**
     * Removes multiple triggers
     * 
     * @param triggersJSONArray
     *            Model-ids of triggers that are selected for delete.
     */
    public static void deleteTriggersBulk(JSONArray triggersJSONArray)
    {
	List<Key<Trigger>> triggerKeys = new ArrayList<Key<Trigger>>();

	for (int i = 0; i < triggersJSONArray.length(); i++)
	{

	    try
	    {
		triggerKeys.add(new Key<Trigger>(Trigger.class, Long
			.parseLong(triggersJSONArray.getString(i))));
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	}

	dao.deleteKeys(triggerKeys);
    }

    /**
     * Locates trigger based on id
     * 
     * @param id
     *            Trigger id
     * @return Trigger with respect to that id
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
     * @return All triggers that are saved
     */
    public static List<Trigger> getAllTriggers()
    {
	return dao.fetchAll();
    }

}
