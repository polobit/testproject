package com.agilecrm.subscription;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.ws.rs.Produces;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.billing.AgileBilling;
import com.agilecrm.customer.CreditCard;
import com.agilecrm.customer.Plan;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.ClickDeskEncrytion;
import com.google.gson.Gson;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

//import org.json.JSONObject;

@XmlRootElement
public class Subscription
{
    @Id
    public Long id;

    @Embedded
    @NotSaved(IfDefault.class)
    public Plan plan = null;

    @NotSaved
    public CreditCard card_details = null;

    @NotSaved(IfDefault.class)
    private String enripted_card_details = null;

    public static enum Type
    {
	BILLING_FAILED, BILLING_SUCCESS
    };

    @NotSaved(IfDefault.class)
    public Type status;

    @NotSaved(IfDefault.class)
    @Indexed
    public Long created_time = 0L;

    @NotSaved(IfDefault.class)
    @Indexed
    public Long updated_time = 0L;

    @NotSaved
    private JSONObject billing_data;

    @NotSaved(IfDefault.class)
    public String billing_data_json_string = null;

    public static enum Gateway
    {
	Stripe, Paypal
    };

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
	return "Subscription: {id: " + id + ", plan: " + plan
		+ ", card_details: " + card_details
		+ ", enripted_card_details: " + enripted_card_details
		+ ", status: " + status + ", created_time: " + created_time
		+ ", updated_time: " + updated_time + ", billing_data: "
		+ billing_data + ", billing_data_json_string: "
		+ billing_data_json_string + ", gateway: " + gateway + "}";
    }

    public void delete()
    {
	dao.delete(this);
    }

    public static Subscription getSubscription()
    {
	Objectify ofy = ObjectifyService.begin();
	return ofy.query(Subscription.class).get();
    }

    public void save()
    {
	Subscription subscription = Subscription.getSubscription();

	// If Subscription object is already exists update it
	if (subscription != null)
	    this.id = subscription.id;

	dao.put(this);
    }

    // Create a cusomer and save subsciption details
    public Subscription createCustomer() throws Exception
    {
	// Create customer add subscription
	billing_data = getAgileBilling().createCustomer(card_details, plan);

	save();

	return this;
    }

    // Update plan of subscription
    public static Subscription updatePlan(Plan plan) throws Exception
    {
	Subscription subscription = getSubscription();
	subscription.plan = plan;

	subscription.billing_data = subscription.getAgileBilling().updatePlan(
		subscription.billing_data, plan);

	subscription.save();

	return subscription;
    }

    // Update credit card details of customer
    public static Subscription updateCustomerCard(CreditCard card_details)
	    throws Exception
    {

	Subscription subscription = getSubscription();

	subscription.billing_data = subscription.getAgileBilling()
		.updateCustomerCard(subscription.billing_data, card_details);

	// Save updated details
	subscription.save();

	return subscription;
    }

    public void deleteCustomer() throws Exception
    {
	getAgileBilling().deleteCustomer(billing_data);

	delete();
    }

    private AgileBilling getAgileBilling() throws Exception
    {
	return (AgileBilling) Class.forName(
		"com.agilecrm.subscription." + gateway + "Impl").newInstance();

    }

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

	Gson gson = new Gson();
	try
	{
	    this.enripted_card_details = ClickDeskEncrytion.RSAEncrypt(gson
		    .toJson(this.enripted_card_details).getBytes());
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
