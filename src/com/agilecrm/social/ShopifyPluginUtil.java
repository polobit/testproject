/**
 * 
 */
package com.agilecrm.social;

import java.io.IOException;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import org.scribe.exceptions.OAuthException;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;

import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.util.StringUtils2;
import com.agilecrm.widgets.Widget;
import com.google.gson.Gson;
import com.stripe.model.Customer;
import com.stripe.model.Invoice;

/**
 * The <code>ShopifyPluginUtil</code> class acts as a Client to Shopify server
 * contains method to access customers details orders,invoice details etc
 * 
 * @author jitendra
 * @since 2014
 */
public class ShopifyPluginUtil
{

    /**
     * Retrieves Shopify customer details and invoices from Shopify plugin
     * server
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
	String token = widget.getProperty("token");
	String shopName = widget.getProperty("shop");

	if (StringUtils2.isNullOrEmpty(new String[] { customerId }))
	    throw new Exception("Please provide the Shopify customer id for this contact");
	String url = getAccessUrl(shopName, customerId);
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, url);
	oAuthRequest.addHeader("X-Shopify-Access-Token", token);
	try
	{
	    Response response = oAuthRequest.send();
	    Map<String, LinkedHashMap<String, Object>> results = new ObjectMapper().readValue(response.getStream(),
		    Map.class);
	    //customer_info = results.get("customer");

	}
	catch (OAuthException e)
	{
	    e.printStackTrace();
	}

	return customer_info;

    }

    private LinkedHashMap<String, Object> getCustomer(String accessURl, String token)
    {

	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, accessURl);
	oAuthRequest.addHeader("X-Shopify-Access-Token", token);
	LinkedHashMap<String, Object> customer = new LinkedHashMap<String, Object>();
	try
	{
	    Response response = oAuthRequest.send();
	    Map<String, LinkedHashMap<String, Object>> results = new ObjectMapper().readValue(response.getStream(),
		    Map.class);
	    customer = results.get("customer");

	}
	catch (OAuthException e)
	{
	    e.printStackTrace();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return customer;

    }

    private static String getAccessUrl(String shop, String customer_id)
    {
	StringBuilder sb = new StringBuilder("https://" + shop + "/admin/customers/" + customer_id + ".json");
	System.out.println("Access url " + sb.toString());
	return sb.toString();
    }

}
