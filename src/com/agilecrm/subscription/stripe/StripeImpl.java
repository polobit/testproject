package com.agilecrm.subscription.stripe;

import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.subscription.AgileBilling;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookServlet;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.APIConnectionException;
import com.stripe.exception.APIException;
import com.stripe.exception.AuthenticationException;
import com.stripe.exception.CardException;
import com.stripe.exception.InvalidRequestException;
import com.stripe.exception.StripeException;
import com.stripe.model.Coupon;
import com.stripe.model.Customer;
import com.stripe.model.CustomerSubscriptionCollection;
import com.stripe.model.Invoice;

/**
 * <code>StringImpl</code> is implementation {@link AgileBilling}, This
 * implementation provides all billing features specified in
 * {@link AgileBilling} interface.
 * <p>
 * This class contains an API key(key provided by stripe for each account) to
 * establish connections to stripe gateway
 * </P>
 * It includes methods for creating, deleting, updating(plan, customer, credit
 * card) of a customer, canceling customer's subscription, these methods allow
 * to make transactions with stripe account related to the API Key(specified in
 * {@link Globals})
 * 
 * 
 * This class is can be used when billing operations are to be done through
 * stripe. Currently used from {@link Subscription} to perform billing
 * operations
 * 
 * @author Yaswanth
 * 
 * @since November 2012
 * @see com.agilecrm.subscription.AgileBilling
 * @see com.agilecrm.subscription.Subscription
 * @see com.agilecrm.subscription.stripe.StripeUtil
 */
public class StripeImpl implements AgileBilling
{

    static
    {
	Stripe.apiKey = Globals.STRIPE_API_KEY;
	Stripe.apiVersion = "2012-09-24";
    }

    /**
     * Creates customer in Stripe, adds subscription to the customer to
     * according to plan chosen and processes the payment.
     * <p>
     * If {@link Customer} can not be created due to invalid parameters(credit
     * card number, cvc, card expiry date), then stripe raises an exception
     * which is propagated to methods down the stack, so user can be notified
     * about the payment failure
     * </p>
     * 
     * @param cardDetails
     *            {@link CreditCard}
     * @param plan
     *            {@link Plan}
     * 
     * @return {@link Customer} as {@link JSONObject}
     * 
     * @throws Exception
     * 
     * 
     */
    public JSONObject createCustomer(CreditCard cardDetails, Plan plan) throws Exception
    {

	// Creates customer and add subscription to it
	Customer customer = Customer.create(StripeUtil.getCustomerParams(cardDetails, plan));

	plan.subscription_id = customer.getSubscription().getId();

	System.out.println(customer);
	System.out.println(StripeUtil.getJSONFromCustomer(customer));
	// Return Customer JSON
	return StripeUtil.getJSONFromCustomer(customer);

    }

    @Override
    public JSONObject createCustomer(CreditCard cardDetails) throws Exception
    {
	// TODO Auto-generated method stub
	// Creates customer and add subscription to it
	Customer customer = Customer.create(StripeUtil.getCustomerParams(cardDetails));

	return StripeUtil.getJSONFromCustomer(customer);
    }

