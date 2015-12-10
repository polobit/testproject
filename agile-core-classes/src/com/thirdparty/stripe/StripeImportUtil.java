/**
 * 
 */
package com.thirdparty.stripe;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.sync.ImportStatus;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.googlecode.objectify.Key;
import com.stripe.Stripe;
import com.stripe.exception.APIConnectionException;
import com.stripe.exception.APIException;
import com.stripe.exception.AuthenticationException;
import com.stripe.exception.CardException;
import com.stripe.exception.InvalidRequestException;
import com.stripe.model.Customer;
import com.stripe.model.CustomerCollection;
import com.thirdparty.google.ContactPrefs;

/**
 * <code>StripeUtil</code> contains Static method for importing all customers
 * from Stripe api. All customers will saved into agile contacts
 * 
 * @author jitendra
 * 
 */
public class StripeImportUtil
{

    // initialize StripeDataMapperService
    private static final StripeAgileDataMapperService mapper = new StripeAgileDataMapperService();

    // Max fetch records limit
    private static final int MAX_LIMIT = 1000;

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
	 * api version for Stripe
	 */
	Stripe.apiVersion = "2012-09-24";
	/**
	 * store last customer id to get next records from stripe if last
	 * customerID is null then it will fetch records from start of index
	 */
	// String lastCustomerID = prefs.userName;

	// initialize total saved contact
	int savedContacts = 0;
	// count total contact found from Stripe
	int total = 0;
	// total duplicate contact
	int duplicatedContacts = 0;

	Map<ImportStatus, Integer> status = new HashMap<ImportStatus, Integer>();
	// retrieve domain user
	DomainUser domainUser = DomainUserUtil.getDomainUser(key.getId());
	try
	{
	    String stripeFieldValue = null;
	    // check stripe widget is configure or not if configure then
	    // retrieve custom field which is configured for stripe widget
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
		options.put("starting_after", null);
		CustomerCollection collections = Customer.all(options);
		List<Customer> customers = collections.getData();
		total += customers.size();
		for (Customer c : customers)
		{
		    Contact contact = mapper.createCustomerDataMap(c, stripeFieldValue);
		    contact.setContactOwner(key);
		    contact.save();
		    if (ContactUtil.isDuplicateContact(contact))
			duplicatedContacts++;
		    else
			savedContacts++;
		}
		if (customers.size() == 0)
		    break;
		else
		{
		    Customer customer = customers.get(customers.size() - 1);

		    // lastCustomerID = customer.getId();

		}

		if (total >= MAX_LIMIT)
		    break;

	    }
	    /**
	     * update last sync check
	     */

	    // updateLastestSync(prefs, lastCustomerID);

	    buildStripeImportStatus(status, ImportStatus.TOTAL, total);
	    buildStripeImportStatus(status, ImportStatus.NEW_CONTACTS, savedContacts);
	    buildStripeImportStatus(status, ImportStatus.DUPLICATE_CONTACT, duplicatedContacts);

	    // send email notification to domain user
	    SendMail.sendMail(domainUser.email, SendMail.STRIPE_IMPORT_NOTIFICATION_SUBJECT,
		    SendMail.STRIPE_IMPORT_NOTIFICATION, new Object[] { domainUser, status });

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
	// pref.userName = lastCustomerID;
	pref.save();

    }

    /**
     * building import status for send email notification about import status
     * and total success or fail
     * 
     * @param map
     *            {@link java.util.Map}
     * @param status
     *            {@link ImportStatus }
     * @param total
     *            integer value of total record
     */
    private static void buildStripeImportStatus(Map<ImportStatus, Integer> statusMap, ImportStatus status, int total)
    {
	if (statusMap.containsKey(status))
	{
	    statusMap.put(status, statusMap.get(status) + total);
	    statusMap.get(status);
	    return;
	}

	statusMap.put(status, total);

    }

}
