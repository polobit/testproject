/**
 * This servlet is used to read gravity form data and create contact 
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
public class GravityForm extends HttpServlet
{
	protected void service(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException
	{
		try
		{
			// Get API Key with tags
			String tagString = req.getParameter("api-key");
			List<ContactField> properties = new ArrayList<ContactField>();

			// Get JSON data
			JSONObject obj = new JSONObject(req.getParameter("data"));

			// Get email from JSON and search for contact
			String email = obj.getString("email");
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

				// Get value of form field
				String value = obj.get(key).toString();

				if (!StringUtils.isBlank(value))
				{

					// Build Address JSON
					if (key.equalsIgnoreCase("country"))
						addJson.put("country", value);

					else if (key.equalsIgnoreCase("state"))
						addJson.put("state", value);

					else if (key.equalsIgnoreCase("city"))
						addJson.put("city", value);

					else if (key.equalsIgnoreCase("zip") || key.equalsIgnoreCase("zip code")
							|| key.equalsIgnoreCase("postal code"))
						addJson.put("zip", value);

					else if (key.equalsIgnoreCase("street address") || key.equalsIgnoreCase("location")
							|| key.equalsIgnoreCase("street"))
						addJson.put("address", value);

					else

						// Add property to list of properties
						properties.add(FormsUtil.gravityBuildProperty(key, value));
				}
			}
			if (addJson.length() != 0)
				properties.add(FormsUtil.gravityBuildProperty(Contact.ADDRESS, addJson.toString()));

			// Format tagString and split into tagsWithKey array
			tagString = tagString.trim();
			tagString = tagString.replace("/, /g", ",");
			String[] tagsWithKey = tagString.split(",");

			// Get tags from tagsWithKey array and set contact owner
			String[] tags = Arrays.copyOfRange(tagsWithKey, 1, tagsWithKey.length);
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