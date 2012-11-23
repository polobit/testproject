package com.agilecrm.subscription;

import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.ws.rs.Produces;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.util.ClickDeskEncrytion;
import com.google.gson.Gson;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;
import com.stripe.model.Customer;
import com.stripe.model.Invoice;

/**
 * The <code>Subscription</code> is to store subscription information, stores
 * Customer details, encrypted creditcard details, billing status, plan,
 * subscription created and updated time
 * 
 * @since November 2012
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
public class Subscription
{
    @Id
    public Long id;

    /** The plan object is used to store plan and quantity */
    @Embedded
    @NotSaved(IfDefault.class)
    public Plan plan = null;

    /**
     * The card_details variable is used for serialization of card details from
     * form this field is not saved only encrypted card details will be saved
     */
    @NotSaved
    public CreditCard card_details = null;

    /**
     * The encrypted_card_details are encrypted form of card_details, Encrypted
     * before saving {@link Subscription} Entity
     */
    @NotSaved(IfDefault.class)
    private String encrypted_card_details = null;

    /** This {@link Enum} Type represents subscription status of domain */
    public static enum Type
    {
	BILLING_FAILED, BILLING_SUCCESS, SUBSCRIPTION_DELETED
    };

    /**
     * The status {@link Enum} type variable is used to set status of
     * Subscription status
     */
    @NotSaved(IfDefault.class)
    public Type status;

    /** The created_time variable represents when subscription object is created */
    @NotSaved(IfDefault.class)
    @Indexed
    public Long created_time = 0L;

    /** The updated_time variable represents when subscription object is updated */
    @NotSaved(IfDefault.class)
    @Indexed
    public Long updated_time = 0L;

    /**
     * The billing_data {@link JSONObject} is never saved directly but saved in
     * the form of string converted in prepersit temporary variable used to keep
     * {@link Customer} as {@link JSONObject}
     */
    @NotSaved
    private JSONObject billing_data;

    /**
     * The billing_data_json_string represents {@link String} form of
     * billing_data(Stripe {@link Customer} info ) saved along with subscription
     * entity
     */
    @NotSaved(IfDefault.class)
    public String billing_data_json_string = null;

    /** This {@link Enum} gateway represents the payment gateway */
    public static enum Gateway
    {
	Stripe, Paypal
    };

    /**
     * This variable gateway of type {@link Gateway} stores the gateway in which
     * user made payment
     */
    @NotSaved(IfDefault.class)
    public Gateway gateway;

    private static ObjectifyGenericDao<Subscription> dao = new ObjectifyGenericDao<Subscription>(
	    Subscription.class);

    public Subscription()
    {

    }

    @Override
    public String toString()
    {
	return "Subscription: {id: " + id + ", plan: " + plan + ", card_details: " + card_details
		+ ", enripted_card_details: " + encrypted_card_details + ", status: " + status
		+ ", created_time: " + created_time + ", updated_time: " + updated_time
		+ ", billing_data: " + billing_data + ", billing_data_json_string: "
		+ billing_data_json_string + ", gateway: " + gateway + "}";
    }

    /**
     * This method return {@link Subscription} object of current domain
     * 
     * @return {@link Subscription}
     * */
    public static Subscription getSubscription()
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Subscription.class).get();
    }

    public void save()
    {
	Subscription subscription = Subscription.getSubscription();

	// If Subscription object already exists, update it(Only one
	// subscription object per domain)
	if (subscription != null)
	    this.id = subscription.id;

	dao.put(this);
    }

    /**
     * Creates a Customer in respective {@link Gateway} and store customer
     * details in {@link Subscription} object
     * 
     * @return {@link Subscription}
     * 
     * @throws Exception
     *             as Customer creation can be failed due to various
     *             reasons(incorrect creditcard details)
     */
    public Subscription createNewSubscription() throws Exception
    {
	// Create customer add subscription
	billing_data = getAgileBilling().createCustomer(card_details, plan);

	// Save new subscription information
	save();

	return this;
    }

    /**
     * Updates the {@link Subscription} of existing user if user is already in
     * same plan(plan_id and quantity both are considered) the method performs
     * not action and returns to avoid unnecessary payments
     * 
     * @param plan
     *            {@link Plan}
     * @return {@link Subscription}
     * @throws Exception
     */
    public static Subscription updatePlan(Plan plan) throws Exception
    {
	// Gets subscription object of current domain
	Subscription subscription = getSubscription();

	// If customer is already on same plan do not update(checks both on
	// plan_id and quantity)
	if (plan.plan_id.equals(subscription.plan.plan_id)
		&& plan.quantity.equals(subscription.plan.quantity))
	    return subscription;

	// Update the plan in related gateway
	subscription.billing_data = subscription.getAgileBilling().updatePlan(
		subscription.billing_data, plan);

	// Update plan in current domain subscription object
	subscription.plan = plan;

	// Save updated subcription object
	subscription.save();

	return subscription;
    }

    /**
     * Update credit card details of customer in its respective gateway and
     * saves the new customer object and new card detials(enrypted before
     * saving)
     * 
     * @param cardDetails
     *            {@link CreditCard}
     * @return {@link Subscription}
     * @throws Exception
     */
    public static Subscription updateCreditCard(CreditCard cardDetails) throws Exception
    {

	// Gets subscription of current domain
	Subscription subscription = getSubscription();

	// Update credit card details in related gateway
	subscription.billing_data = subscription.getAgileBilling().updateCreditCard(
		subscription.billing_data, cardDetails);

	// Assign store card details which will be encrypted before saving
	// subscription entity
	subscription.card_details = cardDetails;

	// Save updated details
	subscription.save();

	return subscription;
    }

    /**
     * Fetch {@link List} of {@link Invoice} from respective gateway
     * 
     * @return {@link List} of {@link Invoice}
     * @throws Exception
     */
    public static List<Invoice> getInvoices() throws Exception
    {
	Subscription subscription = getSubscription();

	// If current domain has subscription object get invoices for that
	// domain
	if (subscription == null)
	    return null;

	return subscription.getAgileBilling().getInvoices(subscription.billing_data);
    }

    /**
     * Cancel Subscription cancels the subscription in its respective gateway
     * and deletes subscription object
     * 
     * @throws Exception
     */
    public void cancelSubscription() throws Exception
    {
	getAgileBilling().cancelSubscription(billing_data);
    }

    /**
     * Delete customer from its gateway
     * 
     * @throws Exception
     */
    public void deleteCustomer() throws Exception
    {
	getAgileBilling().deleteCustomer(billing_data);
    }

    /**
     * Delete subscription also deletes customer from its related gateway
     * 
     * @throws Exception
     */
    public void delete() throws Exception
    {
	// Delete the customer before deleting agile subscription object
	try
	{
	    deleteCustomer();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    // If customer object is not found in stripe still subscription
	    // needs to be delted
	    dao.delete(this);
	}
    }

    /**
     * Returns AgileBilling interface implemented object based on gateway
     * 
     * @return {@link AgileBilling}
     * @throws Exception
     */
    private AgileBilling getAgileBilling() throws Exception
    {
	return (AgileBilling) Class.forName("com.agilecrm.subscription." + this.gateway + "Impl")
		.newInstance();

    }

    /**
     * Return billing data along with subscription
     * 
     * @return {@link String}
     * @throws Exception
     */
    @XmlElement
    @Produces("application/json")
    public String getBillingData() throws Exception
    {
	return billing_data.toString();
    }

    @PrePersist
    private void PrePersist()
    {
	billing_data_json_string = billing_data.toString();
	// Store Created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;
	else
	    updated_time = System.currentTimeMillis() / 1000;

	try
	{
	    // Encrypt creditcard details before saving
	    this.encrypted_card_details = ClickDeskEncrytion.RSAEncrypt(new Gson().toJson(
		    this.encrypted_card_details).getBytes());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    @PostLoad
    void PostLoad()
    {
	try
	{
	    if (billing_data_json_string != null)
		billing_data = new JSONObject(billing_data_json_string);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

}
