/**
 * 
 */
package com.agilecrm.util;

import com.agilecrm.contact.Contact;

/**
 * helper bean which contains contact and their failed causes
 * 
 * @author jitendra
 *
 */
public class FailedContactBean
{
    private Contact contact;
    private String causes;

    public FailedContactBean(Contact contact, String msg)
    {
	this.contact = contact;
	this.causes = msg;
    }

    public Contact getContact()
    {
	return contact;
    }

    public void setContact(Contact contact)
    {
	this.contact = contact;
    }

    public String getCauses()
    {
	return causes;
    }

    public void setCauses(String causes)
    {
	this.causes = causes;
    }

}