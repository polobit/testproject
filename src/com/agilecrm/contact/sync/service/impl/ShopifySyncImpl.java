/**
 * 
 */
package com.agilecrm.contact.sync.service.impl;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.SocketTimeoutException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.codehaus.jettison.json.JSONObject;
import org.scribe.exceptions.OAuthException;
import org.scribe.model.OAuthRequest;
import org.scribe.model.Response;
import org.scribe.model.Verb;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.WrapperService;
import com.agilecrm.contact.sync.wrapper.impl.ShopifyContactWrapperImpl;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.NoteUtil;

/**
 * <code>ShopifySyncImpl</code> is Shopify client Implementation of Oneway sync
 * it will fetch Contacts from shopify and and Sync in agile crm
 * 
 * @author jitendra
 */
public class ShopifySyncImpl extends OneWaySyncService
{

    /** shop name */
    private static String shop;

    /**
     * set limit for max fetch result per call maximum allowed limit is 250
     * according to shopify doc and 50 by default
     */
    private static final int MAX_FETCH_RESULT = 200;

    /** set default page is current page. */
    private int currentPage = 1;

    /** hold date as String . */
    private String lastSyncPoint;

    SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm");

   

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

			   
			    addCustomerRelatedNote(customers.get(i).get("note"), contact);
			    saveCustomersOrder(customers.get(i), contact);

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

    /**
     * create Shopify contact wrapper instance that will implements wrapper
     * service
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
	String shopUrl = new StringBuilder("https://" + shop + "/admin/shop.json?").toString();
	
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, shopUrl);
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	try
	{
	    Response response = oAuthRequest.send();
	    BufferedReader br = new BufferedReader(new InputStreamReader(response.getStream()));
	    String str;JSONObject shopObject = null;
	    while((str = br.readLine())!= null){
		    shopObject = new JSONObject(str);
	    }
	    
	    if(shopObject != null){
		    JSONObject object = shopObject.getJSONObject("shop");
		    Object timezone = object.get("timezone").toString().subSequence(1,10);
		    df.setTimeZone(TimeZone.getTimeZone(timezone.toString()));
		    String date = df.format(new Date());
		    prefs.lastSyncCheckPoint = date;
		    prefs.save();
		    
	    }
	
	}

	catch (Exception e)
	{
	    e.printStackTrace();
	}
	

    }

    /**
     * Materialize url return string representation of URL.
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
		if (update.equalsIgnoreCase("new"))
		{
		    uri.append("&created_at_min=" + URLEncoder.encode(lastSyncPoint));
		}
		else if (update.equalsIgnoreCase("edited"))
		{
		    uri.append("&updated_at_min=" + URLEncoder.encode(lastSyncPoint));
		}
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
		    uri.append("&updated_at_min=" + URLEncoder.encode(lastSyncPoint));
		}
	    }
	}

	return uri.toString();

    }

    /**
     * Returns total customers new and updated customer count
     * 
     * @param shopName
     *            the shop name
     * @return the total customers
     */
    private int getTotalCustomers(String shopName)
    {
	Integer count = 0;
	String newCustomerCount = materializeURL(shopName, "count", 0, "new");

	String updatedCustomerCount = materializeURL(shopName, "count", 0, "edited");
	count += getCustomerCount(newCustomerCount);
	if (lastSyncPoint != null)
	{
	    count += getCustomerCount(updatedCustomerCount);
	}

	return count.intValue();
    }

    /**
     * Return total customer base on url params
     * 
     * @param url
     * @return
     */

    private int getCustomerCount(String url)
    {
	int count = 0;
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, url);
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	try
	{
	    Response response = oAuthRequest.send();
	    HashMap<String, String> properties = new ObjectMapper().readValue(response.getBody(),
		    new TypeReference<HashMap<String, String>>()
		    {

		    });
	    if (properties.containsKey("count"))
		count = Integer.parseInt(properties.get("count"));
	}

