package com.agilecrm.workflows;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.workflows.Trigger.Type;
import com.agilecrm.workflows.deferred.ScoreDeferredTask;
import com.agilecrm.workflows.deferred.TriggersDeferredTask;
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
    public static List<Trigger> getTriggersByConditionandTags(Type condition,
	    Set<String> customTags)
    {
	Objectify ofy = ObjectifyService.begin();

	return ofy.query(Trigger.class).filter("type", condition)
		.filter("custom_tags IN", customTags).list();
    }

    /**
     * Executes trigger when score or tag changes occurs or new contact is added
     * 
     * @param contact
     *            Contact on which changes occur
     * 
     */
    public static void executeTriggerToContact(Contact contact)
    {
	// Check if contact is new
	if (contact.id == null)
	{
	    executeTriggerforOthers(contact, Trigger.Type.CONTACT_IS_ADDED);

	    if (!contact.tags.isEmpty())
		executeTriggerforTags(contact, contact.tags,
			Trigger.Type.TAG_IS_ADDED);
	    return;

	}

	Contact oldContact = Contact.getContact(contact.id);
	checkScoreChange(oldContact, contact);
	checkTagsChange(oldContact, contact);

    }

    /**
     * Executes trigger when tags specified in trigger are added for a contact
     * 
     * @param contactId
     *            Contact Id for which tags are added
     * @param contactTags
     *            Contact tags
     * @param tagCondition
     *            Trigger condition for tags either Tag is added or Tag is
     *            deleted
     */

    public static void executeTriggerforTags(Contact contact,
	    Set<String> changedTags, Type tagCondition)
    {

	List<Trigger> triggersList = null;
	try
	{

	    triggersList = getTriggersByConditionandTags(tagCondition,
		    changedTags);

	    if (triggersList != null)
	    {
		for (Trigger trigger : triggersList)
		{

		    if (trigger.custom_tags != null)
		    {

			// Execute trigger when tags are same as custom tags
			// added to a contact
			if (changedTags.containsAll(trigger.custom_tags))
			    executeTriggerTask(contact,
				    Long.parseLong(trigger.campaign_id));

		    }
		}

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Executes trigger if score of contact hits trigger custom score
     * 
     * @param contactId
     *            Contact Id
     * @param oldScore
     *            Contact score before changes made
     * @param newScore
     *            Contact score after changes made
     */
    public static void executeTriggerforScore(Contact contact,
	    Integer oldScore, Integer newScore)
    {

	List<Trigger> triggersList = null;

	try
	{
	    triggersList = getTriggersByCondition(Trigger.Type.ADD_SCORE);

	    if (triggersList != null)
	    {
		for (Trigger trigger : triggersList)

		{
		    if ((oldScore < trigger.custom_score)
			    && (newScore >= trigger.custom_score))
		    {
			executeTriggerTask(contact,
				Long.parseLong(trigger.campaign_id));
		    }

		}

	    }
	}

	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Executes trigger for Deals when deal is created or deal is deleted.
     * 
     * @param opportunity
     *            Opportunity object when deal is created
     * @param OpportunityIds
     *            Opportunity Ids of deals that are selected for deletion
     */
    public static void executeTriggerToDeals(Opportunity opportunity,
	    JSONArray OpportunityIds)
    {
	// Executes trigger when deal is created
	if (opportunity != null && opportunity.id == null)
	{
	    for (Contact contact : opportunity.getContacts())

	    {
		TriggerUtil.executeTriggerforOthers(contact,
			Trigger.Type.DEAL_IS_ADDED);
	    }
	    return;
	}

	// Executes trigger when deal is deleted
	else if (OpportunityIds != null)
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
			TriggerUtil.executeTriggerforOthers(contact,
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

    /**
     * Executes trigger for Contacts and Deals
     * 
     * @param contactId
     *            Contact id related to contacts or deals
     * @param condition
     *            Trigger condition
     */

    public static void executeTriggerforOthers(Contact contact, Type condition)
    {
	List<Trigger> triggersList = null;

	try
	{
	    triggersList = getTriggersByCondition(condition);

	    System.out.println(" Triggers with condition " + condition
		    + " are: " + triggersList);

	    if (triggersList != null)
	    {
		for (Trigger trigger : triggersList)

		{
		    executeTriggerTask(contact,
			    Long.parseLong(trigger.campaign_id));
		}

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    /**
     * Checks for score changes, like adding score or subtracting score.Executes
     * deferredtask if change occurs.
     * 
     * @param updatedContact
     *            Contact object with updated score
     * @param oldContact
     *            Contact object before changes occur
     */
    public static void checkScoreChange(Contact oldContact,
	    Contact updatedContact)
    {
	System.out.println("Score of updated contact"
		+ updatedContact.lead_score + "Score of old"
		+ oldContact.lead_score);
	if (updatedContact.lead_score == oldContact.lead_score)
	{
	    return;
	}

	String contactJSON = getJSONStringfromEntity(updatedContact);

	ScoreDeferredTask scoredeferredtask = new ScoreDeferredTask(
		contactJSON, oldContact.lead_score, updatedContact.lead_score);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(scoredeferredtask));

    }

    /**
     * Checks for tag changes like adding tag or deleting tag.Executes trigger
     * for tag adding or tag deleting respectively.
     * 
     * @param updatedContact
     *            Contact object after updating
     * @param oldContact
     *            Contact object before updating
     */
    public static void checkTagsChange(Contact oldContact,
	    Contact updatedContact)
    {
	Set<String> updatedTags = updatedContact.tags;
	Set<String> oldTags = oldContact.tags;

	// When tag is added,updated tags size is greater than old tags
	if (updatedTags.size() > oldTags.size())
	{

	    // Gets tag which is added
	    updatedTags.removeAll(oldTags);

	    // Executes trigger with added tags
	    executeTriggerforTags(updatedContact, updatedTags,
		    Trigger.Type.TAG_IS_ADDED);

	}
	else if (updatedTags.size() < oldTags.size())
	{

	    // Gets tag which is deleted
	    oldTags.removeAll(updatedTags);

	    // Executes trigger with deleted tags
	    executeTriggerforTags(updatedContact, oldTags,
		    Trigger.Type.TAG_IS_DELETED);

	}

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

    public static void executeTriggerTask(Contact contact, Long campaignId)
    {
	System.out.println("Executing trigger with contactID:" + contact
		+ "Campaign id" + campaignId);

	String contactJSON = getJSONStringfromEntity(contact);

	TriggersDeferredTask triggersDeferredTask = new TriggersDeferredTask(
		contactJSON, campaignId);
	Queue queue = QueueFactory.getDefaultQueue();
	queue.add(TaskOptions.Builder.withPayload(triggersDeferredTask));
    }

    /**
     * Converts Object class to JSONString.
     * 
     * @param object
     *            Object which needs to converted to JSONString
     * @return JSONString form of object
     */
    public static String getJSONStringfromEntity(Object object)
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
    public static Object getEntityfromJSONString(String objectJSON,
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
