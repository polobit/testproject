package com.thirdparty.shopify;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;
import org.apache.http.client.utils.URIBuilder;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONArray;
import org.json.JSONObject;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.Type;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.forms.FormsUtil;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
 * This <code>ShopifyUtil</code> provide static method for importing data from
 * shopify
 * 
 * @author jitendra
 * 
 */
public class ShopifyUtil
{

    private static ShopifyService shopifyService = new ShopifyService();

    public static JSONObject convertShopifyJson(JSONObject json)
    {
	try
	{
	    JSONObject finalJson = new JSONObject();

	    String name;
	    String value;

	    // Get and put email
	    finalJson.put(Contact.EMAIL, json.getString(Contact.EMAIL));

	    // Remove unrelated fields
	    JSONObject defaultJson = json.getJSONObject("default_address");
	    defaultJson.remove("country");
	    defaultJson.remove("country_name");
	    defaultJson.remove("default");
	    defaultJson.remove("id");
	    defaultJson.remove("province");
	    defaultJson.remove("name");

	    // Iterate json, convert field name and add to finalJson
	    Iterator<?> keys = defaultJson.keys();
	    while (keys.hasNext())
	    {
		name = (String) keys.next();
		value = defaultJson.getString(name);
		if (!StringUtils.isBlank(value))
		{
		    name = FormsUtil.getFieldName(name);
		    finalJson.put(name, value);
		}
	    }
	    return finalJson;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Error is " + e.getMessage());
	    return null;
	}
    }

