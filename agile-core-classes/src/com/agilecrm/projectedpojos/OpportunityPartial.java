package com.agilecrm.projectedpojos;

import javax.xml.bind.annotation.XmlRootElement;

import com.google.appengine.api.datastore.Entity;
import com.googlecode.objectify.annotation.Cached;

@XmlRootElement
@Cached
public class OpportunityPartial extends ProjectionEntityParse{
	public Long id;
	public String name;
	
	public OpportunityPartial(){
		super();
	}
	
	public OpportunityPartial(Long id, String name){
		
	}
	
	public OpportunityPartial parseEntity(Entity entity)
	{
		id = entity.getKey().getId();
		name = (String) getPropertyValue(entity, "name");
		
		return this;
	}
}
