package com.agilecrm.subscription.stripe.webhooks;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;

/**
 * The <code>StripeWebhookServlet</code> is to handle the webhooks sent by the
 * stripe and process them to perform necessary actions on it
 * 
 * @author Yaswanth
 * 
 * @since November 2012
 * 
 */

@SuppressWarnings("serial")
public class StripeWebhookServlet extends HttpServlet
{
    static
    {
	Stripe.apiKey = Globals.STRIPE_API_KEY;
	Stripe.apiVersion = "2012-09-24";
    }

    public void service(HttpServletRequest req, HttpServletResponse res) throws IOException
    {
	res.setContentType("text/plain;charset=UTF-8");

	ServletInputStream in = req.getInputStream();

	BufferedReader reader = new BufferedReader(new InputStreamReader(in));

	String stripe_event_message = "";
	String line = "";

	// Read the event object from request
	while ((line = reader.readLine()) != null)
	{
	    stripe_event_message += (line);
	}

	// If event message is empty return
	if (stripe_event_message.isEmpty())
	    return;

	// Get current Namespace and store it can be set back finally after
	// required processing
	String oldNamespace = NamespaceManager.get();

	try
	{
	    // Convert event jsonstring to JSONObject
	    JSONObject eventJSON = new JSONObject(stripe_event_message);

	    String newNamespace;
	    try
	    {
		// Get Namespace from event
		newNamespace = getNamespaceFromEvent(eventJSON);
	    }
	    catch (StripeException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
		return;
	    }

	    System.out.println("Namespace for event : " + newNamespace);

	    System.out.println("Type of event : " + eventJSON.getString("type"));

	    System.out.println("event json  :" + eventJSON);

	    if (StringUtils.isEmpty(newNamespace))
		return;

	    // Set namespace to do queries on subscription object
	    NamespaceManager.set(newNamespace);

	    // Get event id from event json
	    String eventId = eventJSON.getString("id");

	    Event event;

	    Stripe.apiKey = Globals.STRIPE_API_KEY;
	    Stripe.apiVersion = "2012-09-24";

	    // Get event from stripe based on stripe event id
	    event = Event.retrieve(eventId, Globals.STRIPE_API_KEY);
	    System.out.println("even : " + event);
	    /**
	     * PAYMENT SUCCEEDED
	     * 
	     * If payment is done set subscription flag to success
	     */
	    if (eventJSON.getString("type").equals(Globals.STRIPE_INVOICE_PAYMENT_SUCCEEDED))
	    {
		setSubscriptionFlag(Subscription.BillingStatus.BILLING_SUCCESS);

		// Get domain owner
		DomainUser user = DomainUserUtil.getDomainOwner(newNamespace);

		// Checks whether owner of the domain is not null, if not null
		// payment received mail to the domain user
		if (user == null)
		    return;

		// Set Extra fields to attributes to be used in the template
		customizeEventAttributes(event, user);

		SendMail.sendMail(user.email, SendMail.FIRST_PAYMENT_RECEIVED_SUBJECT, SendMail.FIRST_PAYMENT_RECEIVED,
			event);
	    }

	    /**
	     * PAYMENT FAILED
	     * 
	     * If payment failed set subscription flag is set to failed and
	     * mails sent to respective domain users
	     */
	    else if (eventJSON.getString("type").equals(Globals.STRIPE_INVOICE_PAYMENT_FAILED))
	    {
		// Get number of attempts
		String attempCount = eventJSON.getJSONObject("data").getJSONObject("object").getString("attempt_count");

		Integer number_of_attempts = Integer.parseInt(attempCount);

		// Process webhook
		ProcessPaymentFailedWebhooks(number_of_attempts, event);

	    }

	    /**
	     * CUSTOMER DELETED
	     * 
	     * If Customer is deleted from stripe then delete subscription
	     * Entity and send an email to domain owner
	     */
	    else if (eventJSON.getString("type").equals(Globals.STRIPE_CUSTOMER_DELETED))
	    {
		// Get domain owner
		DomainUser user = DomainUserUtil.getDomainOwner(newNamespace);

		System.out.println("email should be sent to domain user : " + user);

		event = customizeEventAttributes(event, user);

		// Delete account
		Subscription.getSubscription().delete();

		// Send mail to domain user
		SendMail.sendMail(user.email, SendMail.SUBSCRIPTION_DELETED_SUBJECT, SendMail.SUBSCRIPTION_DELETED,
			event);

	    }

	    /**
	     * SUBSCRIPTION DELETED
	     * 
	     * If subscription is deleted from stripe then set the status the
	     * set subscription status flag to subscription deleted
	     */
	    else if (eventJSON.getString("type").equals(Globals.STRIPE_SUBSCRIPTION_DELETED))
	    {

		// Get domain owner
		DomainUser user = DomainUserUtil.getDomainOwner(newNamespace);

		// If user is null return
		if (user == null)
		    return;

		event = customizeEventAttributes(event, user);

		// Send mail to domain user
		SendMail.sendMail(user.email, SendMail.FAILED_BILLINGS_FINAL_TIME_SUBJECT,
			SendMail.FAILED_BILLINGS_FINAL_TIME, getcustomDataForMail(event));

		Subscription subscription = Subscription.getSubscription();
		System.out.println(subscription);
		subscription.delete();

		// Set flag to SUBSCRIPTION_DELETED
		setSubscriptionFlag(Subscription.BillingStatus.SUBSCRIPTION_DELETED);
	    }

	    /**
	     * CHARGE REFUNDED
	     * 
	     * Sends mail to domain owner regarding charge refund
	     */
	    else if (eventJSON.getString("type").equals(Globals.STRIPE_CHARGE_REFUNDED))
	    {
		DomainUser user = DomainUserUtil.getDomainOwner(newNamespace);

		if (user == null)
		    return;

		// Send mail to domain user
		SendMail.sendMail(user.email, SendMail.REFUND_SUBJECT, SendMail.REFUND, getcustomDataForMail(event));
	    }

	    /**
	     * SUBSCRIPTION UPDATED (PLAN CHANGED)
	     * 
	     * Sends mail to domain owner, when subscription is updated
	     */
	    else if (eventJSON.getString("type").equals(Globals.STRIPE_CUSTOMER_SUBSCRIPTION_UPDATED))
	    {
		DomainUser user = DomainUserUtil.getDomainOwner(newNamespace);

		if (user == null)
		    return;

		customizeEventAttributes(event, user);

		// Send mail to domain user
		SendMail.sendMail(user.email, SendMail.PLAN_CHANGED_SUBJECT, SendMail.PLAN_CHANGED,
			getcustomDataForMail(event));
	    }
	}

	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	finally
	{
	    // Set back the old namespace
	    NamespaceManager.set(oldNamespace);
	}
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
    public String getNamespaceFromEvent(JSONObject eventJSON) throws JSONException, StripeException
    {
	// Get event type from event json
	String eventType = eventJSON.getString("type");

	// If type is customer deletion stripe return customer object which
	// contains description(which is set to namespace)
	if (eventType.equals(Globals.STRIPE_CUSTOMER_DELETED))
	{
	    // Read description from event json
	    String namespace = eventJSON.getJSONObject("data").getJSONObject("object").getString("description");

	    return namespace;
	}

	// If event type is not customer deleted the we get the customer id and
	// retieve the customer object from stripe and get
	// description(namespace/domain)
	String customerId = eventJSON.getJSONObject("data").getJSONObject("object").getString("customer");

	Customer customer = Customer.retrieve(customerId, Globals.STRIPE_API_KEY);

	// Description is set to namespace while saving
	String namespace = customer.getDescription();

	return namespace;
    }

    /**
     * Process the payment failed webhookss calls to set subscription flags,
     * sends email
     * 
     * @param attemptCount
     *            Number of payment attempts
     * @param event
     *            {@link Event}
     * 
     */
    public void ProcessPaymentFailedWebhooks(int attemptCount, Event event)
    {
	String namespace = NamespaceManager.get();

	// If number of attemps to payment is 0 or 1 the send email to domain
	// owner
	if (attemptCount == 0 || attemptCount == 1)
	{
	    // Set subscription flag billing failed
	    Subscription.BillingStatus flag = (attemptCount == 0) ? Subscription.BillingStatus.BILLING_FAILED_0
		    : Subscription.BillingStatus.BILLING_FAILED_1;

	    setSubscriptionFlag(flag);

	    // Get owner of the domain
	    DomainUser user = DomainUserUtil.getDomainOwner(namespace);

	    // If user is not found send email to AgileCrm help about the stripe
	    // event
	    if (user == null)
	    {

	    }

	    // Call customize attributes based on namespace and user
	    event = customizeEventAttributes(event, user);

	    SendMail.sendMail(user.email, SendMail.FAILED_BILLINGS_FIRST_TIME_SUBJECT,
		    SendMail.FAILED_BILLINGS_FIRST_TIME, getcustomDataForMail(event));

	}

	// If number of attempts for payment are more than 1 then send email to
	// all the domain users in domain
	if (attemptCount == 2)
	{
	    setSubscriptionFlag(Subscription.BillingStatus.BILLING_FAILED_2);

	    // Get all domain users in the namespace
	    List<DomainUser> users = DomainUserUtil.getUsers(namespace);

	    // Send email to AgileCrm help
	    if (users.size() == 0)
	    {

	    }

	    // Send mail to all domain users
	    for (DomainUser user : users)
	    {
		event = customizeEventAttributes(event, user);

		SendMail.sendMail(user.email, SendMail.FAILED_BILLINGS_SECOND_TIME_SUBJECT,
			SendMail.FAILED_BILLINGS_SECOND_TIME, getcustomDataForMail(event));
	    }
	}

    }

    /**
     * Sets status of subscription whether billing failed of succeeded
     * 
     * @param status
     *            {@link Subscription.Type}
     */
    public void setSubscriptionFlag(Subscription.BillingStatus status)
    {
	// Set status and save subscription
	Subscription subscription = Subscription.getSubscription();
	subscription.status = status;
	subscription.save();
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
    public Event customizeEventAttributes(Event event, DomainUser user)
    {
	String namespace = NamespaceManager.get();

	System.out.println(event.getData().getObject().toString());

	// Get the attibutes from event object
	Map<String, Object> attributes = new HashMap<String, Object>();

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
    public Object[] getcustomDataForMail(Event event)
    {
	Customer customer = null;

	// Gets StripeObject from the Event
	StripeObject stripeObject = event.getData().getObject();

	// Gets customer JSON string from customer object
	String stripeJSONString = new Gson().toJson(stripeObject);

	try
	{

	    // Gets customerId from StripeObject json
	    String customerId = new JSONObject(stripeJSONString).getString("customer");

	    // Retrieves Object customer object from stripe, based on customerId
	    customer = Customer.retrieve(customerId, Globals.STRIPE_API_KEY);

	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	Object object[] = { event, customer };
	return object;
    }
}
