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
import com.stripe.model.Customer;
import com.stripe.model.Invoice;

/**
 * The <code>StripePluginUtil</code> class acts as a Client to Stripe server
 * 
 * <code>StripePluginUtil</code> class contains methods to retrieve stripe
 * customers details
 * 
 * @author Tejaswi
 * @since February 2013
 */
public class StripePluginUtil
{

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
    public static JSONObject getCustomerDetails(Widget widget, String customerId) throws SocketTimeoutException,
	    IOException, Exception
    {
	JSONObject customer_info = new JSONObject();
	String apiKey = widget.getProperty("access_token");

	if (StringUtils2.isNullOrEmpty(new String[] { customerId }))
	    throw new Exception("Please provide the Stripe customer id for this contact");

	/*
	 * Retrieves Stripe customer based on Stripe customer ID and Stripe
	 * account API key
	 */
	Customer customer = Customer.retrieve(customerId.trim(), apiKey);

	Map<String, Object> invoiceParams = new HashMap<String, Object>();
	invoiceParams.put("customer", customerId);

	/*
	 * Retrieves list of invoices based on Stripe customer ID and Stripe
	 * account API key
	 */
	List<Invoice> invoiceList = Invoice.all(invoiceParams, apiKey).getData();

	// Converts list to JSON using GSON and returns output in JSON format
	JSONArray list = new JSONArray(new Gson().toJson(invoiceList));
	customer_info.put("customer", StripeUtil.getJSONFromCustomer(customer));
	customer_info.put("invoice", list);

	System.out.println("Stripe customer info : " + customer_info);
	return customer_info;

    }
}
