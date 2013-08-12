package com.agilecrm.subscription.stripe;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.Gson;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;

/**
 * <code>StripeUtil</code> is utility class used to process data, to support
 * Stripe transactions.
 * <p>
 * It includes utility functions needed to process Customer objects of stripe
 * and conversion to or from JSON objects. This class is used by
 * {@link StripeImpl} class which data to be processed as to support Stripe
 * operations, and data returned from stripe is also process by this utility
 * class to save information in {@link Subscription}
 * </p>
 * 
 * @author Yaswanth
 * @see StripeImpl
 * @since November 2012
 */
public class StripeUtil
{

    /**
     * Creates a map of customer card details, plan and other details required
     * to create a customer in stripe
     * 
     * @param customerCard
     *            {@link CreditCard}
     * @param plan
     *            {@link Plan}
     * @return {@link Map}
     * @throws JsonParseException
     * @throws JsonMappingException
     * @throws IOException
     */
    public static Map<String, Object> getCustomerParams(
	    CreditCard customerCard, Plan plan) throws JsonParseException,
	    JsonMappingException, IOException
    {
	Map<String, Object> customerParams = new HashMap<String, Object>();

	// Gets credit card details map
	customerParams.put("card", getCardParms(customerCard));

	// Gets plan details map
	customerParams.put("plan", plan.plan_id);
	customerParams.put("quantity", plan.quantity);

	// Sets Description and Email for subscription
	customerParams.put("description", NamespaceManager.get());
	customerParams
		.put("email", DomainUserUtil.getCurrentDomainUser().email);

	return customerParams;
    }

    /**
     * This method creates a Map with creditcard details as requirement of
     * stripe
     * 
     * @param cardDetails
     *            {@link CreditCard}
     * @return {@link Map}
     * @throws JsonParseException
     * @throws JsonMappingException
     * @throws IOException
     */
    public static Map<String, Object> getCardParms(CreditCard cardDetails)
	    throws JsonParseException, JsonMappingException, IOException
    {

	// Converts CreditCard object in to JSON string
	String creditCardJSON = new Gson().toJson(cardDetails);

	// Creates HashMap from CreditCard JSON string
	HashMap<String, Object> cardParams = new ObjectMapper().readValue(
		creditCardJSON, new TypeReference<HashMap<String, Object>>()
		{
		});

	return cardParams;
    }

    /**
     * Converts JSONObject(converted from {@link Customer}) to Stripe
     * {@link Customer} object and fetches {@link Customer} from stripe with id
     * to ensure the {@link Customer} is latest(If any changes made in stripe
     * manually)
     * 
     * @param customerJSON
     *            {@link JSONObject}
     * @return {@link Customer}
     * @throws StripeException
     */
    public static Customer getCustomerFromJson(JSONObject customerJSON)
	    throws StripeException
    {
	// Converts Customer JSON to customer object
	Customer customer = new Gson().fromJson(customerJSON.toString(),
		Customer.class);

	// Retrieves the customer from stripe based on id
	return Customer.retrieve(customer.getId());
    }

    /**
     * Converts {@link Customer} of stripe to a {@link JSONObject}
     * 
     * @param customer
     *            {@link Customer}
     * @return {@link JSONObject}
     * @throws Exception
     */
    public static JSONObject getJSONFromCustomer(Customer customer)
	    throws Exception
    {
	// Gets customer JSON string from customer object
	String customerJSONString = new Gson().toJson(customer);

	// Creates customer JSONObject from customer JSON string
	JSONObject customerJSON = new JSONObject(customerJSONString);
	return customerJSON;
    }

}
