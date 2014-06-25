package com.thirdparty.shopify;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.forms.FormsUtil;
import com.thirdparty.google.ContactPrefs;
import com.thirdparty.google.ContactPrefs.Type;
import com.thirdparty.google.utl.ContactPrefsUtil;

/**
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

    public static void importCustomer(ContactPrefs prefs, Key<DomainUser> key)
    {

	/***
	 * calculating total page
	 */
	int total_records = getCount(prefs);
	int page_size = 250;
	int pages = (int) Math.ceil(total_records / page_size);
	int current_page = 1;

	if (total_records < 250)
	    pages = 1;
	/*
		 * 
		 */
	try
	{

	    while (current_page <= pages)
	    {
		String url = buildUrl(prefs, current_page);
		System.out.println(url);
		JSONObject customer = getObject(prefs, url);
		JSONArray arr = customer.getJSONArray("customers");
		/*********************************************************************************************************************
		 * testing total reccords
		 * 
		 * System.out.println("==========result================");
		 * for(int i=0;i<arr.length();i++){ JSONObject o =
		 * arr.getJSONObject(i);
		 * 
		 * System.out.println(o.getString("first_name")+" "+
		 * o.getString("last_name") +"===>>"+o.getString("email")); }
		 *********************************************************************************************************** */

		shopifyService.save(prefs, arr, key);
		current_page += 1;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    private static String buildUrl(ContactPrefs prefs, int current_page) throws URISyntaxException
    {
	URIBuilder uri = getAuthURL(prefs);
	uri.setPath("/admin/customers.json");
	uri.setParameter("limit",""+250);
	uri.setParameter("page", "" + current_page);

	if (prefs.count > 0)
	{
	    uri.addParameter("created_at_min", prefs.last_update_time);
	    uri.addParameter("updated_at_min", prefs.last_update_time);

	}
	uri.build();
	System.out.println(uri.toString());

	return uri.toString();

    }

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

    private static JSONObject getObject(ContactPrefs pref, String url) throws Exception
    {
	String uri = null;
	if (url == null)
	{
	    uri = buildUrl(pref, 0);
	}
	else
	{
	    uri = url;
	}
	JSONObject customers = null;
	try
	{

	    URL ur = new URL(uri);
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

    private static JSONObject getShop(ContactPrefs prefs) throws Exception
    {
	URIBuilder uri = getAuthURL(prefs);
	uri.setPath("/admin/shop.json").build();
	return getObject(prefs, uri.toString());
    }

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

    private static int getCount(ContactPrefs prefs)
    {     
	 URIBuilder uri = getAuthURL(prefs);
	  uri.setPath("/admin/customers/count.json");
             System.out.println(uri.toString());
	if (prefs.count > 0)
	{
	    uri.addParameter("created_at_min", prefs.last_update_time);
	    uri.addParameter("updated_at_min", prefs.last_update_time);

	}
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
	    /*
			 */
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

    private static URIBuilder getAuthURL(ContactPrefs pref)
    {
	URIBuilder uri = new URIBuilder();
	uri.setScheme("https");
	uri.setHost(pref.apiKey + ":" + pref.password + "@" + pref.userName);
	return uri;
    }

    public static void main(String[] args)
    {
	// TODO Auto-generated method stub
	StringBuilder sb = new StringBuilder();
	String url = "https://0f99730e50a2493463d263f6f6003622:1a27610dee9600dd8366bf76d90b5589@shopatmyspace.myshopify.com/admin/customers.json?";
	sb.append(url);
	try
	{
	   /* SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd hh:ss");
	     String d1 = dfs.format(new Date()).substring(0,10);
	     System.out.println(d1.length());
	     System.out.println(d1.substring(0,10));*/
	 
	}catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

}
