/**
 * This servlet is used to read unbounce data and create contact 
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
public class UnbounceWebhook extends HttpServlet
{
    protected void service(HttpServletRequest req, HttpServletResponse response) throws IOException, ServletException
    {
	try
	{
	    // Get API key
	    String tagString = req.getParameter("api-key");

	    // Send Error if API Key is missing
	    if (StringUtils.isEmpty(tagString))
	    {
		response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Bad Request: API Key is missing");
		return;
	    }

	    // Format tagsString for spaces
	    tagString = tagString.trim();
	    tagString = tagString.replace("/, /g", ",");

	    // Split tagString and separate tags, API key
	    String[] tagsWithKey = tagString.split(",");
	    String[] tags = Arrays.copyOfRange(tagsWithKey, 1, tagsWithKey.length);

	    // Get owner from API
	    Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(tagsWithKey[0]);

	    // Send Error if owner is not found
	    if (owner == null)
	    {
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
		        "Unauthorized: No owner exists with this API Key - " + tagsWithKey[0]);
		return;
	    }

	    // Define properties list (ContactField)
	    List<ContactField> properties = new ArrayList<ContactField>();

	    // Get post data from unbounce and convert to json {"name": "value"}
	    JSONObject obj = new JSONObject(req.getParameter("data.json"));
	    JSONObject finalJson = convertUnbounceJson(obj);

	    // Define contact
	    Contact contact = null;

	    // Check if email exists in json, if yes search for contact
	    if (!StringUtils.isBlank(finalJson.optString(Contact.EMAIL)))
		contact = ContactUtil.searchContactByEmail(finalJson.getString(Contact.EMAIL));
	    else
	    {
		response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Bad Request: Email is missing");
		return;
	    }

	    // If contact is null create new contact
	    if (contact == null)
		contact = new Contact();

	    // Build agile contact fields from finalJson
	    FormsUtil.jsonToAgile(finalJson, properties, null);

	    if (owner != null)
	    {
		// Set contact owner, update properties and save contact
		contact.setContactOwner(owner);
		contact.properties = FormsUtil.updateContactProperties(properties, contact.properties);

		if(tags != null && tags.length > 0)
		    contact.addTags(FormsUtil.getValidTags(tags));
		else
		    contact.save();
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();

	    // Send error back to the client
	    response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error: " + e.getMessage());
	    System.out.println("Error is " + e.getMessage());
	    return;
	}
    }

    public static JSONObject convertUnbounceJson(JSONObject json)
    {
	try
	{
	    // Define finalJson
	    JSONObject finalJson = new JSONObject();

	    // Define name, value
	    String name;
	    String value;

	    // Remove default keys from unbounce data
	    json.remove("variant");
	    json.remove("page_uuid");
	    json.remove("page_url");
	    json.remove("date_submitted");
	    json.remove("time_submitted");

	    // Iterate keys and replace with agile field names
	    Iterator<?> keys = json.keys();
	    while (keys.hasNext())
	    {
		String regex = "\\[|\\]";
		name = (String) keys.next();
		value = json.getString(name);
		value = value.replaceAll(regex, "");
		value = value.replaceAll("\"", "");

		// If value is not null, put in finalJson
		if (!StringUtils.isBlank(value))
		{
		    name = FormsUtil.getFieldName(name);
		    finalJson.put(name, value);
		}
	    }
	    return finalJson;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Error is " + e.getMessage());
	    return null;
	}
    }
}