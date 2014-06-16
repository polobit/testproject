package com.thirdparty.shopify;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.forms.FormsUtil;
import com.thirdparty.google.ContactPrefs;

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
	
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		
			  

			String url ="https://0f99730e50a2493463d263f6f6003622:1a27610dee9600dd8366bf76d90b5589@shopatmyspace.myshopify.com/admin/customers.json";
			try{
				
				HttpClient client = new DefaultHttpClient();
				HttpGet get = new HttpGet(url);
			    HttpResponse response = client.execute(get);
				BufferedReader br = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));
				String line;
				while((line= br.readLine())!=null){
					System.out.println(line);
					//shopify.save(new JSONObject(line),key);
				}

			}catch(Exception e){
				e.printStackTrace();
			}	
			

	}
	
	public static void importCustomer(ContactPrefs prefs,Key<DomainUser> key){

		String url = buildUrl(prefs);
		try{
			URL ur = new URL(url);
			URLConnection con = ur.openConnection();
			con.connect();
			BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String line;
			while((line= br.readLine())!=null){
				System.out.println(line);
				shopifyService.save(new JSONObject(line),key);
			}
			

	}catch(Exception e){
		e.printStackTrace();
	}	
	
		
}

private static String buildUrl(ContactPrefs prefs){
	StringBuilder uri = new StringBuilder();
	 uri.append("https://").append(prefs.apiKey+":").append(prefs.password).append("@"+prefs.userName)
	 .append("/admin/customers.json");
	 System.out.println(uri.toString());
	 return uri.toString();
	

}
}
