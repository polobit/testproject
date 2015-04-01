package com.campaignio.wrapper;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.cursor.Cursor;

@XmlRootElement
public class LogWrapper extends CampaignLogWrapper
{
    @XmlElement
    public Contact getContact() throws Exception
    {
	System.out.println(subscriber_id + "this is subscriber id");
	System.out.println(email + "this is email id");

	if (subscriber_id != null && !"null".equals(subscriber_id))
	{
	    System.out.println(subscriber_id + "this is subscriber id");
	    Contact contact = ContactUtil.getContact(Long.parseLong(subscriber_id));

	    if (contact != null)
	    {
		System.out.println("found contact by subscriber id: " + contact.toString());
		return contact;
	    }
	}

	if (email != null && !"null".equals(email))
	{
	    System.out.println("This is email" + email);

	    Contact contact = ContactUtil.searchContactByEmail(email);

	    System.out.println(contact);

	    if (contact != null)
	    {
		System.out.println("found contact by email id: " + contact.toString());
		return contact;
	    }
	}

	return null;
    }

    public LogWrapper()
    {

    }

}
