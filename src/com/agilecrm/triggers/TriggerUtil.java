package com.agilecrm.triggers;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.triggers.Trigger.Type;
import com.agilecrm.triggers.deferred.TriggersDeferredTask;
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
     * Initializes DataAccessObject
     */
    private static ObjectifyGenericDao<Trigger> dao = new ObjectifyGenericDao<Trigger>(
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
	Objectify ofy = ObjectifyService.begin();

	return ofy.query(Trigger.class).list();
    }

    /**
     * Returns list of triggers based on condition
     * 
     * @param condition
     *            Trigger condition.
     * @return Triggers based on condition.
     */

    public static List<Trigger> getTriggersByCondition(Type condition)
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Trigger.class).filter("type", condition).list();
    }

    /**
     * Locates trigger based on condition and tags
     * 
     * @param condition
     *            Trigger condition
     * @param customTags
     *            Trigger tags
     * @return Triggers based on condition and tags
     */
    public static List<Trigger> getTriggersByConditionAndTags(Type condition,
	    Set<String> customTags)
    {
	Objectify ofy = ObjectifyService.begin();

	return ofy.query(Trigger.class).filter("type", condition)
		.filter("custom_tags IN", customTags).list();
    }

    /**
     * Executes triggers using DeferredTask and Queue.Builds
     * {@link TriggersDeferredTask} for triggers
     * 
     * @param contactId
     *            Contact Id
     * 
     * @param campaignId
     *            Campaign Id of respective trigger
     */

    public static void executeTrigger(Contact contact, Long campaignId)
    {
	System.out.println("Executing trigger with contactID:" + contact
		+ "Campaign id" + campaignId);

	String contactJSON = getJSONStringFromEntity(contact);

	TriggersDeferredTask triggersDeferredTask = new TriggersDeferredTask(
		contactJSON, campaignId);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(triggersDeferredTask));
    }

    /**
     * Converts Object class to JSONString.
     * 
     * @param object
     *            Object which needs to be converted to JSONString
     * @return JSONString of object
     */
    public static String getJSONStringFromEntity(Object object)
    {
	ObjectMapper mapper = new ObjectMapper();
	String objectJSONString = null;
	try
	{
	    objectJSONString = mapper.writeValueAsString(object);
	}
	catch (Exception e)
	{

	    e.printStackTrace();
	}
	return objectJSONString;
    }

    /**
     * Gets Object from objectJSON string.
     * 
     * @param objectJSON
     *            JSONString from which Object is retrieved.
     * @param clazz
     *            Generic object class instance.
     * @return Object from JSONString
     */
    public static Object getEntityFromJSONString(String objectJSON,
	    Class<?> clazz)
    {
	ObjectMapper mapper = new ObjectMapper();
	Object object = null;
	try
	{
	    object = mapper.readValue(objectJSON, clazz);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return object;
    }
}
