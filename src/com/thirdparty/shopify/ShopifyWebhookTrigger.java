package com.thirdparty.shopify;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class ShopifyWebhookTrigger extends HttpServlet
{
    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
    {
	String apiKey = req.getParameter("api-key");
	System.out.println("API Key is " + apiKey);

	Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);
	if (owner == null)
	{
	    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "API Key invalid");
	    return;
	}
	System.out.println("Owner is " + owner);

	String shopifyEvent = req.getHeader("X-Shopify-Topic");
	System.out.println("Shopify event is " + shopifyEvent);

	ServletInputStream data = req.getInputStream();
	BufferedReader reader = new BufferedReader(new InputStreamReader(data));
	String line = "";
	String shopifyData = "";
	while ((line = reader.readLine()) != null)
	{
	    shopifyData += line;
	}
	System.out.println("Shopify data is " + shopifyData);

	try
	{
	    JSONObject shopifyJson = new JSONObject(shopifyData);
	    System.out.println("Shopify json is " + shopifyJson);

	    List<Trigger> triggers = TriggerUtil.getAllTriggers();
	    for (Trigger trigger : triggers)
	    {
		if (StringUtils.equals(shopifyEvent.replace('/', '_').toUpperCase(), trigger.trigger_shopify_event))
		{
		    String customerEmail = shopifyJson.getString("email");
		    System.out.println("Customer email is " + customerEmail);

		    String[] tags = getCustomerTags(shopifyEvent, shopifyJson);

		    Contact contact = ContactUtil.searchContactByEmail(customerEmail);
		    if (contact == null)
			contact = new Contact();
		    List<ContactField> contactProperties = new ArrayList<ContactField>();

		    JSONObject customerJson = getCustomerDetails(shopifyEvent, shopifyJson);
		    if (customerJson == null)
		    {
			res.sendError(HttpServletResponse.SC_BAD_REQUEST);
			return;
		    }
		    Iterator<?> keys = customerJson.keys();
		    while (keys.hasNext())
		    {
			String key = (String) keys.next();
			String value = customerJson.getString(key);
			contactProperties.add(new ContactField(key, value, null));
		    }

		    System.out.println("Assigning campaign to contact ...");
		    WorkflowSubscribeUtil.subscribe(contact, trigger.id);

		    if (contact.properties.isEmpty())
			contact.properties = contactProperties;
		    else
			contact.properties = updateContactPropList(contact.properties, contactProperties);

		    System.out.println("Contact properties are " + contact.properties);
		    contact.setContactOwner(owner);
		    contact.addTags(tags);
		    contact.save();

		    if (!StringUtils.isBlank(shopifyJson.getString("note")))
		    {
			System.out.println("Saving note ...");
			Note note = new Note("Shopify Note", shopifyJson.getString("note"));
			note.addRelatedContacts(contact.id.toString());
			note.setOwner(new Key<AgileUser>(AgileUser.class, owner.getId()));
			note.save();
		    }
		}
	    }
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    public List<ContactField> updateContactPropList(List<ContactField> oldProperties, List<ContactField> newProperties)
    {
	List<ContactField> outDatedProperties = new ArrayList<ContactField>();

	for (ContactField oldProperty : oldProperties)
	    for (ContactField newProperty : newProperties)
		if (StringUtils.equals(oldProperty.name, newProperty.name) && StringUtils.equals(oldProperty.subtype, newProperty.subtype))
		    outDatedProperties.add(oldProperty);
	oldProperties.removeAll(outDatedProperties);
	newProperties.addAll(oldProperties);
	return newProperties;
    }

    public JSONObject getAgileContactProperties(JSONObject shopifyJson) throws JSONException
    {
	JSONObject agileJson = new JSONObject();
	JSONObject addressJSON = new JSONObject();
	String address = new String();

	Iterator<?> keys = shopifyJson.keys();
	while (keys.hasNext())
	{
	    String key = (String) keys.next();
	    String value = shopifyJson.getString(key);

	    if (!StringUtils.isBlank(value))
	    {
		switch (key)
		{
		case "address1":
		case "address2":
		    address = (StringUtils.isBlank(address)) ? value : address + ", " + value;
		    break;
		case "country_code":
		    addressJSON.put("country", value);
		    break;
		case "zip":
		case "city":
		    addressJSON.put(key, value);
		    break;
		case "province_code":
		case "name":
		case "province":
		case "longitude":
		case "latitude":
		case "country":
		case "id":
		case "default":
		    break;
		default:
		    agileJson.put(key, value);
		    break;
		}
	    }
	}
	if (!StringUtils.isBlank(address))
	    addressJSON.put("address", address);
	if (!StringUtils.isBlank(addressJSON.toString()))
	    agileJson.put(Contact.ADDRESS, addressJSON);

	return agileJson;
    }

    public JSONObject getCustomerDetails(String shopifyEvent, JSONObject shopifyJson) throws JSONException
    {
	JSONObject customerJson;
	if (shopifyEvent.contains("customer"))
	    customerJson = shopifyJson.getJSONObject("default_address");
	else
	    customerJson = shopifyJson.getJSONObject("shipping_address");
	return customerJson;
    }

    public String[] getCustomerTags(String shopifyEvent, JSONObject shopifyJson) throws JSONException
    {
	List<String> trimmedTags = new ArrayList<String>();
	String shopifyTags;

	if (shopifyEvent.contains("customer"))
	    shopifyTags = shopifyJson.getString("tags");
	else
	    shopifyTags = shopifyJson.getJSONObject("customer").getString("tags");

	String[] tags = shopifyTags.split(",");

	for (String tag : tags)
	    trimmedTags.add(tag.trim());

	return trimmedTags.toArray(new String[trimmedTags.size()]);
    }
}
