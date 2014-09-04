package com.agilecrm.subscription.stripe.webhooks;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.Globals;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.subscription.stripe.webhooks.impl.SubscriptionWebhookHandlerImpl;
import com.stripe.Stripe;
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
public class StripeWebhookServlet2 extends HttpServlet
{
    static
    {
	Stripe.apiKey = Globals.STRIPE_API_KEY;
	Stripe.apiVersion = "2012-09-24";
    }

    // Stripe events
    public static final String STRIPE_INVOICE_PAYMENT_FAILED = "invoice.payment_failed";
    public static final String STRIPE_SUBSCRIPTION_DELETED = "customer.subscription.deleted";
    public static final String STRIPE_CUSTOMER_DELETED = "customer.deleted";
    public static final String STRIPE_INVOICE_PAYMENT_SUCCEEDED = "invoice.payment_succeeded";
    public static final String STRIPE_CUSTOMER_SUBSCRIPTION_UPDATED = "customer.subscription.updated";
    public static final String STRIPE_CUSTOMER_SUBSCRIPTION_CREATED = "customer.subscription.created";
    public static final String STRIPE_CHARGE_REFUNDED = "charge.refunded";

    public void service(HttpServletRequest req, HttpServletResponse res) throws IOException
    {

	res.setContentType("text/plain;charset=UTF-8");

	String stripe_event_message = readData(req);

	// If event message is empty return
	if (stripe_event_message.isEmpty())
	    return;

	StripeWebhookHandlerUtil.getHandler(stripe_event_message).process();
    }
    
    private String readData(HttpServletRequest req)
    {
	ServletInputStream in;
	String stripe_event_message = "";
	try
	{
	    in = req.getInputStream();

	    BufferedReader reader = new BufferedReader(new InputStreamReader(in));

	    String line = "";

	    // Read the event object from request
	    while ((line = reader.readLine()) != null)
	    {
		stripe_event_message += (line);
	    }

	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return stripe_event_message;

    }
}


class StripeWebhookHandlerUtil
{

    public static StripeWebhookHandler getHandler(String eventResponse)
    {
	Event event = StripeUtil.getEventFromJSON(eventResponse);

	if (event == null)
	    return null;

	String event_name;

	event_name = event.getType();

	SubscriptionWebhookHandlerImpl handler = null;

	if (event_name.contains("subscription"))
	    handler = new SubscriptionWebhookHandlerImpl();

	handler.init(eventResponse, event);

	return handler;
    }
}
