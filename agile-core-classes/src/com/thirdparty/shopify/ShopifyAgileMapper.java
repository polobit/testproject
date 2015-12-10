package com.thirdparty.shopify;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

import javax.ws.rs.WebApplicationException;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.thirdparty.google.ContactPrefs;

/**
 * <code>ShopifyAgileMapper</code> Maps customers contacts fields into Agile
 * Contacts fields
 * 
 * @author jitendra
 * 
 */

public class ShopifyAgileMapper
{

    /**
     * This method map shopify customer field data into Agile contact field
     * 
     * @param prefs
     * @param customer
     * @param key
     */
    public void map(ContactPrefs prefs, JSONObject customer, Key<DomainUser> key)
    {

	Contact ctx = new Contact();
	List<ContactField> contactField = new ArrayList<ContactField>();
	try
	{

	    if (!customer.isNull("email"))
		contactField.add(new ContactField(Contact.EMAIL, customer.getString("email"), null));

	    if (!customer.isNull("first_name"))
		contactField.add(new ContactField(Contact.FIRST_NAME, customer.getString("first_name"), null));

	    if (!customer.isNull("last_name"))
		contactField.add(new ContactField(Contact.LAST_NAME, customer.getString("last_name"), null));

	    if (!customer.isNull("default_address"))
	    {
		JSONObject address = new JSONObject(customer.get("default_address").toString());

		/**
		 * formating address according to agile address format
		 */
		JSONObject addrs = new JSONObject();
		addrs.put("address", address.get("address1"));
		addrs.put("city", address.get("city"));
		addrs.put("state", address.get("province"));
		addrs.put("country", address.get("country"));
		addrs.put("mobile", address.get("phone"));
		addrs.put("zip", address.get("zip"));
		addrs.put("name", address.get("name"));
		contactField.add(new ContactField(Contact.ADDRESS, addrs.toString(), "home"));
		if (!address.isNull("company"))
		{
		    contactField.add(new ContactField(Contact.COMPANY, address.getString("company"), "Work"));
		    contactField.add(new ContactField(Contact.PHONE, address.getString("phone"), "work"));
		}

	    }
	    ctx.properties = contactField;
	    ctx.type = Type.PERSON;
	    ctx.setContactOwner(key);
	    ctx.save();

	    if (!customer.isNull("note"))
	    {

		Note note = new Note();
		note.subject = "Customer's Note";
		note.description = customer.getString("note");
		note.addContactIds(ctx.id.toString());
		note.save();

	    }

	    /**
	     * saving order related to customer
	     */
	    JSONArray orders = ShopifyUtil.getOrder(prefs, Long.valueOf(customer.getInt("id")));

	    for (int i = 0; i < orders.length(); i++)
	    {
		JSONObject order = new JSONObject(orders.get(i).toString());
		StringBuilder sb = new StringBuilder();
		Note note = new Note();
		note.subject = "Order";
		JSONArray item = order.getJSONArray("line_items");
		LinkedHashSet<String> tag = new LinkedHashSet<String>();
		for (int j = 0; j < item.length(); j++)
		{
		    JSONObject ob = item.getJSONObject(j);
		    sb.append("Item : " + ob.getString("title") + "	");
		    sb.append("Price : " + ob.getString("price") + "	");
		    sb.append("Quantity : " + ob.getString("fulfillable_quantity") + "	");
		    tag.add(ob.getString("title"));
		}
		sb.append("Payment Status :" + order.getString("financial_status"));
		note.description = sb.toString();
		note.addContactIds(ctx.id.toString());
		note.save();
		ctx.tags = tag;
		ctx.update();
	    }

	}
	catch (WebApplicationException e)
	{
	    System.out.println(e.getMessage());
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	}

    }

}
