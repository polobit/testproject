package com.agilecrm.subscription;

import java.util.List;

import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.stripe.model.Invoice;

/**
 * 
 * This
 * <code>AgileBilling<code> interface consists methods to be followed while implementing
 * any payment gateway
 * 
 * Consists methods createCustomer, UpdatePlan, UpdateCreditCard, getInvoices, deleteCustomer, cancelSubscription
 * 
 * @author Yaswanth
 * 
 * @see com.agilecrm.subscription.Subscription
 * 
 * @since November 2012
 * 
 * */
public interface AgileBilling
{
    /**
     * Create customer and return Customer as {@link JSONObject}
     * 
     * @param cardDetails
     *            {@link CreditCard}, plan {@link Plan}
     * 
     * @return {@link JSONObject}
     * 
     * @throws Exception
     */
    public JSONObject createCustomer(CreditCard cardDetails, Plan plan) throws Exception;

    /**
     * Update customer plan and return Customer as {@link JSONObject}
     * 
     * @param billingData
     *            {@link JSONException}, plan{@link Plan}
     * 
     * @return {@link JSONObject}
     * 
     * @throws Exception
     */
    public JSONObject updatePlan(JSONObject billingData, Plan plan) throws Exception;

    /**
     * Update customer CreditCard detials and return Customer as
     * {@link JSONObject}
     * 
     * @param billingData
     *            as {@link JSONObject}, cardDetails {@link CreditCard}
     * 
     * @return {@link JSONObject}
     * 
     * @throws Exception
     */
    public JSONObject updateCreditCard(JSONObject billingData, CreditCard cardDetails)
	    throws Exception;

    /**
     * Get invoices of customer
     * 
     * @param billingData
     *            as {@link JSONObject}, CreditCard {@link CreditCard}
     * 
     * @return List of {@link JSONObject}
     * 
     * @throws Exception
     */
    public List<Invoice> getInvoices(JSONObject billingData) throws Exception;

    /**
     * Delete customer from gateway
     * 
     * @param billingData
     *            as {@link JSONObject}
     * 
     * 
     * @throws Exception
     */
    public void deleteCustomer(JSONObject billingData) throws Exception;

    /**
     * Cancel customer Subscription
     * 
     * @param billingData
     *            as {@link JSONObject}
     * 
     * 
     * @throws Exception
     */
    public void cancelSubscription(JSONObject billingData) throws Exception;
}