    /**
     * This will return All tags related to customers
     * 
     * @param json
     * @return
     */
    public static String[] getTags(JSONObject json)
    {
	try
	{
	    String tagsArray[] = {};

	    // If tags is not empty convert to array and return
	    if (!StringUtils.isBlank(json.optString("tags")))
	    {
		String tagString = json.getString("tags");
		tagString = tagString.trim();
		tagString = tagString.replace("/, /g", ",");
		tagsArray = tagString.split(",");
	    }
	    return tagsArray;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * This code will return All Notes related to customer JSONObject
     * 
     * @param json
     * @return
     */
    public static Note getNote(JSONObject json)
    {
	try
	{
	    Note note = null;

	    // If note is not empty, create note and return
	    if (!StringUtils.isBlank(json.optString("note")))
	    {
		note = new Note("Customer Note", json.getString("note"));
	    }
	    return note;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * This will return of Products tag
     * 
     * @param arr
     * @return
     */
    public static String[] getProductTags(JSONArray arr)
    {
	try
	{
	    List<String> productTags = new ArrayList<String>();
	    for (int i = 0; i < arr.length(); i++)
	    {
		JSONObject item = arr.getJSONObject(i);
		productTags.add(item.getString("title"));
	    }
	    return productTags.toArray(new String[productTags.size()]);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * This code will import all customers from Shopify
     * 
     * @param prefs
     * @param key
     */
    public static void importCustomers(ContactPrefs prefs, Key<DomainUser> key)
    {

	/***
	 * This trick used for implementation of pagination and fetching more
	 * record provided by api calculating total page
	 */
	int total_records = getCount(prefs);
	int page_size = 250;
	int pages = (int) Math.ceil(total_records / page_size);
	int current_page = 1;

	if (total_records < 250)
	    pages = 1;

	try
	{

	    while (current_page <= pages)
	    {
		String url = buildUrl(prefs, current_page);
		System.out.println(url);
		JSONObject customer = getObject(prefs, url);
		JSONArray arr = customer.getJSONArray("customers");
		shopifyService.save(prefs, arr, key);
		current_page += 1;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    /**
     * <code>BuildUrl</code>This code materialize and url based on user contact
     * preferences and return String representation of url
     * 
     * @param prefs
     * @param current_page
     * @return
     * @throws URISyntaxException
     */
    private static String buildUrl(ContactPrefs prefs, int current_page) throws URISyntaxException
    {
	URIBuilder uri = getAuthURL(prefs);
	uri.setPath("/admin/customers.json");
	uri.setParameter("limit", "" + 250);
	uri.setParameter("page", "" + current_page);

	/*
	 * if (prefs.count > 0) { uri.addParameter("created_at_min",
	 * prefs.last_update_time); uri.addParameter("updated_at_min",
	 * prefs.last_update_time);
	 * 
	 * }
	 */
	uri.build();
	System.out.println(uri.toString());

	return uri.toString();

    }

    /**
     * <code>getOrder</code> Return JSONArray of Orders Object purchased by
     * customers
     * 
     * @param prefs
     * @param custID
     * @return
     */
    public static JSONArray getOrder(ContactPrefs prefs, Long custID)
    {
	URIBuilder uri = getAuthURL(prefs);
	uri.setPath("/admin/orders.json");
	JSONArray orders = null;
	try
	{
	    uri.setParameter("customer_id", "" + custID).build();
	    JSONObject response = getObject(prefs, uri.toString());
	    orders = response.getJSONArray("orders");

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return orders;

    }

    /**
     * Return JSONObject which is found by provided URL if provided URL is null
     * or empty then it will create default URL
     * 
     * @param pref
     * @param url
     * @return Customer JSONObject
     * @throws Exception
     */
    private static JSONObject getObject(ContactPrefs pref, String url) throws Exception
    {
	if (url == null)
	{
	    url = buildUrl(pref, 0);
	}

	JSONObject customers = null;
	try
	{

	    URL ur = new URL(url);
	    URLConnection con = ur.openConnection();

	    BufferedReader br = new BufferedReader((new InputStreamReader(con.getInputStream())));
	    String line;
	    while ((line = br.readLine()) != null)
	    {
		customers = new JSONObject(line);
	    }

	}
	catch (Exception e)
	{
	    throw new Exception("Invalid Request");
	}
	return customers;
    }

    /**
     * Return Shop information in form Of JSONObject
     * 
     * @param prefs
     * @return
     * @throws Exception
     */
    private static JSONObject getShop(ContactPrefs prefs) throws Exception
    {
	URIBuilder uri = getAuthURL(prefs);
	uri.setPath("/admin/shop.json").build();
	return getObject(prefs, uri.toString());
    }

    /**
     * Test whether User is authenticated for access shop or not
     * 
     * @param prefs
     * @return TRUE/FALSE
     * @throws Exception
     */
    public static boolean isValid(ContactPrefs prefs) throws Exception
    {
	try
	{
	    JSONObject result = getShop(prefs);

	    JSONObject shop = result.getJSONObject("shop");

	    String domain = shop.getString("domain");

	    if (domain.equalsIgnoreCase(prefs.userName))
		return true;
	}
	catch (Exception e)
	{
	    throw new Exception("Invalid login. Please try again");
	}
	return false;
    }

    /**
     * Return total number of customer in shop
     * 
     * @param prefs
     * @return
     */
    private static int getCount(ContactPrefs prefs)
    {
	URIBuilder uri = getAuthURL(prefs);
	uri.setPath("/admin/customers/count.json");
	System.out.println(uri.toString());
	/*
	 * if (prefs.count > 0) { uri.addParameter("created_at_min",
	 * prefs.last_update_time); uri.addParameter("updated_at_min",
	 * prefs.last_update_time);
	 * 
	 * }
	 */
	try
	{
	    System.out.println(uri.toString());
	    JSONObject results = getObject(prefs, uri.toString());
	    return results.getInt("count");

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return 0;
    }

    /**
     * <code>Sync</code>Will sync all contact from shopify to agile crm contact
     */
    public static void sync()
    {
	ContactPrefs prefs = ContactPrefsUtil.getPrefsByType(Type.SHOPIFY);

	if (prefs != null)
	{

	    /***
	     * calculating total records in shopify database
	     * <p>
	     * shopify api show data pagewise and each can hold max 250 records
	     * </p>
	     */
	    int total_records = getCount(prefs);
	    int page_size = 250;
	    int pages = (int) Math.ceil(total_records / page_size);
	    int current_page = 1;

	    if (total_records < 250)
		pages = 1;
	    try
	    {

		while (current_page <= pages)
		{
		    JSONObject customer = getObject(prefs, buildUrl(prefs, current_page));
		    JSONArray arr = customer.getJSONArray("customers");
		    shopifyService.save(prefs, arr, prefs.getDomainUser());
		    current_page++;
		}
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}

    }

    /**
     * This will create Base auth url for and return URIBuilder Object
     * 
     * @param pref
     * @return
     */
    private static URIBuilder getAuthURL(ContactPrefs pref)
    {
	URIBuilder uri = new URIBuilder();
	uri.setScheme("https");
	// uri.setHost(pref.apiKey + ":" + pref.password + "@" + pref.userName);
	return uri;
    }

    public static void main(String[] args)
    {

	String uri = "https://agiletestshop.myshopify.com/admin/orders.json";
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, uri);
	oAuthRequest.addHeader("X-Shopify-Access-Token", "59260c2e72fcfe96b8d6c366046baf4a");
	try
	{
	
	//Response response = oAuthRequest.send();
		InputStream in = new FileInputStream(new File("order.txt"));
	
		Map<String, ArrayList<LinkedHashMap<String, Object>>> properties = new ObjectMapper().readValue(in,Map.class);
		ArrayList<LinkedHashMap<String, Object>> customers = properties.get("orders");

		for(int i =0;i<customers.size();i++){
			LinkedHashMap<String, String> address = (LinkedHashMap<String, String>) customers.get(i).get("default_address");
		  System.out.println(address);
		  System.out.println(customers.get(i).get("email"));
		  if(address.containsValue("address2")){
			  System.out.println(address.get("address2"));
		  }
		}
		
	}
	
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

}
