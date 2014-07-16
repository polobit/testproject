package com.agilecrm.contact.sync.wrapper;

import com.agilecrm.contact.Contact;

public interface WrapperService
{
    public void wrapContact();

    public void addName();

    public void addEmail();

    public void addPhoneNumber();

    public void addOrganization();

    public void addDescription();

    public void addTag();

    public void addAddress();

    public void addNotes();

    public ContactWrapper getWrapper(Object object);

    public Contact buildContact();

}
