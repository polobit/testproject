package com.agilecrm.subscription.stripe.webhooks.impl;

import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.exception.ExceptionUtils;
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
    	AccountPrefs prefs = getAccountPrefs();
	if (eventType.equals(StripeWebhookServlet.STRIPE_INVOICE_CREATED))
	{
		System.out.println("InvoiceCreatedWebhookHandler success");
		//check if invoice created automatically by stripe (if request == null)
		if(getEvent().getRequest() == null){
			//if biennial plan set trial for one year if first year completed
			try{
				JSONObject invoiceJSON = eventJSON.getJSONObject("data").getJSONObject("object");
				JSONObject data = invoiceJSON.getJSONObject("lines").getJSONArray("data").getJSONObject(0);
				JSONObject plan = data.getJSONObject("plan");
				//Check for biennial plan
				if(plan.getString("name").toLowerCase().contains("biennial") && checkTrialEligibility(invoiceJSON.getLong("period_start"), invoiceJSON.getLong("period_end"))){
					Calendar cal = Calendar.getInstance();
					cal.setTimeInMillis(invoiceJSON.getLong("period_start") * 1000);
					cal.add(Calendar.YEAR, 2);
					StripeUtil.addTrial(invoiceJSON.getString("customer"), data.getString("id"), (cal.getTime().getTime())/1000);
					StripeUtil.closeInvoice(invoiceJSON.getString("id"));
					System.out.println("Added trial for biennial customer and invoice closed "+invoiceJSON.getString("id"));
				}
				
				if(prefs != null && prefs.sendInvoiceBeforeCharge){
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
			}catch(Exception e){
				System.out.println(ExceptionUtils.getMessage(e));
				e.printStackTrace();
			}
		}
	}

    }
    
    public boolean checkTrialEligibility(Long start, Long end){
    	//check if difference between 2 dates are more than 11 months
    	if(end - start < 33696000)
    		return true;
    	return false;  	
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
		if(planJSON.get("interval").toString().equals("month")){
			System.out.println("This is monthly subscription. returning null");
			return null;
		}
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
		SimpleDateFormat formater = new SimpleDateFormat("EEE MMM dd yyyy");
		plan.put("start_date", formater.format(new Date(Long.parseLong(period.getString("start")) * 1000)));
		plan.put("end_date", formater.format(new Date(Long.parseLong(period.getString("end")) * 1000)));
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
