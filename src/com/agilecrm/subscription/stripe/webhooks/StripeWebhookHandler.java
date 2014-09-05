package com.agilecrm.subscription.stripe.webhooks;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.subscription.stripe.webhooks.impl.SubscriptionWebhookHandlerImpl;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.Gson;
import com.stripe.exception.APIConnectionException;
import com.stripe.exception.APIException;
import com.stripe.exception.AuthenticationException;
import com.stripe.exception.CardException;
import com.stripe.exception.InvalidRequestException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;

public abstract class StripeWebhookHandler
{
    private Event event;
    private String event_rensponse_string;
    protected JSONObject eventJSON;
    private String domain;
    protected String eventType;
    protected Customer customer = null;
    protected Map<String, Object> plan;

    Contact contact;
    DomainUser user;

    public abstract void process();

    abstract public void updateOurDomainContact();

    protected Event getEvent()
    {
	return event;
    }

    protected DomainUser getUser()
    {
	if (user != null)
	    return user;

	

	System.out.println("fetching user from domain : " + getDomain());
	
	String domain = getDomain();
	if (StringUtils.isEmpty(domain))
	    return null;

	user = DomainUserUtil.getDomainOwner(domain);
	return user;
    }

    protected Contact getContactFromOurDomain()
    {
	if (contact != null)
	    return contact;

	String oldNamespace = NamespaceManager.get();
	try
	{
	    NamespaceManager.set("our");

	    if (contact == null)
	    {
		user = getUser();
		if (user == null)
		    return null;

		contact = ContactUtil.searchContactByEmail(getUser().email);
	    }

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	return contact;
    }

    protected Customer getCustomerFromStripe()
    {
	if (customer != null)
	    return customer;

	// If event type is not customer deleted the we get the customer id and
	// retieve the customer object from stripe and get
	// description(namespace/domain)
	String customerId = null;
	try
	{
	    customerId = eventJSON.getJSONObject("data").getJSONObject("object").getString("customer");
	    customer = Customer.retrieve(customerId, Globals.STRIPE_API_KEY);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (APIException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (AuthenticationException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (InvalidRequestException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (APIConnectionException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (CardException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return customer;
    }

    /**
     * This method process event based on type of event and return namespace
     * (domain) to which the webhook addresses
     * 
     * @param eventJSON
     *            {@link JSONObject}
     * @return {@link String}
     * @throws JSONException
     * @throws StripeException
     */
    protected String getDomain()
    {
	if (!StringUtils.isEmpty(domain))
	    return domain;

	StripeObject stripeObject = event.getData().getObject();

	// If type is customer deletion stripe return customer object which
	// contains description(which is set to namespace)
	if (eventType.equals(StripeWebhookServlet.STRIPE_CUSTOMER_DELETED))
	{
	    // Read description from event json
	    try
	    {
		domain = eventJSON.getJSONObject("data").getJSONObject("object").getString("description");
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	    return domain;
	}

	customer = getCustomerFromStripe();

	if (customer == null)
	    return null;

	// Description is set to namespace while saving
	domain = customer.getDescription();

	return domain;
    }

    protected void sendMail(String emailSubject, String template)
    {
	// Send mail to domain user
	SendMail.sendMail(user.email, emailSubject, template, getcustomDataForMail());
    }

    public void init(String event_response_string, Event event)
    {
	this.event_rensponse_string = event_response_string;
	eventJSON = new JSONObject(event);
	this.event = event;

	// Get event type from event json
	eventType = event.getType();
    }

    /**
     * Customize the event attributes set namespace and domain user name to use
     * in email template
     * 
     * @param event
     *            {@link Event}
     * @param user
     *            {@link DomainUser}
     * @return {@link Event}
     */
    public Event customizeEventAttributes(DomainUser user)
    {
	String namespace = NamespaceManager.get();

	// Get the attibutes from event object
	Map<String, Object> attributes = event.getData().getPreviousAttributes();

	// if (STRIPE_INVOICE_PAYMENT_SUCCEEDED.equals(event.getType()))
	// return event;

	if (attributes == null)
	    attributes = new HashMap<String, Object>();

	// Set custom attributes "namespace", "user_name"

	if (StringUtils.isEmpty(namespace))
	    return event;

	attributes.put("domain", namespace);
	attributes.put("user_name", user.name);
	attributes.put("email", user.email);

	// set back to event object
	event.getData().setPreviousAttributes(attributes);

	// Return customized event
	return event;
    }

    /**
     * Customizes the the content for email templates add customer details
     * related to the event and returns object array, with event object and
     * customer object
     * 
     * @param event
     * @return Object[]
     */
    public Object[] getcustomDataForMail()
    {

	// Gets StripeObject from the Event
	StripeObject stripeObject = event.getData().getObject();

	// Gets customer JSON string from customer object
	String stripeJSONString = new Gson().toJson(stripeObject);

	try
	{

	    // Retrieves Object customer object from stripe, based on customerId
	    customer = getCustomerFromStripe();
	    com.stripe.model.Subscription subscription = customer.getSubscription();

	    if (StripeWebhookServlet.STRIPE_INVOICE_PAYMENT_SUCCEEDED.equals(event.getType()))
	    {
		JSONObject stripeJSONJSON = new JSONObject(stripeJSONString);

		plan.put("price", Float.valueOf(stripeJSONJSON.getString("total")) / 100);
		plan.put("start_date", new Date(subscription.getCurrentPeriodStart() * 1000).toString());
		plan.put("end_date", new Date(subscription.getCurrentPeriodEnd() * 1000).toString());
		System.out.println(plan);
	    }
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	Object object[] = { event, getCustomerFromStripe(), getPlanDetails() };
	return object;
    }

    /**
     * Parses the current event object and fetches plan data
     */
    protected abstract Map<String, Object> getPlanDetails();
}
