/**
 * 
 */
package com.agilecrm.contact.sync.wrapper.impl;

import java.util.List;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;

/**
 * @author jitendra
 * 
 */
public class ZohoContactWrapperImpl extends ContactWrapper
{
    JSONObject object;

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#wrapContact()
     */
    @Override
    public void wrapContact()
    {

    }

    @Override
    public ContactField getFirstName()
    {
	ContactField field = null;
	if (object.has("Account Name"))
	    try
	    {
		field = new ContactField(Contact.NAME, object.get("Account Name").toString(), null);
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }
	return field;
    }

    @Override
    public ContactField getLastName()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public ContactField getEmail()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public ContactField getPhoneNumber()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public ContactField getOrganization()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public String getDescription()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public List<String> getTags()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public ContactField getAddress()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public List<Note> getNotes()
    {
	// TODO Auto-generated method stub
	return null;
    }

}
