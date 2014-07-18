package com.agilecrm.contact.sync.wrapper;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;

public interface WrapperService
{
    public void wrapContact();

    public ContactWrapper getWrapper(Object object);

    public ContactField getFirstName();

    public ContactField getLastName();

    public ContactField getEmail();

    public ContactField getPhoneNumber();

    public ContactField getOrganization();

    public String getDescription();

    public List<String> getTags();

    public ContactField getAddress();

    public List<Note> getNotes();

    public List<ContactField> getMoreCustomInfo();

    public Contact buildContact();

}
