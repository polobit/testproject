package com.agilecrm.subscription;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.customer.CreditCard;
import com.agilecrm.customer.Plan;
import com.agilecrm.user.AgileUser;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.Gson;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;

public class StripeUtil
{

    // Create a Map Object with customer details
    public static Map<String, Object> getCustomerParams(
	    CreditCard customerCard, Plan plan) throws JsonParseException,
	    JsonMappingException, IOException
    {
	Map<String, Object> customerParams = new HashMap<String, Object>();

	// Get credit card details map
	customerParams.put("card", getCardParms(customerCard));

	// Get plan details map
	customerParams.put("plan", plan.plan_id);
	customerParams.put("quantity", plan.quantity);

	// Set Description and Email for subscription
	customerParams.put("description", NamespaceManager.get());
	customerParams.put("email",
		AgileUser.getCurrentAgileUser().open_id_user.getEmail());

	System.out.println(customerParams);

	return customerParams;
    }

    // Create a map object with card details
    public static Map<String, Object> getCardParms(CreditCard cardDetails)
	    throws JsonParseException, JsonMappingException, IOException
    {

	// Convert CreditCard object in to json string
	String creditCardJSON = new Gson().toJson(cardDetails);

	// Create HashMap from CreditCard json string
	HashMap<String, Object> cardParams = new ObjectMapper().readValue(
		creditCardJSON, new TypeReference<HashMap<String, Object>>()
		{
		});
	return cardParams;
    }

    public static Customer getCustomerFromJson(JSONObject customerJSON)
	    throws StripeException
    {
	Customer customer = new Gson().fromJson(customerJSON.toString(),
		Customer.class);

	return Customer.retrieve(customer.getId());
    }

    // Create Customer JSONObject from Customer Object
    public static JSONObject getJSONFromCustomer(Customer customer)
	    throws Exception
    {
	// Get customer json string from customer object
	String customerJSONString = new Gson().toJson(customer);

	// Create customer JSONObject from customer json string
	JSONObject customerJSON = new JSONObject(customerJSONString);

	return customerJSON;
    }

}
