/**
 * @auther jitendra
 * @since 2014
 */
package com.agilecrm.contact.sync.wrapper;

import java.util.ArrayList;
import java.util.List;

import org.scribe.utils.Preconditions;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;

public abstract class ContactWrapper implements WrapperService
{
    protected Contact contact;
    protected Object object;

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.wrapper.WrapperService#getWrapper(java.lang
     * .Object)
     */
    @Override
    public ContactWrapper getWrapper(Object object)
    {

	Preconditions.checkNotNull(object, "Contact entry object cannot be null");
	contact = new Contact();
	this.object = object;

	return this;
    }

    @Override
    public Contact buildContact()
    {

	wrapContact();

	/**
	 * Setting properties and other fields to new contact object
	 */

	setFirstName();
	setLastName();
	setEmail();
	setOrganization();
	setPhoneNumber();
	setDescription();
	setAddress();
	setTag();
	setNotes();
	addMoreCustomInfo();

	return contact;
    }

    private void addPropertyToContact(ContactField field)
    {
	if (field == null)
	    return;

	contact.properties.add(field);
    }

    /**
     * Private setter methods which are called from build contact method, which
     * calls appropriate method from child implementations of contact wrapper
     * class
     */
    private void setFirstName()
    {
	addPropertyToContact(getFirstName());
    }

    private void setLastName()
    {
	addPropertyToContact(getLastName());
    }

    private void setEmail()
    {
	addPropertyToContact(getEmail());
    }

    private void setPhoneNumber()
    {
	addPropertyToContact(getPhoneNumber());
    }

    private void setTag()
    {
	List<String> tags = getTags();

	if (tags != null && tags.size() > 0)
	    contact.tags.addAll(tags);
    }

    private void setAddress()
    {
	addPropertyToContact(getAddress());
    }

    private void setOrganization()
    {

    }

    private void setDescription()
    {

    }

    private void setNotes()
    {

    }

    private void addMoreCustomInfo()
    {
	List<ContactField> fields = getMoreCustomInfo();

	if (fields == null || fields.size() == 0)
	    return;

	contact.properties.addAll(fields);
    }

    @Override
    public List<ContactField> getMoreCustomInfo()
    {
	// TODO Auto-generated method stub
	return new ArrayList<ContactField>(0);
    }

}
