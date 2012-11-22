package com.agilecrm.subscription.stripe.webhooks;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
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
import com.agilecrm.core.DomainUser;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.util.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;

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

	// Get current namespace and store it can be set back finally after
	// required opetaions
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

	    if (StringUtils.isEmpty(newNamespace))
		return;

	    // Set namespace to do queries on subscription object
	    NamespaceManager.set(newNamespace);

	    // Get event id from event json
	    String eventId = eventJSON.getString("id");

	    Event event;

	    // Get event from stripe based on stripe event id
	    event = Event.retrieve(eventId, Globals.STRIPE_API_KEY);

	    // If payment is done set subscription flag to success
	    if (eventJSON.getString("type").equals(Globals.STRIPE_INVOICE_PAYMENT_SUCCEEDED))
	    {
		setSubscriptionFlag(Subscription.Type.BILLING_SUCCESS);
	    }

	    // If payment failed set subscription flag is set to failed and
	    // mails sent to respective domain users
	    if (eventJSON.getString("type").equals(Globals.STRIPE_INVOICE_PAYMENT_FAILED))
	    {
		// Get number of attempts
		String attempCount = eventJSON.getJSONObject("data").getJSONObject("object")
			.getString("attempt_count");

		Integer number_of_attempts = Integer.parseInt(attempCount);

		// Process webhook
		ProcessPaymentFailedWebhooks(number_of_attempts, event);

	    }
	    else if (eventJSON.getString("type").equals(Globals.STRIPE_CUSTOMER_DELETED))
	    {
		// Get domain owner
		DomainUser user = DomainUser.getDomainOwner(newNamespace);

		event = customizeEventAttributes(event, user);

		// Send mail to domain user
		SendMail.sendMail(user.email, SendMail.SUBSCRIPTION_DELETED,
			SendMail.SUBSCRIPTION_DELETED_SUBJECT, event);

		// Delete account
		Subscription.getSubscription().delete();
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
	    String namespace = eventJSON.getJSONObject("data").getJSONObject("object")
		    .getString("description");

	    return namespace;
	}

	// If event type is not customer deleted the we get the customer id and
	// retieve the customer object from stripe and get
	// description(namespace/domain)
	String customerId = eventJSON.getJSONObject("data").getJSONObject("object")
		.getString("customer");

	Customer customer = Customer.retrieve(customerId);

	// Description is set to namespace while saving
	String namespace = customer.getDescription();

	return namespace;
    }

    /**
     * Process the payment failed webhooks calls to set subscription flags,
     * sends emails
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

	// Set subscription flag billing failed
	setSubscriptionFlag(Subscription.Type.BILLING_FAILED);

	// If number of attemps to payment is 0 or 1 the send email to domain
	// owner
	if (attemptCount == 0 || attemptCount == 1)
	{
	    // Get owner of the domain
	    DomainUser user = DomainUser.getDomainOwner(namespace);

	    // If user is not found send email to AgileCrm help about the stripe
	    // event
	    if (user == null)
	    {

	    }

	    // Call customize attributes based on namespace and user
	    event = customizeEventAttributes(event, user);

	    SendMail.sendMail(user.email, SendMail.SUBSCRIPTION_PAYMENT_FAILED_SUBJECT,
		    SendMail.SUBSCRIPTION_PAYMENT_FAILED, event);

	}

	// If number of attempts for payment are more than 1 then send email to
	// all the domain users in domain
	if (attemptCount == 2)
	{
	    // Get all domain users in the namespace
	    List<DomainUser> users = DomainUser.getUsers(namespace);

	    // Send email to AgileCrm help
	    if (users.size() == 0)
	    {

	    }

	    // Send mail to all domain users
	    for (DomainUser user : users)
	    {
		event = customizeEventAttributes(event, user);

		SendMail.sendMail(user.email, SendMail.SUBSCRIPTION_PAYMENT_FAILED_SUBJECT,
			SendMail.SUBSCRIPTION_PAYMENT_FAILED, event);
	    }

	}

    }

    /**
     * Sets status of subscription whether billing failed of succeeded
     * 
     * @param status
     *            {@link Subscription.Type}
     */
    public void setSubscriptionFlag(Subscription.Type status)
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

	// Get the attibutes from event object
	Map<String, Object> attributes = event.getData().getPreviousAttributes();

	// Set custom attributes "namespace", "user_name"
	attributes.put("domain", namespace);
	attributes.put("user_name", user.name);

	// set back to event object
	event.getData().setPreviousAttributes(attributes);

	// Return customized event
	return event;
    }
}
