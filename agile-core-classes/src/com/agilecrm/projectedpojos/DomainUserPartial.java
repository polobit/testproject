package com.agilecrm.projectedpojos;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.Entity;
import com.googlecode.objectify.annotation.Cached;

@XmlRootElement
@Cached
public class DomainUserPartial extends ProjectionEntityParse{
	public Long id;
	public String domain;
	public String email;
	public String name;
	public String pic;
	
	public DomainUserPartial(){
		super();
		System.out.println("Default one");
	}
	
	public DomainUserPartial parseEntity(Entity entity)
	{
		id = entity.getKey().getId();
		domain = NamespaceManager.get();
		name = (String) getPropertyValue(entity, "name");
		email = (String) getPropertyValue(entity, "email");
		pic = (String) getPropertyValue(entity, "pic");
		
		return this;

	}
	
	public List<DomainUserPartial> postProcess(List domainUsers){
		System.out.println("postProcess");
		
		// Now sort by name.
	    Collections.sort(domainUsers, new Comparator<DomainUserPartial>()
	    {
		public int compare(DomainUserPartial one, DomainUserPartial other)
		{
		    return one.name.toLowerCase().compareTo(other.name.toLowerCase());
		}
	    });
	    
	    return domainUsers;

	}
	
	
}
