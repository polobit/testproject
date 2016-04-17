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
import java.util.Map.Entry;
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
import com.agilecrm.contact.sync.TimeZoneUtil;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;
import com.agilecrm.contact.sync.wrapper.impl.ShopifyContactWrapperImpl;
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
	    /*
	     * int total_records = getTotalCustomers(shop); int pages = (int)
	     * Math.ceil(total_records / MAX_FETCH_RESULT);
	     * 
	     * if (total_records < MAX_FETCH_RESULT) pages = 1;
	     */
	    boolean limitExceeded = false;

	    try
	    {

		while (true)
		{
		    ArrayList<LinkedHashMap<String, Object>> customers = new ArrayList<LinkedHashMap<String, Object>>();
		    /*
		     * String newCustomerURl = materializeURL(shop, "customers",
		     * currentPage, "new"); String updateCustomerURl =
		     * materializeURL(shop, "customers", currentPage, "edited");
		     * 
		     * customers.addAll(getCustomers(newCustomerURl)); if
		     * (lastSyncPoint != null) {
		     * customers.addAll(getCustomers(updateCustomerURl)); }
		     */
		    ArrayList<LinkedHashMap<String, Object>> newCustomersList = new ArrayList<LinkedHashMap<String, Object>>();
		    ArrayList<LinkedHashMap<String, Object>> updatedCustomersList = new ArrayList<LinkedHashMap<String, Object>>();

		    newCustomersList = getCustomers(materializeURL(shop, "customers", currentPage, "new"), currentPage,
			    materializeURL(shop, "count", 0, "new"));
		    if (newCustomersList != null)
			System.out.println("newCustomersList size-----" + newCustomersList.size());
		    if (lastSyncPoint != null)
		    {
			updatedCustomersList = getCustomers(materializeURL(shop, "customers", currentPage, "edited"),
				currentPage, materializeURL(shop, "count", 0, "edited"));
			if (updatedCustomersList != null)
			    System.out.println("updatedCustomersList size-----" + updatedCustomersList.size());
		    }
		    if (newCustomersList != null)
			customers.addAll(newCustomersList);
		    if (updatedCustomersList != null){
		    	for (int i = 0; i < updatedCustomersList.size(); i++)
				{
		    		if(customers!=null && customers.size()!=0){
		    		for (int j = 0; j < customers.size(); j++)
		    		{
		    			if(customers.get(j).get("id").equals(updatedCustomersList.get(i).get("id")))
		    				break;
		    			else
		    				customers.add(updatedCustomersList.get(i));
		    		}
		    		}
		    		else
		    			customers.add(updatedCustomersList.get(i));
				}
		    	//customers.addAll(updatedCustomersList);
		    }
			

		    if (newCustomersList != null && newCustomersList.size() == 0 && updatedCustomersList != null
			    && updatedCustomersList.size() == 0)
			break;
		    limitExceeded = isLimitExceeded();
		    if (!limitExceeded && customers.size() > 0)
		    {
			if (customers != null)
			    System.out.println("customers size----------" + customers.size());
			for (int i = 0; i < customers.size(); i++)
			{

			    Contact contact = wrapContactToAgileSchemaAndSave(customers.get(i));
			    System.out.println("Contact-------" + contact);

			    addCustomerRelatedNote(customers.get(i).get("note"), contact);
			    saveCustomersOrder(customers.get(i), contact);

			}
		    }
		    else
		    {
			System.out.println("Limit exceeded so updating last sync prefs");
			updateLastSyncedInPrefs();
			break;
		    }
		    currentPage += 1;
		}
		// If limit exceeded mail notification is called by
		// isLimitExceeded()
		// otherwise we call mail notification from here
		if (!limitExceeded)
		    sendNotification(prefs.type.getNotificationEmailSubject());
		System.out.println("After mail notification, updating last sync prefs");
		updateLastSyncedInPrefs();
	    }
	    catch (Exception e)
	    {
		System.out.println("After exception raised in initSync(), updating last sync prefs----- "
			+ e.getMessage());
		updateLastSyncedInPrefs();
		e.printStackTrace();
	    }

	}
    }

    /**
     * create Shopify contact wrapper instance that will implements wrapper
     * service
     */
    @Override
    public Class<? extends IContactWrapper> getWrapperService()
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
	    String str;
	    JSONObject shopObject = null;
	    while ((str = br.readLine()) != null)
	    {
		shopObject = new JSONObject(str);
	    }

	    if (shopObject != null)
	    {
		JSONObject object = shopObject.getJSONObject("shop");
		String createdTime = (String) object.get("created_at");
		TimeZone tz = TimeZoneUtil.getTimeZone(createdTime);
		SimpleDateFormat df = new SimpleDateFormat("YYYY-MM-dd HH:mm");
		df.setTimeZone(tz);
		String currentDate = df.format(new Date());
		System.out.println("iso formate current date " + currentDate);
		prefs.lastSyncCheckPoint = currentDate;
		prefs.save();

	    }

	}

	catch (Exception e)
	{

	    // retries when any problem happence
	    System.out.println("After exception raised in updateLastSyncedInPrefs(), updating last sync prefs------- "
		    + e.getMessage());
	    updateLastSyncedInPrefs();
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
    System.out.println("Start getCustomerCount(-)-----");
    System.out.println("url------"+url);
	int count = 0;
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, url);
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	try
	{
	    Response response = oAuthRequest.send();
	    //If we get 429 response code, we'll get the response again after 10 seconds.
	    if(response!=null && response.getCode()==429)
	    {
	    	System.out.println("response.getCode()--------------"+response.getCode());
	    	System.out.println("before thread sleep--------------");
	    	Thread.sleep(10000);
	    	oAuthRequest = new OAuthRequest(Verb.GET, url);
	    	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	    	response = oAuthRequest.send();
	    	System.out.println("after thread sleep--------------");
	    }
	    HashMap<String, String> properties = new ObjectMapper().readValue(response.getBody(),
		    new TypeReference<HashMap<String, String>>()
		    {

		    });
	    if (properties.containsKey("count"))
		count = Integer.parseInt(properties.get("count"));
	    System.out.println("count----"+count);
	    System.out.println("properties.containsKey(count)----"+properties.containsKey("count"));
	    for (Map.Entry<String,String> entry : properties.entrySet()) {
			System.out.println(entry.getKey()+"---------"+entry.getValue());
		}
	}

	catch (OAuthException e)
	{

	    if (e.getCause().equals(new SocketTimeoutException())
		    || e.getCause().toString().contains((new SocketTimeoutException()).toString()))
		getCustomerCount(url);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	System.out.println("End getCustomerCount(-)-----");
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
    public ArrayList<LinkedHashMap<String, Object>> getCustomers(String accessURl, int currentPage, String countURL)
    {
    System.out.println("Start getCustomers(-,-,-)-------");
    System.out.println("currentPage---"+currentPage+"--------MAX_FETCH_RESULT-----"+MAX_FETCH_RESULT);
	OAuthRequest oAuthRequest = new OAuthRequest(Verb.GET, accessURl);
	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	ArrayList<LinkedHashMap<String, Object>> customers = new ArrayList<LinkedHashMap<String, Object>>();
	try
	{
	    Response response = oAuthRequest.send();
	    //If we get 429 response code, we'll get the response again after 10 seconds.
	    if(response!=null && response.getCode()==429)
	    {
	    	System.out.println("response.getCode()--------------"+response.getCode());
	    	System.out.println("before thread sleep--------------");
	    	Thread.sleep(10000);
	    	oAuthRequest = new OAuthRequest(Verb.GET, accessURl);
	    	oAuthRequest.addHeader("X-Shopify-Access-Token", prefs.token);
	    	response = oAuthRequest.send();
	    	System.out.println("after thread sleep--------------");
	    }
	    Map<String, ArrayList<LinkedHashMap<String, Object>>> results = new ObjectMapper().readValue(
		    response.getStream(), Map.class);
	    customers = results.get("customers");
	    int total_customers = getCustomerCount(countURL);
	    System.out.println("total_customers-------"+total_customers);
	    // Some times no customers getting due to invalid response so
	    // if customers null again calling the getCustomers method
	    if ((customers == null && (currentPage * MAX_FETCH_RESULT) < total_customers)
		    || (customers != null && customers.size() == 0 && (currentPage * MAX_FETCH_RESULT) < total_customers))
	    {
		System.out.println("customers is null");
		getCustomers(accessURl, currentPage, countURL);
	    }
	}
	catch (OAuthException e)
	{
		e.printStackTrace();
	    if (e.getCause().equals(new SocketTimeoutException())
		    || e.getCause().toString().contains((new SocketTimeoutException()).toString()))
		getCustomers(accessURl, currentPage, countURL);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	System.out.println("End getCustomers(-,-,-)-------");
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
	List<LinkedHashMap<String, Object>> newOrderList = Orders(newOrder);
	List<LinkedHashMap<String, Object>> updatedOrderList = Orders(updatedOrder);
	if (newOrderList != null)
	    listOrder.addAll(newOrderList);
	if (lastSyncPoint != null)
	{
	    if (updatedOrderList != null)
		listOrder.addAll(updatedOrderList);
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
	    // retry
	    if (e.getCause().equals(new SocketTimeoutException())
		    || e.getCause().toString().contains((new SocketTimeoutException()).toString()))
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
	StringBuilder sb = new StringBuilder("https://" + shop + "/admin/orders.json?customer_id=" + custId
		+ "&status=any");
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
	try
	{
	    System.out.println("Start------saveCustomersOrder(-,-)");
	    LinkedHashMap<String, Object> customerProperties = (LinkedHashMap<String, Object>) customer;
	    ArrayList<LinkedHashMap<String, Object>> orders = getOrder(customerProperties.get("id").toString());

	    if (orders != null && orders.size() > 0)
	    {

		// removeOlderNotes(contact);
		Map<String, Note> notes = new HashMap<String, Note>();

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

			if (notes.containsKey(note.subject))
			{

			    Note n = notes.get(note.subject);
			    StringBuilder sb = new StringBuilder(n.description);
			    sb.append("\n").append(itemDetails.get("name") + " : ")
				    .append(itemDetails.get("price") + "(").append(order.get("currency") + ")");
			    if (taxDetails.size() > 0)
			    {
				sb.append("Tax : " + taxDetails.get(0).get("price") + "(" + order.get("currency") + ")");
			    }
			    sb.append("\n Total Price : " + order.get("total_price") + "(" + order.get("currency")
				    + ")");
			    n.description = sb.toString();

			}
			else
			{
			    StringBuilder sb = new StringBuilder();
			    sb.append(itemDetails.get("name") + " : ").append(itemDetails.get("price") + "(")
				    .append(order.get("currency") + ")");
			    if (taxDetails.size() > 0)
			    {
				sb.append("Tax : " + taxDetails.get(0).get("price") + "(" + order.get("currency") + ")");
			    }
			    note.description = sb.toString();

			}
			if (listItems.size() == 1)
			{
			    note.description += "\n Total Price : " + order.get("total_price") + "("
				    + order.get("currency") + ")" + "";
			}

			note.addRelatedContacts(contact.id.toString());

			notes.put(note.subject, note);

			if (itemDetails.get("title") != null)
			{
			    // Replacing special characters with underscore
			    // except space and underscore
			    String tagName = itemDetails.get("title").toString().replaceAll("[^\\p{L}\\p{N} _]", "_")
				    .trim();
			    if (tagName != null)
			    {
				// if tag name start with _ we removed that _
				// until tag name starts with alphabet
				while (tagName.startsWith("_"))
				    tagName = tagName.replaceFirst("_", "").trim();
				if (!tagName.isEmpty())
				    contact.tags.add(tagName);
			    }
			}
			contact.save();

		    }
		    // saving note
		    try
		    {
			List<Note> listNote = NoteUtil.getNotes(contact.id);
			for (Note n : listNote)
			{
			    notes.put(n.subject, n);
			}

			for (Entry<String, Note> map : notes.entrySet())
			{
			    Note orderNote = map.getValue();
			    orderNote.save();
			}
		    }
		    catch (Exception e)
		    {
			e.printStackTrace();
		    }

		    printRefunds(contact, order.get("id").toString(), customerProperties.get("id").toString());
		    printOrderRelatedEvents(order.get("id").toString(), contact);

		}

	    }
	    System.out.println("End------saveCustomersOrder(-,-)");

	}
	catch (Exception e1)
	{
	    e1.printStackTrace();
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
	System.out.println("Start----addCustomerRelatedNote(-,-)");
	Map<String, Note> noteMap = new HashMap<String, Note>();
	try
	{
	    List<Note> existing = new ArrayList<Note>();

	    if (noteObject != null)
	    {
		String noteString = noteObject.toString();
		if (!noteString.isEmpty())
		{
		    // new note

		    Note n = new Note("Customer Note", noteString);
		    n.addRelatedContacts(contact.id.toString());
		    noteMap.put("Customer Note", n);

		    // checking existing customer note

		    List<Note> notes = NoteUtil.getNotes(contact.id);
		    for (Note note : notes)
		    {
			if (note.subject.equalsIgnoreCase("Customer Note"))
			{
			    existing.add(note);

			}
		    }

		}

	    }

	    for (Entry<String, Note> e : noteMap.entrySet())
	    {
		NoteUtil.deleteBulkNotes(existing);
		Note n = e.getValue();
		n.save();
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	System.out.println("End----addCustomerRelatedNote(-,-)");
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
	    if (response.getCode() == 200)
	    {
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
		    System.out.println("ContactId         :  " + contact.id);
		    System.out.println("OrderId           :  " + orderId);
		    System.out.println("Event             :  " + event.get("verb"));
		    System.out.println("Event message     :   " + event.get("message"));
		    System.out.println("Created date      :   " + event.get("created_at"));

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