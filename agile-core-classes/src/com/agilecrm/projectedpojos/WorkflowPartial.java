package com.agilecrm.projectedpojos;

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

    public WorkflowPartial parseEntity(Entity entity)
    {
	id = entity.getKey().getId();
	name = (String) getPropertyValue(entity, "name");
	return this;
    }

    public List<Object> postProcess(List workflows)
    {
	System.out.println("postProcess");
	// Now sort by name.
	// Collections.sort(workflows, new Comparator<WorkflowPartial>()
	// {
	// public int compare(WorkflowPartial one, WorkflowPartial other)
	// {
	// return
	// one.name.trim().toLowerCase().compareTo(other.name.trim().toLowerCase());
	// }
	// });
	return workflows;
    }
}
