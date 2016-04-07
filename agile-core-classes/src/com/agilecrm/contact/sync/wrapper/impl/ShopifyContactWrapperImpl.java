package com.agilecrm.contact.sync.wrapper.impl;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;
import com.google.gdata.data.contacts.Website;

/**
 * <code>ShopifyContactWrapperImple</code> Implements ContactWrapper This class
 * Wraps Shopify Contacts in agile schema format
 * 
 * @author Jitendra
 * 
 */
public class ShopifyContactWrapperImpl extends ContactWrapper
{

    /** The contact properties. */
    LinkedHashMap<String, Object> contactProperties;

    /** The default address. */
    LinkedHashMap<String, String> defaultAddress;

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#wrapContact()
     */
    @Override
    public void wrapContact()
    {
	contactProperties = (LinkedHashMap<String, Object>) object;
	if (contactProperties != null)
	{
	    defaultAddress = (LinkedHashMap<String, String>) contactProperties.get("default_address");

	}
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getFirstName()
     */
    @Override
    public ContactField getFirstName()
    {
	String firstName = null;
	ContactField field = null;
	if (contactProperties.containsKey("first_name") && contactProperties.get("first_name") != null)
	{
	    firstName = contactProperties.get("first_name").toString();
	    field = new ContactField(Contact.FIRST_NAME, firstName, null);
	}
	return field;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getLastName()
     */
    @Override
    public ContactField getLastName()
    {
	String lastName = null;
	ContactField field = null;
	if (contactProperties.containsKey("last_name") && contactProperties.get("last_name") != null)
	{
	    lastName = contactProperties.get("last_name").toString();
	    field = new ContactField(Contact.LAST_NAME, lastName, null); 
	}
	return field;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getEmail()
     */
    @Override
    public ContactField getEmail()
    {
	String email = null;
	ContactField field = null;
	if (contactProperties.containsKey("email") && contactProperties.get("email") != null)
	{
	    email = contactProperties.get("email").toString();
	    field = new ContactField(Contact.EMAIL, email, "home");
	}
	return field;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getPhoneNumber()
     */
    @Override
    public ContactField getPhoneNumber()
    {
	String phoneNumber = null;
	if (defaultAddress != null)
	{
	    if (defaultAddress.containsKey("phone"))
	    {
		phoneNumber = defaultAddress.get("phone");
	    }
	    return new ContactField(Contact.PHONE, phoneNumber, "home");
	}
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getOrganization()
     */
    @Override
    public ContactField getOrganization()
    {
	String company = null;
	ContactField field = null;
	if (contactProperties.containsKey("company"))
	{
	    company = defaultAddress.get("phone");
	    field = new ContactField(Contact.COMPANY, company, "office");
	}
	return field;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getDescription()
     */
    @Override
    public String getDescription()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getTags()
     */
    @Override
    public List<String> getTags()
    {
	List<String> tagList = new ArrayList<String>();
	if (contactProperties.containsKey("tags"))
	{
	    String[] tags = contactProperties.get("tags").toString().split(",");
	    for (String tag : tags)
	    {
		if (StringUtils.isNotBlank(tag))
		{
		    tag = convertToAgileTag(tag);
		    if (StringUtils.isNotBlank(tag))
			tagList.add(tag);
		}
	    }

	}
	return tagList;
    }

    /**
     * Wrap Address and return as ContactField Object
     */
    @Override
    public ContactField getAddress()
    {
	JSONObject address = new JSONObject();
	ContactField field = null;
	if (defaultAddress != null)
	{
	    String strete = defaultAddress.get("address1");
	    if (defaultAddress.containsKey("address2"))
	    {
		String address2 = defaultAddress.get("address2");
		if (address2 != null)
		    strete = strete + address2;
	    }
	    try
	    {
		if (defaultAddress.containsKey("city"))
		    address.put("city", defaultAddress.get("city"));

		if (defaultAddress.containsKey("province"))
		    address.put("state", defaultAddress.get("province"));

		if (defaultAddress.containsKey("country"))
		    address.put("country", defaultAddress.get("country"));

		if (defaultAddress.containsKey("zip"))
		    address.put("zip", defaultAddress.get("zip"));

		address.put("address", strete);
		field = new ContactField(Contact.ADDRESS, address.toString(), "home");
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}
	return field;
    }

    /**
     * Return List of Note found customer account
     */
    @Override
    public List<Note> getNotes()
    {
	List<Note> notes = new ArrayList<Note>();
	if (contactProperties.containsKey("note") && contactProperties.get("note") != null)
	{
	    String note = contactProperties.get("note").toString();
	    Note n = new Note("Customer's Note", note);

	    notes.add(n);

	}

	return notes;
    }
    
    @Override
    public List<ContactField> getMoreCustomInfo()
    {
	// TODO Auto-generated method stub
    	List<ContactField> fields = new ArrayList<ContactField>();
    	String syncid = null;
    	if (contactProperties.containsKey("id") && contactProperties.get("id") != null)
    	{
    		syncid = contactProperties.get("id").toString();
    	}
    		fields.add(new ContactField(Contact.SHOPIFY_SYNC, syncid.toString(), "home"));
    		return fields;

    }

    @Override
    public void saveCallback()
    {

    }

}
