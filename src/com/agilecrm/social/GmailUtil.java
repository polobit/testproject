package com.agilecrm.social;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.ContactField;

@XmlRootElement
public class GmailUtil
{

    public static void main(String[] args) throws Exception
    {

	List<ContactField> properties = new ArrayList<ContactField>();
	properties.add(new ContactField("company", "work", "Giga Om"));

	// Contact contact = new Contact(Contact.Type.PERSON, "", "Om", "Malik",
	// new ArrayList<String>(), properties);
	// getLinkedInProfile(contact);
	// getTwitterProfile(contact);
    }

}
