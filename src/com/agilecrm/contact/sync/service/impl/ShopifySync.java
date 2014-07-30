/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

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

// TODO: Auto-generated Javadoc
/**
 * The Class ShopifySync.
 * 
 * @author jitendra
 */
public class ShopifySync extends OneWaySyncService
{
    private static String shop;
    private static final int MAX_FETCH_RESULT = 50;
    private int currentPage = 1;
    private String lastSyncPoint;

    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
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
		uri.append("&created_at_min=" + lastSyncPoint);
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
		    uri.append("&created_at_min=" + lastSyncPoint);
		}
		else if (update.equalsIgnoreCase("edited"))
		{
		    uri.append("&updated_at_max=" + lastSyncPoint);
		}
	    }
	}
	System.out.println(uri.toString());

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
     * Save customers order.
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
		LinkedHashMap<String, Object> order = it.next();

		ArrayList<LinkedHashMap<String, String>> itemDetails = (ArrayList<LinkedHashMap<String, String>>) order
			.get("line_items");
		Iterator<LinkedHashMap<String, String>> iterator = itemDetails.listIterator();
		while (iterator.hasNext())
		{
		    LinkedHashMap<String, String> details = iterator.next();
		    Note n = new Note("Orders", details.get("name") + "-" + details.get("price"));

		    n.addRelatedContacts(contact.id.toString());
		    n.save();

		    contact.tags.add(details.get("title"));
		    contact.save();
		}

	    }
	}

    }
}