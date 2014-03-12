/**
 *  This servlet is used to read wufoo data and add contact with specified properties to 
 *  the associated agile api key owner
 */
package com.thirdparty;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class WufooWebhook extends HttpServlet
{
	protected void service(HttpServletRequest req, HttpServletResponse res)
	{
		try
		{
			// Get API key and tags
			String tagString = req.getParameter("HandshakeKey");

			// Create contact, properties and notes list
			Contact contact = null;
			List<Note> notes = new ArrayList<Note>();
			List<ContactField> properties = new ArrayList<ContactField>();

			// Get fields from field structure and iterate
			JSONObject obj = new JSONObject(req.getParameter("FieldStructure"));
			JSONArray arr = obj.getJSONArray("Fields");

			for (int i = 0; i < arr.length(); i++)
			{
				JSONObject json = arr.getJSONObject(i);

				// Check if data contains email, search contact based on email
				if (json.getString("Title").toLowerCase().contains("email"))
					contact = ContactUtil.searchContactByEmail(req.getParameter(json.getString("ID")));

				// If contact is not found create new contact
				if (contact == null)
					contact = new Contact();
			}

			// Address JSON
			JSONObject addressJson = new JSONObject();

			for (int i = 0; i < arr.length(); i++)
			{
				JSONObject json = arr.getJSONObject(i);

				// Build Address JSON from normal text fields
				if ((json.getString("Title").equalsIgnoreCase("street address")
						|| json.getString("Title").equalsIgnoreCase("street") || json.getString("Title")
						.equalsIgnoreCase("location")) && !StringUtils.isBlank(req.getParameter(json.getString("ID"))))
					addressJson.put("address", req.getParameter(json.getString("ID")));
				else if ((json.getString("Title").equalsIgnoreCase("country"))
						&& !StringUtils.isBlank(req.getParameter(json.getString("ID"))))
					addressJson.put("country", req.getParameter(json.getString("ID")));
				else if ((json.getString("Title").equalsIgnoreCase("city"))
						&& !StringUtils.isBlank(req.getParameter(json.getString("ID"))))
					addressJson.put("city", req.getParameter(json.getString("ID")));
				else if ((json.getString("Title").equalsIgnoreCase("state"))
						&& !StringUtils.isBlank(req.getParameter(json.getString("ID"))))
					addressJson.put("state", req.getParameter(json.getString("ID")));
				else if ((json.getString("Title").equalsIgnoreCase("zip")
						|| json.getString("Title").equalsIgnoreCase("postal code") || json.getString("Title")
						.equalsIgnoreCase("zip code")) && !StringUtils.isBlank(req.getParameter(json.getString("ID"))))
					addressJson.put("zip", req.getParameter(json.getString("ID")));
				else if (json.getString("Type").equals("textarea"))
				{
					Note note = new Note();
					note.subject = req.getParameter(json.getString("Title"));
					note.description = req.getParameter(json.getString("ID"));
					if (!StringUtils.isBlank(note.description))
						notes.add(note);
				}
				else if (!StringUtils.isBlank(json.getString("Title")) && !json.getString("Title").equals("Address")
						&& !StringUtils.isBlank(req.getParameter(json.getString("ID"))))

					// Add properties to list of properties
					properties.add(buildProperty(json.getString("Title"), req.getParameter(json.getString("ID")),
							contact));

				Iterator<?> keys = json.keys();
				while (keys.hasNext())
				{
					// Iterate subfields
					String key = (String) keys.next();
					if (key.equals("SubFields"))
					{
						JSONArray subArr = json.getJSONArray("SubFields");

						// Address JSON
						JSONObject addJson = new JSONObject();
						String addField = new String();
						for (int j = 0; j < subArr.length(); j++)
						{
							JSONObject subObj = subArr.getJSONObject(j);

							// Build Address JSON from fancy pants address field
							if (subObj.getString("Label").equals("Street Address"))
								addField = req.getParameter(subObj.getString("ID"));
							else if (subObj.getString("Label").equals("Address Line 2"))
								addField = addField + ", " + req.getParameter(subObj.getString("ID"));
							else if (subObj.getString("Label").equals("City")
									&& !StringUtils.isBlank(req.getParameter(json.getString("ID"))))
								addJson.put("city", req.getParameter(subObj.getString("ID")));
							else if (subObj.getString("Label").equals("State / Province / Region")
									&& !StringUtils.isBlank(req.getParameter(json.getString("ID"))))
								addJson.put("state", req.getParameter(subObj.getString("ID")));
							else if (subObj.getString("Label").equals("Country")
									&& !StringUtils.isBlank(req.getParameter(json.getString("ID"))))
							{
								HashMap<String, String> countryCode = new HashMap<String, String>();
								countryCode = CountryCodeMap.countrycodemap();
								String code = countryCode.get(req.getParameter(subObj.getString("ID")));
								addJson.put("country", code);
							}
							else if (subObj.getString("Label").equals("Postal / Zip Code")
									&& !StringUtils.isBlank(req.getParameter(json.getString("ID"))))
								addJson.put("zip", req.getParameter(subObj.getString("ID")));
							else if (!StringUtils.isBlank(subObj.getString("Label"))
									&& !StringUtils.isBlank(req.getParameter(subObj.getString("ID"))))
								// Add properties to list of properties
								properties.add(buildProperty(subObj.getString("Label"),
										req.getParameter(subObj.getString("ID")), contact));
						}
						if (!(addField.equals(", ") || addField.equals("")))
						{
							addJson.put("address", addField);
							properties.add(buildProperty(Contact.ADDRESS, addJson.toString(), contact));
						}
					}
				}
			}

			if (addressJson.length() != 0)
				properties.add(buildProperty(Contact.ADDRESS, addressJson.toString(), contact));

			// Format tagString and split into tagsWithKey array
			tagString = tagString.trim();
			tagString = tagString.replace("/, /g", ",");
			String[] tagsWithKey = tagString.split(",");

			// Remove API key from tagsWithKey array and set contact owner
			String[] tags = Arrays.copyOfRange(tagsWithKey, 1, tagsWithKey.length);
			Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(tagsWithKey[0]);

			System.out.println("owner is " + owner);

			if (owner != null)
			{
				Key<AgileUser> user = new Key<AgileUser>(AgileUser.class, owner.getId());
				contact.setContactOwner(owner);

				System.out.println("properties are " + properties);

				contact.properties = properties;
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
			System.out.println("exception is " + e.getMessage());
			return;
		}
	}

	public static ContactField buildProperty(String name, String value, Contact contact) throws JSONException
	{
		// Initialize ContactField
		ContactField field = null;

		// Set field type to SYSTEM for name, email, company, title, phone, all
		// other fields save as CUSTOM.
		if (name.equalsIgnoreCase("name") || name.equalsIgnoreCase("first") || name.equalsIgnoreCase("first name")
				|| name.equalsIgnoreCase(Contact.FIRST_NAME))
		{
			name = Contact.FIRST_NAME;
			field = contact.getContactFieldByName(name);
			if (field == null)
				field = new ContactField();
			field.name = Contact.FIRST_NAME;
			field.type = FieldType.SYSTEM;
			field.value = value;
		}
		else if (name.equalsIgnoreCase("last") || name.equalsIgnoreCase("last name")
				|| name.equalsIgnoreCase(Contact.LAST_NAME))
		{
			name = Contact.LAST_NAME;
			field = contact.getContactFieldByName(name);
			if (field == null)
				field = new ContactField();
			field.name = Contact.LAST_NAME;
			field.type = FieldType.SYSTEM;
			field.value = value;
		}
		else if (name.toLowerCase().contains("organisation") || name.toLowerCase().contains("organization")
				|| name.equalsIgnoreCase(Contact.COMPANY))
		{
			name = Contact.COMPANY;
			field = contact.getContactFieldByName(name);
			if (field == null)
				field = new ContactField();
			field.name = Contact.COMPANY;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("designation") || name.equalsIgnoreCase(Contact.TITLE))
		{
			name = Contact.TITLE;
			field = contact.getContactFieldByName(name);
			if (field == null)
				field = new ContactField();
			field.name = Contact.TITLE;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.toLowerCase().contains("phone"))
		{
			name = "phone";
			field = contact.getContactFieldByName(name);
			if (field == null || field.subtype.equals("home"))
			{
				field = new ContactField();
				field.name = "phone";
				field.value = value;
				field.type = FieldType.SYSTEM;
				field.subtype = "work";
			}
			else if (field.subtype.equals("work"))
			{
				field.name = "phone";
				field.value = value;
				field.type = FieldType.SYSTEM;
				field.subtype = "work";
			}
			else
			{
				field = new ContactField();
				field.name = "phone";
				field.value = value;
				field.type = FieldType.SYSTEM;
				field.subtype = "work";
			}
		}
		else if (name.toLowerCase().contains("mobile"))
		{
			name = "phone";
			field = contact.getContactFieldByName(name);
			if (field == null || field.subtype.equals("work"))
			{
				field = new ContactField();
				field.name = "phone";
				field.value = value;
				field.type = FieldType.SYSTEM;
				field.subtype = "home";
			}
			else if (field.subtype.equals("home"))
			{
				field.name = "phone";
				field.value = value;
				field.type = FieldType.SYSTEM;
				field.subtype = "home";
			}
			else
			{
				field = new ContactField();
				field.name = "phone";
				field.value = value;
				field.type = FieldType.SYSTEM;
				field.subtype = "home";
			}
		}
		else if (name.toLowerCase().contains("email"))
		{
			if (ContactUtil.isValidEmail(value))
			{
				name = Contact.EMAIL;
				field = contact.getContactFieldByName(name);
				if (field == null)
					field = new ContactField();
				field.name = Contact.EMAIL;
				field.value = value;
				field.type = FieldType.SYSTEM;
			}
		}
		else if (name.toLowerCase().contains("website"))
		{
			name = Contact.WEBSITE;
			field = contact.getContactFieldByName(name);
			if (field == null)
				field = new ContactField();
			field.name = Contact.WEBSITE;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else if (name.equals("address"))
		{
			name = Contact.ADDRESS;
			field = contact.getContactFieldByName(name);
			if (field == null)
				field = new ContactField();
			field.name = Contact.ADDRESS;
			field.value = value;
			field.type = FieldType.SYSTEM;
		}
		else
		{
			field = contact.getContactFieldByName(name);
			if (field == null)
				field = new ContactField();
			field.name = name;
			field.value = value;
			field.type = FieldType.CUSTOM;
		}
		return field;
	}
}