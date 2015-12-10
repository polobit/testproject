package com.agilecrm.subscription.stripe.webhooks.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookHandler;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookServlet;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.Gson;
import com.stripe.model.Card;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;

public class InvoiceWebhookHandler extends StripeWebhookHandler
{

    String subscribptionIdFromStripe = null;

    @Override
    public void process()
    {
	/**
	 * PAYMENT SUCCEEDED
	 * 
	 * If payment is done set subscription flag to success
	 */
	if (eventType.equals(StripeWebhookServlet.STRIPE_INVOICE_PAYMENT_SUCCEEDED))
	{
	    Subscription subscription = setSubscriptionFlag(Subscription.BillingStatus.BILLING_SUCCESS);

	    // Get domain owner
	    DomainUser user = getUser();

	    System.out.println(user);
	    if (isEmailAddonPlan())
	    {
		setEmailsCountBillingRestriction();
	    }
	    // Checks whether owner of the domain is not null, if not null
	    // payment received mail to the domain user
	    if (user == null)
		return;

	    System.out.println("********** Sending mail ***********");
	    System.out.println(user.email);

	    if (isEmailAddonPlan())
	    {
		System.out.println("email plan payment made");
		sendMail1(SendMail.EMAIL_PAYMENT_RECEIVED_SUBJECT, SendMail.EMAIL_PAYMENT_RECEIVED);
		return;
	    }

	    sendMail1(SendMail.FIRST_PAYMENT_RECEIVED_SUBJECT, SendMail.FIRST_PAYMENT_RECEIVED);

	    try
	    {
		updateContactInOurDomain(getContactFromOurDomain(), user.email, subscription, null);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}

	/**
	 * PAYMENT FAILED
	 * 
	 * If payment failed set subscription flag is set to failed and mails
	 * sent to respective domain users
	 */
	else if (eventType.equals(StripeWebhookServlet.STRIPE_INVOICE_PAYMENT_FAILED))
	{
	    // Get number of attempts
	    String attempCount = "0";
	    try
	    {
		attempCount = eventJSON.getJSONObject("data").getJSONObject("object").getString("attempt_count");
	    }
	    catch (JSONException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }

	    Integer number_of_attempts = Integer.parseInt(attempCount);

	    // Process webhook
	    ProcessPaymentFailedWebhooks(number_of_attempts);

	}

    }

    @Override
    public void updateOurDomainContact()
    {
	// TODO Auto-generated method stub

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
    public void ProcessPaymentFailedWebhooks(int attemptCount)
    {
	String namespace = getDomain();

	// If number of attemps to payment is 0 or 1() the send email to domain
	// owner
	if (attemptCount == 0 || attemptCount == 1)
	{
	    // Set subscription flag billing failed
	    Subscription.BillingStatus flag = (attemptCount == 0) ? Subscription.BillingStatus.BILLING_FAILED_0
		    : Subscription.BillingStatus.BILLING_FAILED_1;

	    setSubscriptionFlag(flag);

	    // Get owner of the domain
	    DomainUser user = getUser();

	    // If user is not found send email to AgileCrm help about the stripe
	    // event
	    if (user == null)
	    {

	    }

	    sendMail1(SendMail.FAILED_BILLINGS_FIRST_TIME_SUBJECT, SendMail.FAILED_BILLINGS_FIRST_TIME);

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

		SendMail.sendMail(user.email, SendMail.FAILED_BILLINGS_SECOND_TIME_SUBJECT,
			SendMail.FAILED_BILLINGS_SECOND_TIME, getMailDetails());
	    }
	}

    }

    /**
     * Sets status of subscription whether billing failed of succeeded
     * 
     * @param status
     *            {@link Subscription.Type}
     */
    public Subscription setSubscriptionFlag(Subscription.BillingStatus status)
    {
	String domain = getDomain();

	String oldNamespace = NamespaceManager.get();
	try
	{
	    NamespaceManager.set(domain);
	    // Set status and save subscription
	    Subscription subscription = SubscriptionUtil.getSubscription();

	    if (isEmailAddonPlan())
	    {
		subscription.emailStatus = status;
	    }
	    else
		subscription.status = status;
	    subscription.save();
	    return subscription;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
	return null;
    }

    private String getPlanName()
    {
	System.out.println("getting plan details");
	System.out.println(getPlanDetails());
	return String.valueOf(getPlanDetails().get("plan"));
    }

    @Override
    public Map<String, Object> getPlanDetails()
    {
	// Gets StripeObject from the Event
	StripeObject stripeObject = getEvent().getData().getObject();

	// Gets customer JSON string from customer object
	String stripeJSONString = new Gson().toJson(stripeObject);
	System.out.println(stripeJSONString);
	Map<String, Object> plan = new HashMap<String, Object>();
	try
	{
	    JSONObject obj = new JSONObject(stripeJSONString);
	    JSONObject lines = obj.getJSONObject("lines");
	    JSONObject data = lines.getJSONArray("data").getJSONObject(0);

	    System.out.println(data);
	    if (data.has("quantity"))
		plan.put("quantity", data.get("quantity"));

	    if (data.has("plan"))
	    {
		JSONObject planJSON = data.getJSONObject("plan");
		plan.put("plan", planJSON.get("name"));
		plan.put("plan_id", planJSON.getString("id"));

	    }
	    else
	    {
		System.out.println("plan details not found ");
		if (obj.has("metadata"))
		{
		    JSONObject metadata = obj.getJSONObject("metadata");

		    System.out.println("meta data : " + metadata);
		    if (metadata != null)
		    {
			plan.put("quantity", metadata.get("quantity"));
			plan.put("plan", metadata.get("plan"));
		    }
		}
	    }

	    if (data.has("period"))
	    {
		JSONObject period = data.getJSONObject("period");
		plan.put("start_date", new Date(Long.parseLong(period.getString("start")) * 1000).toString());
		plan.put("end_date", new Date(Long.parseLong(period.getString("end")) * 1000).toString());
	    }

	    if (data.has("id"))
		subscribptionIdFromStripe = data.getString("id");
	    plan.put("amount", Float.valueOf(obj.getString("total")) / 100);

	    System.out.println(plan);

	    return plan;
	}
	catch (JSONException e1)
	{
	    // TODO Auto-generated catch block
	    e1.printStackTrace();
	}

	return null;
    }

    @Override
    protected Map<String, Object> getMailDetails()
    {
	Customer customer = getCustomerFromStripe();
	DomainUser user = getUser();

	Map<String, Object> details = getPlanDetails();
	details.put("user_name", user.name);
	details.put("domain", getDomain());
	Card card = StripeUtil.getDefaultCard(customer);
	details.put("last4", card.getLast4());

	/*
	 * CustomerCardCollection cardCollection = customer.getCards();
	 * 
	 * String defaultCard = customer.getDefaultCard();
	 * 
	 * String last_four = null; for(Card card : cardCollection.getData()) {
	 * if(card.getId().equals(defaultCard)) { last_four = card.getLast4();
	 * break; } }
	 * 
	 * details.put("last_four", last_four);
	 */
	// details.put("last_four", customer.getDefaultCard());
	return details;
    }

    private void setEmailsCountBillingRestriction()
    {
	String domain = getDomain();
	if (StringUtils.isEmpty(domain))
	    return;

	String oldNamespace = NamespaceManager.get();

	try
	{
	    NamespaceManager.set(domain);
	    Map<String, Object> map = getPlanDetails();
	    int count = (int) map.get("quantity");
	    System.out.println("quantity " + count);
	    if (count == 0)
		count = 1;
	    BillingRestriction restriction = BillingRestrictionUtil.getBillingRestriction(null, null);

	    System.out.println("events : " + getEvent().getData());
	    System.out.println("previous attributes : " + getEvent().getData().getPreviousAttributes());
	    if (getEvent().getData().getPreviousAttributes() == null
		    || getEvent().getData().getPreviousAttributes().isEmpty())
	    {
		if (restriction.one_time_emails_count < 0)
		    restriction.one_time_emails_count = 0;

		restriction.one_time_emails_count += (count * 1000);
		restriction.max_emails_count = restriction.one_time_emails_count;
	    }
	    else
	    {
		restriction.one_time_emails_count = (count * 1000);
		restriction.max_emails_count = restriction.one_time_emails_count;
	    }

	    System.out.println("Updating restriction object : " + restriction.one_time_emails_count);

	    // To reset count
	    restriction.isNewEmailPlanUpgrade = true;
	    restriction.save();
	    restriction.isNewEmailPlanUpgrade = false;

	    System.out.println("After restriction object update : " + restriction.one_time_emails_count);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }
}
