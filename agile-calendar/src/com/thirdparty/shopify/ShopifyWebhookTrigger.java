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
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.contact.util.TagUtil;
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
	System.out.println("API KEY is " + apiKey);

	Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);
	System.out.println("Owner is " + owner);
	if (owner == null)
	{
	    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "API Key invalid");
	    return;
	}

	String shopifyEvent = req.getHeader("X-Shopify-Topic");
	System.out.println("Shopify event is " + shopifyEvent);

	System.out.println("Get input stream encode with UTF-8");
	ServletInputStream data = req.getInputStream();
	BufferedReader reader = new BufferedReader(new InputStreamReader(data, "UTF-8"));
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
	    System.out.println("Shopify JSON format is " + shopifyJson);

	    List<Trigger> triggers = TriggerUtil.getAllTriggers();
	    for (Trigger trigger : triggers)
	    {
		if (StringUtils.equals(shopifyEvent.replace('/', '_').toUpperCase(), trigger.trigger_shopify_event))
		{
		    System.out.println("Trigger type shopify event match ...");
		    String customerEmail = getCustomerEmail(shopifyEvent, shopifyJson);
		    System.out.println("Customer email is " + customerEmail);

		    Boolean newContact = false;
		    Contact contact = ContactUtil.searchContactByEmail(customerEmail);
		    if (contact == null)
		    {
			contact = new Contact();
			newContact = true;
		    }

		    List<ContactField> contactProperties = new ArrayList<ContactField>();

		    JSONObject customerJson = getCustomerDetails(shopifyEvent, shopifyJson);
		    System.out.println("Customer JSON is " + customerJson);
		    if (customerJson == null)
		    {
			res.sendError(HttpServletResponse.SC_BAD_REQUEST);
			return;
		    }

		    JSONObject agileCustomerJson = getAgileContactProperties(customerJson);
		    System.out.println("Agile customer data is " + agileCustomerJson);
		    if (StringUtils.isBlank(agileCustomerJson.toString()))
		    {
			res.sendError(HttpServletResponse.SC_BAD_REQUEST);
			return;
		    }

		    Iterator<?> keys = agileCustomerJson.keys();
		    while (keys.hasNext())
		    {
			String key = (String) keys.next();
			String value = customerJson.getString(key);
			contactProperties.add(new ContactField(key, value, null));
		    }

		    ContactField addressContactField = getCustomerAddress(shopifyEvent, shopifyJson);
		    if (addressContactField != null)
			contactProperties.add(addressContactField);

		    List<ContactField> contactDetailsFromAddress = getContactDetailsFromAddress(shopifyEvent,
			    shopifyJson);

		    if (contactDetailsFromAddress != null)
			contactProperties.addAll(contactDetailsFromAddress);

		    if (contact.properties.isEmpty())
			contact.properties = contactProperties;
		    else
			contact.properties = updateContactPropList(contact.properties, contactProperties);
		    System.out.println("Contact properties are " + contact.properties);

		    contact.setContactOwner(owner);

		    String[] tags = getCustomerTags(shopifyEvent, shopifyJson);
		    if (tags != null)
			contact.addTags(getValidTags(tags));
		    else
		    {
			System.out.println("Saving contact ...");
			contact.save();
		    }

		    Note note = getCustomerNote(shopifyEvent, shopifyJson, contact);
		    if (note != null)
		    {
			System.out.println("Saving note ...");
			note.addRelatedContacts(contact.id.toString());
			note.setOwner(new Key<AgileUser>(AgileUser.class, owner.getId()));
			note.created_time = System.currentTimeMillis() / 1000;
			note.save();
			System.out.println("Saving note ...");
		    }

		    if (getTriggerRunResult(newContact, trigger))
		    {
			System.out.println("Assigning campaign to contact....");
			WorkflowSubscribeUtil.subscribeDeferred(contact, trigger.campaign_id,
			        new JSONObject().put("shopify", shopifyJson));
		    }
		}
	    }
	    return;
	}
	catch (JSONException e)
	{
	    return;
	}
    }

    public String getCustomerEmail(String shopifyEvent, JSONObject shopifyJson)
    {
	try
	{
	    String customerEmail = null;
	    if (shopifyEvent.contains("customers"))
		customerEmail = shopifyJson.getString("email");
	    else if (shopifyEvent.contains("checkouts") || shopifyEvent.contains("orders"))
		customerEmail = shopifyJson.getJSONObject("customer").getString("email");

	    return customerEmail;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public String[] getCustomerTags(String shopifyEvent, JSONObject shopifyJson)
    {
	try
	{
	    List<String> trimmedTags = new ArrayList<String>();
	    String shopifyTags = null;

	    if (shopifyEvent.contains("customers"))
		shopifyTags = shopifyJson.getString("tags");
	    else if (shopifyEvent.contains("checkouts") || shopifyEvent.contains("orders"))
		shopifyTags = shopifyJson.getJSONObject("customer").getString("tags");

	    if (StringUtils.isBlank(shopifyTags))
		return null;

	    String[] tags = shopifyTags.split(",");
	    for (String tag : tags)
		trimmedTags.add(tag.trim());

	    return trimmedTags.toArray(new String[trimmedTags.size()]);
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public Note getCustomerNote(String shopifyEvent, JSONObject shopifyJson, Contact contact)
    {
	try
	{
	    String noteDescription = null;
	    if (shopifyEvent.contains("customers"))
		noteDescription = shopifyJson.getString("note");
	    else if (shopifyEvent.contains("checkouts") || shopifyEvent.contains("orders"))
		noteDescription = shopifyJson.getJSONObject("customer").getString("note");

	    if (StringUtils.isBlank(noteDescription) || StringUtils.equals(noteDescription, "null"))
		return null;

	    List<Note> notes = NoteUtil.getNotes(contact.id);
	    for (Note note : notes)
	    {
		if (StringUtils.equals(note.subject, "Shopify Note"))
		    return null;
	    }
	    Note note = new Note("Shopify Note", noteDescription);
	    return note;
	}
	catch (Exception e)
	{
	    return null;
	}

    }

    public JSONObject getAgileContactProperties(JSONObject customerJson)
    {
	try
	{
	    JSONObject agileJson = new JSONObject();

	    Iterator<?> keys = customerJson.keys();
	    while (keys.hasNext())
	    {
		String key = (String) keys.next();
		String value = customerJson.getString(key);

		if (!StringUtils.isBlank(value) && !StringUtils.equals(value, "null"))
		{
		    switch (key)
		    {
		    case "email":
			agileJson.put(Contact.EMAIL, value);
			break;
		    case "first_name":
			agileJson.put(Contact.FIRST_NAME, value);
			break;
		    case "last_name":
			agileJson.put(Contact.LAST_NAME, value);
			break;
		    default:
			break;
		    }
		}
	    }
	    return agileJson;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public JSONObject getCustomerDetails(String shopifyEvent, JSONObject shopifyJson)
    {
	try
	{
	    JSONObject customerJson = null;
	    if (shopifyEvent.contains("customers"))
		customerJson = shopifyJson;
	    else if (shopifyEvent.contains("checkouts") || shopifyEvent.contains("orders"))
		customerJson = shopifyJson.getJSONObject("customer");
	    return customerJson;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public ContactField getCustomerAddress(String shopifyEvent, JSONObject shopifyJson)
    {
	try
	{
	    JSONObject addressJson;
	    JSONObject agileAddressJson = new JSONObject();
	    String address = null;

	    if (shopifyEvent.contains("customers"))
		addressJson = shopifyJson.getJSONObject("default_address");
	    else if (shopifyEvent.contains("orders"))
		addressJson = shopifyJson.getJSONObject("customer").getJSONObject("default_address");
	    else if (shopifyEvent.contains("checkouts"))
		addressJson = shopifyJson.getJSONObject("billing_address");
	    else
		addressJson = null;

	    if (addressJson == null)
		return null;

	    Iterator<?> keys = addressJson.keys();
	    while (keys.hasNext())
	    {
		String key = (String) keys.next();
		String value = addressJson.getString(key);

		if (!StringUtils.isBlank(value) && !StringUtils.equals(value, "null"))
		{
		    switch (key)
		    {
		    case "address1":
		    case "address2":
			address = (StringUtils.isBlank(address)) ? value : address + ", " + value;
			break;
		    case "city":
			agileAddressJson.put("city", value);
			break;
		    case "province":
			agileAddressJson.put("state", value);
			break;
		    case "country_code":
			agileAddressJson.put("country", value);
			break;
		    case "zip":
			agileAddressJson.put("zip", value);
			break;
		    default:
			break;
		    }
		}
	    }
	    if (!StringUtils.isBlank(address))
		agileAddressJson.put("address", address);

	    if (!StringUtils.isBlank(agileAddressJson.toString()))
	    {
		ContactField addressContactField = new ContactField(Contact.ADDRESS, agileAddressJson.toString(), null);
		return addressContactField;
	    }
	    else
		return null;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public List<ContactField> updateContactPropList(List<ContactField> oldProperties, List<ContactField> newProperties)
    {
	List<ContactField> outDatedProperties = new ArrayList<ContactField>();

	for (ContactField oldProperty : oldProperties)
	    for (ContactField newProperty : newProperties)
		if (StringUtils.equals(oldProperty.name, newProperty.name)
		        && StringUtils.equals(oldProperty.subtype, newProperty.subtype))
		    outDatedProperties.add(oldProperty);
	oldProperties.removeAll(outDatedProperties);
	newProperties.addAll(oldProperties);
	return newProperties;
    }

    public List<ContactField> getContactDetailsFromAddress(String shopifyEvent, JSONObject shopifyJson)
    {
	try
	{
	    List<ContactField> contactDetailsFromAddress = new ArrayList<ContactField>();

	    JSONObject requiredJson = null;
	    if (shopifyEvent.contains("customers"))
		requiredJson = shopifyJson.getJSONObject("default_address");
	    else if (shopifyEvent.contains("orders"))
		requiredJson = shopifyJson.getJSONObject("customer").getJSONObject("default_address");
	    else if (shopifyEvent.contains("checkouts"))
		requiredJson = shopifyJson.getJSONObject("billing_address");

	    if (requiredJson == null)
		return null;

	    Iterator<?> keys = requiredJson.keys();
	    while (keys.hasNext())
	    {
		String key = (String) keys.next();
		String value = (String) requiredJson.getString(key);

		if (!StringUtils.isBlank(value) && !StringUtils.equals(value, "null"))
		{
		    if (StringUtils.equals(key, Contact.PHONE))
			contactDetailsFromAddress.add(new ContactField(Contact.PHONE, value, null));
		    else if (StringUtils.equals(key, Contact.COMPANY))
			contactDetailsFromAddress.add(new ContactField(Contact.COMPANY, value, null));
		}
	    }
	    if (contactDetailsFromAddress.isEmpty())
		return null;

	    return contactDetailsFromAddress;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public Boolean getTriggerRunResult(Boolean newContact, Trigger trigger)
    {
	return (newContact || !TriggerUtil.getTriggerRunStatus(trigger));
    }

    public String[] getValidTags(String[] tags)
    {
	List<String> validTags = new ArrayList<String>();
	for (int i = 0; i < tags.length; i++)
	{
	    String tag = TagUtil.getValidTag(tags[i]);
	    if (tag == null)
		continue;

	    validTags.add(tag);
	}
	return validTags.toArray(new String[validTags.size()]);
    }
}