package com.agilecrm.subscription;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.RegistrationGlobals;
import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
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
	    subscription.refreshCustomer();
	    subscription.cachedData = BillingRestrictionUtil.getBillingRestriction(
		    subscription.plan.plan_type.toString(), subscription.plan.quantity);

	    // subscription.cachedData.refresh(true);
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
     * Creates a Customer in respective {@link Subscription.Gateway} and store
     * customer details in {@link Subscription} object
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

	String plan_id = "email-4";

	EmailGateway gateway = EmailGatewayUtil.getEmailGateway();

	if (gateway != null)
	{
	    plan_id = "email-2";
	    return plan_id;
	}

	if (count <= 100000)
	    plan_id = "email-4";
	else if (count <= 1000000)
	    plan_id = "email-3";
	else if (count > 1000000)
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
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    public static boolean deleteEmailSubscription(String namespace, String subscriptionId)
    {
	String oldNamespace = NamespaceManager.get();
	try
	{
	    NamespaceManager.set(namespace);
	    return deleteEmailSubscriptionById(subscriptionId);
	}
	finally
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
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    public static void deleteEmailSubscription()
    {
	Subscription subscription = getSubscription();
	if (subscription.isFreeEmailPack())
	    return;

	subscription.emailPlan = null;
	subscription.save();
    }

    public static boolean deleteEmailSubscriptionById(String subscription_id)
    {
	Subscription subscription = getSubscription();
	if (subscription.isFreeEmailPack())
	    return false;

	// If subscription is not equal then subscription in changed not
	// canceled
	if (!subscription_id.equals(subscription.emailPlan))
	{
	    return false;
	}
	subscription.emailPlan = null;
	subscription.save();
	return true;
    }

    public static void deleteUserSubscription()
    {
	Subscription subscription = getSubscription();
	if (subscription.isFreePlan())
	    return;

	subscription.plan = null;
	subscription.save();
    }

    // Signup plan request
    public static Plan signUpPlanFromRequest(HttpServletRequest request)
    {
	String plan = request.getParameter(RegistrationGlobals.PLAN_TYPE);

	String count = request.getParameter(RegistrationGlobals.USER_COUNT);

	if (plan == null)
	    return new Plan("FREE", 2);

	if (StringUtils.isEmpty(count))
	    count = "1";

	Integer users_count = Integer.valueOf(count);
	if (users_count > 20)
	    users_count = 20;
	Plan planObject = new Plan(plan.toUpperCase(), users_count);

	return planObject;
    }

    /**
     * Reads plan from session and removes it. Removes it as it is only one time
     * use variable
     * 
     * @param request
     * @return
     */
    public static Plan getSignupPlanFromSessionAndRemove(HttpServletRequest request)
    {
	HttpSession session = request.getSession();

	// Reads from session
	Object object = session.getAttribute(RegistrationGlobals.REGISTRATION_PLAN_IN_SESSION);
	System.out.println("Session attribute : " + object);
	Plan plan = null;
	if (object != null && object instanceof Plan)
	    plan = (Plan) object;

	System.out.println("plan read from session : " + plan);

	// Removes plan from session
	session.removeAttribute(RegistrationGlobals.REGISTRATION_PLAN_IN_SESSION);

	if (plan == null)
	    plan = new Plan("FREE", 2);

	return plan;
    }
}
