package com.agilecrm.subscription.stripe.webhooks.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.AccountPrefs;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookHandler;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookServlet;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.email.SendMail;
import com.google.gson.Gson;
import com.stripe.model.Card;
import com.stripe.model.Customer;
import com.stripe.model.StripeObject;

public class InvoiceCreatedWebhookHandler extends StripeWebhookHandler
{
    @Override
    public void process()
    {
	/**
	 * INVOICE CREATED
	 * 
	 * if "request" parameter is null then only do the process 
	 */
    	System.out.println("InvoiceCreatedWebhookHandler");
	if (eventType.equals(StripeWebhookServlet.STRIPE_INVOICE_CREATED) && getEvent().getRequest() == null)
	{
		System.out.println("InvoiceCreatedWebhookHandler success");

	    // Get domain owner
	    DomainUser user = getUser();

	    System.out.println(user);
	    // Checks whether owner of the domain is not null, if not null
	    // send invoice created mail to the domain user
	    if (user == null)
		return;

	    System.out.println("********** Sending mail ***********");
	    System.out.println(user.email);
	    SendMail.sendMail("mogulla@invox.com", SendMail.INVOICE_CREATED_SUBJECT, SendMail.INVOICE_CREATED, getMailDetails());
	    sendMail1(SendMail.INVOICE_CREATED_SUBJECT, SendMail.INVOICE_CREATED);
	}

    }

    @Override
    public void updateOurDomainContact()
    {
	// TODO Auto-generated method stub

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

	    System.out.println("data is:::"+data);
	    if (data.has("quantity"))
	    	plan.put("quantity", data.get("quantity"));
	    plan.put("invoice_id", obj.get("id"));
	    if (data.has("plan"))
	    {
		JSONObject planJSON = data.getJSONObject("plan");
		String planName = planJSON.get("name").toString();
		if(planName.toLowerCase().contains("email"))
			plan.put("plan", "1000 Emails");
		else
			plan.put("plan", planName);

	    }
	    else
	    {
		System.out.println("plan details not found ");
	    }
	    plan.put("date", new Date(Long.parseLong(obj.getString("date")) * 1000).toString());
	    if (data.has("period"))
	    {
		JSONObject period = data.getJSONObject("period");
		
		plan.put("start_date", new Date(Long.parseLong(period.getString("start")) * 1000).toString());
		plan.put("end_date", new Date(Long.parseLong(period.getString("end")) * 1000).toString());
	    }
	    Float amount = Float.valueOf(obj.getString("amountDue"));
	    if(amount <= 0)
	    	return null;
	    plan.put("amount", amount / 100);

	    System.out.println("Plan is :::"+plan);

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
	if(details == null)
		return null;
	AccountPrefs prefs = getAccountPrefs();
	System.out.println("Got the Account prefs");
	if(prefs != null && !prefs.company_name.toLowerCase().equals("my company"))
		details.put("company", prefs.company_name);
	details.put("user_name", user.name);
	details.put("domain", getDomain());
	details.put("email", user.email);
	Card card = StripeUtil.getDefaultCard(customer);
	details.put("last4", card.getLast4());
	return details;
    }
}
