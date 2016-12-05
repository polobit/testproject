package com.agilecrm.projectedpojos;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.google.appengine.api.datastore.Entity;
import com.googlecode.objectify.annotation.Cached;

@XmlRootElement
@Cached
public class WorkflowPartial extends ProjectionEntityParse
{
    public Long id;

    public String name;
    
    public boolean is_disabled;
    
    public WorkflowPartial()
    {
	super();
    }
    
    public WorkflowPartial(Long id,String name,boolean is_disabled)
    {
	this.id = id;
	this.name = name;
	this.is_disabled = is_disabled;
    }

    public WorkflowPartial parseEntity(Entity entity)
    {
	id = entity.getKey().getId();
	name = (String) getPropertyValue(entity, "name");
	is_disabled = (boolean) getPropertyValue(entity, "is_disabled");
	return this;
    }

    /*
    public List<Object> postProcess(List workflows)
    {
	System.out.println("postProcess");
	// Now sort by name.
	Collections.sort(workflows, new Comparator<WorkflowPartial>()
	{
	    public int compare(WorkflowPartial one, WorkflowPartial other)
	    {
		return one.name.trim().toLowerCase().compareTo(other.name.trim().toLowerCase());
	    }
	 });
	return workflows;
    }
    */
}
