package com.thirdparty.shopify;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
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

	private static String buildUrl(ContactPrefs prefs, int current_page)
	{

		StringBuilder uri = new StringBuilder();
		uri.append("https://").append(prefs.apiKey + ":").append(prefs.password).append("@" + prefs.userName);
		uri.append("/admin/customers.json?limit=250&page=" + current_page);

		return uri.toString();

	}

	public static JSONArray getOrder(ContactPrefs prefs, Long custID)
	{
		StringBuilder orderUrl = new StringBuilder();
		orderUrl.append("https://").append(prefs.apiKey + ":").append(prefs.password).append("@" + prefs.userName)
				.append("/admin/orders.json?customer_id=").append(custID);
		JSONArray orders = null;
		try
		{
			JSONObject response = getObject(prefs, orderUrl.toString());
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
			con.setConnectTimeout(30 * 1000);
			con.connect();
			BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
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

		StringBuilder url = new StringBuilder();
		url.append("https://").append(prefs.apiKey + ":").append(prefs.password).append("@" + prefs.userName)
				.append("/admin/shop.json");
		return getObject(prefs, url.toString());
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
		StringBuilder url = new StringBuilder();
		url.append("https://").append(prefs.apiKey + ":").append(prefs.password).append("@" + prefs.userName)
				.append("/admin/customers/count.json");
		try
		{
			JSONObject results = getObject(prefs, url.toString());
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
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:ss");
		String d = df.format(new Date());

		if (prefs != null)
		{

			StringBuilder url = new StringBuilder();
			url.append("https://").append(prefs.apiKey + ":").append(prefs.password).append("@" + prefs.userName)
					.append("/admin/customers.json?created_at_min=").append(d);

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
			/*
			 */
			try
			{

				while (current_page <= pages)
				{
					JSONObject customer = getObject(prefs, url.toString());
					JSONArray arr = customer.getJSONArray("customers");
					shopifyService.save(prefs, arr, prefs.getDomainUser());
				}
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}

		}

	}

	public static void main(String[] args)
	{
		// TODO Auto-generated method stub

		/*
		 * String url =
		 * "https://0f99730e50a2493463d263f6f6003622:1a27610dee9600dd8366bf76d90b5589@shopatmyspace.myshopify.com/admin/customers.json"
		 * ; try {
		 * 
		 * HttpClient client = new DefaultHttpClient(); HttpGet get = new
		 * HttpGet(url); HttpResponse response = client.execute(get);
		 * BufferedReader br = new BufferedReader(new
		 * InputStreamReader(response.getEntity().getContent())); String line;
		 * while ((line = br.readLine()) != null) { System.out.println(line); //
		 * shopify.save(new JSONObject(line),key); }
		 * 
		 * } catch (Exception e) { e.printStackTrace(); }
		 */
		// sync();

	}

}
