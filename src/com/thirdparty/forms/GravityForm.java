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
			String tagString = req.getParameter("api-key");

			tagString = tagString.trim();
			tagString = tagString.replace("/, /g", ",");

			String[] tagsWithKey = tagString.split(",");
			String[] tags = Arrays.copyOfRange(tagsWithKey, 1, tagsWithKey.length);

			Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(tagsWithKey[0]);

			List<ContactField> properties = new ArrayList<ContactField>();

			JSONObject json = new JSONObject(req.getParameter("data"));
			JSONObject finalJson = convertGravityJson(json);

			Contact contact = null;

			if (!StringUtils.isBlank(finalJson.optString(Contact.EMAIL)))
				contact = ContactUtil.searchContactByEmail(finalJson.getString(Contact.EMAIL));

			if (contact == null)
				contact = new Contact();

			FormsUtil.jsonToAgile(finalJson, properties, null);

			if (owner != null)
			{
				contact.setContactOwner(owner);
				contact.properties = FormsUtil.updateContactProperties(properties, contact.properties);
				contact.addTags(tags);
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
			JSONObject finalJson = new JSONObject();

			String name;
			String value;

			Iterator<?> keys = json.keys();
			while (keys.hasNext())
			{
				name = (String) keys.next();
				value = json.getString(name);

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