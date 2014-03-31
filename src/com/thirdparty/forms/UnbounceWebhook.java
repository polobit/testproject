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

			JSONObject obj = new JSONObject(req.getParameter("data.json"));
			JSONObject finalJson = convertUnbounceJson(obj);

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

	public static JSONObject convertUnbounceJson(JSONObject json)
	{
		try
		{
			JSONObject finalJson = new JSONObject();

			String name;
			String value;

			json.remove("variant");
			json.remove("page_uuid");
			json.remove("page_url");
			json.remove("date_submitted");
			json.remove("time_submitted");

			Iterator<?> keys = json.keys();
			while (keys.hasNext())
			{
				String regex = "\\[|\\]";
				name = (String) keys.next();
				value = json.getString(name);
				value = value.replaceAll(regex, "");
				value = value.replaceAll("\"", "");

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