package com.agilecrm.projectedpojos;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.contact.ContactField;
import com.googlecode.objectify.annotation.Cached;

@XmlRootElement
@Cached
public class ContactPartial {
	public Long id;
	
	@JsonIgnore
	public String first_name;
	@JsonIgnore
	public String last_name;
	@JsonIgnore
	public String name;
	
	public String type;
	
	public List<ContactField> properties = new ArrayList<ContactField>();
	
	
	public ContactPartial(Long id, String first_name, String last_name, String name, String type){
		this.id = id;
		this.name = name;
		this.first_name = first_name;
		this.last_name = last_name;
		this.type = type;
		
		// Create a propertirs list
		properties.add(new ContactField("first_name", first_name, null));
		properties.add(new ContactField("last_name", last_name, null));
		properties.add(new ContactField("name", name, null));
		
	}
}
