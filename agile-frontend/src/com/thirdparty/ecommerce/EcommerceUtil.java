package com.thirdparty.ecommerce;

import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.JSAPIUtil;
import com.agilecrm.util.JSAPIUtil.Errors;

import org.json.JSONArray;
import org.json.JSONObject;

public class EcommerceUtil
{

    public static enum HOOK
    {
	CUSTOMER_CREATED, CUSTOMER_UPDATED, ORDER_CREATED, ORDER_UPDATED, NOTE_CREATED
    }

    public String apiKey;
    public HOOK hook;
    public Order order;
    public String email;
    public String pluginType;

    public String createContact(String contactJSON)
    {
	System.out.println(contactJSON);
	try
	{

	    // Get Contact count by email
	    int count = ContactUtil.searchContactCountByEmail(email);
	    System.out.println("email " + email + " count: " + count);
	    if (count != 0)
	    {
		Contact contact = ContactUtil.searchContactByEmail(email);
		if (contact == null)
		    return JSAPIUtil.generateContactMissingError();

		JSONObject obj = new JSONObject(contactJSON);
		System.out.println(obj);
		System.out.println(contactJSON);

		JSONArray jarray = obj.getJSONArray("properties");
		int jarrayLen = jarray.length();

		for (int i = 0; i < jarrayLen; i++)
		{
		    JSONObject item = jarray.getJSONObject(i);
		    ContactField field = new ContactField(item.getString("name"), item.getString("value"), null);
		    contact.addpropertyWithoutSaving(field);
		}

		contact.save();

		return JSAPIUtil.generateJSONErrorResponse(Errors.DUPLICATE_CONTACT, email);
	    }

	    ObjectMapper mapper = new ObjectMapper();
	    Contact contact = mapper.readValue(contactJSON, Contact.class);

	    // Sets owner key to contact before saving
	    contact.setContactOwner(JSAPIUtil.getDomainUserKeyFromInputKey(apiKey));
	    contact.addTags(pluginType);

	    try
	    {
		// If zero, save it
		System.out.println("Contact is saving...");
		contact.save();
	    }
	    catch (PlanRestrictedException e)
	    {
		return JSAPIUtil.generateJSONErrorResponse(Errors.CONTACT_LIMIT_REACHED);
	    }

	    return new JSONObject().put("success", true).toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return "{\"error\" : \"" + e.getMessage() + "\"}";
	}

    }

    public String addOrderNote(String json)
    {
	JSONObject jsonObj;
	try
	{
	    if (order == null)
	    {
		jsonObj = new JSONObject(json);
		ObjectMapper mapper = new ObjectMapper();
		order = mapper.readValue(jsonObj.getString("order"), Order.class);
	    }

	    String noteSub = "";
	    String noteDesc = "";
	    if (hook.equals(HOOK.ORDER_CREATED))
	    {
		noteSub = "New order #" + order.id;
		noteDesc = "Order status: " + order.status + "\n";
		noteDesc += "Total amount: " + order.grandTotal + "\n";

		if (order.products != null && !order.products.isEmpty())
		{
		    noteDesc += "Items(id-qty): ";
		    for (Product product : order.products)
		    {
			noteDesc += product.name + '(' + product.id + '-' + product.quantity + "), ";
		    }
		    noteDesc = noteDesc.substring(0, noteDesc.length() - 2);
		}

		noteDesc += "\nBilling: " + order.billingAddress;

		if (order.note != null && !order.note.isEmpty())
		{
		    noteDesc += "\nCustomer note: " + order.note.trim();
		}
	    }
	    else if (hook.equals(HOOK.ORDER_UPDATED))
	    {
		noteSub = "Order updated #" + order.id;
		noteDesc = "Order status changed to " + order.status + ".";
	    }

	    if (!noteSub.isEmpty() && !noteDesc.isEmpty())
	    {
		JSONObject noteJson = new JSONObject();
		noteJson.put("subject", noteSub);
		noteJson.put("description", noteDesc);
		return addNoteToContact(noteJson.toString());
	    }
	    return "{\"error\" : \"Adding note failed.\"}";

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return "{\"error\" : \"" + e.getMessage() + "\"}";
	}

    }

    public String addNoteToContact(String json)
    {
	System.out.println(json);
	try
	{
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    if (contact == null)
		return JSAPIUtil.generateContactMissingError();

	    ObjectMapper mapper = new ObjectMapper();
	    Note note = mapper.readValue(json, Note.class);
	    note.addRelatedContacts(contact.id.toString());

	    DomainUser domainUser = null;
	    if (APIKey.isPresent(apiKey))
		domainUser = APIKey.getDomainUserRelatedToAPIKey(apiKey);
	    if (APIKey.isValidJSKey(apiKey))
		domainUser = APIKey.getDomainUserRelatedToJSAPIKey(apiKey);

	    if (domainUser == null)
		return "{\"error\" : \"No domain user found.\"}";
	    note.owner_id = domainUser.id.toString();
	    note.save();
	    System.out.println("note saved");
	    return new JSONObject().put("success", true).toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return "{\"error\" : \"" + e.getMessage() + "\"}";
	}

    }

}