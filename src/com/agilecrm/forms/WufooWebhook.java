/**
 *  This servlet is used to read wufoo data and add contact with specified properties to 
 *  the associated agile api key owner
 */
package com.agilecrm.forms;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.util.ContactUtil;

@SuppressWarnings("serial")
public class WufooWebhook extends HttpServlet
{
    protected void service(HttpServletRequest req, HttpServletResponse res)
    {
	try
	{
	    // Read hand shake key (agile API key) to authenticate data
	    String apiKey = req.getParameter("HandshakeKey");
	    Contact contact = new Contact();
	    List<ContactField> properties = new ArrayList<ContactField>();

	    // Get fields structure from form data and iterate JSON
	    JSONObject obj = new JSONObject(req.getParameter("FieldStructure"));
	    JSONArray arr = obj.getJSONArray("Fields");
	    for (int i = 0; i < arr.length(); i++)
	    {
		JSONObject json = arr.getJSONObject(i);

		// Add properties to list of properties
		properties.add(buildProperty(json.getString("Title"), req.getParameter(json.getString("ID"))));
		Iterator<?> keys = json.keys();
		while (keys.hasNext())
		{
		    // Iterate subfields
		    String key = (String) keys.next();
		    if (key.equals("SubFields"))
		    {
			JSONArray subArr = json.getJSONArray("SubFields");
			for (int j = 0; j < subArr.length(); j++)
			{
			    JSONObject subObj = subArr.getJSONObject(j);

			    // Add properties to list of properties
			    properties.add(buildProperty(subObj.getString("Label"),
				    req.getParameter(subObj.getString("ID"))));
			}
		    }
		}
	    }
	    // Add properties to contact and set contact owner
	    contact.properties = properties;
	    if (APIKey.getDomainUserKeyRelatedToAPIKey(apiKey) != null)
	    {
		contact.setContactOwner(APIKey.getDomainUserKeyRelatedToAPIKey(apiKey));
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
	name = name.toLowerCase();
	ContactField field = new ContactField();

	// Set field type to SYSTEM for name, email, company, title, phone, all
	// other fields save as CUSTOM.
	if (name.equals("name") || name.equals("first") || name.equalsIgnoreCase("first name"))
	{
	    field.name = Contact.FIRST_NAME;
	    field.type = FieldType.SYSTEM;
	    field.value = value;
	}
	else if (name.equals("last") || name.equalsIgnoreCase("last name"))
	{
	    field.name = Contact.LAST_NAME;
	    field.type = FieldType.SYSTEM;
	    field.value = value;
	}
	else if (name.contains("organisation") || name.contains("organization") || name.equals(Contact.COMPANY))
	{
	    field.name = Contact.COMPANY;
	    field.value = value;
	    field.type = FieldType.SYSTEM;
	}
	else if (name.contains("designation") || name.equals(Contact.TITLE))
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