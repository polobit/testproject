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
import com.google.appengine.labs.repackaged.org.json.JSONObject;

@SuppressWarnings("serial")
public class UnbounceWebhook extends HttpServlet
{
protected void service(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException
{
	try
	{	
		//we need to append agile api key to webhook integration url for it work
		String apiKey = req.getParameter("api-key");
		
		Contact contact = new Contact();
		List<ContactField> properties = new ArrayList<ContactField>();
		
		System.out.println(req.getParameter("json.data"));
		
		JSONObject obj = new JSONObject(req.getParameter("json.data"));
		Iterator<?> keys = obj.keys();
		while(keys.hasNext())
		{
			String key = (String) keys.next();
		    String value = obj.get(key).toString();
		    String regex = "\\[|\\]";
		    value = value.replaceAll(regex, "");
		    value = value.replaceAll("\"", "");
			properties.add(buildProperty(key, value));
			
		}
		System.out.println("properties" + properties);
		contact.properties = properties;
		contact.setContactOwner(APIKey.getDomainUserKeyRelatedToAPIKey(apiKey));
		contact.save();
	}
	catch(Exception e)
	{
		e.printStackTrace();
		return;
	}
}

public static ContactField buildProperty(String name, String value)
{
	ContactField field = new ContactField();
	if (name.equals("first_name") || name.equals("last_name") || name.equals("email") || name.equals("company") || name.equals("title") || name.equals("organisation")
			|| name.equals("organization") || name.equals("designation") || name.equals("name") || name.equals("phone") || name.equals("phone_number") || name.equals("mobile"))
	{
		field.type = FieldType.SYSTEM;
	}
	else field.type = FieldType.CUSTOM;
	
	if (name.equals("name"))
	{
	field.name = "first_name";
	String[] nameArray = value.split(" ");
	field.value = nameArray[0];
	return field;
	}
	else if (name.equals("organisation")||name.equals("organization"))
	{
	field.name = "company";
	field.value = value;
	return field;
	}
	else if (name.equals("designation"))
	{
	field.name = "title";
	field.value = value;
	return field;
	}
	else if (name.equals("phone_number") || name.equals("phone"))
	{
	field.name = "phone";
	field.value = value;
	field.subtype = "work";
	}
	else if (name.equals("mobile"))
	{
	field.name = "phone";
	field.value = value;
	field.subtype = "home";
	}
	else 
	field.name = name;
	field.value = value;
	return field;
}
}