package com.agilecrm.contact.sync.wrapper;

import org.scribe.utils.Preconditions;

import com.agilecrm.contact.Contact;

public abstract class ContactWrapper implements WrapperService
{
    protected Contact contact;
    protected Object object;

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

	addName();
	addPhoneNumber();
	addAddress();
	addDescription();
	addEmail();
	addOrganization();
	addNotes();
	addMoreCustomInfo();

	return contact;
    }

    public void addMoreCustomInfo()
    {

    }

}
