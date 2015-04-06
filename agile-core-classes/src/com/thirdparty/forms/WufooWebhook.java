package com.thirdparty.forms;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class WufooWebhook extends HttpServlet
{
    public void service(HttpServletRequest req, HttpServletResponse res)
    {
	try
	{
	    // Get API key and tags
	    String tagString = req.getParameter("HandshakeKey");

	    // Format tagsSting for spaces
	    tagString = tagString.trim();
	    tagString = tagString.replace("/, /g", ",");

	    // Split tagsString into string array and separate tags, API key
	    String[] tagsWithKey = tagString.split(",");
	    String[] tags = Arrays.copyOfRange(tagsWithKey, 1, tagsWithKey.length);

	    // Get domain user from API key
	    Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(tagsWithKey[0]);

	    // Create note(Note) and properties(ContactField) list
	    List<Note> notes = new ArrayList<Note>();
	    List<ContactField> properties = new ArrayList<ContactField>();

	    // Get post data from wufoo
	    JSONObject wufooJson = new JSONObject(req.getParameter("FieldStructure"));
	    JSONArray wufooArray = wufooJson.getJSONArray("Fields");

	    JSONObject json = new JSONObject();

	    // Convert wufoo post data as json {"name": "value"}
	    JSONObject finalJson = convertWufooJson(wufooArray, req, json);

	    System.out.println("finalJson is: " + finalJson);

	    // Define contact
	    Contact contact = null;

	    // Check if email present in finalJson, if yes search for contact
	    if (!StringUtils.isBlank(finalJson.optString(Contact.EMAIL)))
		contact = ContactUtil.searchContactByEmail(finalJson.getString(Contact.EMAIL));

	    // If contact is null search for contact
	    if (contact == null)
		contact = new Contact();

	    // Build agile contact fields (SYSTEM / CUSTOM) from finalJson
	    FormsUtil.jsonToAgile(finalJson, properties, notes);

	    System.out.println("properties are: " + properties);

	    if (owner != null)
	    {
		// Get agile user, assign contact owner, update contact
		// properties, save contact
		Key<AgileUser> user = new Key<AgileUser>(AgileUser.class, owner.getId());
		contact.setContactOwner(owner);
		contact.properties = FormsUtil.updateContactProperties(properties, contact.properties);

		if(tags != null && tags.length > 0)
		    contact.addTags(FormsUtil.getValidTags(tags));
		else
		    contact.save();

		// Get agile user, assign user, save notes if owner exists
		for (Note note : notes)
		{
		    note.addRelatedContacts(contact.id.toString());
		    note.created_time = System.currentTimeMillis() / 1000;
		    note.setOwner(user);
		    note.save();
		}
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Error is " + e.getMessage());
	    return;
	}
    }

    public static JSONObject convertWufooJson(JSONArray array, HttpServletRequest req, JSONObject finalJson)
    {
	try
	{
	    for (int i = 0; i < array.length(); i++)
	    {
		JSONObject json = array.getJSONObject(i);
		String name = null;

		if (!StringUtils.isBlank(json.optString("Type")) && StringUtils.equals("textarea", json.getString("Type")))
		    name = json.getString("Title") + " " + "agilenote";

		else if (!StringUtils.isBlank(json.optString("Type")) && StringUtils.equals("checkbox", json.getString("Type")))
		{
		    finalJson.put(json.getString("Title") + " " + "agilecheckbox agilecustomfield", checkboxValue(json.getJSONArray("SubFields"), req));
		    continue;
		}
		else if (!StringUtils.isBlank(json.optString("Type"))
			&& (StringUtils.equals("date", json.getString("Type")) || StringUtils.equals("eurodate", json.getString("Type")))
			&& (!StringUtils.isBlank(req.getParameter(json.getString("ID")))))
		{
		    finalJson.put(json.getString("Title") + " " + "agilecustomfield", dateFieldValue(req.getParameter(json.getString("ID"))));
		    continue;
		}

		else if (!StringUtils.isBlank(json.optString("SubFields")))
		    convertWufooJson(json.getJSONArray("SubFields"), req, finalJson);

		String value = req.getParameter(json.getString("ID"));
		if (!StringUtils.isBlank(value))
		{
		    name = !StringUtils.isBlank(name) ? name : StringUtils.isBlank(json.optString("Label")) ? json.getString("Title") : json.getString("Label");
		    name = FormsUtil.getFieldName(name);
		    finalJson.put(name, value);
		}
	    }
	    return finalJson;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("error is " + e.getMessage());
	    return null;
	}
    }

    public static String checkboxValue(JSONArray subarray, HttpServletRequest req)
    {
	try
	{
	    String checkboxValue = null;
	    for (int i = 0; i < subarray.length(); i++)
	    {
		JSONObject subjson = subarray.getJSONObject(i);
		String option = req.getParameter(subjson.getString("ID"));
		if (!StringUtils.isBlank(option))
		{
		    if (!StringUtils.isBlank(checkboxValue))
			checkboxValue = checkboxValue + ", " + option;
		    else
			checkboxValue = option;
		}
	    }
	    return checkboxValue;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("error is " + e.getMessage());
	    return null;
	}
    }

    public static String dateFieldValue(String date)
    {
	SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
	try
	{
	    Date simpleDate = simpleDateFormat.parse(date);
	    Long epochDate = simpleDate.getTime() / 1000;
	    return epochDate.toString();
	}
	catch (ParseException e)
	{
	    return date;
	}
    }
}