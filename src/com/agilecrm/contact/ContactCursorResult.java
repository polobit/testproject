package com.agilecrm.contact;

import java.util.List;

import javax.persistence.Embedded;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement
public class ContactCursorResult
{

	@Embedded
	//@XmlElementWrapper(name = "listcontacts")
	public List<Contact> contacts;
	public String cursor = "";
	
	ContactCursorResult(List<Contact> contacts, String cursor)
	{
		this.contacts = contacts;
		this.cursor = cursor;
	}
	
	ContactCursorResult()
	{
		
	}
	
}
