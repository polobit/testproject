package com.agilecrm.subscription.stripe.webhooks.impl;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookHandler;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookServlet;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

public class SubscriptionWebhookHandlerImpl extends StripeWebhookHandler
{

    public void process()
    {
	// TODO Auto-generated method stub
	/**
	 * PAYMENT SUCCEEDED
	 * 
	 * If payment is done set subscription flag to success
	 */
	if (eventType.equals(StripeWebhookServlet.STRIPE_CUSTOMER_SUBSCRIPTION_CREATED))
	{
	    newSubscription();
	}
	else if (eventType.equals(StripeWebhookServlet.STRIPE_CUSTOMER_SUBSCRIPTION_UPDATED))
	{
	    updateSubscription();
	}
	else if (eventType.equals(StripeWebhookServlet.STRIPE_SUBSCRIPTION_DELETED))
	{
	    deleteSubscription();
	}

    }

    public void newSubscription()
    {
	// Sets billing restrictions email count
	if (isEmailAddonPlan())
	    setEmailsCountBillingRestriction();

    }

    public void updateSubscription()
    {
	if (!isPlanChanged())
	{
	    return;
	}

	DomainUser user = getUser();

	System.out.println(user);
	if (user == null)
	    return;

	// Sets billing restrictions email count
	if (isEmailAddonPlan())
	    setEmailsCountBillingRestriction();

	customizeEventAttributes(user);

	// Send mail to domain user
	sendMail(SendMail.PLAN_CHANGED_SUBJECT, SendMail.PLAN_CHANGED);

	 updateContactInOurDomain(getContactFromOurDomain(), user.email, null,
	 getPlanName());
    }

    public void deleteSubscription()
    {
	// Get domain owner
	DomainUser user = getUser();

	// If user is null return
	if (user == null)
	    return;

	customizeEventAttributes(user);

	// Send mail to domain user
	sendMail(SendMail.FAILED_BILLINGS_FINAL_TIME_SUBJECT, SendMail.FAILED_BILLINGS_FINAL_TIME);

	String userDomain = getDomain();

	if (StringUtils.isEmpty(userDomain))
	    return;

	Subscription.deleteSubscriptionOfParticularDomain(userDomain);
    }

    private void setEmailsCountBillingRestriction()
    {
	String domain = getDomain();
	if (StringUtils.isEmpty(domain))
	    return;

	String oldNamespace = NamespaceManager.get();

	try
	{
	    BillingRestriction restriction = BillingRestrictionUtil.getBillingRestriction(null, null);
	    restriction.emails_count = 10000;
	    restriction.save();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }

    /************************************************************************************************************
     * Functionalities to get plan and customize parameters to send mails
     * 
     * @return
     ************************************************************************************************************
     */

    private String getPlanName()
    {
	return String.valueOf(getPlanDetails().get("name"));
    }

    private boolean isPlanChanged()
    {
	Map<String, Object> attributes = getEvent().getData().getPreviousAttributes();

	if (attributes == null)
	    return false;

	if (attributes.containsKey("plan"))
	    return true;

	else if (attributes.containsKey("quantity"))
	    return true;

	return false;
    }

    private boolean isEmailAddonPlan()
    {
	String plan_id = String.valueOf(getPlanDetails().get("id"));
	if (StringUtils.containsIgnoreCase(plan_id, "email"))
	    return true;

	return false;
    }

    @Override
    public void updateOurDomainContact()
    {
	// TODO Auto-generated method stub

    }

    @Override
    protected Map<String, Object> getPlanDetails()
    {
	JSONObject object;
	try
	{
	    if (plan != null && !plan.isEmpty())
		return plan;

	    object = eventJSON.getJSONObject("data").getJSONObject("object");

	    JSONObject planJSON = object.getJSONObject("plan");

	    plan.put("plan", planJSON.getString("name"));
	    plan.put("plan_id", planJSON.getString("id"));

	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    plan = new HashMap<String, Object>();
	}

	return plan;
    }

    @Override
    protected Map<String, Object> getMailDetails()
    {
	// TODO Auto-generated method stub
	return null;
    }

}
