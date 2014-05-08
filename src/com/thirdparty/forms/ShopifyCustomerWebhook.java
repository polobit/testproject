package com.thirdparty.forms;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class ShopifyCustomerWebhook extends HttpServlet
{
	public void service(HttpServletRequest req, HttpServletResponse res)
	{
		try
		{
			String dataKey = null;
			
			// Get API key
			Map<String, String[]> requestParams  = req.getParameterMap();
			String apiKey = requestParams.get("apikey")[0];
			
			// Get data
			for (Map.Entry<String, String[]> entry : requestParams.entrySet()){
				if(!StringUtils.equals("apikey", entry.getKey()))
					dataKey = entry.getKey();
			}
			JSONObject data = new JSONObject(dataKey);
			
			// Get owner
			Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);

			if (owner == null)
				return;

			// List of contact fields
			List<ContactField> properties = new ArrayList<ContactField>();

			// Convert Shopify JSON
			JSONObject finalJson = convertShopifyJson(data);

			// Initialize or get Contact
			Contact contact = null;
			if (!StringUtils.isBlank(finalJson.optString(Contact.EMAIL)))
				contact = ContactUtil.searchContactByEmail(finalJson.getString(Contact.EMAIL));
			if (contact == null)
				contact = new Contact();

			// Convert Shopify fields to Agile fields
			FormsUtil.jsonToAgile(finalJson, properties, null);

			// Add properties, owner, tags and save contact
			contact.setContactOwner(owner);
			contact.properties = FormsUtil.updateContactProperties(properties, contact.properties);
			if (!ArrayUtils.isEmpty(getTags(data)))
				contact.addTags(getTags(data));
			contact.save();

			// Save note to agile user
			Note note = getNote(data);
			if (note != null)
			{
				Key<AgileUser> user = new Key<AgileUser>(AgileUser.class, owner.getId());
				note.addRelatedContacts(contact.id.toString());
				note.setOwner(user);
				note.save();
			}
		}
		catch (Exception e)
		{
			System.out.println("Error is " + e.getMessage());
			e.printStackTrace();
			return;
		}
	}

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
}