	catch (OAuthException e)
	{

	    if (e.getCause().equals(new SocketTimeoutException()))
		getCustomerCount(url);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return count;
    }

    /**
     * Gets the customers base on pass access url. URL can have various params
     * result will be filtered out according to params
     * 
     * @param accessURl
     *            the access url
     * @return ArrayList of Customers
     */
    public ArrayList<LinkedHashMap<String, Object>> getCustomers(String accessURl)
    {

	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, accessURl);
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	ArrayList<LinkedHashMap<String, Object>> customers = new ArrayList<LinkedHashMap<String, Object>>();
	try
	{
	    Response response = oAuthRequest.send();
	    Map<String, ArrayList<LinkedHashMap<String, Object>>> results = new ObjectMapper().readValue(
		    response.getStream(), Map.class);
	    customers = results.get("customers");

	}
	catch (OAuthException e)
	{
	    if (e.getCause().equals(new SocketTimeoutException()))
		getCustomers(accessURl);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return customers;
    }

    /**
     * Gets purchased product order of Customer method will takes customerID as
     * params customer Orders as list
     * 
     * @param customerId
     *            the customer id
     * @return the order
     */
    public ArrayList<LinkedHashMap<String, Object>> getOrder(String customerId)
    {
	ArrayList<LinkedHashMap<String, Object>> listOrder = new ArrayList<LinkedHashMap<String, Object>>();
	String newOrder = getOrderUrl(customerId, "new");
	String updatedOrder = getOrderUrl(customerId, "updated");
	listOrder.addAll(Orders(newOrder));
	if (lastSyncPoint != null)
	{
	    listOrder.addAll(Orders(updatedOrder));
	}
	return listOrder;

    }

    private ArrayList<LinkedHashMap<String, Object>> Orders(String url)
    {
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, url);
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	ArrayList<LinkedHashMap<String, Object>> orders = new ArrayList<LinkedHashMap<String, Object>>();
	try
	{
	    Response response = oAuthRequest.send();
	    Map<String, ArrayList<LinkedHashMap<String, Object>>> results = new ObjectMapper().readValue(
		    response.getStream(), Map.class);
	    orders = results.get("orders");

	}
	catch (OAuthException e)
	{
	    if (e.getCause().equals(new SocketTimeoutException()))
		;
	    // retry
	    Orders(url);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return orders;
    }

    /**
     * Construct order URL of customer.
     * 
     * @param custId
     *            the cust id
     * @return the order url
     */
    public String getOrderUrl(String custId, String status)
    {
	StringBuilder sb = new StringBuilder("https://" + shop + "/admin/orders.json?customer_id=" + custId);
	if (lastSyncPoint != null)
	{
	    if (status.equalsIgnoreCase("new"))
	    {
		sb.append("&created_at_min=" + URLEncoder.encode(lastSyncPoint));
	    }
	    else if (status.equalsIgnoreCase("updated"))
	    {
		sb.append("&updated_at_min=" + URLEncoder.encode(lastSyncPoint));
	    }
	}
	return sb.toString();
    }

