package com.agilecrm.contact.sync.wrapper.impl;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.sync.wrapper.WrapperServiceBuilder;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.stripe.model.Card;
import com.stripe.model.Customer;

public class StripeContactWrapperImpl extends WrapperServiceBuilder
{

    Customer customer;
    private String stripeFieldValue = null;

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
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}
    }

    @Override
    public void addName()
    {
	Card card = customer.getActiveCard();
	if (card != null)
	{
	    contact.properties.add(new ContactField(Contact.FIRST_NAME, card.getName(), null));
	}

    }

    @Override
    public void addEmail()
    {
	// TODO Auto-generated method stub
	contact.properties.add(new ContactField(Contact.EMAIL, customer.getEmail(), "work"));
    }

    @Override
    public void addPhoneNumber()
    {
	// TODO Auto-generated method stub

    }

    @Override
    public void addOrganization()
    {
	// TODO Auto-generated method stub

    }

    @Override
    public void addDescription()
    {
	// TODO Auto-generated method stub

    }

    @Override
    public void addTag()
    {
	// TODO Auto-generated method stub

    }

    @Override
    public void addAddress()
    {
	Card card = customer.getActiveCard();
	if (card != null)
	{
	    contact.properties.add(new ContactField(Contact.ADDRESS, getAddress(card), "office"));
	}

    }

    @Override
    public void addMoreCustomInfo()
    {
	// TODO Auto-generated method stub
	// check stripe custom field
	if (stripeFieldValue != null && !stripeFieldValue.isEmpty())
	{

	    contact.properties.add(new ContactField(stripeFieldValue, customer.getId(), null));

	}
    }

    @Override
    public void addNotes()
    {
	// TODO Auto-generated method stub

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

}
