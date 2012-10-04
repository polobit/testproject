package com.agilecrm.workflows;

import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
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

    @NotSaved(IfDefault.class)
    public String condition = null;

    @NotSaved(IfDefault.class)
    public String campaign = null;

    // Created/Updated Time
    public Long created_time = 0L;

    @NotSaved(IfDefault.class)
    public Long updated_time = 0L;

    // Dao
    private static ObjectifyGenericDao<Trigger> dao = new ObjectifyGenericDao<Trigger>(
	    Trigger.class);

    Trigger()
    {

    }

    public Trigger(String name, String condition, String campaign)
    {
	this.name = name;
	this.condition = condition;
	this.campaign = campaign;
    }

    @PrePersist
    private void PrePersist()
    {
	// Store Created and Last Updated Time
	if (created_time == 0L)
	{
	    created_time = System.currentTimeMillis() / 1000;
	}
	else
	    updated_time = System.currentTimeMillis() / 1000;
    }

    public void save()
    {
	dao.put(this);
    }

    public void delete()
    {
	dao.delete(this);
    }

    public static Trigger getTriggers(Long id)
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
	return "Name: " + name + " Condition: " + condition + "Campaign:"
		+ campaign + " created_time: " + created_time + " updated_time"
		+ updated_time;
    }

}
