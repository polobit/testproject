package com.agilecrm.projectedpojos;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.ContactField;
import com.google.appengine.api.datastore.Entity;
import com.googlecode.objectify.annotation.Cached;

@XmlRootElement
@Cached
public class ContactPartial extends ProjectionEntityParse {
	public Long id;
	
	@JsonIgnore
	public String first_name;
	@JsonIgnore
	public String last_name;
	@JsonIgnore
	public String name;
	
	public String type;
	
	// In future add annotation type ignore for property projection
	public List<ContactField> properties = new ArrayList<ContactField>();
	
	public ContactPartial(){
		super();
	}
	
	public ContactPartial parseEntity(Entity entity){
		
		id = entity.getKey().getId();
		first_name = (String) getPropertyValue(entity, "first_name");
		last_name = (String) getPropertyValue(entity, "last_name"); 
		name = (String) getPropertyValue(entity, "name"); 
		type = (String) getPropertyValue(entity, "type"); 
		
		// Create a properties list
		properties.add(new ContactField("first_name", first_name, null));
		properties.add(new ContactField("last_name", last_name, null));
		properties.add(new ContactField("name", name, null));
		
		return this;

	}
}
