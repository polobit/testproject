package com.agilecrm.contact.sync.wrapper.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;

/**
 * @author jitendra
 * @since 2014 Freshbooks contact wrapper wrap all fields and create contacts
 *        similar to agile contacts
 *
 */
public class FreshbooksContactWrapper extends ContactWrapper
{
    JSONObject customer;

    @Override
    public void wrapContact()
    {
	customer = (JSONObject) object;

    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getFirstName()
     */
    @Override
    public ContactField getFirstName()
    {
	ContactField field = null;
	try
	{
	    String firstName = customer.getString("first_name");
	    if (!firstName.isEmpty() && !firstName.equals("undefined"))
	    {
		field = new ContactField(Contact.FIRST_NAME, firstName, null);
	    }
	}
	catch (NullPointerException | JSONException e)
	{
	    e.printStackTrace();
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
	ContactField field = null;
	try
	{
	    String lastName = customer.getString("last_name");
	    if (!lastName.isEmpty() && !lastName.equals("undefined"))
	    {
		field = new ContactField(Contact.LAST_NAME, lastName, null);
	    }
	}
	catch (NullPointerException | JSONException e)
	{
	    e.printStackTrace();
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
	ContactField field = null;
	try
	{
	    String email = customer.getString("email");
	    if (!email.isEmpty() && !email.equals("undefined"))
	    {
		field = new ContactField(Contact.EMAIL, email, "work");
	    }
	}
	catch (NullPointerException | JSONException e)
	{
	    e.printStackTrace();
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
	ContactField field = null;
	try
	{
	    String phone = customer.getString("home_phone");
	    if (!phone.isEmpty() && !phone.equals("undefined"))
	    {
		field = new ContactField(Contact.PHONE, phone, "home");
	    }
	}
	catch (NullPointerException | JSONException e)
	{
	    e.printStackTrace();
	}
	return field;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getOrganization()
     */
    @Override
    public ContactField getOrganization()
    {

	ContactField field = null;
	try
	{
	    String organization = customer.getString("organization");
	    if (!organization.isEmpty() && !organization.equals("undefined"))
	    {
		field = new ContactField(Contact.COMPANY, organization, "office");
	    }
	}
	catch (NullPointerException | JSONException e)
	{
	    e.printStackTrace();
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
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getAddress()
     */
    @Override
    public ContactField getAddress()
    {

	JSONObject address = getAddress(customer);
	if (address != null && address.length() > 0)
	{
	    return new ContactField(Contact.ADDRESS, address.toString(), "home");
	}

	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getNotes()
     */
    @Override
    public List<Note> getNotes()
    {
	/*
	 * ContactField field = null; try { String organization =
	 * customer.getString("notes"); if (!organization.isEmpty() &&
	 * !organization.equals("undefined")) { field = new
	 * ContactField(Contact.COMPANY, organization, "office"); } } catch
	 * (NullPointerException | JSONException e) { e.printStackTrace(); }
	 * return field;
	 */
	return null;
    }

    private JSONObject getAddress(JSONObject customer)
    {
	try
	{

	    JSONObject address = new JSONObject();
	    String street1 = customer.getString("p_street1");
	    String street2 = customer.getString("p_street2");
	    String city = customer.getString("p_city");
	    String zip = customer.getString("p_code");
	    String country = customer.getString("p_country");
	    String state = customer.getString("p_state");
	    if (!StringUtils.isBlank(street2))
	    {
		String street = street1 + " " + street2;
		if (!street.isEmpty() && !street.equals("undefined"))
		{
		    address.put("address", street);
		}
	    }

	    if (!StringUtils.isEmpty(city) && !city.equals("undefined"))
	    {
		address.put("city", city);
	    }

	    if (!StringUtils.isEmpty(zip) && !zip.equals("undefined"))
	    {
		address.put("zip", zip);
	    }
	    if (!StringUtils.isEmpty(state) && !state.equals("undefined"))
	    {
		address.put("state", state);
	    }
	    if (!StringUtils.isEmpty(country) && !country.equals("undefined"))
	    {
		address.put("country", country);
	    }
	    // check if primary address is null or empty then create alternative
	    // address
	    if (address == null || address.length() == 0)
	    {
		address = new JSONObject();
		String street3 = customer.getString("s_street1");
		String street4 = customer.getString("s_street2");
		String scity = customer.getString("s_city");
		String szip = customer.getString("s_code");
		String scountry = customer.getString("s_country");
		String sstate = customer.getString("s_state");
		if (!StringUtils.isBlank(street3))
		{
		    String street = street3 + " " + street4;
		    if (!street.isEmpty() && !street.equals("undefined"))
		    {
			address.put("address", street);
		    }
		}

		if (!StringUtils.isEmpty(scity) && !scity.equals("undefined"))
		{
		    address.put("city", scity);
		}

		if (!StringUtils.isEmpty(szip) && !szip.equals("undefined"))

		{
		    address.put("zip", szip);
		}
		if (!StringUtils.isEmpty(sstate) && !sstate.equals("undefined"))
		{
		    address.put("state", sstate);
		}
		if (!StringUtils.isEmpty(scountry) && !scountry.equals("undefined"))
		{
		    address.put("country", scountry);
		}
	    }

	    return address;

	}
	catch (NullPointerException | ClassCastException | JSONException e)
	{
	    e.printStackTrace();
	}
	return null;
    }
}
