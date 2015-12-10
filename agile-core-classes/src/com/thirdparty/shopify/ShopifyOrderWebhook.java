package com.thirdparty.shopify;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.forms.FormsUtil;

@SuppressWarnings("serial")
public class ShopifyOrderWebhook extends HttpServlet
{
	public void service(HttpServletRequest req, HttpServletResponse res)
	{
		try
		{
			String tData = null;
			
			// Get API Key
			@SuppressWarnings("unchecked")
			Map<String, String[]> requestParams = req.getParameterMap();
			
			String apiKey = requestParams.get("apikey")[0];
			Map<String, String[]> requestParamsCopy = new HashMap<String, String[]>(requestParams);
			requestParamsCopy.remove("apikey");
			
			// Get owner
			Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);
			if (owner == null)
				return;

			// Get data
			for (Map.Entry<String, String[]> entry : requestParamsCopy.entrySet())
			{
					String dataKey = entry.getKey();
					String dataValue = entry.getValue()[0];
					tData = dataKey+dataValue;
			}
			
			JSONObject data = new JSONObject(tData);
			JSONObject customerJson = data.getJSONObject("customer");
			JSONArray itemsArray = data.getJSONArray("line_items");
			
			// List of contact fields
			List<ContactField> properties = new ArrayList<ContactField>();

			// Convert Shopify JSON
			JSONObject finalJson = ShopifyUtil.convertShopifyJson(customerJson);

			// Convert Shopify fields to Agile fields
			FormsUtil.jsonToAgile(finalJson, properties, null);

			// Initialize or get Contact
			Contact contact = null;
			if (!StringUtils.isBlank(data.getString(Contact.EMAIL)))
				contact = ContactUtil.searchContactByEmail(data.getString(Contact.EMAIL));
			if (contact == null)
				contact = new Contact();

			String[] customerTags = ShopifyUtil.getTags(customerJson);
			String[] productTags = ShopifyUtil.getProductTags(itemsArray);
			String[] totalTags = (String[]) ArrayUtils.addAll(customerTags, productTags);

			// Add properties, owner, tags and save contact
			contact.setContactOwner(owner);
			contact.properties = FormsUtil.updateContactProperties(properties, contact.properties);
			if (!ArrayUtils.isEmpty(totalTags))
				contact.addTags(totalTags);
			contact.save();

			// Save note to agile user
			Note note = ShopifyUtil.getNote(customerJson);
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
}
