/**
 * 
 */
package com.agilecrm.social;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.scribe.exceptions.OAuthException;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.core.api.widgets.ShopifyWidgetAPI;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.StringUtils2;
import com.agilecrm.widgets.Widget;
import com.google.code.linkedinapi.client.enumeration.HttpMethod;

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
    public static List<LinkedHashMap<String, Object>> getCustomerOrderDetails(Widget widget, String email)
	    throws SocketTimeoutException, IOException, Exception
    {
	String token = widget.getProperty("token");
	String shopName = widget.getProperty("shop");
	LinkedHashMap<String, Object> customer = getCustomer(widget, email);
	System.out.println(customer);
	if (customer != null && customer.size() > 0)
	{
	    Integer customerId = (Integer) customer.get("id");

	    String url = getAccessUrl(shopName, customerId.toString());
	    OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, url);
	    oAuthRequest.addHeader("X-Shopify-Access-Token", token);
	    try
	    {
		Response response = oAuthRequest.send();
		Map<String, LinkedHashMap<String, Object>> results = new ObjectMapper().readValue(response.getStream(),
			Map.class);
		System.out.println(results);
		List<LinkedHashMap<String, Object>> orders = (List<LinkedHashMap<String, Object>>) results
			.get("orders");
		return orders;

	    }
	    catch (OAuthException e)
	    {
		e.printStackTrace();
	    }
	}

	return null;

    }

    public static boolean isCustomerExist(Widget widget, String email)
    {
	LinkedHashMap<String, Object> customer = getCustomer(widget, email);
	if (customer.size() == 0)
	    return false;
	return true;
    }

    public static LinkedHashMap<String, Object> getCustomer(Widget widget, String email)
    {
	String token = widget.getProperty("token");
	String shopName = widget.getProperty("shop");
	String url = "https://" + shopName + "/admin/customers/search.json?query=email:" + email + "";
	System.out.println(url);
	return getCustomer(url, token, email);
    }

    private static LinkedHashMap<String, Object> getCustomer(String accessURl, String token, String email)
    {

	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, accessURl);
	oAuthRequest.addHeader("X-Shopify-Access-Token", token);
	List<LinkedHashMap<String, Object>> customer = new ArrayList<LinkedHashMap<String, Object>>();
	try
	{
	    Response response = oAuthRequest.send();
	    Map<String, LinkedHashMap<String, Object>> results = new ObjectMapper().readValue(response.getStream(),
		    Map.class);
	    customer = (List<LinkedHashMap<String, Object>>) results.get("customers");

	}
	catch (OAuthException e)
	{
	    e.printStackTrace();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	if (customer.size() > 0)
	{
	    return customer.get(0);
	}
	return new LinkedHashMap<String, Object>();

    }

    private static String getAccessUrl(String shop, String customer_id)
    {
	StringBuilder sb = new StringBuilder("https://" + shop + "/admin/orders.json?customer_id=" + customer_id);
	System.out.println("Access url " + sb.toString());
	return sb.toString();
    }

    /**
     * add new customer in shopify
     * 
     * @param contact
     */
    public static void addCustomer(Widget widget, Contact contact)
    {

	String token = widget.getProperty("token");
	String shopName = widget.getProperty("shop");

	String url = "https://" + shopName + "/admin/customers.json";
	JSONObject data = new JSONObject();
	JSONObject customer = new JSONObject();
	ContactField firstname = contact.getContactFieldByName(contact.FIRST_NAME);
	ContactField lastname = contact.getContactFieldByName(contact.LAST_NAME);
	ContactField email = contact.getContactFieldByName(contact.EMAIL);
	ContactField address = contact.getContactFieldByName(contact.ADDRESS);
	try
	{
	    customer.put("first_name", firstname.value);

	    customer.put("last_name", lastname.value);
	    customer.put("email", email);
	    customer.put("verified_email", true);
	    customer.put("address", address.value);
	    data.put("customer", customer);
	    String resp = postData(url, token, data);
	    System.out.println(resp);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, url);
	oAuthRequest.addHeader("X-Shopify-Access-Token", token);

    }

    private static String postData(String requestURL, String token, JSONObject data)
    {

	String output = "";
	try
	{
	    // Send data
	    URL url = new URL(requestURL);
	    HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	    conn.setDoOutput(true);
	    conn.addRequestProperty("X-Shopify-Access-Token", token);
	    // Set Connection Timeout as Google AppEngine has 5 secs timeout
	    conn.setConnectTimeout(600000);
	    conn.setReadTimeout(600000);

	    conn.setRequestMethod("POST");
	    OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
	    wr.write(data.toString());
	    wr.flush();

	    // Get the response
	    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

	    String inputLine;
	    while ((inputLine = reader.readLine()) != null)
	    {
		output += inputLine;
	    }

	    wr.close();
	    reader.close();

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return output;
    }

    public static LinkedHashMap<String, Object> getOrder(Widget widget, Long id)
    {

	String token = widget.getProperty("token");
	String shopName = widget.getProperty("shop");
	String url = "https://" + shopName + "/admin/orders/" + id + ".json";
	System.out.println(url);

	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, url);
	oAuthRequest.addHeader("X-Shopify-Access-Token", token);
	LinkedHashMap<String, Object> orders = new LinkedHashMap<String, Object>();
	try
	{
	    Response response = oAuthRequest.send();
	    Map<String, LinkedHashMap<String, Object>> results = new ObjectMapper().readValue(response.getStream(),
		    Map.class);
	    orders = (LinkedHashMap<String, Object>) results.get("order");

	}
	catch (OAuthException e)
	{
	    e.printStackTrace();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return orders;
    }

}
