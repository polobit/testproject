/**
 * 
 */
package com.thirdparty.stripe;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.stripe.model.Card;
import com.stripe.model.Customer;

/**
 * <code>StripeAgileDataMapperService</code> This code will provide mapping all
 * Stripe's customers field data into agile contact
 * 
 * @author jitendra
 * 
 */
public class StripeAgileDataMapperService
{

    /**
     * This code will create Maps Stripe's customer field value to agile contact
     * field value
     * 
     * @param customer
     * @return Contact
     */
    public Contact createCustomerDataMap(Customer customer, String stripeFieldValue)
    {
	Contact contact = new Contact();
	List<ContactField> contactFields = new ArrayList<ContactField>();
	contact.type = Type.PERSON;
	contactFields.add(new ContactField(Contact.EMAIL, customer.getEmail(), "work"));
	Card card = StripeUtil.getDefaultCard(customer);
	contactFields.add(new ContactField(Contact.FIRST_NAME, card.getName(), null));
	contactFields.add(new ContactField(Contact.ADDRESS, getAddress(card), "office"));

	// check stripe custom field
	if (stripeFieldValue != null && !stripeFieldValue.isEmpty())
	{

	    contactFields.add(new ContactField(stripeFieldValue, customer.getId(), null));

	}

	contact.properties = contactFields;

	return contact;

    }

    /**
     * Extract address from {@link Card} and set return JSON address in string
     * format
     * 
     * @param card
     * @return
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
