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

/**
 * <h1>WufooWebhook</h1>
 *
 * <p>
 * Servlet to handle <b>Wufoo Webhook</b> requests
 * </p>
 *
 * @author agile
 * @version 1.0
 * @since 2013-12-31
 */
@SuppressWarnings("serial")
public class WufooWebhook extends HttpServlet
{
    /**
     * <p>
     * This method handles the <b>Wufoo Webhook</b> HTTP POST requests
     * </p>
     *
     * @param req
     *            WufooWebhook HTTP request Object
     * @param res
     *            WufooWebhook HTTP response Object
     * @return void
     */
    public void service(HttpServletRequest req, HttpServletResponse res)
    {
	try
	{
	    // Get Wufoo POST parameter 'HandshakeKey' for Agile REST API Key &
	    // Contact tags
	    // Sample format of HandshakeKey :
	    // 1imnn6cmd3eipmp2ag0qoh56up,tag1,tag2,tag3
	    String tagString = req.getParameter("HandshakeKey");
	    if (StringUtils.isEmpty(tagString))
	    {
		res.sendError(HttpServletResponse.SC_BAD_REQUEST, "Bad Request: API Key is missing");
		return;
	    }

	    // Remove trailing spaces and split at "," to separate API Key &
	    // Contact tags
	    tagString = tagString.trim();
	    tagString = tagString.replace("/, /g", ",");
	    String[] tagsWithKey = tagString.split(",");
	    String[] tags = Arrays.copyOfRange(tagsWithKey, 1, tagsWithKey.length);

	    // Get owner from API Key to assign to contact
	    Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(tagsWithKey[0]);
	    if (owner == null)
	    {
		res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized: No owner exists with this API Key - "
		        + tagsWithKey[0]);
		return;
	    }

	    // Convert Wufoo Form Fields to JSON Object 'finalJson'
	    JSONArray wufooArray = new JSONObject(req.getParameter("FieldStructure")).getJSONArray("Fields");
	    JSONObject finalJson = convertWufooJson(wufooArray, req, new JSONObject());
	    System.out.println("finalJson is: " + finalJson);

	    // If no email in finalJson return, to avoid adding duplicate
	    // contacts
	    if (!finalJson.has(Contact.EMAIL))
	    {
		res.sendError(HttpServletResponse.SC_BAD_REQUEST, "Bad Request: EMAIL Key is missing");
		return;
	    }
	    Contact contact = ContactUtil.searchContactByEmail(finalJson.getString(Contact.EMAIL));
	    if (contact == null)
		contact = new Contact();

	    // Get Contact properties & notes from finalJson to add to contact
	    List<Note> notes = new ArrayList<Note>();
	    List<ContactField> properties = new ArrayList<ContactField>();
	    FormsUtil.jsonToAgile(finalJson, properties, notes);
	    System.out.println("properties are: " + properties);

	    // Add / update contact properties, tags, notes
	    contact.setContactOwner(owner);
	    contact.properties = FormsUtil.updateContactProperties(properties, contact.properties);
	    if (tags != null && tags.length > 0)
		contact.addTags(FormsUtil.getValidTags(tags));
	    else
		contact.save();

	    Key<AgileUser> user = new Key<AgileUser>(AgileUser.class, owner.getId());
	    for (Note note : notes)
	    {
		note.addRelatedContacts(contact.id.toString());
		note.created_time = System.currentTimeMillis() / 1000;
		note.setOwner(user);
		note.save();
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Error is " + e.getMessage());
	    return;
	}
    }

    /**
     * <p>
     * This method converts <b>Wufoo Form Fields</b> into <b>JSON Object</b>
     * </p>
     *
     * @param array
     *            JSON array <b>Fields</b> from value of Wufoo POST parameter
     *            <b>FieldStructure</b>
     * @param req
     *            Wufoo Webhook HTTP request object
     * @param finalJson
     *            new JSON Object, need to add key, value pairs to this
     * @return finalJson
     */
    public static JSONObject convertWufooJson(JSONArray array, HttpServletRequest req, JSONObject finalJson)
    {
	try
	{
	    // Iterate JSON Array & add name, value pairs to JSON Object
	    // finalJson
	    for (int i = 0; i < array.length(); i++)
	    {
		JSONObject json = array.getJSONObject(i);
		String name = null;

		if (!StringUtils.isBlank(json.optString("Type"))
		        && StringUtils.equals("textarea", json.getString("Type")))
		    name = json.getString("Title") + " " + "agilenote";
		else if (!StringUtils.isBlank(json.optString("Type"))
		        && StringUtils.equals("checkbox", json.getString("Type")))
		{
		    finalJson.put(json.getString("Title") + " " + "agilecheckbox agilecustomfield",
			    checkboxValue(json.getJSONArray("SubFields"), req));
		    continue;
		}
		else if (!StringUtils.isBlank(json.optString("Type"))
		        && (StringUtils.equals("date", json.getString("Type")) || StringUtils.equals("eurodate",
		                json.getString("Type")))
		        && (!StringUtils.isBlank(req.getParameter(json.getString("ID")))))
		{
		    finalJson.put(json.getString("Title") + " " + "agilecustomfield",
			    dateFieldValue(req.getParameter(json.getString("ID"))));
		    continue;
		}
		else if (!StringUtils.isBlank(json.optString("SubFields")))
		    convertWufooJson(json.getJSONArray("SubFields"), req, finalJson);

		// Blank check before adding name, value pairs to JSON Object
		String value = req.getParameter(json.getString("ID"));
		if (!StringUtils.isBlank(value))
		{
		    name = !StringUtils.isBlank(name) ? name : StringUtils.isBlank(json.optString("Label")) ? json
			    .getString("Title") : json.getString("Label");
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

    /**
     * This method is used to get the <b>value</b> of Wufoo field of type
     * <b>checkbox</b>
     *
     * @param subarray
     *            JSON Array SubFields of CheckBox JSON Object
     * @param req
     *            Wufoo Webhook HTTP request object
     * @return Value of Wufoo field of Type checkbox
     */
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

    /**
     * This method is used to parse <b>epoch date</b> from <b>Wufoo Date
     * field</b>
     *
     * @param date
     *            Wufoo date field value
     *
     * @return Date as String in epoch format
     */
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