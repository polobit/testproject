/**
 * This servlet is used to read gravity form data and create contact 
 * with properties specified to associated agile API key owner
 */
package com.thirdparty;

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
import com.agilecrm.contact.ContactField.FieldType;
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
						properties.add(buildProperty(key, value));
				}
			}
			if (addJson.length() != 0)
				properties.add(buildProperty(Contact.ADDRESS, addJson.toString()));

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
				List<ContactField> newProperties = properties;
				List<ContactField> oldProperties = contact.properties;
				List<ContactField> updatedProperties = new ArrayList<ContactField>();
				List<ContactField> outdatedProperties = new ArrayList<ContactField>();

				if (oldProperties.size() != 0)
				{
					for (ContactField oldProperty : oldProperties)
					{
						for (ContactField newProperty : newProperties)
						{
							if (StringUtils.equals(oldProperty.name, newProperty.name)
									&& (StringUtils.equals(oldProperty.subtype, newProperty.subtype)))
							{
								outdatedProperties.add(oldProperty);
							}
						}
					}
					oldProperties.removeAll(outdatedProperties);
					updatedProperties.addAll(oldProperties);
				}
				updatedProperties.addAll(newProperties);
				contact.properties = updatedProperties;
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

	public static ContactField buildProperty(String name, String value)
	{
		// Initialize ContactField
		ContactField field = new ContactField();

		// Set field type to SYSTEM for name, email, company, title, phone, all
		// other fields save as CUSTOM.
		if (name.equalsIgnoreCase(Contact.FIRST_NAME) || name.equalsIgnoreCase("name")
				|| name.equalsIgnoreCase("first name") || name.equalsIgnoreCase("first"))
		{
			field.name = Contact.FIRST_NAME;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.equalsIgnoreCase(Contact.LAST_NAME) || name.equalsIgnoreCase("last name")
				|| name.equalsIgnoreCase("last"))
		{
			field.name = Contact.LAST_NAME;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("organisation") || name.toLowerCase().contains("organization")
				|| name.toLowerCase().equals(Contact.COMPANY))
		{
			field.name = Contact.COMPANY;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.equalsIgnoreCase("designation") || name.equalsIgnoreCase(Contact.TITLE))
		{
			field.name = Contact.TITLE;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("phone"))
		{
			field.name = "phone";
			field.value = value;
			field.type = FieldType.SYSTEM;
			field.subtype = "work";
		}
		else if (name.toLowerCase().contains("mobile"))
		{
			field.name = "phone";
			field.value = value;
			field.type = FieldType.SYSTEM;
			field.subtype = "home";
		}
		else if (name.toLowerCase().contains("email"))
		{
			if (ContactUtil.isValidEmail(value))
			{
				field.name = Contact.EMAIL;
				field.value = value;
				field.type = FieldType.SYSTEM;
			}
		}
		else if (name.toLowerCase().contains("website"))
		{
			field.name = Contact.WEBSITE;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.equals("address"))
		{
			field.name = Contact.ADDRESS;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else
		{
			field.name = name;
			field.value = value;
			field.type = FieldType.CUSTOM;
		}
		return field;
	}
}