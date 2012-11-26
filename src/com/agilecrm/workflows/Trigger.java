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
 * Triggers provide the ability to automate the campaign execution with respect
 * to conditions
 * 
 * @author Naresh
 * 
 */

@XmlRootElement
public class Trigger
{

    /**
     * Trigger key
     */
    @Id
    public Long id;

    /**
     * Save trigger name when it is not null
     */
    @NotSaved(IfDefault.class)
    public String name = null;

    /**
     * Types of Triggers
     * 
     */
    public enum Type
    {
	TAG_IS_ADDED, CONTACT_IS_ADDED, DEAL_IS_ADDED, DEAL_IS_DELETED, ADD_SCORE
    };

    public Type type;

    /**
     * Save campaign id when it is not null
     */
    @NotSaved(IfDefault.class)
    public String campaign_id = null;

    /**
     * Custom fields for trigger
     */
    @NotSaved(IfDefault.class)
    public String custom_score = null;

    @NotSaved(IfDefault.class)
    public Set<String> custom_tags = new HashSet<String>();

    @NotSaved
    public String trigger_tags[] = null;

    /**
     * Initialize DataAccessObject
     */
    private static ObjectifyGenericDao<Trigger> dao = new ObjectifyGenericDao<Trigger>(
	    Trigger.class);

    Trigger()
    {

    }

    /**
     * Creates a new {@link Trigger}.
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
     * Add custom trigger tags before save
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
     * Delete trigger from database
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Delete multiple triggers
     * 
     * @param triggersJSONArray
     *            The triggers that are selected for delete
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
     * @return All triggers that are saved
     */
    public static List<Trigger> getAllTriggers()
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Trigger.class).list();
    }

    public String toString()
    {
	return "Name: " + name + " Condition: " + type + "Campaign:"
		+ campaign_id;
    }

    /**
     * @return The campaign name as an Xml element based on campaign id if
     *         exists otherwise return ?
     * @throws Exception
     *             When workflow doesn't exist
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
     * @return The custom tags of a trigger as Xmlelement
     */
    @XmlElement
    public Set<String> getTags()
    {
	return custom_tags;
    }

    /**
     * @param condition
     *            The trigger condition
     * @return The triggers based on condition
     */
    public static List<Trigger> getTriggersByCondition(Type condition)
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Trigger.class).filter("type", condition).list();
    }

    /**
     * The trigger executes when tags are added for a contact
     * 
     * @param contact_id
     *            The id of a contact for which tags added
     * @param contact_tags
     *            The tags of a contact
     */
    public static void executeTriggerforTags(Long contact_id,
	    Set<String> contact_tags)
    {

	List<Trigger> triggerslist = null;
	try
	{

	    triggerslist = Trigger
		    .getTriggersByCondition(Trigger.Type.TAG_IS_ADDED);
	    if (triggerslist != null)
	    {
		for (Trigger triggers : triggerslist)

		{

		    // Get custom tags given for trigger
		    if (triggers.custom_tags != null)
		    {
			System.out.println("The given tags for a trigger:"
				+ triggers.custom_tags);

			// Execute trigger when tags same as custom tags are
			// added to a contact
			if (contact_tags.containsAll(triggers.custom_tags))
			    Trigger.executeTrigger(contact_id,
				    Trigger.Type.TAG_IS_ADDED);
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
     * Serialize the triggers execution with DeferredTask and Queue
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
 * Execute campaign with respect to trigger
 * 
 */
class TriggersDeferredTask implements DeferredTask
{

    Long contactId;

    Type type;

    /**
     * Creates a new {@link TriggersDeferredTask}.
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
		if (contact != null
			&& !(StringUtils.isEmpty(trigger.campaign_id)))

		    WorkflowManager.subscribe(contact,
			    Long.parseLong(trigger.campaign_id));

	    }
	}
    }

}
