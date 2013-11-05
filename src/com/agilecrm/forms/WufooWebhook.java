/**
 *  This servlet is used to read wufoo data and add contact with specified properties to 
 *  the associated agile api key owner
 */
package com.agilecrm.forms;

import java.util.ArrayList;
import java.util.Arrays;
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
		String tagString = req.getParameter("HandshakeKey");
	    Contact contact = null;
	    List<ContactField> properties = new ArrayList<ContactField>();

	    // Get fields structure from form data and iterate JSON
	    JSONObject obj = new JSONObject(req.getParameter("FieldStructure"));
	    JSONArray arr = obj.getJSONArray("Fields");
	    for (int i = 0; i < arr.length(); i++)
	    {
		JSONObject json = arr.getJSONObject(i);
		
		// Check if data contains email, search contact based on email
		if(json.getString("Title").contains("email")){
			contact = ContactUtil.searchContactByEmail(req.getParameter(json.getString("ID")));
		
		// If contact is not found create new contact
			if(contact==null)
				contact = new Contact();
		}
		// If data does not contain email create new contact
		else contact = new Contact();

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
	    // Format tagString and split into tagsWithKey array
	    String[] tagsWithKey = new String[0];
	    tagString = tagString.trim();
		tagString = tagString.replace("/, /g", ",");
		tagsWithKey = tagString.split(",");
		
		// Remove API key from tagsWithKey array
		String[] tags = Arrays.copyOfRange(tagsWithKey, 1, tagsWithKey.length);
	    
	    // Add properties to contact and set contact owner
	    contact.properties = properties;
	    contact.addTags(tags);
	    
	    if (APIKey.getDomainUserKeyRelatedToAPIKey(tagsWithKey[0]) != null)
	    {
		contact.setContactOwner(APIKey.getDomainUserKeyRelatedToAPIKey(tagsWithKey[0]));
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