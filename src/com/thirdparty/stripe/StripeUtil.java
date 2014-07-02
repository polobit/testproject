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
     * Test method used for local console testing
     * 
     * @param args
     */
    public static void main(String[] args)
    {
	// Stripe.apiKey = Globals.STRIPE_API_KEY;
	// Stripe.apiKey ="sk_live_kV3JFirLAOXsEUcYYO3YsCJ5";
	// Stripe.apiKey ="sk_test_2RbCiX2Bf2QoEdRhGqY8nttc";
	Stripe.apiVersion = "2012-09-24";
	Map<String, Object> option = new HashMap<String, Object>();
	option.put("limit", 100);
	// option.put("", arg1)
	try
	{
	    CustomerCollection list = Customer.all(option, "sk_live_kV3JFirLAOXsEUcYYO3YsCJ5");
	    List<Customer> customers = list.getData();
	    int i = 0;
	    for (Customer c : customers)
	    {
		System.out.println(i + " " + c.getId());
		i++;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    /**
     * This code will do import all Customer from Stripe. It will check whether
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
	Stripe.apiVersion = "2012-09-24";
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

	    HashMap<String, Object> options = new HashMap<String, Object>();
	    options.put("limit", 100);
	    CustomerCollection collections = Customer.all(options, prefs.apiKey);
	    List<Customer> customers = collections.getData();
	    for (Customer c : customers)
	    {
		Contact contact = mapper.createCustomerDataMap(c, stripeFieldValue);
		contact.setContactOwner(key);
		contact.save();
	    }

	}
	catch (AuthenticationException | InvalidRequestException | APIConnectionException | CardException
		| APIException | JSONException e)
	{
	    e.printStackTrace();
	}

    }

    /**
     * sync customer details into agile contact
     */
    public static void sync()
    {
	ContactPrefs pref = ContactPrefsUtil.getPrefsByType(Type.STRIPE);
	if (pref != null && pref.getDomainUser() != null)
	{
	    importCustomers(pref, pref.getDomainUser());
	}
    }

}
