package com.agilecrm.contact.sync.wrapper;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.thirdparty.google.ContactPrefs;

/**
 * The Interface WrapperService provide several methods for wrap contact field
 * info and easy way to create contact every third party client needs to
 * implement wrapper service
 */
public interface IContactWrapper
{

    /**
     * Wrap contact.
     */
    public void wrapContact();

    /**
     * Gets the wrapper.
     * 
     * @param object
     *            the object
     * @return the wrapper
     */
    public ContactWrapper getWrapper(Object object);

    public ContactWrapper getWrapper(Object object, ContactPrefs prefs);

    /**
     * Gets the first name.
     * 
     * @return the first name
     */
    public ContactField getFirstName();

    /**
     * Gets the last name.
     * 
     * @return the last name
     */
    public ContactField getLastName();

    /**
     * Gets the email.
     * 
     * @return the email
     */
    public ContactField getEmail();

    public ContactField getSyncId();
    /**
     * Gets the phone number.
     * 
     * @return the phone number
     */
    public ContactField getPhoneNumber();

    /**
     * Gets the organization.
     * 
     * @return the organization
     */
    public ContactField getOrganization();

    /**
     * Gets the description.
     * 
     * @return the description
     */
    public String getDescription();

    /**
     * Gets the tags.
     * 
     * @return the tags
     */
    public List<String> getTags();

    /**
     * Gets the address.
     * 
     * @return the address
     */
    public ContactField getAddress();

    /**
     * Gets the notes.
     * 
     * @return the notes
     */
    public List<Note> getNotes();

    /**
     * Gets the more custom info.
     * 
     * @return the more custom info
     */
    public List<ContactField> getMoreCustomInfo();

    /**
     * Builds the contact.
     * 
     * @return the contact
     */
    public Contact buildContact();

    /**
     * Converts client tag into Agile tag replaces special characters with
     * underscore. Replaces underscore with empty string if tag starts with
     * underscore
     */
    public String convertToAgileTag(String tag);

}