    /**
     * Updates the plan of the customer based on the customer(on which customer
     * update needs to be done) and plan object parameters.
     * <p>
     * Plan upgrade in Stripe is pro-rated
     * </p>
     * 
     * @param stripeCustomer
     *            {@link Customer}, as {@link JSONObject},
     * 
     * @return {@link Customer} as {@link JSONObject}
     * @throws Exception
     *             if
     */
    public JSONObject updatePlan(JSONObject stripeCustomer, Plan plan) throws Exception
    {

	// Gets Customer Object to update its plan
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	// Sets plan changes in a map
	Map<String, Object> updateParams = new HashMap<String, Object>();
	updateParams.put("plan", plan.plan_id);
	updateParams.put("quantity", plan.quantity);

	if (!StringUtils.isEmpty(plan.coupon))
	    updateParams.put("coupon", plan.coupon);
	System.out.println(updateParams);

	updateParams.put("prorate", false);

	CustomerSubscriptionCollection subscriptionCollection = customer.getSubscriptions();
	List<com.stripe.model.Subscription> subscriptionList = subscriptionCollection.getData();

	// Fetches all subscriptions and check if there is an account plan
	Iterator<com.stripe.model.Subscription> iterator = subscriptionList.iterator();
	com.stripe.model.Subscription oldSubscription = null;
	while (iterator.hasNext())
	{
	    com.stripe.model.Subscription s = iterator.next();
	    com.stripe.model.Plan p = s.getPlan();
	    if (!StringUtils.containsIgnoreCase(p.getId(), "email"))
	    {
		oldSubscription = s;
		break;
	    }
	}

	com.stripe.model.Plan oldPlan = (oldSubscription == null) ? null : oldSubscription.getPlan();
	com.stripe.model.Plan newPlan = com.stripe.model.Plan.retrieve(plan.plan_id);

	// Add prorate based on upgrade/downgrade
	if (oldPlan == null
		|| (newPlan.getAmount() * plan.quantity) > (oldPlan.getAmount() * oldSubscription.getQuantity()))
	{
	    updateParams.put("prorate", "true");

	}

	// Updates customer with changed plan
	if (oldSubscription != null)
	{
	    oldSubscription.update(updateParams);
	}
	else
	{
	    customer.createSubscription(updateParams);

	    // Returns Customer object as JSONObject
	    return StripeUtil.getJSONFromCustomer(customer);
	}

	// Create the invoice and pay immediately
	if (updateParams.get("prorate").equals("true"))
	{
	    Map<String, Object> invoiceItemParams = new HashMap<String, Object>();
	    invoiceItemParams.put("customer", customer.getId());
	    try
	    {
		Invoice invoice = Invoice.create(invoiceItemParams);
		if (invoice != null)
		    invoice.pay();
	    }
	    catch (Exception e)
	    {
	    }
	}

	// Returns Customer object as JSONObject
	return StripeUtil.getJSONFromCustomer(customer);
    }

    /**
     * Updates customer credit card details in Stripe. If an exception raised
     * while updating a customer then it is propagated back the show failure
     * message to user
     * 
     * @param stripeCustomer
     *            , {@link Customer} , cardDetails {@link CreditCard}
     * 
     * @return {@link Customer} as {@link JSONObject}
     * 
     * @throws Exception
     * */
    public JSONObject updateCreditCard(JSONObject stripeCustomer, CreditCard cardDetails) throws Exception
    {

	/*
	 * Gets Customer retrieves from stripe based on customer id, to update
	 * credit card
	 */
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	Map<String, Object> updateParams = new HashMap<String, Object>();

	/*
	 * Gets Map of card parameters to be sent to stripe, to update customer
	 * card details in stripe
	 */
	Map<String, Object> cardParams = StripeUtil.getCardParams(cardDetails);

	/*
	 * Adds changed credit card details to map, which is sent to Stripe as
	 * to update card details
	 */
	updateParams.put("card", cardParams);

	// Updates customer with changed card details
	customer = customer.update(updateParams);

	return StripeUtil.getJSONFromCustomer(customer);
    }

    /**
     * Gets List of invoices of particular customer(passed as parameter)
     * 
     * @param stripeCustomer
     *            {@link Customer} as JSONObject {@link JSONObject}
     * 
     * @return {@link List} of {@link Invoice}
     * 
     * @throws StripeException
     * */
    public List<Invoice> getInvoices(JSONObject stripeCustomer) throws StripeException
    {
	Map<String, Object> invoiceParams = new HashMap<String, Object>();

	// Sets invoice parameters (Stripe customer id is required to get
	// invoices of a customer form stripe)
	invoiceParams.put("customer", StripeUtil.getCustomerFromJson(stripeCustomer).getId());
	/*
	 * Fetches all invoices for given stripe customer id and returns
	 * invoices
	 */
	return Invoice.all(invoiceParams).getData();
    }

    /**
     * Pay pending invoices immediately
     * 
     * @param oldCustomer
     * @param userId
     */
    private void payPendingInvoices(JSONObject stripeCustomer)
    {
	try
	{
	    /*
	     * Gets Customer retrieves from stripe based on customer id, to
	     * update credit card
	     */
	    Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	    // Bill any invoices pending
	    List<Invoice> invoices = getInvoices(stripeCustomer);

	    Iterator iterator = invoices.iterator();

	    while (iterator.hasNext())
	    {
		Invoice invoice = (Invoice) iterator.next();
		if (!invoice.getPaid())
		    invoice.pay();
	    }
	}
	catch (Exception e)
	{
	}

    }

    /**
     * Deletes customer from Stripe, which raises an webhook to
     * {@link StripeWebhookServlet}, on processing webhook it deletes
     * {@link Subscription} object
     * 
     * @param stripeCustomer
     *            {@link Customer} as {@link JSONObject}
     * 
     * @throws Exception
     */
    public void deleteCustomer(JSONObject stripeCustomer) throws Exception
    {
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	/*
	 * Deletes customer from stripe, this operation in stripe raises a
	 * webhook gets handled and deletes subscription object of the domain
	 */
	customer.delete();
    }

