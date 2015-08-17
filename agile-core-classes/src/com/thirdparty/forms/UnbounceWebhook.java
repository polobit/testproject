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

/**
 * <h1>UnbounceWebhook</h1>
 *
 * <p>
 * Servlet to handle <b>Unbounce Webhook</b> requests
 * </p>
 *
 * @author agile
 * @version 1.0
 * @since 2013-12-31
 */
@SuppressWarnings("serial")
public class UnbounceWebhook extends HttpServlet
{
    /**
     * This Method handles the Unbounce Webhook HTTP requests
     *
     * @param req
     *            WufooWebhook HTTP request Object
     * @param res
     *            WufooWebhook HTTP response Object
     * @return void
     */
    protected void service(HttpServletRequest req, HttpServletResponse response) throws IOException, ServletException
    {
	try
	{
	    // Read query parameter 'api-key' for Agile REST API Key & Contact
	    // tags
	    String tagString = req.getParameter("api-key");
	    if (StringUtils.isEmpty(tagString))
	    {
		response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Bad Request: API Key is missing");
		return;
	    }

	    // Remove trailing spaces & split at "," to separate API Key &
	    // contact tags
	    tagString = tagString.trim();
	    tagString = tagString.replace("/, /g", ",");
	    String[] tagsWithKey = tagString.split(",");
	    String[] tags = Arrays.copyOfRange(tagsWithKey, 1, tagsWithKey.length);

	    // Get owner from API Key to assign to contact
	    Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(tagsWithKey[0]);
	    if (owner == null)
	    {
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
		        "Unauthorized: No owner exists with this API Key - " + tagsWithKey[0]);
		return;
	    }

	    // Get POST data from Unbounce and convert to JSON Object
	    // 'finalJson'
	    JSONObject obj = new JSONObject(req.getParameter("data.json"));
	    JSONObject finalJson = convertUnbounceJson(obj);

	    // Return if no email in finalJson to avoid duplicate contacts
	    if (StringUtils.isBlank(finalJson.optString(Contact.EMAIL)))
	    {
		response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Bad Request: Email is missing");
		return;
	    }
	    Contact contact = ContactUtil.searchContactByEmail(finalJson.getString(Contact.EMAIL));
	    if (contact == null)
		contact = new Contact();

	    // Get contact properties from finalJson
	    List<ContactField> properties = new ArrayList<ContactField>();
	    FormsUtil.jsonToAgile(finalJson, properties, null);

	    // Add / update contact properties & tags
	    contact.setContactOwner(owner);
	    contact.properties = FormsUtil.updateContactProperties(properties, contact.properties);

	    if (tags != null && tags.length > 0)
		contact.addTags(FormsUtil.getValidTags(tags));
	    else
		contact.save();
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

    /**
     * This method is used to convert <b>Unbounce POST data</b> to <b>JSON
     * Object</b>
     *
     * @param json
     *            New JSON Object
     * @return finalJson
     */
    public static JSONObject convertUnbounceJson(JSONObject json)
    {
	try
	{
	    // Define & Initialize finalJson
	    JSONObject finalJson = new JSONObject();

	    // Define name, value
	    String name;
	    String value;

	    // Remove default keys from Unbounce POST data JSON
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