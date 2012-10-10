package com.agilecrm.workflows;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.db.ObjectifyGenericDao;
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
	TAG_IS_ADDED, TAG_IS_DELETED, CONTACT_IS_ADDED, CONTACT_IS_DELETED, DEAL_IS_ADDED, DEAL_IS_DELETED
    };

    // Trigger Condition
    public Type type;

    @NotSaved(IfDefault.class)
    public String campaign_id = null;

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
	Workflow workflow = Workflow.getWorkflow(Long.parseLong(campaign_id));

	if (workflow != null)
	    return workflow.name;

	return "";
    }

}
