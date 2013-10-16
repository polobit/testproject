/**
 * This servlet is used to read unbounce data and create contact 
 * with properties specified to associated agile api key owner
 */
package com.agilecrm.forms;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.util.ContactUtil;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

@SuppressWarnings("serial")
public class GravityForm extends HttpServlet
{
    protected void service(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException
    {
	try
	{
	    // Read API Key
	    String apiKey = req.getParameter("api-key");

	    Contact contact = new Contact();
	    List<ContactField> properties = new ArrayList<ContactField>();

	    // Read JSON data
	    JSONObject obj = new JSONObject(req.getParameter("data"));

	    // Iterate over JSON data to get form fields
	    Iterator<?> keys = obj.keys();
	    while (keys.hasNext())
	    {
		// Get name of form field
		String key = (String) keys.next();

		// Get value of form field
		String value = obj.get(key).toString();

		// Add property to list of properties
		properties.add(buildProperty(key, value));
	    }
	    // Add properties to contact and set contact owner
	    contact.properties = properties;
	    if (APIKey.getDomainUserRelatedToAPIKey(apiKey) != null)
	    {
		contact.setContactOwner(APIKey.getDomainUserKeyRelatedToAPIKey(apiKey));

		// Save contact
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
	ContactField field = new ContactField();

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