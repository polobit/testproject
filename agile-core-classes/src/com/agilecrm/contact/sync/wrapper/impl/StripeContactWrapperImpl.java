/**
 * @auther jitendra
 * @since 2014
 */
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
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.stripe.model.Card;
import com.stripe.model.Customer;

/**
 * <code>StripeContactWrapperImpl</code> extends ContactWrapper wraps individual
 * field in agile Contact Object
 */
public class StripeContactWrapperImpl extends ContactWrapper
{

	/** customer Instance */
	Customer customer;

	/** Stripe field value. */
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
		 * check stripe widget is configure or not if configure then
		 * retrieve custom field which is configured for stripe widget
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
	 * Return String format of customer address which is extracted from
	 * stripe model {@link Card}.
	 * 
	 * @param card
	 *                the card
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

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getFirstName()
	 */
	@Override
	public ContactField getFirstName()
	{
		Card card = StripeUtil.getDefaultCard(customer);
		if (card != null && card.getName()!=null)
		{
			return new ContactField(Contact.FIRST_NAME, card.getName().split(" ")[0], null);
		}
		else if(card==null || (card != null && card.getName()==null))
		{
			String email = null;
			if(customer!=null && customer.getEmail()!=null)
			{
				email = customer.getEmail();
				if(email!=null)
					return new ContactField(Contact.FIRST_NAME, customer.getEmail().split("@")[0].split("\\.")[0], null);
			}
		}

		// TODO Auto-generated method stub
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getEmail()
	 */
	@Override
	public ContactField getEmail()
	{
		return new ContactField(Contact.EMAIL, customer.getEmail(), "work");
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getAddress()
	 */
	@Override
	public ContactField getAddress()
	{
	    Card card = StripeUtil.getDefaultCard(customer);

		ContactField field = null;
		if (card != null)
		{
			field = new ContactField(Contact.ADDRESS, getAddress(card), "office");
		}

		return field;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.agilecrm.contact.sync.wrapper.ContactWrapper#getMoreCustomInfo()
	 */
	public List<ContactField> getMoreCustomInfo()
	{
		List<ContactField> customFields = new ArrayList<ContactField>();
		// check stripe custom field
		if (stripeFieldValue != null && !stripeFieldValue.isEmpty())
		{
			ContactField field = new ContactField();
			field.type = FieldType.CUSTOM;
			field.name = stripeFieldValue;
			field.value = customer.getId();
			customFields.add(field);
		}
		else
		{
			
	             contact.addpropertyWithoutSaving(new ContactField("StripeID", customer.getId(), null));
			
		}

		return customFields;
	}

	/**
	 * Following fields data is not available in stripe.
	 * 
	 * @return the phone number
	 */
	@Override
	public ContactField getPhoneNumber()
	{
		// TODO Auto-generated method stub
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.agilecrm.contact.sync.wrapper.WrapperService#getOrganization()
	 */
	@Override
	public ContactField getOrganization()
	{
		// TODO Auto-generated method stub
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.agilecrm.contact.sync.wrapper.WrapperService#getDescription()
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
		// TODO Auto-generated method stub
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
		// TODO Auto-generated method stub
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.agilecrm.contact.sync.wrapper.WrapperService#getLastName()
	 */
	@Override
	public ContactField getLastName()
	{
		Card card = StripeUtil.getDefaultCard(customer);
		if (card != null && card.getName()!=null)
		{
			String[] lastNames = card.getName().split(" ");
			String lastName = "";
			for(int i=1;i<lastNames.length;i++){
				lastName += lastNames[i]+" ";
			}
			return new ContactField(Contact.LAST_NAME, lastName.trim(), null);
		}
		else if(card==null || (card != null && card.getName()==null))
		{
			String email = null;
			if(customer!=null && customer.getEmail()!=null)
			{
				email = customer.getEmail();
				if(email!=null)
				{
					String[] lastNames = customer.getEmail().split("@")[0].split("\\.");
					String lastName = "";
					for(int i=1;i<lastNames.length;i++)
					{
						lastName += lastNames[i]+" ";
					}
					return new ContactField(Contact.LAST_NAME, lastName.trim(), null);
				}
			}
		}
		// TODO Auto-generated method stub
		return null;
	}

}
