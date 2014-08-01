/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.agilecrm.contact.sync.wrapper.impl.ShopifyContactWrapperImpl;

import edu.emory.mathcs.backport.java.util.Arrays;

// TODO: Auto-generated Javadoc
/**
 * The Class ShopifySync.
 * 
 * @author jitendra
 */
public class ShopifySyncImpl extends OneWaySyncService
{
    private static String shop;
    private static final int MAX_FETCH_RESULT = 50;
    private int currentPage = 1;
    private String lastSyncPoint;

    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm");
    String date = df.format(new Date());

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.OneWaySyncService#initSync()
     */
    @Override
    public void initSync()
    {
	shop = prefs.othersParams;
	lastSyncPoint = prefs.lastSyncCheckPoint;
	if (shop != null && !shop.isEmpty())
	{
	    int total_records = getTotalCustomers(shop);
	    int pages = (int) Math.ceil(total_records / MAX_FETCH_RESULT);

	    if (total_records < MAX_FETCH_RESULT)
		pages = 1;

	    try
	    {

		while (currentPage <= pages)
		{
		    ArrayList<LinkedHashMap<String, Object>> customers = new ArrayList<LinkedHashMap<String, Object>>();
		    String newCustomerURl = materializeURL(shop, "customers", currentPage, "new");
		    String updateCustomerURl = materializeURL(shop, "customers", currentPage, "edited");

		    customers.addAll(getCustomers(newCustomerURl));
		    if (lastSyncPoint != null)
		    {
			customers.addAll(getCustomers(updateCustomerURl));
		    }
		    if (!isLimitExceeded())
		    {
			for (int i = 0; i < customers.size(); i++)
			{

			    Contact contact = wrapContactToAgileSchemaAndSave(customers.get(i));
			    saveCustomersOrder(customers.get(i).get("id").toString(), contact);

			}
		    }
		    else
		    {
			updateLastSyncedInPrefs();
			break;
		    }
		    currentPage += 1;
		}
		sendNotification(prefs.type.getNotificationEmailSubject());
		updateLastSyncedInPrefs();
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }

	}
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.service.SyncService#getWrapperService()
     */
    @Override
    public Class<? extends WrapperService> getWrapperService()
    {
	return ShopifyContactWrapperImpl.class;
    }

    /*
     * (non-Javadoc)
     * 
     * @see
     * com.agilecrm.contact.sync.service.ContactSyncService#updateLastSyncedInPrefs
     * ()
     */
    @Override
    protected void updateLastSyncedInPrefs()
    {
	prefs.lastSyncCheckPoint = date;
	prefs.save();

    }

    /**
     * Materialize url.
     * 
     * @param shop
     *            the shop
     * @param entityName
     *            the entity name
     * @param page
     *            the page
     * @param update
     *            the update
     * @return the string
     */
    private String materializeURL(String shop, String entityName, int page, String update)
    {
	StringBuilder uri = new StringBuilder();
	if (entityName.equalsIgnoreCase("count"))
	{
	    uri.append("https://").append(shop).append("/admin/customers/").append(entityName + ".json?");
	    if (lastSyncPoint != null)
	    {
		uri.append("&created_at_min=" + URLEncoder.encode(lastSyncPoint));
	    }
	}
	else
	{

	    uri.append("https://").append(shop).append("/admin/").append(entityName + ".json?");
	}
	if (page != 0)
	{
	    uri.append("limit=" + MAX_FETCH_RESULT).append("&page=" + currentPage);
	    if (lastSyncPoint != null)
	    {
		if (update.equalsIgnoreCase("new"))
		{
		    uri.append("&created_at_min=" + URLEncoder.encode(lastSyncPoint));
		}
		else if (update.equalsIgnoreCase("edited"))
		{
		    uri.append("&updated_at_max=" + URLEncoder.encode(lastSyncPoint));
		}
	    }
	}

	return uri.toString();

    }

    /**
     * Gets the total new customers .
     * 
     * @param shopName
     *            the shop name
     * @return the total customers
     */
    private int getTotalCustomers(String shopName)
    {
	Integer count = 0;
	String uri = materializeURL(shopName, "count", 0, "new");
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, uri);
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	Response response = oAuthRequest.send();
	try
	{
	    HashMap<String, String> properties = new ObjectMapper().readValue(response.getBody(),
		    new TypeReference<HashMap<String, String>>()
		    {

		    });
	    if (properties.containsKey("count"))
		count = Integer.parseInt(properties.get("count"));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return count.intValue();
    }

    /**
     * Gets the customers.
     * 
     * @param accessURl
     *            the access u rl
     * @return the customers
     */
    public ArrayList<LinkedHashMap<String, Object>> getCustomers(String accessURl)
    {

	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, accessURl);
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	ArrayList<LinkedHashMap<String, Object>> customers = new ArrayList<LinkedHashMap<String, Object>>();
	Response response = oAuthRequest.send();
	try
	{
	    Map<String, ArrayList<LinkedHashMap<String, Object>>> results = new ObjectMapper().readValue(
		    response.getStream(), Map.class);
	    customers = results.get("customers");

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return customers;
    }

    /**
     * Gets the order related to customer.
     * 
     * @param customerId
     *            the customer id
     * @return the order
     */
    public ArrayList<LinkedHashMap<String, Object>> getOrder(String customerId)
    {
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, getOrderUrl(customerId));
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	ArrayList<LinkedHashMap<String, Object>> orders = new ArrayList<LinkedHashMap<String, Object>>();
	Response response = oAuthRequest.send();
	try
	{
	    Map<String, ArrayList<LinkedHashMap<String, Object>>> results = new ObjectMapper().readValue(
		    response.getStream(), Map.class);
	    orders = results.get("orders");

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return orders;
    }

    public String getOrderUrl(String custId)
    {
	StringBuilder sb = new StringBuilder("https://" + shop + "/admin/orders.json?customer_id=" + custId);
	return sb.toString();
    }

    /**
     * Save customers order add Product name as tag and Item as Note
     * 
     * @param customerId
     *            the customer id
     * @param contact
     *            the contact
     */
    public void saveCustomersOrder(String customerId, Contact contact)
    {
	ArrayList<LinkedHashMap<String, Object>> orders = getOrder(customerId);

	if (orders != null && orders.size() > 0)
	{
	    Iterator<LinkedHashMap<String, Object>> it = orders.listIterator();
	    while (it.hasNext())
	    {
		Note note = new Note();
		LinkedHashMap<String, Object> order = it.next();

		ArrayList<LinkedHashMap<String, Object>> listItems = (ArrayList<LinkedHashMap<String, Object>>) order
			.get("line_items");
		Iterator<LinkedHashMap<String, Object>> iterator = listItems.listIterator();
		while (iterator.hasNext())
		{
		    LinkedHashMap<String, Object> itemDetails = iterator.next();
		    ArrayList<LinkedHashMap<String, String>> taxDetails = (ArrayList<LinkedHashMap<String, String>>) itemDetails
			    .get("tax_lines");
		    note.subject = "Order-" + order.get("order_number");
		    if (note.description != null && !note.description.isEmpty())
		    {
			note.description = note.description + "\n" + itemDetails.get("name") + ": "
				+ itemDetails.get("price") + " (" + order.get("currency") + ") + Tax : "
				+ taxDetails.get(0).get("price") + " (" + order.get("currency") + ")";

		    }
		    else
		    {
			note.description = itemDetails.get("name") + ": " + itemDetails.get("price") + " ("
				+ order.get("currency") + ") + Tax : " + taxDetails.get(0).get("price") + " ("
				+ order.get("currency") + ")";
		    }

		    note.addRelatedContacts(contact.id.toString());

		    note.save();

		    contact.tags.add((String) itemDetails.get("title"));
		    contact.save();
		}
		// setting total price of orders item
		note.description = note.description + "\n" + "Total Price : " + order.get("total_price") + " ("
			+ order.get("currency") + ")";
		// update notes
		note.save();
		// save order related customer note
		if (order.containsKey("note"))
		{
		    Object customerNote = order.get("note");
		    if (customerNote != null)
		    {
			// check for empty string
			if (!customerNote.toString().isEmpty())
			{
			    Note n = new Note("Customer's Note", customerNote.toString());
			    n.addRelatedContacts(contact.id.toString());
			    n.save();
			}
		    }
		}

		// save order related tags
		if (order.containsKey("tags"))
		{
		    Object tag = order.get("tags");
		    if (tag != null)
		    {
			String[] tags = tag.toString().split(",");
			for (String s : tags)
			{
			    if (!s.isEmpty())
			    {
				contact.tags.add(s);

			    }
			}
			contact.save();
		    }
		}

	    }
	}

    }
}