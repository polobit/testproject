/**
 *  This servlet is used to read wufoo data and add contact with specified properties to 
 *  the associated agile api key owner
 */
package com.thirdparty.forms;

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
				if (!json.getString("Type").equals("email"))
					continue;

				contact = ContactUtil.searchContactByEmail(req.getParameter(json.getString("ID")));

				if (contact == null)
					contact = new Contact();

				break;
			}

			// Address JSON
			JSONObject addressJson = new JSONObject();

			for (int i = 0; i < arr.length(); i++)
			{
				JSONObject json = arr.getJSONObject(i);

				String fieldLabel = json.getString("Title");
				String fieldValue = req.getParameter(json.getString("ID"));
				String fieldType = json.getString("Type");

				if (!StringUtils.isBlank(fieldValue))
				{

					// Build Address JSON from normal text fields
					if (fieldLabel.equalsIgnoreCase("street address") || fieldLabel.equalsIgnoreCase("street")
							|| fieldLabel.equalsIgnoreCase("location"))
						addressJson.put("address", fieldValue);

					else if (fieldLabel.equalsIgnoreCase("country"))
						addressJson.put("country", fieldValue);

					else if (fieldLabel.equalsIgnoreCase("city"))
						addressJson.put("city", fieldValue);

					else if (fieldLabel.equalsIgnoreCase("state"))
						addressJson.put("state", fieldValue);

					else if (fieldLabel.equalsIgnoreCase("zip") || fieldLabel.equalsIgnoreCase("postal code")
							|| fieldLabel.equalsIgnoreCase("zip code"))
						addressJson.put("zip", fieldValue);

					else if (fieldType.equals("textarea"))
					{
						Note note = new Note();
						note.subject = fieldLabel;
						note.description = fieldValue;
						if (!StringUtils.isBlank(fieldValue))
							notes.add(note);
					}

					else if (fieldType.equals("phone"))
						properties.add(FormsUtil.wufooBuildPropertyWithSubtype(Contact.PHONE, fieldValue, "main"));

					else if (fieldType.equals("url"))
						properties.add(FormsUtil.wufooBuildPropertyWithSubtype(Contact.WEBSITE, fieldValue, "URL"));

					else if (!StringUtils.isBlank(fieldLabel) && !fieldType.equals("address")
							&& !fieldType.equals("shortname") && !fieldType.equals("checkbox"))

						// Add properties to list of properties
						properties.add(FormsUtil.wufooBuildProperty(fieldLabel, fieldValue));

					Iterator<?> keys = json.keys();
					while (keys.hasNext())
					{
						// Iterate subfields
						String key = (String) keys.next();
						if (key.equals("SubFields"))
						{
							JSONArray subArr = json.getJSONArray("SubFields");
							String subFieldTitle = json.getString("Title");
							String subFieldType = json.getString("Type");

							// Address JSON
							JSONObject addJson = new JSONObject();
							String addField = new String();

							// Check box string
							String checkBox = new String();

							for (int j = 0; j < subArr.length(); j++)
							{
								JSONObject subObj = subArr.getJSONObject(j);

								String subFieldLabel = subObj.getString("Label");
								String subFieldValue = req.getParameter(subObj.getString("ID"));

								if (!StringUtils.isBlank(subFieldValue))
								{
									// Build Address JSON from fancy pants
									// address
									// field
									if (subFieldValue.equals("Street Address"))
									{
										addField = subFieldValue;
										addJson.put("address", addField);
									}

									else if (subFieldLabel.equals("Address Line 2"))
									{
										addField = addField + ", " + subFieldValue;
										addJson.put("address", addField);
									}

									else if (subFieldLabel.equals("City"))
										addJson.put("city", subFieldValue);

									else if (subFieldLabel.equals("State / Province / Region"))
										addJson.put("state", subFieldValue);

									else if (subFieldLabel.equals("Country"))
									{
										HashMap<String, String> countryCode = new HashMap<String, String>();
										countryCode = FormsUtil.countrycodemap();
										String code = countryCode.get(subFieldValue);
										addJson.put("country", code);
									}

									else if (subFieldLabel.equals("Postal / Zip Code"))
										addJson.put("zip", subFieldValue);

									else if (subFieldType.equals("checkbox"))
									{
										if (!StringUtils.isBlank(checkBox))
											checkBox = checkBox + ", " + subFieldValue;
										else
											checkBox = subFieldValue;
									}

									else if (!StringUtils.isBlank(subFieldLabel))

										// Add properties to list of properties
										properties.add(FormsUtil.wufooBuildProperty(subFieldLabel, subFieldValue));
								}
							}
							if (!StringUtils.isBlank(checkBox))
								properties.add(FormsUtil.wufooBuildProperty(subFieldTitle, checkBox));

							if (addJson.length() != 0)
								properties.add(FormsUtil.wufooBuildProperty(Contact.ADDRESS, addJson.toString()));
						}
					}
				}
			}

			if (addressJson.length() != 0)
				properties.add(FormsUtil.wufooBuildProperty(Contact.ADDRESS, addressJson.toString()));

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
			System.out.println("exception is " + e.getMessage());
			return;
		}
	}
}