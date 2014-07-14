/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.stripe.exception.APIConnectionException;
import com.stripe.exception.APIException;
import com.stripe.exception.AuthenticationException;
import com.stripe.exception.CardException;
import com.stripe.exception.InvalidRequestException;
import com.stripe.model.Card;
import com.stripe.model.Customer;
import com.stripe.model.CustomerCollection;
import com.thirdparty.google.ContactPrefs;

/**
 * <code>StripeSync</code> implements {@link OneWaySyncService}
 * 
 * @author jitendra
 * 
 */
public class StripeSyncImpl extends OneWaySyncService
{

    private static final String STRIPE_NOTIFICATION_SUBJECT = "Stripe Import Status";
    private String stripeFieldValue = null;
    private String lastSyncCheckPoint = null;

    /**
     * 
     * Implementation of initSync for Stripe
     * 
     * @see com.agilecrm.contact.sync.service.OneWaySyncService#initSync()
     */
    @Override
    public void initSync()
    {

	try
	{

	    /**
	     * check last sync check point
	     */
	    lastSyncCheckPoint = prefs.lastSyncCheckPoint;
	    /**
	     * check stripe widget is configure or not if configure then
	     * retrieve custom field which is configured for stripe widget
	     */
	    Widget widget = WidgetUtil.getWidget("Stripe");
	    if (widget != null)
	    {
		JSONObject stripePref = new JSONObject(widget.prefs);
		if (stripePref.has("stripe_field_name"))
		    stripeFieldValue = stripePref.get("stripe_field_name").toString();
	    }

	    while (true)
	    {

		CustomerCollection collections = Customer.all(options(), prefs.apiKey);

		List<Customer> customers = collections.getData();
		for (Customer customer : customers)
		{
		    wrapContactToAgileSchemaAndSave(customer);
		}
		if (customers.size() == 0)
		    break;
		else
		{
		    Customer customer = customers.get(customers.size() - 1);

		    lastSyncCheckPoint = customer.getId();
		}

		if (isLimitExceeded())
		    break;
	    }
	    updateLatestSync(prefs, lastSyncCheckPoint);

	}
	catch (AuthenticationException | InvalidRequestException | APIConnectionException | CardException
		| APIException | JSONException e)
	{
	    e.printStackTrace();
	}

    }

    /**
     * Update Last SyncId which is user later for retrieve contacts from that id
     * 
     * @param prefs
     * @param customerId
     */
    private void updateLatestSync(ContactPrefs prefs, String customerId)
    {
	prefs.lastSyncCheckPoint = customerId;
	prefs.save();
    }

    /**
     * Wraps Stripe Customer field into Agile schema
     * 
     * @see com.agilecrm.contact.sync.service.OneWaySyncService#wrapContactToAgileSchema(java.lang.Object)
     */
    @Override
    public Contact wrapContactToAgileSchema(Object object)
    {
	Contact contact = new Contact();
	if (object instanceof Customer)
	{
	    Customer customer = (Customer) object;

	    List<ContactField> contactFields = new ArrayList<ContactField>();
	    contact.type = Type.PERSON;
	    contactFields.add(new ContactField(Contact.EMAIL, customer.getEmail(), "work"));
	    Card card = customer.getActiveCard();
	    if (card != null)
	    {
		contactFields.add(new ContactField(Contact.FIRST_NAME, card.getName(), null));
		contactFields.add(new ContactField(Contact.ADDRESS, getAddress(card), "office"));
	    }

	    // check stripe custom field
	    if (stripeFieldValue != null && !stripeFieldValue.isEmpty())
	    {

		contactFields.add(new ContactField(stripeFieldValue, customer.getId(), null));

	    }

	    contact.properties = contactFields;
	    contact.setContactOwner(prefs.getDomainUser());
	}

	return contact;
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

    /**
     * Stripe data retrieve Options
     * 
     * @return
     */
    private Map<String, Object> options()
    {
	HashMap<String, Object> options = new HashMap<String, Object>();
	options.put("limit", 100);
	options.put("starting_after", lastSyncCheckPoint);
	return options;
    }

}
