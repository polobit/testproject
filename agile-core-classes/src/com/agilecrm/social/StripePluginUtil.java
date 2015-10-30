package com.agilecrm.social;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.util.StringUtils2;
import com.agilecrm.widgets.Widget;
import com.google.gson.Gson;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import com.stripe.model.Invoice;
import com.stripe.net.RequestOptions;
import com.stripe.net.RequestOptions.RequestOptionsBuilder;

/**
 * The <code>StripePluginUtil</code> class acts as a Client to Stripe server
 * 
 * <code>StripePluginUtil</code> class contains methods to retrieve stripe
 * customers details
 * 
 * @author Tejaswi
 * @since February 2013
 */
public class StripePluginUtil {

	/**
	 * Retrieves Stripe customer details and invoices from Stripe plugin server
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve stripe access token
	 * @param customerId
	 *            ID of the customer in Stripe
	 * @return {@link JSONObject} form of the response returned from Stripe
	 * @throws Exception
	 */
	public static JSONObject getCustomerDetails(Widget widget, String customerId)
			throws SocketTimeoutException, IOException, Exception {
		JSONObject customer_info = new JSONObject();
		String apiKey = widget.getProperty("access_token");

		if (StringUtils2.isNullOrEmpty(new String[] { customerId })) {
			throw new Exception(
					"Please provide the Stripe customer id for this contact");
		}

		// Un comment the apiKey and customerId, to test in local or beta.
		apiKey = "sk_test_qxs4FCoEJ3o5aED4d1rIWiCE";
		customerId = "cus_5M6BkObcMEbP5C";

		/*
		 * Retrieves Stripe customer based on Stripe customer ID and Stripe
		 * account API key
		 */
		RequestOptionsBuilder builder = new RequestOptionsBuilder();
		builder.setApiKey(apiKey);
		builder.setStripeVersion("2012-09-24");
		RequestOptions options = builder.build();
		Customer customer = Customer.retrieve(customerId.trim(), options);

		Map<String, Object> invoiceParams = new HashMap<String, Object>();
		invoiceParams.put("customer", customerId);

		/*
		 * Retrieves list of invoices based on Stripe customer ID and Stripe
		 * account API key
		 */
		RequestOptionsBuilder builder2 = new RequestOptionsBuilder();
		builder2.setApiKey(apiKey);
		builder2.setStripeVersion("2014-12-08");
		RequestOptions options2 = builder2.build();
		List<Invoice> invoiceList = Invoice.all(invoiceParams, options2)
				.getData();

		// Converts list to JSON using GSON and returns output in JSON format
		JSONArray list = new JSONArray(new Gson().toJson(invoiceList));
		customer_info.put("customer", StripeUtil.getJSONFromCustomer(customer));
		customer_info.put("invoice", list);

		Map<String, Object> chargeParams = new HashMap<String, Object>();
		chargeParams.put("customer", customer.getId());
		chargeParams.put("limit", 10);
		List<Charge> chargesList = Charge.all(chargeParams, options2).getData();

		// Converts list to JSON using GSON and returns output in JSON format
		JSONArray chargeJsonList = new JSONArray(new Gson().toJson(chargesList));
		System.out.println("stripe data : " + chargesList.toString());
		customer_info.put("payments", chargeJsonList);

		System.out.println("Stripe customer info : " + customer_info);
		return customer_info;

	}
}
