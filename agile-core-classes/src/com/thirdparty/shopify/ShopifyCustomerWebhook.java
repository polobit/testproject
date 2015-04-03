package com.thirdparty.shopify;

import java.util.ArrayList;
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
import com.thirdparty.forms.FormsUtil;

@SuppressWarnings("serial")
public class ShopifyCustomerWebhook extends HttpServlet
{
	public void service(HttpServletRequest req, HttpServletResponse res)
	{
		try
		{
			String dataKey = null;

			// Get API key
			@SuppressWarnings("unchecked")
			Map<String, String[]> requestParams = req.getParameterMap();
			String apiKey = requestParams.get("apikey")[0];

			// Get owner
			Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);
			if (owner == null)
				return;

			// Get data
			for (Map.Entry<String, String[]> entry : requestParams.entrySet())
			{
				if (!StringUtils.equals("apikey", entry.getKey()))
					dataKey = entry.getKey();
			}
			JSONObject data = new JSONObject(dataKey);

			// List of contact fields
			List<ContactField> properties = new ArrayList<ContactField>();

			// Convert Shopify JSON
			JSONObject finalJson = ShopifyUtil.convertShopifyJson(data);

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
			if (!ArrayUtils.isEmpty(ShopifyUtil.getTags(data)))
				contact.addTags(ShopifyUtil.getTags(data));
			contact.save();

			// Save note to agile user
			Note note = ShopifyUtil.getNote(data);
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
