/**
 * @auther jitendra
 * @since 2014
 */
package com.agilecrm.contact.sync.wrapper;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.scribe.utils.Preconditions;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.thirdparty.google.ContactPrefs;

/**
 * <code>ContactWrapper</code> Abstraction of ContactWapper every third party
 * needs to be extends this wrapper to Construct Contact in agile style format
 */
public abstract class ContactWrapper implements IContactWrapper
{

    /** Contact Instance */
    protected Contact contact;

    /** Object */
    protected Object object;

    protected ContactPrefs prefs;

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
    public ContactWrapper getWrapper(Object object, ContactPrefs prefs)
    {

	Preconditions.checkNotNull(object, "Contact entry object cannot be null");
	ContactWrapper wrapper = getWrapper(object);
	wrapper.prefs = prefs;
	return this;
    }

    public ContactPrefs getPrefs()
    {
	return prefs;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#buildContact()
     */
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
	setJobTitle();

	addMoreCustomInfo();

	return contact;
    }

    /**
     * Adds the property to contact.
     * 
     * @param field
     *            the field
     */
    private void addPropertyToContact(ContactField field)
    {
	if (field == null)
	    return;

	contact.properties.add(field);
    }

    /**
     * Private setter methods which are called from build contact method, which
     * calls appropriate method from child implementations of contact wrapper
     * class.
     */
    private void setFirstName()
    {
	addPropertyToContact(getFirstName());
    }

    /**
     * Sets the last name.
     */
    private void setLastName()
    {
	addPropertyToContact(getLastName());
    }

    /**
     * Sets the email.
     */
    private void setEmail()
    {
	addPropertyToContact(getEmail());
    }

    /**
     * Sets the email.
     */
    private void setSyncId()
    {
	addPropertyToContact(getSyncId());
    }
    
    /**
     * Sets the phone number.
     */
    private void setPhoneNumber()
    {
	addPropertyToContact(getPhoneNumber());
    }

    /**
     * Sets the tag.
     */
    private void setTag()
    {
	List<String> tags = getTags();

	if (tags != null && tags.size() > 0)
	    contact.tags.addAll(tags);
    }

    /**
     * Sets the address.
     */
    private void setAddress()
    {
	addPropertyToContact(getAddress());
    }

    /**
     * Sets the organization.
     */
    private void setOrganization()
    {
	addPropertyToContact(getOrganization());
    }

    /**
     * Sets the description.
     */
    private void setDescription()
    {
    }

    /**
     * Sets the job title.
     */
    private void setJobTitle()
    {
	addPropertyToContact(getJobTitle());
    }

    /**
     * Sets the notes.
     */
    private void setNotes()
    {
	List<Note> notes = getNotes();

    }

    /**
     * Adds the more custom info.
     */
    private void addMoreCustomInfo()
    {
	List<ContactField> fields = getMoreCustomInfo();

	if (fields != null && fields.size() > 0)
	    contact.properties.addAll(fields);
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getMoreCustomInfo()
     */
    @Override
    public List<ContactField> getMoreCustomInfo()
    {
	// TODO Auto-generated method stub
	return new ArrayList<ContactField>(0);
    }

    /**
     * Gets the job title.
     * 
     * @return the job title
     */
    public ContactField getJobTitle()
    {
	return null;
    }

    /**
     * Save callback.
     */
    public void saveCallback()
    {

    }

    public String convertToAgileTag(String tag)
    {
	// Replacing special characters with underscore except space and
	// underscore
	String tagName = tag.replaceAll("[^\\p{L}\\p{N} _]", "_").trim();
	// if tag name start with _ or digit we removing that character until tag name
	// starts with alphabet
	while (StringUtils.isNotBlank(tagName) && (tagName.startsWith("_") || Character.isDigit(tagName.charAt(0))))
	{
	    if (tagName.startsWith("_"))
		tagName = tagName.replaceFirst("_", "").trim();
	    if (Character.isDigit(tagName.charAt(0)))
		tagName = tagName.replaceFirst("[0-9]", "").trim();
	}
	return tagName;
    }
}
