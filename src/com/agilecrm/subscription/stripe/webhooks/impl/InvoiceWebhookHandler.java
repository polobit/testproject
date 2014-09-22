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
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookHandler;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookServlet;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.google.gson.Gson;
import com.stripe.model.Card;
import com.stripe.model.Customer;
import com.stripe.model.CustomerCardCollection;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;

public class InvoiceWebhookHandler extends StripeWebhookHandler
{

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

	    // Checks whether owner of the domain is not null, if not null
	    // payment received mail to the domain user
	    if (user == null)
		return;

	    // Set Extra fields to attributes to be used in the template
	    customizeEventAttributes(user);

	    System.out.println("********** Sending mail ***********");
	    System.out.println(user.email);
	    
	    System.out.println(getPlanName());
	    if(StringUtils.containsIgnoreCase(getPlanName(), "email"))
	    {	
		System.out.println("email plan payment made");
		sendMail1(SendMail.EMAIL_PAYMENT_RECEIVED_SUBJECT, SendMail.EMAIL_PAYMENT_RECEIVED);
		return;
	    }
	    
	    sendMail1(SendMail.FIRST_PAYMENT_RECEIVED_SUBJECT, SendMail.FIRST_PAYMENT_RECEIVED);

	    updateContactInOurDomain(getContactFromOurDomain(), user.email, subscription, null);
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

	    // Call customize attributes based on namespace and user
	    Event event = customizeEventAttributes(user);

	    SendMail.sendMail(user.email, SendMail.FAILED_BILLINGS_FIRST_TIME_SUBJECT,
		    SendMail.FAILED_BILLINGS_FIRST_TIME, getcustomDataForMail());

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
		Event event = customizeEventAttributes(user);

		SendMail.sendMail(user.email, SendMail.FAILED_BILLINGS_SECOND_TIME_SUBJECT,
			SendMail.FAILED_BILLINGS_SECOND_TIME, getcustomDataForMail());
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
	try
	{
	    // Set status and save subscription
	    Subscription subscription = SubscriptionUtil.getSubscription();
	    subscription.status = status;
	    subscription.save();
	    return subscription;
	}
	catch (Exception e)

	{

	}
	return null;
    }
    
    private String getPlanName()
    {
	return String.valueOf(getPlanDetails().get("plan"));
    }

    @Override
    public Map<String, Object> getPlanDetails()
    {
	// Gets StripeObject from the Event
	StripeObject stripeObject = getEvent().getData().getObject();

	// Gets customer JSON string from customer object
	String stripeJSONString = new Gson().toJson(stripeObject);
	Map<String, Object> plan = new HashMap<String, Object>();
	try
	{
	    JSONObject obj = new JSONObject(stripeJSONString);
	    JSONObject lines = obj.getJSONObject("lines");
	    JSONObject data = lines.getJSONArray("data").getJSONObject(0);
	    
	    if(data.has("quantity"))
		plan.put("quantity", data.get("quantity"));
	    
	    if(data.has("plan"))
	    {
		JSONObject planJSON = data.getJSONObject("plan");
		plan.put("plan", planJSON.get("name"));
		plan.put("plan_id", planJSON.getString("id"));
		if(data.has("period"))
		{
		    JSONObject period = data.getJSONObject("period");
		    plan.put("start_date", new Date(Long.parseLong(period.getString("start")) * 1000).toString());
		    plan.put("end_date", new Date(Long.parseLong(period.getString("end")) * 1000).toString());
		}
	    }
	    
	    plan.put("amount", Integer.valueOf(obj.getString("total")) / 100);
		
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
	CustomerCardCollection cardCollection = customer.getCards();
	
	String defaultCard = customer.getDefaultCard();

	String last_four = null;
	for(Card card : cardCollection.getData())
	{
	    if(card.getId().equals(defaultCard))
	    {
		last_four = card.getLast4();
		break;
	    }
	}
	
	details.put("last_four", last_four);
	
	//details.put("last_four", customer.getDefaultCard());
	return details;
    }

}
