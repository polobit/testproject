/**
 * This servlet is used to read gravity form data and create contact 
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
public class GravityForm extends HttpServlet
{
    protected void service(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException
    {
	try
	{
	    // Get API key and tags
	    String tagString = req.getParameter("api-key");

	    // Format tagString for spaces
	    tagString = tagString.trim();
	    tagString = tagString.replace("/, /g", ",");

	    // Split tagString and separate tags and API key
	    String[] tagsWithKey = tagString.split(",");
	    String[] tags = Arrays.copyOfRange(tagsWithKey, 1, tagsWithKey.length);

	    // Get owner from API key
	    Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(tagsWithKey[0]);

	    // Define properties list (ContactField)
	    List<ContactField> properties = new ArrayList<ContactField>();

	    // Get data from gravity plugin and convert to finalJson {"name":
	    // "value"}
	    JSONObject json = new JSONObject(req.getParameter("data"));
	    JSONObject finalJson = convertGravityJson(json);

	    // Define contact
	    Contact contact = null;

	    // Check if email exists in finalJson, if yes search for contact
	    if (!StringUtils.isBlank(finalJson.optString(Contact.EMAIL)))
		contact = ContactUtil.searchContactByEmail(finalJson.getString(Contact.EMAIL));

	    // If contact is null create new contact
	    if (contact == null)
		contact = new Contact();

	    // Build agile contactfield (SYSTEM / CUSTOM) from finalJson
	    FormsUtil.jsonToAgile(finalJson, properties, null);

	    if (owner != null)
	    {
		// Set contact owner, update contact properties, save contact
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
	    System.out.println("Error is " + e.getMessage());
	    return;
	}
    }

    public static JSONObject convertGravityJson(JSONObject json)
    {
	try
	{
	    // Define finalJson
	    JSONObject finalJson = new JSONObject();

	    // Define name, value
	    String name;
	    String value;

	    // Iterate keys and replace with agile field keys
	    Iterator<?> keys = json.keys();
	    while (keys.hasNext())
	    {
		name = (String) keys.next();
		value = json.getString(name);

		// If value is not null, update finalJson
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