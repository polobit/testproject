package com.agilecrm.zapier.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.util.PHPAPIUtil;

public class ZapierUtil {

    public static JSONObject modifyZapierAddress(String oldaddress,
	    JSONObject jsonzap, String key) throws JSONException {
	JSONObject json = new JSONObject();
	JSONObject tester = new JSONObject();
	if (oldaddress == null)
	{
	    tester = jsonzap;
	    json.put("name", key);
	    json.put("value", "" + tester + "");
	}
	else
	{   
	    JSONObject jsonold = new JSONObject(oldaddress);

	    if (!jsonzap.has("address"))
	    {
		if (jsonold.has("address"))
		    jsonzap.put("address", jsonold.getString("address"));
	    }
	    if (!jsonzap.has("city"))
	    {
		if (jsonold.has("city"))
		    jsonzap.put("city", jsonold.getString("city"));
	    }
	    if (!jsonzap.has("state"))
	    {
		if (jsonold.has("state"))
		    jsonzap.put("state", jsonold.getString("state"));
	    }
	    if (!jsonzap.has("zip"))
	    {
		if (jsonold.has("zip"))
		    jsonzap.put("zip", jsonold.getString("zip"));
	    }
	    if (!jsonzap.has("country"))
	    {
		if (jsonold.has("country"))
		    jsonzap.put("country", jsonold.getString("country"));
	    }
	    tester = jsonzap;
	    json.put("name", key);
	    json.put("value", "" + tester + "");
	}
	return json;
    }

    public static String updateContactCanBeDone(String data) {
	try
	{
	    // Get data and check if email is present
	    JSONObject obj1 = new JSONObject(data);
	    String[] tags1 = new String[0];
	    ObjectMapper mapper = new ObjectMapper();
	    if (!obj1.has("email"))
		return null;

	    // Search contact if email is present else return
	    // null
	    Contact contact1 = ContactUtil.searchContactByEmailZapier(obj1.getString("email")
		    .toLowerCase());

	    // Iterate data by keys ignore email key value pair
	    Iterator<?> keys1 = obj1.keys();
	    List<ContactField> input_properties = new ArrayList<ContactField>();
	    contact1.contact_company_id = null;
	    while (keys1.hasNext())
	    {
		String key = (String) keys1.next();
		if (key.equals("flag"))
		    continue;
		if (key.equals("email"))
		    continue;
		else if (key.equals("tags"))
		{
		    tags1 = ZapierUtil.getModifiedTag(obj1.getString(key));
		}
		else
		{
		    // Create and add contact field to contact
		    JSONObject json = new JSONObject();
		    if (key.equals("address"))
		    {

			String zapaddress = obj1.getString(key);
			JSONObject jsonzap = new JSONObject(zapaddress);
			String oldaddress = contact1.getContactFieldValue("ADDRESS");
			json = ZapierUtil.modifyZapierAddress(oldaddress,jsonzap,key);

		    }
		    else
		    {
			json.put("name", key);
			json.put("value", obj1.getString(key));
		    }

		    ContactField field = mapper.readValue(json.toString(), ContactField.class);
		    input_properties.add(field);
		}
	    }
	    // Partial update, send all properties
	    contact1.addPropertiesData(input_properties);
	    if (tags1.length > 0)
		contact1.addTags(PHPAPIUtil.getValidTags(tags1));

	    // Return contact object as String
	    return mapper.writeValueAsString(contact1);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	
    }

    public static String createContactCanBeDone(String data) {
	try
	{
	    Contact contact1 = new Contact();
	    List<ContactField> properties = new ArrayList<ContactField>();
	    String[] tags1 = new String[0];

	    // Get data and iterate over keys
	    JSONObject obj1 = new JSONObject(data);
	    Iterator<?> keys = obj1.keys();
	    while (keys.hasNext())
	    {
		String key = (String) keys.next();
		if (key.equals("flag"))
		    continue;
		// If key equals to tags, format tags String and
		// prepare
		// tags
		// array
		if (key.equals("tags"))
		{
		    tags1 = ZapierUtil.getModifiedTag(obj1.getString(key));
		}
		// Prepare Contact Field and add to properties
		// list
		else
		{
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = key;
		    field.value = value;
		    field.type = PHPAPIUtil.getFieldTypeFromName(key);
		    properties.add(field);
		}
	    }

	    int count = 0;

	    if (obj1.has("email"))
		count = ContactUtil.searchContactCountByEmail(obj1.getString("email").toLowerCase());

	    System.out.println("contacts available" + count);
	    if (count != 0)
	    {
		System.out.println("duplicate contact");
		return null;
	    }

	    // Add properties list to contact properties
	    contact1.properties = properties;
	    if (tags1.length > 0)
		contact1.addTags(PHPAPIUtil.getValidTags(tags1));
	    else
		contact1.save();

	    ObjectMapper mapper1 = new ObjectMapper();
	    return mapper1.writeValueAsString(contact1);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static String[] getModifiedTag(String tagString) {
	 tagString = tagString.trim();
	 tagString = tagString.replace("/ /g", " ");
	 tagString = tagString.replace("/, /g", ",");
	 return tagString.split(",");
    }

}