    /**
     * Save customers order add Product name as tag and Item as Note.
     * 
     * @param customerId
     *            the customer id
     * @param contact
     *            the contact
     */
    public void saveCustomersOrder(Object customer, Contact contact)
    {
	LinkedHashMap<String, Object> customerProperties = (LinkedHashMap<String, Object>) customer;
	ArrayList<LinkedHashMap<String, Object>> orders = getOrder(customerProperties.get("id").toString());

	if (orders != null && orders.size() > 0)
	{
	    removeOlderNotes(contact);
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

		    contact.tags.add(itemDetails.get("title").toString());
		    contact.save();

		}
		// setting total price of orders item
		note.description = note.description + "\n" + "Total Price : " + order.get("total_price") + " ("
			+ order.get("currency") + ")";
		// update notes
		note.save();

		printRefunds(contact, order.get("id").toString(), customerProperties.get("id").toString());
		printOrderRelatedEvents(order.get("id").toString(), contact);

	    }

	}

    }

    /**
     * Add Notes to the Customer
     * 
     * @param noteString
     * @param contact
     */

    private void addCustomerRelatedNote(Object noteObject, Contact contact)
    {
	try
	{
		if(noteObject != null){
			String noteString = noteObject.toString();
			if(!noteString.isEmpty()){
	    if (ContactUtil.isExists(contact.getContactFieldValue(Contact.EMAIL)))
	    {
		List<Note> notes = NoteUtil.getNotes(contact.id);
		List<Note> duplicatedNote = new ArrayList<Note>();
		for (Note note : notes)
		{
		    if (note.subject.equalsIgnoreCase("Customer's Note"))
		    {
			duplicatedNote.add(note);
		    }

		}
		NoteUtil.deleteBulkNotes(duplicatedNote);
	    }

	    Note n = new Note("Customer's Note", noteString);
	    n.addRelatedContacts(contact.id.toString());
	    n.save();

	}
		}
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Remove Previous Product and Order information and updates with new
     * 
     * @param contact
     */
    private void removeOlderNotes(Contact contact)
    {
	try
	{
	    List<Note> notes = NoteUtil.getNotes(contact.id);
	    if (notes.size() > 0)
		NoteUtil.deleteBulkNotes(notes);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    private void printRefunds(Contact conact, String orderId, String customerId)
    {
	String refundUrl = getRefundUrl(orderId, customerId);

	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, refundUrl);
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	ArrayList<LinkedHashMap<String, Object>> refunds = new ArrayList<LinkedHashMap<String, Object>>();
	try
	{
	    Response response = oAuthRequest.send();
	    if(response.getCode() == 200){
	    Map<String, ArrayList<LinkedHashMap<String, Object>>> results = new ObjectMapper().readValue(
		    response.getStream(), Map.class);
	    
	    if (results.get("refunds") != null)
	    {
		refunds.addAll(results.get("refunds"));
	    }
	    }

	}
	catch (OAuthException e)
	{
	    e.printStackTrace();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    private String getRefundUrl(String orderId, String customerId)
    {
	StringBuilder sb = new StringBuilder("https://" + shop + "/admin/orders/" + orderId + "/refunds.json" + "");
	return sb.toString();
    }

    public void printOrderRelatedEvents(String orderId, Contact contact)
    {
	String eventUrl = new StringBuilder("https://" + shop + "/admin/orders/" + orderId + "/events.json").toString();

	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, eventUrl);
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	ArrayList<LinkedHashMap<String, Object>> events = new ArrayList<LinkedHashMap<String, Object>>();
	try
	{
	    Response response = oAuthRequest.send();
	    Map<String, ArrayList<LinkedHashMap<String, Object>>> results = new ObjectMapper().readValue(
		    response.getStream(), Map.class);
	    if (results.get("events") != null)
	    {
		events.addAll(results.get("events"));
	    }

	    if (events != null && events.size() > 0)
	    {
		Iterator<LinkedHashMap<String, Object>> it = events.listIterator();
		System.out.println("==============================================================");
		System.out.println("----------------------- Customer  Events ----------------------");
		while (it.hasNext())
		{
		    LinkedHashMap<String, Object> event = it.next();
		    System.out.println("ContactId         :  "+contact.id);
		    System.out.println("OrderId           :  "+ orderId);
		    System.out.println("Event             :  "+ event.get("verb"));
		    System.out.println("Event message     :   "+ event.get("message"));
		    System.out.println("Created date      :   "+event.get("created_at"));

		}
		System.out.println("==============================================================");
		System.out.println("----------------------- Customer Events ----------------------");
	    }
	}
	catch (OAuthException e)
	{
	    e.printStackTrace();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
		}

	}
}