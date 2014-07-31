package com.agilecrm.social;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.scribe.util.SignpostUtil;
import com.agilecrm.util.HTTPUtil;

/**
 * The class <code>ChargifyUtil</code> contains core methods which can access
 * Chargify resources.
 * 
 * Accessing resources can be done only after authentication. Chargify uses
 * basic authentication so for every request we need to send add API key to URL.
 * 
 * @author Rajitha
 * @see ChargifyUtil
 * @since July 2014
 */
public class ChargifyUtil
{
	/** fields to hold chargify configuration detials */
	private String chargifyApiKey = null;
	private String chargifyNamespace = null;
	public static final String CHARGIFY_API_URL = "https://$<ns>.chargify.com/";

	/** initializes instance variables */
	public ChargifyUtil(String chargifyApiKey, String chargifyNamespace) throws Exception
	{
		// API key & namespace are mandatory for accessing resources in
		// chargify.Throwing exception if they are null
		if (chargifyApiKey.isEmpty())
			throw new Exception("Chargify ApiKey is empty");
		if (chargifyNamespace.isEmpty())
			throw new Exception("Chargify Namespace is empty");

		this.chargifyApiKey = chargifyApiKey.trim();
		this.chargifyNamespace = chargifyNamespace.trim();
	}

	/**
	 * @param customerJson
	 * @return subscriptions json for the customers as string
	 * @throws Exception
	 *             Fetches subscriptions based on customer ID
	 */
	public String getSubscriptions(JSONObject customerJson) throws Exception
	{
		String customerId = customerJson.getString("id");

		if (customerId.startsWith("No"))
			throw new Exception(customerId);

		// preparing chargify URL for fetching customer subscriptions
		String url = CHARGIFY_API_URL.replace("$<ns>", chargifyNamespace) + "customers/" + customerId
				+ "/subscriptions.json";

		// accessing chargify resource
		return HTTPUtil.accessURLUsingAuthentication(url, chargifyApiKey, "x", "GET", null, false, "application/json",
				"application/json");

	}

	//
	/**
	 * @param customerJson
	 * @return invoice json array as string
	 * @throws Exception
	 *             Fetches subscriptions based on customer ID
	 */
	public String getInvoices(JSONObject customerJson) throws Exception
	{
		String customerId = customerJson.getString("id");

		if (customerId.startsWith("No"))
			throw new Exception(customerId);

		// preparing chargify URL for fetching customer invoices
		String url = CHARGIFY_API_URL.replace("$<ns>", chargifyNamespace) + "/invoices.json";

		// accessing chargify resource
		return HTTPUtil.accessURLUsingAuthentication(url, chargifyApiKey, "x", "GET", null, false, "application/json",
				"application/json");
	}

	/**
	 * @param email
	 * @return jsonarray
	 * @throws Exception
	 *             Fetches customer based on email
	 */
	public JSONArray getCustomerId(String email) throws Exception
	{
		// preparing chargify URL for fetching customers
		String url = CHARGIFY_API_URL.replace("$<ns>", chargifyNamespace) + "customers.json";

		// accessing chargify resource
		String response = HTTPUtil.accessURLUsingAuthentication(url, chargifyApiKey, "x", "GET", null, false, null,
				"application/json");

		JSONArray customersArray = new JSONArray(response);

		JSONArray foundCustomersArray = new JSONArray();

		System.out.println("customersArray " + customersArray);

		// throw exception if no customers found in chargify acc.
		if (customersArray.length() == 0)
			throw new Exception(chargifyNamespace + " domain of doesn't contain any customers");

		// iterate through customers array and fetch only
		for (int i = 0; i < customersArray.length(); i++)
		{
			JSONObject eachCustomerJson = customersArray.getJSONObject(i).getJSONObject("customer");

			if (eachCustomerJson.getString("email").equals(email))
				foundCustomersArray.put(eachCustomerJson);
		}

		return foundCustomersArray;
	}

	/**
	 * Create Customer in Chargify with firstname,lastname,email
	 * 
	 * @param firstname
	 * @param lastname
	 * @param email
	 * @return
	 * @throws Exception
	 */
	public String createCustomer(String firstname, String lastname, String email) throws Exception
	{
		// preparing chargify URL for fetching customer subscriptions
		String url = CHARGIFY_API_URL.replace("$<ns>", chargifyNamespace) + "customers.json";
		JSONObject customerJSON = new JSONObject().put("first_name", firstname).put("last_name", lastname)
				.put("email", email);
		System.out.println(customerJSON.toString());
		// accessing chargify resource
		return HTTPUtil.accessURLUsingAuthentication(url, chargifyApiKey, "x", "POST",
				new JSONObject().put("customer", customerJSON).toString(), false, "application/json",
				"application/json");

	}
}