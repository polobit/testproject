package com.agilecrm.subscription.stripe;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.subscription.AgileBilling;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Invoice;

/**
 * The <code>StringImpl</code> class is to connect and make transations with
 * stripe payment gateway It includes methods for creating, deleting,
 * updating(plan, customer, creditcard) of customer and cancel subscription
 * 
 * @author Yaswanth
 * @see com.agilecrm.subscription.AgileBilling
 * @see com.agilecrm.subscription.Subscription
 * @see com.agilecrm.subscription.stripe.StripeUtil
 */
public class StripeImpl implements AgileBilling
{
    static
    {
	Stripe.apiKey = Globals.STRIPE_API_KEY;
    }

    /**
     * Create customer in Stripe subscribes the customer to plan based on plan
     * object
     * 
     * @param cardDetails
     *            {@link CreditCard}
     * @param plan
     *            {@link Plan}
     * 
     * @return {@link Customer} as {@link JSONObject}
     * 
     * @throws Exception
     *             if {@link Customer} canot be created or if any parameters are
     *             not valid(cardnumber, cvc, expiry) should be sent to client
     *             to show message to user
     */
    public JSONObject createCustomer(CreditCard cardDetails, Plan plan) throws Exception
    {

	// Creates customer and add subscription to it
	Customer customer = Customer.create(StripeUtil.getCustomerParams(cardDetails, plan));

	// Return Customer json
	return StripeUtil.getJSONFromCustomer(customer);

    }

    /**
     * Update the plan of the customer based on the customer and plan object
     * paramerters
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

	// Get Cutomer to update its plan
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	// Set changes plan preferences
	Map<String, Object> updateParams = new HashMap<String, Object>();
	updateParams.put("plan", plan.plan_id);
	updateParams.put("quantity", plan.quantity);

	// Update customer with changed plan
	customer = customer.update(updateParams);

	// Returns Customer object as JSONObject
	return StripeUtil.getJSONFromCustomer(customer);
    }

    /**
     * Update customer credit card details of Stripe customer
     * 
     * @param stripeCustomer
     *            , {@link Customer} , cardDetails {@link CreditCard}
     * 
     * @return {@link Customer} as {@link JSONObject}
     * 
     * @throws Exception
     * */
    public JSONObject updateCreditCard(JSONObject stripeCustomer, CreditCard cardDetails)
	    throws Exception
    {

	// Get Customer to update credit card retrieves from stripe
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	Map<String, Object> updateParams = new HashMap<String, Object>();

	// Gets Map of card params to be sent to stripe in update params
	Map<String, Object> cardParams = StripeUtil.getCardParms(cardDetails);

	// Set changed credit card details
	updateParams.put("card", cardParams);

	// Update customer with changed card details
	customer = customer.update(updateParams);

	return StripeUtil.getJSONFromCustomer(customer);
    }

    /**
     * Get invoices of customer given as param
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

	// Set invoice params (required to get invoices from stripe)
	invoiceParams.put("customer", StripeUtil.getCustomerFromJson(stripeCustomer).getId());

	// Fetch all invoices for given stripe id which return list<invoices>

	// return json_array;
	return Invoice.all(invoiceParams).getData();

    }

    /**
     * Delete customer from Stripe and cancel subscription
     * 
     * @param stripeCustomer
     *            {@link Customer} as {@link JSONObject}
     * 
     * @throws Exception
     */
    public void deleteCustomer(JSONObject stripeCustomer) throws Exception
    {
	Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

	// Delete customer from stripe which raises webhook gets handled in
	// servlet
	customer.delete();
    }

    /**
     * Cancel customer subscription in Stripe
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
}
