/**
 * 
 */
package com.thirdparty.stripe;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.user.DomainUser;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.googlecode.objectify.Key;
import com.stripe.Stripe;
import com.stripe.exception.APIConnectionException;
import com.stripe.exception.APIException;
import com.stripe.exception.AuthenticationException;
import com.stripe.exception.CardException;
import com.stripe.exception.InvalidRequestException;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import com.stripe.model.CustomerCollection;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Type;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * This util contains Static method for importing all customers from Stripe api.
 * All customers will saved into agile contacts
 * 
 * @author jitendra
 * 
 */
public class StripeUtil
{

    public static final StripeAgileDataMapperService mapper = new StripeAgileDataMapperService();

    /**
     * This will do import all Customer from Stripe. It will check whether
     * Stripe widget is Configured or not if is configured then it will fetch
     * custom field value of widget and fill customer ID in that widget and auto
     * saved stripe customerID
     * 
     * @param prefs
     *            ContactPrefs
     * @param key
     *            Key<DomainUser> key
     */
    public static void importCustomers(ContactPrefs prefs, Key<DomainUser> key)
    {
	/**
	 * setting api version for Stripe
	 */
	Stripe.apiVersion = "2012-09-24";
	/**
	 * store last customer id to get next records from stripe if last
	 * customerID is null then it will fetch records from start of index
	 */
	String lastCustomerID = prefs.userName;

	try
	{
	    String stripeFieldValue = null;
	    Widget widget = WidgetUtil.getWidget("Stripe");
	    if (widget != null)
	    {
		JSONObject stripePref = new JSONObject(widget.prefs);
		if (stripePref.has("stripe_field_name"))
		    stripeFieldValue = stripePref.get("stripe_field_name").toString();
	    }

	    while (true)
	    {
		HashMap<String, Object> options = new HashMap<String, Object>();
		options.put("limit", 100);
		options.put("starting_after", lastCustomerID);
		CustomerCollection collections = Customer.all(options, prefs.token);
		List<Customer> customers = collections.getData();
		System.out.println(customers.size());
		for (Customer c : customers)
		{
		    Contact contact = mapper.createCustomerDataMap(c, stripeFieldValue);
		    contact.setContactOwner(key);
		    contact.save();
		}
		if (customers.size() == 0)
		    break;
		else
		{
		    Customer customer = customers.get(customers.size() - 1);

		    lastCustomerID = customer.getId();

		}

	    }
	    /**
	     * updating last sync check
	     */

	    updateLastestSync(prefs, lastCustomerID);

	}
	catch (AuthenticationException | InvalidRequestException | APIConnectionException | CardException
		| APIException | JSONException e)
	{
	    e.printStackTrace();
	}

    }

    /**
     * Update last sync prefs
     * 
     * @param pref
     * @param lastCustomerID
     */
    private static void updateLastestSync(ContactPrefs pref, String lastCustomerID)
    {
	pref.userName = lastCustomerID;
	pref.save();

    }

}
