package com.agilecrm.workflows;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.Trigger.Type;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * TriggerUtil class consists of all static methods required for {@link Trigger}
 * . TriggerUtil class execute {@link Trigger} for all types of conditions.It
 * can fetch triggers from data store based upon trigger-id or by
 * trigger-condition or all triggers at a time. TriggerUtil can delete triggers
 * in a bulk that are selected.
 */
public class TriggerUtil
{
    /**
     * Initialize DataAccessObject
     */
    private static ObjectifyGenericDao<Trigger> dao = new ObjectifyGenericDao<Trigger>(
	    Trigger.class);

    /**
     * Remove multiple triggers
     * 
     * @param triggersJSONArray
     *            The model-ids of triggers that are selected for delete.
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
     * The trigger locator based on id
     * 
     * @param id
     *            The trigger id
     * @return The trigger with respect to that id
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
     * Return all triggers.
     * 
     * @return All triggers that are saved
     */
    public static List<Trigger> getAllTriggers()
    {
	Objectify ofy = ObjectifyService.begin();

	return ofy.query(Trigger.class).list();
    }

    /**
     * Return list of triggers based on condition
     * 
     * @param condition
     *            The trigger condition.
     * @return The triggers based on condition.
     */
    public static List<Trigger> getTriggersByCondition(Type condition)
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Trigger.class).filter("type", condition).list();
    }

    /**
     * The trigger executes when tags specified in trigger are added for a
     * contact
     * 
     * @param contactId
     *            The id of a contact for which tags are added
     * @param contactTags
     *            The tags of a contact
     * @param tagCondition
     *            The type of trigger for tags either Tag is added or Tag is
     *            deleted
     */
    public static void executeTriggerforTags(Long contactId,
	    Set<String> contactTags, Type tagCondition)
    {

	List<Trigger> triggersList = null;
	try
	{

	    triggersList = TriggerUtil.getTriggersByCondition(tagCondition);
	    if (triggersList != null)
	    {
		for (Trigger triggers : triggersList)

		{
		    // Get custom tags given for trigger
		    if (triggers.custom_tags != null)
		    {
			System.out.println("The given tags for a trigger:"
				+ triggers.custom_tags);

			// Execute trigger when tags are same as custom tags
			// added to a contact
			if (contactTags.containsAll(triggers.custom_tags))
			    TriggerUtil.executeTrigger(contactId, tagCondition);

		    }
		}
		// Avoid further looping
		triggersList = null;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Trigger will execute if score of contact reaches trigger custom score
     * 
     * @param contactId
     *            The id of a contact.
     * @param leadScore
     *            The score of a contact.
     * @param addScore
     *            The custom score in trigger.
     */
    public static void executeTriggerforScore(Long contactId,
	    Integer leadScore, Type addScore)
    {
	// Execute trigger when contact score is within the range of trigger
	// score E.g.trigger executes for 50 to 59 when custom_score is 50.
	List<Trigger> triggersList = null;

	try
	{
	    triggersList = TriggerUtil.getTriggersByCondition(addScore);
	    System.out.println("Triggers with condition ADD_SCORE:"
		    + triggersList);
	    if (triggersList != null)
	    {
		for (Trigger triggers : triggersList)

		{
		    if (leadScore >= triggers.custom_score
			    && leadScore <= (triggers.custom_score + 9))
		    {
			TriggerUtil.executeTrigger(contactId,
				Trigger.Type.ADD_SCORE);
		    }

		}
		// Avoid further looping
		triggersList = null;
	    }
	}

	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Serialize the triggers execution using DeferredTask and Queue.Builds
     * {@link TriggersDeferredTask} for triggers
     * 
     * @param contactId
     *            The id of a contact
     * @param type
     *            The trigger condition
     */
    public static void executeTrigger(Long contactId, Type type)

    {
	System.out.println("Executing trigger with contactID:" + contactId
		+ "Condition type" + type);

	TriggersDeferredTask triggersDeferredTask = new TriggersDeferredTask(
		contactId, type);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(triggersDeferredTask));
    }

}
