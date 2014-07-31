package com.agilecrm.contact.sync.wrapper.impl;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.Type;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.stripe.model.Card;
import com.stripe.model.Customer;

public class StripeContactWrapperImpl extends ContactWrapper
{

    Customer customer;
    private String stripeFieldValue = null;

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#wrapContact()
     */
    @Override
    public void wrapContact()
    {
	if (!(object instanceof Customer))
	    return;

	customer = (Customer) object;
    }

    {
	/**
	 * check stripe widget is configure or not if configure then retrieve
	 * custom field which is configured for stripe widget
	 */
	Widget widget = WidgetUtil.getWidget("Stripe");
	if (widget != null)
	{

	    try
	    {
		JSONObject stripePref = new JSONObject(widget.prefs);

		if (stripePref.has("stripe_field_name"))
		    stripeFieldValue = stripePref.get("stripe_field_name").toString();
	    }
	    catch (org.json.JSONException e)
	    {
		e.printStackTrace();
	    }
	}
    }

    /**
     * return String formate of customer address which is extracted from stripe
     * model {@link Card}
     * 
     * @param card
     * @return address
     */
    private String getAddress(Card card)
    {

	JSONObject address = new JSONObject();

	String addressLine2 = "";
	if (card.getAddressLine2() != null)
	{
	    addressLine2 = card.getAddressLine2();
	}
	try
	{
	    address.put("address", card.getAddressLine1() + " " + addressLine2);

	    if (card.getAddressCity() != null)
		address.put("city", card.getAddressCity());

	    if (card.getAddressState() != null)
		address.put("state", card.getAddressState());

	    address.put("country", card.getAddressCountry());
	    address.put("zip", card.getAddressZip());
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}
	return address.toString();
    }

    @Override
    public ContactField getFirstName()
    {
	Card card = customer.getActiveCard();
	if (card != null)
	{
	    return new ContactField(Contact.FIRST_NAME, card.getName(), null);
	}

	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public ContactField getEmail()
    {
	return new ContactField(Contact.EMAIL, customer.getEmail(), "work");
    }

    @Override
    public ContactField getAddress()
    {
	Card card = customer.getActiveCard();

	ContactField field = null;
	if (card != null)
	{
	    field = new ContactField(Contact.ADDRESS, getAddress(card), "office");
	}

	return field;
    }

    public List<ContactField> getMoreCustomInfo()
    {
	List<ContactField> customFields = new ArrayList<ContactField>(0);
	// TODO Auto-generated method stub
	// check stripe custom field
	if (stripeFieldValue != null && !stripeFieldValue.isEmpty())
	{
	    ContactField field = new ContactField();
	    field.type = FieldType.CUSTOM;
	    field.name = stripeFieldValue;
	    field.value = customer.getId();
	    customFields.add(field);
	}
	

	return customFields;
    }

    /**
     * Following fields data is not available in stripe
     */
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
    public List<Note> getNotes()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public ContactField getLastName()
    {
	// TODO Auto-generated method stub
	return null;
    }

}
