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

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jettison.json.JSONObject;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;

/**
 * The <code>ShopifyPluginUtil</code> class acts as a Client to Shopify server
 * contains method to access customers details orders,invoice details etc
 * 
 * @author jitendra
 * @since 2014
 */
public class ShopifyPluginUtil {

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
	public static List<LinkedHashMap<String, Object>> getCustomerOrderDetails(
			Widget widget, String customer_id) throws SocketTimeoutException,
			IOException, Exception {
		String token = widget.getProperty("token");
		String shopName = widget.getProperty("shop");

		String url = getAccessUrl(shopName, customer_id);
		OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, url);
		oAuthRequest.addHeader("X-Shopify-Access-Token", token);
		try {
			Response response = oAuthRequest.send();
			Map<String, LinkedHashMap<String, Object>> results = new ObjectMapper()
					.readValue(response.getStream(), Map.class);
			System.out.println(results);
			List<LinkedHashMap<String, Object>> orders = (List<LinkedHashMap<String, Object>>) results
					.get("orders");
			return orders;
		} catch (Exception e) {
			ExceptionUtil.catchException(e);
		}

		return null;

	}

	/**
	 * Checks is the customer exists in shopify based on the email.
	 * 
	 * @param widget
	 * @param email
	 * @return
	 */
	public static String isCustomerExist(Widget widget, String email) {
		String custID = null;
		LinkedHashMap<String, Object> customer = getCustomer(widget, email);
		if (customer != null && customer.size() > 0) {			
			Long customerId =   Long.parseLong(customer.get("id").toString());
			custID = customerId.toString();
		}
		return custID;
	}

	/**
	 * Gets the customer info based on the email id.
	 * 
	 * @param widget
	 * @param email
	 * @return
	 */
	public static LinkedHashMap<String, Object> getCustomer(Widget widget,
			String email) {
		String token = widget.getProperty("token");
		String shopName = widget.getProperty("shop");
		String url = "https://" + shopName
				+ "/admin/customers/search.json?query=email:" + email + "";
		System.out.println(url);
		return getCustomer(url, token, email);
	}

	/**
	 * Gets the customer info from shopify.
	 * 
	 * @param accessURl
	 * @param token
	 * @param email
	 * @return
	 */
	private static LinkedHashMap<String, Object> getCustomer(String accessURl,
			String token, String email) {

		OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, accessURl);
		oAuthRequest.addHeader("X-Shopify-Access-Token", token);
		List<LinkedHashMap<String, Object>> customer = new ArrayList<LinkedHashMap<String, Object>>();
		try {
			Response response = oAuthRequest.send();
			System.out.println(response.getStream().toString());
			Map<String, LinkedHashMap<String, Object>> results = new ObjectMapper()
					.readValue(response.getStream(), Map.class);
			customer = (List<LinkedHashMap<String, Object>>) results
					.get("customers");
		} catch (Exception e) {
			ExceptionUtil.catchException(e);
		}

		if (customer.size() > 0) {
			return customer.get(0);
		}
		return new LinkedHashMap<String, Object>();

	}

	/**
	 * Gets the access url based on the shop name and customer id.
	 * 
	 * @param shop
	 * @param customer_id
	 * @return
	 */
	private static String getAccessUrl(String shop, String customer_id) {
		StringBuilder sb = new StringBuilder("https://" + shop
				+ "/admin/orders.json?customer_id=" + customer_id
				+ "&status=any");
		System.out.println("Access url " + sb.toString());
		return sb.toString();
	}

	/**
	 * Adds new customer in shopify
	 * 
	 * @param contact
	 */
	public static void addCustomer(Widget widget, Contact contact) {

		String token = widget.getProperty("token");
		String shopName = widget.getProperty("shop");

		String url = "https://" + shopName + "/admin/customers.json";
		JSONObject data = new JSONObject();
		JSONObject customer = new JSONObject();
		ContactField firstname = contact
				.getContactFieldByName(contact.FIRST_NAME);
		ContactField lastname = contact
				.getContactFieldByName(contact.LAST_NAME);
		ContactField email = contact.getContactFieldByName(contact.EMAIL);
		ContactField address = contact.getContactFieldByName(contact.ADDRESS);
		try {
			customer.put("first_name", firstname.value);
			customer.put("last_name", lastname.value);
			customer.put("email", email);
			customer.put("verified_email", true);
			customer.put("address", address.value);
			data.put("customer", customer);
			String resp = postData(url, token, data);
			System.out.println(resp);
		} catch (Exception e) {
			ExceptionUtil.catchException(e);
		}

		OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, url);
		oAuthRequest.addHeader("X-Shopify-Access-Token", token);

	}

	/**
	 * Posts the data to the shopify.
	 * 
	 * @param requestURL
	 * @param token
	 * @param data
	 * @return
	 */
	private static String postData(String requestURL, String token,
			JSONObject data) {

		String output = "";
		try {
			// Send data
			URL url = new URL(requestURL);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.addRequestProperty("X-Shopify-Access-Token", token);
			// Set Connection Timeout as Google AppEngine has 5 secs timeout
			conn.setConnectTimeout(600000);
			conn.setReadTimeout(600000);

			conn.setRequestMethod("POST");
			OutputStreamWriter wr = new OutputStreamWriter(
					conn.getOutputStream(), "UTF-8");
			wr.write(data.toString());
			wr.flush();

			// Get the response
			BufferedReader reader = new BufferedReader(new InputStreamReader(
					conn.getInputStream(), "UTF-8"));

			String inputLine;
			while ((inputLine = reader.readLine()) != null) {
				output += inputLine;
			}

			wr.close();
			reader.close();

		} catch (Exception e) {
			ExceptionUtil.catchException(e);
		}

		return output;
	}

	/**
	 * Gets the orders.
	 * 
	 * @param widget
	 * @param id
	 * @return
	 */
	public static LinkedHashMap<String, Object> getOrder(Widget widget, Long id) {

		String token = widget.getProperty("token");
		String shopName = widget.getProperty("shop");
		String url = "https://" + shopName + "/admin/orders/" + id + ".json";
		System.out.println(url);

		OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, url);
		oAuthRequest.addHeader("X-Shopify-Access-Token", token);
		LinkedHashMap<String, Object> orders = new LinkedHashMap<String, Object>();
		try {
			Response response = oAuthRequest.send();
			Map<String, LinkedHashMap<String, Object>> results = new ObjectMapper()
					.readValue(response.getStream(), Map.class);
			orders = (LinkedHashMap<String, Object>) results.get("order");

		} catch (Exception e) {
			ExceptionUtil.catchException(e);
		}

		return orders;
	}

	/**
	 * Helps to know is the shop expired.
	 * 
	 * @param widget
	 * @return
	 */
	public static boolean isShopExpired(Widget widget) {
		boolean status = false;
		String token = widget.getProperty("token");
		String shopName = widget.getProperty("shop");
		String url = "https://" + shopName + "/admin/shop.json";
		OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, url);
		oAuthRequest.addHeader("X-Shopify-Access-Token", token);
		try {
			Response response = oAuthRequest.send();
			Map<String, LinkedHashMap<String, Object>> results = new ObjectMapper()
					.readValue(response.getStream(), Map.class);

			for (Map.Entry<String, LinkedHashMap<String, Object>> m : results
					.entrySet()) {
				String key = m.getKey();
				if (key.equalsIgnoreCase("errors")) {
					status = true;
					break;
				}
			}
		} catch (Exception e) {
			ExceptionUtil.catchException(e);
		}

		return status;

	}

}