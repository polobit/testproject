package com.agilecrm.subscription;

import java.util.List;

import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.stripe.model.Invoice;
import com.stripe.model.InvoiceItem;

/**
 * 
 * <code>AgileBilling<code> is root interface for all billing gateway Implementations,
 * It Include methods to be followed while implementing
 * any payment gateway. Includes methods createCustomer, UpdatePlan, UpdateCreditCard, getInvoices, deleteCustomer, cancelSubscription
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
     * Attaches card/update card in payment gateway 
     */
    public JSONObject addCreditCard(CreditCard card) throws Exception;
    
    /**
     * Creates customer and return Customer as {@link JSONObject}
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
     * Creates customer and return Customer as {@link JSONObject}
     * 
     * @param cardDetails
     *            {@link CreditCard}, plan {@link Plan}
     * 
     * @return {@link JSONObject}
     * 
     * @throws Exception
     */
    public JSONObject createCustomer(CreditCard cardDetails) throws Exception;

    /**
     * Updates customer plan and return Customer as {@link JSONObject}
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
     * Updates customer CreditCard detials and return Customer as
     * {@link JSONObject}
     * 
     * @param billingData
     *            as {@link JSONObject}, cardDetails {@link CreditCard}
     * 
     * @return {@link JSONObject}
     * 
     * @throws Exception
     */
    public JSONObject updateCreditCard(JSONObject billingData, CreditCard cardDetails) throws Exception;

    /**
     * Gets list of customer subscription invoices
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
     * Deletes customer from gateway
     * 
     * @param billingData
     *            as {@link JSONObject}
     * 
     * 
     * @throws Exception
     */
    public void deleteCustomer(JSONObject billingData) throws Exception;

    /**
     * Cancels customer Subscription
     * 
     * @param billingData
     *            as {@link JSONObject}
     * 
     * 
     * @throws Exception
     */
    public void cancelSubscription(JSONObject billingData) throws Exception;
    
    public JSONObject addSubscriptionAddon(Plan plan) throws Exception;
    
    /**
     * Cancels customer Email Subscription
     * 
     * @param billingData
     *            as {@link JSONObject}
     * 
     * 
     * @throws Exception
     */
    public void cancelEmailSubscription(JSONObject billingData) throws Exception;
    public Invoice getUpcomingInvoice(JSONObject billingData, Plan plan) throws Exception;
    public void purchaseEmailCredits(JSONObject billingData, Integer quantity) throws Exception;
    
    /**
     * Adds trial for all subscriptions
     * 
     * @param trialEnd as {@link Long}
     *  
     * @throws Exception
     */
    public void addTrial(Long trialEnd) throws Exception;
    
}
