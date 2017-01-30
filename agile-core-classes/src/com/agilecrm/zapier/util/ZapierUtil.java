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
	if (oldaddress == null) {
	    tester = jsonzap;
	    json.put("name", key);
	    json.put("value", "" + tester + "");
	} else {
	    JSONObject jsonold = new JSONObject(oldaddress);

	    if (!jsonzap.has("address")) {
		if (jsonold.has("address"))
		    jsonzap.put("address", jsonold.getString("address"));
	    }
	    if (!jsonzap.has("city")) {
		if (jsonold.has("city"))
		    jsonzap.put("city", jsonold.getString("city"));
	    }
	    if (!jsonzap.has("state")) {
		if (jsonold.has("state"))
		    jsonzap.put("state", jsonold.getString("state"));
	    }
	    if (!jsonzap.has("zip")) {
		if (jsonold.has("zip"))
		    jsonzap.put("zip", jsonold.getString("zip"));
	    }
	    if (!jsonzap.has("country")) {
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
	try {
	    // Get data and check if email is present
	    JSONObject obj1 = new JSONObject(data);
	    String[] tags1 = new String[0];
	    ObjectMapper mapper = new ObjectMapper();
	    if (!obj1.has("email"))
		return null;

	    // Search contact if email is present else return
	    // null
	    Contact contact1 = ContactUtil.searchContactByEmailZapier(obj1
		    .getString("email").toLowerCase());

	    // Iterate data by keys ignore email key value pair
	    Iterator<?> keys1 = obj1.keys();
	    List<ContactField> input_properties = new ArrayList<ContactField>();
	    contact1.contact_company_id = null;
	    while (keys1.hasNext()) {
		String key = (String) keys1.next();
		if (key.equals("flag"))
		    continue;
		if (key.equals("email"))
		    continue;
		else if (key.equals("tags")) {
		    tags1 = ZapierUtil.getModifiedTag(obj1.getString(key));
		} else {
		    // Create and add contact field to contact
		    JSONObject json = new JSONObject();
		    if (key.equals("address")) {

			String zapaddress = obj1.getString(key);
			JSONObject jsonzap = new JSONObject(zapaddress);
			String oldaddress = contact1
				.getContactFieldValue("ADDRESS");
			json = ZapierUtil.modifyZapierAddress(oldaddress,
				jsonzap, key);

		    } else if (key.equals("phone")) {
			json.put("name", "phone");
			json.put("value", obj1.getString(key));
			json.put("subtype", "work");
		    } else if (key.equals("home_phone_zapier")) {
			json.put("name", "phone");
			json.put("value", obj1.getString(key));
			json.put("subtype", "home");
		    } else if (key.equals("mobile_phone_zapier")) {
			json.put("name", "phone");
			json.put("value", obj1.getString(key));
			json.put("subtype", "mobile");
		    } else if (key.equals("main_phone_zapier")) {
			json.put("name", "phone");
			json.put("value", obj1.getString(key));
			json.put("subtype", "main");
		    } else if (key.equals("home_fax_zapier")) {
			json.put("name", "phone");
			json.put("value", obj1.getString(key));
			json.put("subtype", "home fax");
		    } else if (key.equals("work_fax_zapier")) {
			json.put("name", "phone");
			json.put("value", obj1.getString(key));
			json.put("subtype", "work fax");
		    } else if (key.equals("website")) {
			json.put("name", "website");
			json.put("value", obj1.getString(key));
			json.put("subtype", "URL");
		    } else if (key.equals("skype_website_zapier")) {
			json.put("name", "website");
			json.put("value", obj1.getString(key));
			json.put("subtype", "SKYPE");
		    } else if (key.equals("twitter_website_zapier")) {
			json.put("name", "website");
			json.put("value", obj1.getString(key));
			json.put("subtype", "TWITTER");
		    } else if (key.equals("linkedin_website_zapier")) {
			json.put("name", "website");
			json.put("value", obj1.getString(key));
			json.put("subtype", "LINKEDIN");
		    } else if (key.equals("facebook_website_zapier")) {
			json.put("name", "website");
			json.put("value", obj1.getString(key));
			json.put("subtype", "FACEBOOK");
		    } else if (key.equals("xing_website_zapier")) {
			json.put("name", "website");
			json.put("value", obj1.getString(key));
			json.put("subtype", "XING");
		    } else if (key.equals("feed_website_zapier")) {
			json.put("name", "website");
			json.put("value", obj1.getString(key));
			json.put("subtype", "FEED");
		    } else if (key.equals("googleplus_website_zapier")) {
			json.put("name", "website");
			json.put("value", obj1.getString(key));
			json.put("subtype", "GOOGLE_PLUS");
		    } else if (key.equals("flickr_website_zapier")) {
			json.put("name", "website");
			json.put("value", obj1.getString(key));
			json.put("subtype", "FLICKR");
		    } else if (key.equals("github_website_zapier")) {
			json.put("name", "website");
			json.put("value", obj1.getString(key));
			json.put("subtype", "GITHUB");
		    } else if (key.equals("youtube_website_zapier")) {
			json.put("name", "website");
			json.put("value", obj1.getString(key));
			json.put("subtype", "YOUTUBE");
		    } else {
			json.put("name", key);
			json.put("value", obj1.getString(key));
		    }

		    ContactField field = mapper.readValue(json.toString(),
			    ContactField.class);
		    input_properties.add(field);
		}
	    }
	    // Partial update, send all properties
	    contact1.addPropertiesData(input_properties);
	    if (tags1.length > 0)
		contact1.addTags(PHPAPIUtil.getValidTags(tags1));

	    // Return contact object as String
	    return mapper.writeValueAsString(contact1);
	} catch (Exception e) {
	    e.printStackTrace();
	    return null;
	}

    }

    public static String createContactCanBeDone(String data) {
	try {
	    Contact contact1 = new Contact();
	    List<ContactField> properties = new ArrayList<ContactField>();
	    String[] tags1 = new String[0];

	    // Get data and iterate over keys
	    JSONObject obj1 = new JSONObject(data);
	    Iterator<?> keys = obj1.keys();
	    while (keys.hasNext()) {
		String key = (String) keys.next();
		if (key.equals("flag"))
		    continue;
		if (key.equals("tags")) {
		    tags1 = ZapierUtil.getModifiedTag(obj1.getString(key));
		} else if (key.equals("phone")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "phone";
		    field.value = value;
		    field.subtype = "work";
		    properties.add(field);
		} else if (key.equals("home_phone_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "phone";
		    field.value = value;
		    field.subtype = "home";
		    properties.add(field);
		} else if (key.equals("mobile_phone_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "phone";
		    field.value = value;
		    field.subtype = "mobile";
		    properties.add(field);
		} else if (key.equals("main_phone_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "phone";
		    field.value = value;
		    field.subtype = "main";
		    properties.add(field);
		} else if (key.equals("home_fax_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "phone";
		    field.value = value;
		    field.subtype = "home fax";
		    properties.add(field);
		} else if (key.equals("work_fax_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "phone";
		    field.value = value;
		    field.subtype = "work fax";
		    properties.add(field);
		} else if (key.equals("website")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "website";
		    field.value = value;
		    field.subtype = "URL";
		    properties.add(field);
		} else if (key.equals("skype_website_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "website";
		    field.value = value;
		    field.subtype = "SKYPE";
		    properties.add(field);
		} else if (key.equals("twitter_website_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "website";
		    field.value = value;
		    field.subtype = "TWITTER";
		    properties.add(field);
		} else if (key.equals("linkedin_website_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "website";
		    field.value = value;
		    field.subtype = "LINKEDIN";
		    properties.add(field);
		} else if (key.equals("facebook_website_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "website";
		    field.value = value;
		    field.subtype = "FACEBOOK";
		    properties.add(field);
		} else if (key.equals("xing_website_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "website";
		    field.value = value;
		    field.subtype = "XING";
		    properties.add(field);
		} else if (key.equals("feed_website_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "website";
		    field.value = value;
		    field.subtype = "FEED";
		    properties.add(field);
		} else if (key.equals("googleplus_website_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "website";
		    field.value = value;
		    field.subtype = "GOOGLE_PLUS";
		    properties.add(field);
		} else if (key.equals("flickr_website_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "website";
		    field.value = value;
		    field.subtype = "FLICKR";
		    properties.add(field);
		} else if (key.equals("github_website_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "website";
		    field.value = value;
		    field.subtype = "GITHUB";
		    properties.add(field);
		} else if (key.equals("youtube_website_zapier")) {
		    ContactField field = new ContactField();
		    String value = obj1.getString(key);
		    field.name = "website";
		    field.value = value;
		    field.subtype = "YOUTUBE";
		    properties.add(field);
		} else {
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
		count = ContactUtil.searchContactCountByEmail(obj1.getString(
			"email").toLowerCase());

	    System.out.println("contacts available" + count);
	    if (count != 0) {
		System.out.println("duplicate contact");
		return null;
	    }

	    // Add properties list to contact properties
	    contact1.properties = properties;
	    // Add source as zapier
	    contact1.source = "zapier";
	    
	    if (tags1.length > 0)
		contact1.addTags(PHPAPIUtil.getValidTags(tags1));
	    else
		contact1.save();

	    ObjectMapper mapper1 = new ObjectMapper();
	    return mapper1.writeValueAsString(contact1);
	} catch (Exception e) {
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

    public static List<ContactField> getAllPropertiesCreateContact(String data)
	    throws JSONException {
	List<ContactField> properties = new ArrayList<ContactField>();
	JSONObject obj = new JSONObject(data);
	Iterator<?> keys = obj.keys();
	while (keys.hasNext()) {
	    String key = (String) keys.next();

	    if (key.equals("flag"))
		continue;
	    // If key equals to tags, format tags String and prepare tags
	    // array
	    if (key.equals("tags")) {
		System.out.println("Tag encounterd");
	    } else if (key.equals("phone")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "phone";
		field.value = value;
		field.subtype = "work";
		properties.add(field);
	    } else if (key.equals("home_phone_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "phone";
		field.value = value;
		field.subtype = "home";
		properties.add(field);
	    } else if (key.equals("mobile_phone_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "phone";
		field.value = value;
		field.subtype = "mobile";
		properties.add(field);
	    } else if (key.equals("main_phone_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "phone";
		field.value = value;
		field.subtype = "main";
		properties.add(field);
	    } else if (key.equals("home_fax_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "phone";
		field.value = value;
		field.subtype = "home fax";
		properties.add(field);
	    } else if (key.equals("work_fax_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "phone";
		field.value = value;
		field.subtype = "work fax";
		properties.add(field);
	    } else if (key.equals("website")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "website";
		field.value = value;
		field.subtype = "URL";
		properties.add(field);
	    } else if (key.equals("skype_website_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "website";
		field.value = value;
		field.subtype = "SKYPE";
		properties.add(field);
	    } else if (key.equals("twitter_website_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "website";
		field.value = value;
		field.subtype = "TWITTER";
		properties.add(field);
	    } else if (key.equals("linkedin_website_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "website";
		field.value = value;
		field.subtype = "LINKEDIN";
		properties.add(field);
	    } else if (key.equals("facebook_website_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "website";
		field.value = value;
		field.subtype = "FACEBOOK";
		properties.add(field);
	    } else if (key.equals("xing_website_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "website";
		field.value = value;
		field.subtype = "XING";
		properties.add(field);
	    } else if (key.equals("feed_website_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "website";
		field.value = value;
		field.subtype = "FEED";
		properties.add(field);
	    } else if (key.equals("googleplus_website_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "website";
		field.value = value;
		field.subtype = "GOOGLE_PLUS";
		properties.add(field);
	    } else if (key.equals("flickr_website_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "website";
		field.value = value;
		field.subtype = "FLICKR";
		properties.add(field);
	    } else if (key.equals("github_website_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "website";
		field.value = value;
		field.subtype = "GITHUB";
		properties.add(field);
	    } else if (key.equals("youtube_website_zapier")) {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = "website";
		field.value = value;
		field.subtype = "YOUTUBE";
		properties.add(field);
	    } else {
		ContactField field = new ContactField();
		String value = obj.getString(key);
		field.name = key;
		field.value = value;
		field.type = PHPAPIUtil.getFieldTypeFromName(key);
		properties.add(field);
	    }
	}
	return properties;
    }

}