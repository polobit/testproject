/**
 * This servlet is used to read unbounce data and create contact 
 * with properties specified to associated agile API key owner
 */
package com.thirdparty.forms;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class UnbounceWebhook extends HttpServlet
{
	protected void service(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException
	{
		try
		{
			// Get API Key with tags
			String tagString = req.getParameter("api-key");
			List<ContactField> properties = new ArrayList<ContactField>();

			// Get JSON data
			JSONObject obj = new JSONObject(req.getParameter("data.json"));
			obj.remove("variant");
			obj.remove("page_uuid");
			obj.remove("page_url");
			obj.remove("date_submitted");
			obj.remove("time_submitted");

			// Get email from JSON and format
			String email = obj.getString("email");
			String reg = "\\[|\\]";
			email = email.replaceAll(reg, "");
			email = email.replaceAll("\"", "");

			// Search contact based on email
			Contact contact = ContactUtil.searchContactByEmail(email);
			if (contact == null)
				contact = new Contact();

			// Address JSON
			JSONObject addJson = new JSONObject();

			// Iterate over JSON data to get form fields
			Iterator<?> keys = obj.keys();
			while (keys.hasNext())
			{
				// Get name of form field
				String key = (String) keys.next();

				// Get value of form field and format
				String value = obj.get(key).toString();
				String regex = "\\[|\\]";
				value = value.replaceAll(regex, "");
				value = value.replaceAll("\"", "");

				if (!StringUtils.isBlank(value))
				{

					// Build address JSON
					if (key.equalsIgnoreCase("country"))
						addJson.put("country", value);

					else if (key.equalsIgnoreCase("state"))
						addJson.put("state", value);

					else if ((key.equalsIgnoreCase("province")) && !StringUtils.isBlank(value))
						addJson.put("city", value);

					else if ((key.equalsIgnoreCase("zip") || key.equalsIgnoreCase("zip code") || key
							.equalsIgnoreCase("postal code")))
						addJson.put("zip", value);

					else if ((key.equalsIgnoreCase("street address") || key.equalsIgnoreCase("location") || key
							.equalsIgnoreCase("street")))
						addJson.put("address", value);

					else if (key.equalsIgnoreCase("stateprovince"))
						addJson.put("state", value);

					else

						// Add property to list of properties
						properties.add(FormsUtil.unbounceBuildProperty(key, value));
				}
			}
			if (addJson.length() != 0)
				properties.add(FormsUtil.unbounceBuildProperty(Contact.ADDRESS, addJson.toString()));

			// Format tagString and split into tagsWithKey array
			tagString = tagString.trim();
			tagString = tagString.replace("/, /g", ",");
			String[] tagsWithKey = tagString.split(",");

			// Get tags from tagsWithKey array
			String[] tags = Arrays.copyOfRange(tagsWithKey, 1, tagsWithKey.length);

			// Set contact owner
			Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(tagsWithKey[0]);
			if (owner != null)
			{
				contact.setContactOwner(owner);

				// Add properties to contact and set contact owner
				contact.properties = FormsUtil.updateContactProperties(properties, contact.properties);
				contact.addTags(tags);
				contact.save();
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return;
		}
	}
}