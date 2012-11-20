package com.agilecrm.workflows;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.campaign.Campaign;
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

@XmlRootElement
public class Trigger
{
    // Key
    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String name = null;

    // Trigger Condition
    public enum Type
    {
	TAG_IS_ADDED, TAG_IS_DELETED, CONTACT_IS_ADDED, CONTACT_IS_DELETED, DEAL_IS_ADDED, DEAL_IS_DELETED, ADD_SCORE
    };

    // Trigger Condition
    public Type type;

    @NotSaved(IfDefault.class)
    public String campaign_id = null;

    @NotSaved(IfDefault.class)
    public String score_value = null;

    @NotSaved(IfDefault.class)
    public String tags = null;

    // Dao
    private static ObjectifyGenericDao<Trigger> dao = new ObjectifyGenericDao<Trigger>(
	    Trigger.class);

    Trigger()
    {

    }

    public Trigger(String name, Type type, String campaign_id)
    {
	this.name = name;
	this.type = type;
	this.campaign_id = campaign_id;
    }

    public void save()
    {
	dao.put(this);
    }

    public void delete()
    {
	dao.delete(this);
    }

    // Delete triggers bulk
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

    // Get Triggers based on Trigger condition
    public static List<Trigger> getTriggersByCondition(Type condition)
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Trigger.class).filter("type", condition).list();
    }

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

class TriggersDeferredTask implements DeferredTask
{

    Long contactId;

    Type type;

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

		    Campaign.subscribe(contact,
			    Long.parseLong(trigger.campaign_id));

	    }
	}
    }

}
