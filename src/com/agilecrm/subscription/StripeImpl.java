package com.agilecrm.subscription;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.billing.AgileBilling;
import com.agilecrm.billing.CreditCard;
import com.agilecrm.billing.Plan;
import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Invoice;
import com.stripe.model.InvoiceCollection;

public class StripeImpl implements AgileBilling
{
    static
    {
	Stripe.apiKey = Globals.STRIPE_API_KEY;
    }

    // Create customer and subscribe plan
    public JSONObject createCustomer(CreditCard cardDetails, Plan plan)
	    throws Exception
    {

	// Create customer and add subscription to it
	Customer customer = Customer.create(StripeUtil.getCustomerParams(
		cardDetails, plan));

	// Return Customer json
	return StripeUtil.getJSONFromCustomer(customer);

    }

    // Update Customer plan
    public JSONObject updatePlan(JSONObject stripeCustomer, Plan plan)
	    throws Exception
    {

	// Get Cutomer to update its plan
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	// Set changes plan preferences
	Map<String, Object> updateParams = new HashMap<String, Object>();
	updateParams.put("plan", plan.plan_id);
	updateParams.put("quantity", plan.quantity);

	// Update customer with changed plan
	customer = customer.update(updateParams);

	return StripeUtil.getJSONFromCustomer(customer);

    }

    // Update customer credit card
    public JSONObject updateCreditCard(JSONObject stripeCustomer,
	    CreditCard cardDetails) throws Exception
    {

	// Get Customer to update credit card retrieves from stripe
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	System.out.println(customer);

	Map<String, Object> updateParams = new HashMap<String, Object>();
	Map<String, Object> cardParams = StripeUtil.getCardParms(cardDetails);

	// Set changed credit card details
	updateParams.put("card", cardParams);

	// Update customer with changed card details
	customer = customer.update(updateParams);

	return StripeUtil.getJSONFromCustomer(customer);
    }

    // Get invoices of particular customer stripe id
    public List<Invoice> getInvoices(JSONObject stripeCustomer)
	    throws StripeException
    {

	InvoiceCollection invoiceCollection = null;
	Map<String, Object> invoiceParams = new HashMap<String, Object>();
	invoiceParams.put("customer",
		StripeUtil.getCustomerFromJson(stripeCustomer).getId());

	// Fetch all invoices for given stripe id
	List<Invoice> invoice_collection = Invoice.all(invoiceParams).getData();

	JSONObject invoiceJSON = null;
	JSONArray json_array = new JSONArray();
	try
	{
	    json_array.put(invoice_collection);
	    System.out.println(json_array);
	    for (Invoice invoice : invoice_collection)
	    {
		invoiceJSON = new JSONObject(new Gson().toJson(invoice));

	    }

	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	// return json_array;
	return invoice_collection;
    }

    // Delete customer from Stripe and cancel subscription
    public void deleteCustomer(JSONObject stripeCustomer) throws Exception
    {
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);
	customer.delete();
    }

    public void cancelSubscription(JSONObject stripeCustomer) throws Exception
    {
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	customer.cancelSubscription();
    }
}
