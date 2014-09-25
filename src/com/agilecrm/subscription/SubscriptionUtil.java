package com.agilecrm.subscription;

import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.subscription.Subscription.Gateway;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.subscription.ui.serialize.Plan.PlanType;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;

public class SubscriptionUtil
{

    /**
     * Returns {@link Subscription} object of current domain
     * 
     * @return {@link Subscription}
     * */
    public static Subscription getSubscription()
    {
	Objectify ofy = ObjectifyService.begin();
	Subscription subscription = ofy.query(Subscription.class).get();
	if (subscription == null)
	{
	    subscription = new Subscription();
	    
	    subscription.fillDefaultPlans();
	}

	return subscription;
    }
    
    public static boolean isFreePlan()
    {
	Objectify ofy = ObjectifyService.begin();
	Subscription subscription = ofy.query(Subscription.class).get();
	if (subscription == null)
	{
	    subscription = new Subscription();
	    
	    subscription.fillDefaultPlans();
	}
	
	return subscription.isFreePlan();
    }

    /**
     * Returns {@link Subscription} object of current domain
     * 
     * @return {@link Subscription}
     * */
    public static Subscription getSubscription(boolean reloadCustomer)
    {
	Subscription subscription = getSubscription();

	if (subscription == null || subscription.getBillingData() == null)
	    return subscription;

	// Returns Customer object as JSONObject
	try
	{
	    Customer customer = getCustomer(subscription.billing_data);
	    subscription.billing_data = StripeUtil.getJSONFromCustomer(customer);
	}
	catch (StripeException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return subscription;

    }

    public static Customer getCustomer(String namespace) throws StripeException
    {
	Subscription subscription = Subscription.getSubscriptionOfParticularDomain(namespace);
	if (subscription != null)
	{
	    JSONObject billing = subscription.billing_data;
	    System.out.println(billing + " in subscription.java");
	    return getCustomer(billing);
	}
	return null;

    }

    public static Customer getCustomer(JSONObject billing) throws StripeException
    {
	return StripeUtil.getCustomerFromJson(billing);
    }

    /**
     * Creates a Customer in respective {@link Subscription.Gateway} and store customer
     * details in {@link Subscription} object
     * 
     * @return {@link Subscription}
     * 
     * @throws Exception
     *             as Customer creation can be failed due to various
     *             reasons(incorrect creditcard details)
     */
    public static Subscription createEmailSubscription(Plan plan) throws Exception
    {
        Subscription subscription = getSubscription();
        // Creates customer and adds subscription
        subscription.billing_data = subscription.getAgileBilling().addSubscriptionAddon(plan);
        subscription.emailPlan = plan;
    
        // Saves new subscription information
        if (subscription.billing_data != null)
            subscription.save();
    
        return subscription;
    }
    
    public static String getEmailPlan(Integer quantity)
    {
	Integer count = quantity * 1000;
	if(count < 5000)
	    return null;
	
	String plan_id = "";
	if(count <=  100000)
	    plan_id = "email-4";
	else if(count <= 1000000)
	    plan_id = "email-3";
	else if(count > 1000000)
	    plan_id = "email-3";
	return plan_id;
    }
    
    public static void deleteEmailSubscription(String namespace)
    {
	String oldNamespace = NamespaceManager.get();
	try
	{
	    NamespaceManager.set(namespace);
	    deleteEmailSubscription();
	} finally 
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
    
    public static void deleteUserSubscription(String namespace)
    {
	String oldNamespace = NamespaceManager.get();
	try
	{
	    NamespaceManager.set(namespace);
	    deleteUserSubscription();
	} finally 
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    public static void deleteEmailSubscription()
    {
	Subscription subscription = getSubscription();
	if(subscription.isFreeEmailPack())
	    return;
	
	subscription.emailPlan = null;
	subscription.save();
    }
    
    public static void deleteUserSubscription()
    {
	Subscription subscription = getSubscription();
	if(subscription.isFreePlan())
	    return;
	
	subscription.emailPlan = null;
	subscription.save();
    }
}