    /**
     * Cancels customer subscription in Stripe
     * 
     * @param stripeCustomer
     *            {@link Customer} as {@link JSONObject}
     * 
     * @throws Exception
     */
    public void cancelSubscription(JSONObject stripeCustomer) throws Exception
    {
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	// Cancels subscription in stripe
	customer.cancelSubscription();
    }

    public static JSONObject getCoupon(String couponId) throws Exception
    {

	try
	{
	    // Retrieve coupon from Stripe
	    Coupon coupon = Coupon.retrieve(couponId);

	    // Convert to JSON
	    return new JSONObject(new Gson().toJson(coupon));

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return new JSONObject();
    }

    @Override
    public JSONObject addSubscriptionAddon(Plan newPlan) throws Exception
    {
	// Fetches current subscription of domain to check if add on
	// subscription already exists and it is update request
	Subscription subscription = SubscriptionUtil.getSubscription();

	// New email plan to subscribe user to
	String plan_id = SubscriptionUtil.getEmailPlan(newPlan.quantity);
	
	newPlan.plan_id = plan_id;

	// Existing email plan in agile subscription object
	Plan emailPlanInAgile = subscription.emailPlan;

	// Fetches subscription from customer object in stripe
	Customer customer = StripeUtil.getCustomerFromJson(new JSONObject(subscription.billing_data_json_string));

	// If there exists email plan, then it is updated instead of creating
	// new subscription
	try
	{

	    /**
	     * Retrieves all subscriptions from customer object. It is used to
	     * find out the existing subscription object based on the
	     * subscription id that is saved in embedded Plan object (which is
	     * saved when ever a new subscription is created) <a>
	     */
	    CustomerSubscriptionCollection subscriptionCollection = customer.getSubscriptions();
	    List<com.stripe.model.Subscription> subscriptionList = subscriptionCollection.getData();

	    // To hold current email package plan object from stripe
	    com.stripe.model.Plan existingAddonPlan = null;
	    com.stripe.model.Subscription existingSubscription = null;

	    Iterator<com.stripe.model.Subscription> subscriptionIterator = subscriptionList.iterator();

	    if (emailPlanInAgile != null)
		// Iterates through all plans and get existing email plan
		while (subscriptionIterator.hasNext())
		{
		    com.stripe.model.Subscription s = subscriptionIterator.next();
		    com.stripe.model.Plan stripePlan = s.getPlan();

		    // If plan contains email, it holds exiting plan to update
		    if (StringUtils.equals(s.getId(), emailPlanInAgile.subscription_id))
		    {
			existingSubscription = s;
			existingAddonPlan = stripePlan;
			break;
		    }
		}

	    Map<String, Object> newSubscriptionParams = new HashMap<String, Object>();
	    newSubscriptionParams.put("plan", newPlan.plan_id);
	    newSubscriptionParams.put("quantity", newPlan.quantity);
	    newSubscriptionParams.put("prorate", true);
	    newPlan.count = null;
	    // If there is no existing subscription that falls under current
	    // Category it is considered as new plan subscription
	    if (existingAddonPlan == null)
	    {
		existingSubscription = customer.createSubscription(newSubscriptionParams);
	    }
	    else
	    {
		// Updates existing
		com.stripe.model.Subscription x = existingSubscription.update(newSubscriptionParams);
		System.out.println(x);
	    }

	    newPlan.subscription_id = existingSubscription.getId();
	    
	    Map<String, Object> invoiceItemParams = new HashMap<String, Object>();
	    invoiceItemParams.put("customer", customer.getId());
	    invoiceItemParams.put("subscription", existingSubscription.getId());
	    
	    try
	    {
		// Creates invoice for plan upgrade and charges customer
		// immediately
		Invoice invoice = Invoice.create(invoiceItemParams);
		if (invoice != null)
		{
		    if (invoice.getSubscription().equals(existingSubscription.getId()))
			invoice.pay();
		}
	    }
	    catch (Exception e)
	    {
	    }
	   
	    subscription.emailPlan = newPlan;
	    return StripeUtil.getJSONFromCustomer(Customer.retrieve(customer.getId()));
	    
	}
	catch (StripeException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return null;
	}

	
    }

    @Override
    public JSONObject addCreditCard(CreditCard card) throws Exception
    {
	Customer customer = Customer.create(StripeUtil.getCustomerParams(card));

	// Returns Customer object as JSONObject
	return StripeUtil.getJSONFromCustomer(customer);
    }

}