package com.agilecrm.workflows;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.Trigger.Type;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * Trigger is a base class for all triggers which allow application to run
 * campaign automatically.The Trigger Object encapsulates the trigger details
 * which includes name of a trigger,type and campaign.
 * <p>
 * Trigger uses these conditions
 * <ul>
 * <li>When same tag defined in trigger is added to contact</li>
 * <li>When same tag defined in trigger is deleted from contact</li>
 * <li>When new contact is added</li>
 * <li>When new deal is created</li>
 * <li>When deal is deleted</li>
 * <li>When score of contact reaches the trigger score</li>
 * </ul>
 * <p>
 * Some important points to consider are campaigns should not be empty while
 * creating trigger.Trigger use DeferredTask to run different trigger tasks.
 * 
 * @author Naresh
 * 
 */

@XmlRootElement
public class Trigger
{

    /**
     * Id of a trigger.Each trigger has its own and unique id.
     */
    @Id
    public Long id;

    /**
     * Name of a trigger which is a valid identifier.
     */
    @NotSaved(IfDefault.class)
    public String name = null;

    /**
     * Types of Triggers
     * 
     */
    public enum Type
    {
	TAG_IS_ADDED, TAG_IS_DELETED, CONTACT_IS_ADDED, DEAL_IS_ADDED, DEAL_IS_DELETED, ADD_SCORE
    };

    /**
     * Trigger type.
     */
    public Type type;

    /**
     * Campaign id of a campaign with respect to trigger.Campaign name can be
     * retrieved using campaign id.
     */
    @NotSaved(IfDefault.class)
    public String campaign_id = null;

    /**
     * Custom score while saving trigger with Add score type.
     */
    @NotSaved(IfDefault.class)
    public Integer custom_score = null;

    /**
     * Custom tags set while saving trigger with Tag is added and Tag is deleted
     * types.
     */
    @NotSaved(IfDefault.class)
    public Set<String> custom_tags = new HashSet<String>();

    /**
     * String array object for trigger tags
     */
    @NotSaved
    public String trigger_tags[] = null;

    /**
     * Initialize DataAccessObject
     */
    private static ObjectifyGenericDao<Trigger> dao = new ObjectifyGenericDao<Trigger>(
	    Trigger.class);

    /**
     * Default Trigger
     */
    Trigger()
    {

    }

    /**
     * Constructs new {@link Trigger} with name,type and campaign id.
     * 
     * @param name
     *            The trigger name.Required
     * @param type
     *            The trigger condition.Required
     * @param campaign_id
     *            The campaign id from campaign.Required
     */
    public Trigger(String name, Type type, String campaign_id)
    {
	this.name = name;
	this.type = type;
	this.campaign_id = campaign_id;
    }

    /**
     * Add custom trigger tags before save.Save trigger_tags array into Set.
     */
    @PrePersist
    private void PrePersist()
    {
	// Save trigger tags into set when not null
	if (trigger_tags != null)
	{
	    for (String trigger_tag : trigger_tags)
		custom_tags.add(trigger_tag);
	}

    }

    /**
     * Save trigger in database
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Removes trigger from database
     */
    public void delete()
    {
	dao.delete(this);
    }

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

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    public String toString()
    {
	return "Name: " + name + " Condition: " + type + "Campaign:"
		+ campaign_id;
    }

    /**
     * Campaign name is returned as an xml element which is retrieved using
     * campaign-id
     * 
     * @return The campaign name as an xml element based on campaign id if
     *         exists otherwise return ?
     * @throws Exception
     *             When campaign doesn't exist for given campaign id.
     */
    @XmlElement(name = "campaign")
    public String getCampaign() throws Exception
    {

	if (!StringUtils.isEmpty(campaign_id))
	{
	    Workflow workflow = Workflow.getWorkflow(Long
		    .parseLong(campaign_id));

	    if (workflow != null)
		return workflow.name;
	}

	return "?";
    }

    /**
     * Return trigger custom tags.
     * 
     * @return The custom tags of a trigger as Xml element
     */
    @XmlElement
    public Set<String> getTags()
    {
	return custom_tags;
    }

    /**
     * Return triggers based on condition
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
     * @param contact_id
     *            The id of a contact for which tags are added
     * @param contact_tags
     *            The tags of a contact
     */
    public static void executeTriggerforTags(Long contact_id,
	    Set<String> contact_tags, Type tag_condition)
    {

	List<Trigger> triggerslist = null;
	try
	{

	    triggerslist = Trigger.getTriggersByCondition(tag_condition);
	    if (triggerslist != null)
	    {
		for (Trigger triggers : triggerslist)

		{
		    // Get custom tags given for trigger
		    if (triggers.custom_tags != null)
		    {
			System.out.println("The given tags for a trigger:"
				+ triggers.custom_tags);

			// Execute trigger when tags are same as custom tags
			// added to a contact
			if (contact_tags.containsAll(triggers.custom_tags))
			    Trigger.executeTrigger(contact_id, tag_condition);
		    }
		}
		// Avoid further looping
		triggerslist = null;
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
     * @param contact_id
     *            The id of a contact.
     * @param lead_score
     *            The score of a contact.
     * @param add_score
     *            The custom score in trigger.
     */
    public static void executeTriggerforScore(Long contact_id,
	    Integer lead_score, Type add_score)
    {
	// Execute trigger when contact score is within the range of trigger
	// score E.g.trigger executes for 50 to 59.
	List<Trigger> triggerslist = null;

	try
	{
	    triggerslist = Trigger.getTriggersByCondition(add_score);
	    System.out.println("Triggers with condition ADD_SCORE:"
		    + triggerslist);
	    if (triggerslist != null)
	    {
		for (Trigger triggers : triggerslist)

		{
		    if (lead_score >= triggers.custom_score
			    && lead_score <= (triggers.custom_score + 9))
		    {
			Trigger.executeTrigger(contact_id,
				Trigger.Type.ADD_SCORE);
		    }

		}
		// Avoid further looping
		triggerslist = null;
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

/**
 * Implements DeferredTask interface for triggers.Execute campaign with respect
 * to trigger condition and contact.
 * 
 */
class TriggersDeferredTask implements DeferredTask
{

    Long contactId;

    Type type;

    /**
     * Constructs new {@link TriggersDeferredTask} with contact id and trigger
     * condition.
     * 
     * @param contactId
     *            The contact id
     * @param condition
     *            The trigger condition
     */
    public TriggersDeferredTask(Long contactId, Type condition)
    {

	this.contactId = contactId;
	type = condition;
    }

    public void run()
    {
	List<Trigger> triggers = Trigger.getTriggersByCondition(type);
	Contact contact = Contact.getContact(contactId);

	if (!triggers.isEmpty())
	{
	    for (Trigger trigger : triggers)
	    {
		// Check if contact is not null and campaign id is not equals to
		// null and ""
		if (contact != null
			&& !(StringUtils.isEmpty(trigger.campaign_id)))

		    WorkflowManager.subscribe(contact,
			    Long.parseLong(trigger.campaign_id));

	    }
	}
    }

}
