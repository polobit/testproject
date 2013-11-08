/**
 * This servlet is used to read gravity form data and create contact 
 * with properties specified to associated agile API key owner
 */
package com.agilecrm.forms;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

			// Iterate over JSON data to get form fields
			Iterator<?> keys = obj.keys();
			while (keys.hasNext())
			{
				// Get name of form field
				String key = (String) keys.next();

				// Get value of form field
				String value = obj.get(key).toString();

				// Add property to list of properties
				properties.add(buildProperty(key, value, contact));
			}

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
				contact.properties = properties;
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

	public static ContactField buildProperty(String name, String value, Contact contact)
	{
		// Get contact field of contact, based on its name
		ContactField field = contact.getContactFieldByName(name);
		if (field == null)
			field = new ContactField();

		// Set field type to SYSTEM for name, email, company, title, phone, all
		// other fields save as CUSTOM.
		if (name.equals(Contact.FIRST_NAME))
		{
			field.name = Contact.FIRST_NAME;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.equals(Contact.LAST_NAME))
		{
			field.name = Contact.LAST_NAME;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.contains("organisation") || name.contains("organization") || name.equals(Contact.COMPANY))
		{
			field.name = Contact.COMPANY;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.equals("designation") || name.equals(Contact.TITLE))
		{
			field.name = Contact.TITLE;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.contains("phone"))
		{
			field.name = "phone";
			field.value = value;
			field.type = FieldType.SYSTEM;
			field.subtype = "work";
		}
		else if (name.contains("mobile"))
		{
			field.name = "phone";
			field.value = value;
			field.type = FieldType.SYSTEM;
			field.subtype = "home";
		}
		else if (name.contains("email"))
		{
			if (ContactUtil.isValidEmail(value))
			{
				field.name = Contact.EMAIL;
				field.value = value;
				field.type = FieldType.SYSTEM;
			}
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