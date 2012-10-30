package com.agilecrm.workflows;

import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.core.DomainUser;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
@Unindexed
public class Workflow extends Cursor
{
    // Key
    @Id
    public Long id;

    public String name;

    // Created/Updated Time
    public Long created_time = 0L;

    @NotSaved(IfDefault.class)
    public Long updated_time = 0L;

    @NotSaved(IfDefault.class)
    public String rules = null;

    @NotSaved(IfDefault.class)
    private Key<DomainUser> creator_key = null;

    // Dao
    public static ObjectifyGenericDao<Workflow> dao = new ObjectifyGenericDao<Workflow>(
	    Workflow.class);

    Workflow()
    {

    }

    public Workflow(String name, String rules)
    {
	this.name = name;
	this.rules = rules;
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
	DomainUser domainUser = DomainUser.getDomainCurrentUser();
	creator_key = new Key<DomainUser>(DomainUser.class, domainUser.id);

	dao.put(this);
    }

    public void delete()
    {
	dao.delete(this);
    }

    public static Workflow getWorkflow(Long id)
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

    public static List<Workflow> getAllWorkflows()
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Workflow.class).list();
    }

    public static List<Workflow> getAllWorkflows(int max, String cursor)
    {
	List<Workflow> workflows = dao.fetchAll(max, cursor);
	return workflows;
    }

    public String toString()
    {
	return "Name: " + name + " Rules: " + rules + " created_time: "
		+ created_time + " updated_time" + updated_time;
    }

    @XmlElement(name = "creator")
    public String getCreatorName() throws Exception
    {
	Objectify ofy = ObjectifyService.begin();
	if (creator_key != null)
	{
	    DomainUser domainUser = ofy.get(creator_key);
	    if (domainUser != null)
		return domainUser.name;
	}
	return "";
    }
}