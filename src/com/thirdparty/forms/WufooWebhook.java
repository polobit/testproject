package com.thirdparty.forms;

import java.util.ArrayList;
import java.util.Arrays;
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
				contact.addTags(tags);
				contact.save();

				// Get agile user, assign user, save notes if owner exists
				for (Note note : notes)
				{
					note.addRelatedContacts(contact.id.toString());
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

				if (!StringUtils.isBlank(json.optString("Type"))
						&& StringUtils.equals("textarea", json.getString("Type")))
					name = json.getString("Title") + " " + "agilenote";

				if (!StringUtils.isBlank(json.optString("SubFields")))
					convertWufooJson(json.getJSONArray("SubFields"), req, finalJson);

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
}
