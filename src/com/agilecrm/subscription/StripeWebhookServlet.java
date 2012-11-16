package com.agilecrm.subscription;

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
import com.agilecrm.util.SendMail;
import com.agilecrm.util.Util;
import com.google.appengine.api.NamespaceManager;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;

public class StripeWebhookServlet extends HttpServlet
{

    public void service(HttpServletRequest req, HttpServletResponse res)
	    throws IOException
    {
	res.setContentType("text/plain;charset=UTF-8");

	ServletInputStream in = req.getInputStream();

	BufferedReader reader = new BufferedReader(new InputStreamReader(in));

	String stripe_event_message = "";
	String line = "";
	while ((line = reader.readLine()) != null)
	{
	    stripe_event_message += (line);
	}

	// If event message is empty return
	if (stripe_event_message.isEmpty())
	    return;

	String oldNamespace = NamespaceManager.get();

	try
	{
	    JSONObject eventJSON = new JSONObject(stripe_event_message);

	    String newNamespace;
	    try
	    {
		newNamespace = getNamespaceFromEvent(eventJSON);
	    }
	    catch (StripeException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
		return;
	    }

	    if (StringUtils.isEmpty(newNamespace))
		return;

	    // Set namespace
	    NamespaceManager.set(newNamespace);

	    String eventId = eventJSON.getString("id");

	    Event event;

	    event = Event.retrieve(eventId, Globals.STRIPE_API_KEY);

	    // If payment is done set subscription flag to success
	    if (eventJSON.getString("type").equals(
		    Globals.STRIPE_INVOICE_PAYMENT_SUCCEEDED))
	    {
		setSubscriptionFlag(Subscription.Type.BILLING_SUCCESS);
	    }

	    // If payment failed set subscription flag is set to failed and
	    // mails sent to respective domain users
	    if (eventJSON.getString("type").equals(
		    Globals.STRIPE_INVOICE_PAYMENT_FAILED))
	    {
		// Get number of attempts
		String attempCount = eventJSON.getJSONObject("data")
			.getJSONObject("object").getString("attempt_count");

		Integer number_of_attempts = Integer.parseInt(attempCount);

		// Process webhook
		ProcessPaymentFailedWebhooks(number_of_attempts, event);

	    }
	    else if (eventJSON.getString("type").equals(
		    Globals.STRIPE_SUBSCRIPTION_DELETED))
	    {
		Util.sendMail("praveen@invox.com", "yaswanth",
			DomainUser.getDomainOwner(newNamespace).email,
			"subscription Deleted", "praveen@invox.com",
			"your subscription deleted", null);

		Subscription.getSubscription().delete();

	    }

	    else if (eventJSON.getString("type").equals(
		    Globals.STRIPE_CUSTOMER_DELETED))
	    {
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

    /* Get namespace from the webhook event to notify the users */
    public String getNamespaceFromEvent(JSONObject eventJSON)
	    throws JSONException, StripeException
    {
	String eventType = eventJSON.getString("type");

	if (eventType.equals(Globals.STRIPE_CUSTOMER_DELETED))
	{
	    String namespace = eventJSON.getJSONObject("data")
		    .getJSONObject("object").getString("description");

	    if (StringUtils.isEmpty(namespace))
		return null;

	    return namespace;
	}

	String customerId = eventJSON.getJSONObject("data")
		.getJSONObject("object").getString("customer");

	Customer customer = Customer.retrieve(customerId);

	// Description is set to namespace while saving
	String namespace = customer.getDescription();

	return namespace;
    }

    /*
     * Process the payment failed webhooks calls to set subscription flags,
     * sends emails
     */
    public void ProcessPaymentFailedWebhooks(int attempt_count, Event event)
    {
	String namespace = NamespaceManager.get();

	// Set subscription flag billing failed
	setSubscriptionFlag(Subscription.Type.BILLING_FAILED);

	// If number of attemps to payment is 0 or 1 the send email to domain
	// owner
	if (attempt_count == 0 || attempt_count == 1)
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

	    SendMail.sendMail(user.email,
		    SendMail.SUBSCRIPTION_PAYMENT_FAILED_SUBJECT,
		    SendMail.SUBSCRIPTION_PAYMENT_FAILED, event);

	}

	// If number of attempts for payment are more than 1 then send email to
	// all the domain users in domain
	if (attempt_count == 2)
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

		SendMail.sendMail(user.email,
			SendMail.SUBSCRIPTION_PAYMENT_FAILED_SUBJECT,
			SendMail.SUBSCRIPTION_PAYMENT_FAILED, event);
	    }

	}

    }

    /* Sets status of subscription whether billing failed of succeeded */
    public void setSubscriptionFlag(Subscription.Type status)
    {
	// Set status
	Subscription subscription = Subscription.getSubscription();
	subscription.status = status;
	subscription.save();

    }

    /*
     * Customize the event attributes set namespace and domain user name to use
     * in email template
     */
    public Event customizeEventAttributes(Event event, DomainUser user)
    {
	String namespace = NamespaceManager.get();

	// Get the attibutes from event object
	Map<String, Object> attributes = event.getData()
		.getPreviousAttributes();

	// Set custom attributes "namespace", "user_name"
	attributes.put("domain", namespace);

	attributes.put("user_name", user.name);

	event.getData().setPreviousAttributes(attributes);

	// Return customized event
	return event;
    }
}
