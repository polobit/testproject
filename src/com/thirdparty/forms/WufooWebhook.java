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
			String tagString = req.getParameter("HandshakeKey");

			tagString = tagString.trim();
			tagString = tagString.replace("/, /g", ",");

			String[] tagsWithKey = tagString.split(",");
			String[] tags = Arrays.copyOfRange(tagsWithKey, 1, tagsWithKey.length);

			Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(tagsWithKey[0]);

			List<Note> notes = new ArrayList<Note>();
			List<ContactField> properties = new ArrayList<ContactField>();

			JSONObject wufooJson = new JSONObject(req.getParameter("FieldStructure"));
			JSONArray wufooArray = wufooJson.getJSONArray("Fields");

			JSONObject finalJson = convertWufooJson(wufooArray, req);

			System.out.println("finalJson is: " + finalJson);

			Contact contact = null;

			if (!StringUtils.isBlank(finalJson.optString(Contact.EMAIL)))
				contact = ContactUtil.searchContactByEmail(finalJson.getString(Contact.EMAIL));

			if (contact == null)
				contact = new Contact();

			FormsUtil.jsonToAgile(finalJson, properties, notes);

			System.out.println("properties are: " + properties);

			if (owner != null)
			{
				Key<AgileUser> user = new Key<AgileUser>(AgileUser.class, owner.getId());
				contact.setContactOwner(owner);
				contact.properties = FormsUtil.updateContactProperties(properties, contact.properties);
				contact.addTags(tags);
				contact.save();
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

	public static JSONObject convertWufooJson(JSONArray array, HttpServletRequest req)
	{
		try
		{
			JSONObject finalJson = new JSONObject();

			for (int i = 0; i < array.length(); i++)
			{
				String name = null;
				String value = null;

				JSONObject json = array.getJSONObject(i);
				String fieldType = json.getString("Type");

				if (fieldType.equals("url"))
					name = fieldType;
				else if (fieldType.equals("email"))
					name = fieldType;
				else if (fieldType.equals("textarea"))
					name = json.getString("Title") + " " + fieldType;
				else if (fieldType.equals("checkbox"))
					name = json.getString("Title") + " " + fieldType;

				if (!StringUtils.isBlank(json.optString("SubFields")) && StringUtils.isBlank(name))
				{
					JSONArray subarray = json.getJSONArray("SubFields");
					for (int j = 0; j < subarray.length(); j++)
					{
						JSONObject subjson = subarray.getJSONObject(j);
						value = req.getParameter(subjson.getString("ID"));
						if (!StringUtils.isBlank(value))
						{
							name = FormsUtil.getFieldName(subjson.getString("Label"));
							finalJson.put(name, value);
						}
					}
				}
				else if (!StringUtils.isBlank(json.optString("SubFields")) && !StringUtils.isBlank(name))
				{
					JSONArray subarray = json.getJSONArray("SubFields");
					for (int j = 0; j < subarray.length(); j++)
					{
						JSONObject subjson = subarray.getJSONObject(j);
						value = req.getParameter(subjson.getString("ID"));
						if (!StringUtils.isBlank(value))
							finalJson.put(name, value);
					}

				}
				else if (StringUtils.isBlank(json.optString("SubFields")) && StringUtils.isBlank(name))
				{
					name = json.getString("Title");
					value = req.getParameter(json.getString("ID"));
					if (!StringUtils.isBlank(value))
					{
						name = FormsUtil.getFieldName(name);
						finalJson.put(name, value);
					}
				}
				else if (StringUtils.isBlank(json.optString("SubFields")) && !StringUtils.isBlank(name))
				{
					value = req.getParameter(json.getString("ID"));
					if (!StringUtils.isBlank(value))
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
