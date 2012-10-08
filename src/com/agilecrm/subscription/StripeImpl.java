package com.agilecrm.subscription;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.billing.AgileBilling;
import com.agilecrm.customer.CreditCard;
import com.agilecrm.customer.Plan;
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
	customer.update(updateParams);

	return StripeUtil.getJSONFromCustomer(customer);

    }

    // Update customer credit card
    public JSONObject updateCustomerCard(JSONObject stripeCustomer,
	    CreditCard cardDetails) throws Exception
    {

	// Get Customer to update credit card retrieves from stripe
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	Map<String, Object> updateParams = new HashMap<String, Object>();
	Map<String, Object> cardParams = StripeUtil.getCardParms(cardDetails);

	// Set changed credit card details
	updateParams.put("card", cardParams);

	// Update customer with changed card details
	customer.update(updateParams);

	return StripeUtil.getJSONFromCustomer(customer);
    }

    // Delete customer from Stripe
    public void deleteCustomer(JSONObject stripeCustomer) throws Exception
    {
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);
	customer.delete();

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
	invoiceCollection = Invoice.all(invoiceParams);

	return invoiceCollection.getData();
    }
}
