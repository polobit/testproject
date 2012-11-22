package com.agilecrm.subscription.stripe;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.core.DomainUser;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.Gson;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;

/**
 * This <code>StripeUtil</code> contains utility functions needed to process
 * Customer objects of stripe and conversion to or from json objects
 * 
 * @author Yaswanth
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
    public static Map<String, Object> getCustomerParams(CreditCard customerCard, Plan plan)
	    throws JsonParseException, JsonMappingException, IOException
    {
	Map<String, Object> customerParams = new HashMap<String, Object>();

	// Get credit card details map
	customerParams.put("card", getCardParms(customerCard));

	// Get plan details map
	customerParams.put("plan", plan.plan_id);
	customerParams.put("quantity", plan.quantity);

	// Set Description and Email for subscription
	customerParams.put("description", NamespaceManager.get());
	customerParams.put("email", DomainUser.getDomainCurrentUser().email);

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

	// Convert CreditCard object in to json string
	String creditCardJSON = new Gson().toJson(cardDetails);

	// Create HashMap from CreditCard json string
	HashMap<String, Object> cardParams = new ObjectMapper().readValue(creditCardJSON,
		new TypeReference<HashMap<String, Object>>()
		{
		});

	return cardParams;
    }

    /**
     * This method converts JSONObject(converted from {@link Customer}) to
     * Stripe {@link Customer} object and fetches {@link Customer} from stripe
     * with id to ensure the {@link Customer} is latest(If any changes made in
     * stipe manually)
     * 
     * @param customerJSON
     *            {@link JSONObject}
     * @return {@link Customer}
     * @throws StripeException
     */
    public static Customer getCustomerFromJson(JSONObject customerJSON) throws StripeException
    {
	// Converts Customer json to customer object
	Customer customer = new Gson().fromJson(customerJSON.toString(), Customer.class);

	// Retrieves the customer from stripe based on id
	return Customer.retrieve(customer.getId());
    }

    /**
     * This method converts {@link Customer} of stripe to a {@link JSONObject}
     * 
     * @param customer
     *            {@link Customer}
     * @return {@link JSONObject}
     * @throws Exception
     */
    public static JSONObject getJSONFromCustomer(Customer customer) throws Exception
    {
	// Get customer json string from customer object
	String customerJSONString = new Gson().toJson(customer);

	// Create customer JSONObject from customer json string
	JSONObject customerJSON = new JSONObject(customerJSONString);

	return customerJSON;
    }

}
