/**
 * 
 */
package com.thirdparty.quickbook;

import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;
import java.util.Map.Entry;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.TimeZoneUtil;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;
import com.agilecrm.contact.util.NoteUtil;
import com.agilecrm.scribe.util.SignpostUtil;

/**
 * @author jitendra Sync Quickbooks Cusomters as Contact in agile CRM its cursor
 *         based implementation of contacts sync save lastSync date as
 *         checkpoint for next time sync lastSync date is ISO formate of date
 */
public class QuickBookSyncImpl extends OneWaySyncService
{

    private String BASE_URL = "https://quickbooks.api.intuit.com/v3/company/%s/query?query=%s";
    private static int MAX_RESULT = 100;
    private int START_POSITION = 1;
    private int current_page = 1;

    @Override
    public Class<? extends IContactWrapper> getWrapperService()
    {
	return QuickBookContactWrapperImpl.class;
    }

    @Override
    public void initSync()
    {

	int noOfPages = 1;
	int total_customer = getTotalCustomer();
	if (total_customer == 0)
	{
	    sendNotification(prefs.type.getNotificationEmailSubject());
	    updateLastSyncedInPrefs();
	    return;
	}
	if (total_customer > MAX_RESULT)
	{
	    noOfPages = (int) Math.ceil(total_customer / MAX_RESULT);
	}

	while (current_page <= noOfPages)
	{
	    JSONArray customers = getCustomers(START_POSITION, MAX_RESULT);
	    try
	    {
		if (customers != null)
		{
		    for (int i = 0; i < customers.length(); i++)
		    {
			Contact contact = wrapContactToAgileSchemaAndSave(customers.get(i));
			addCustomerInvoiceNote(contact, customers.get(i));
			printPaymentDetails(customers.get(i));
		    }
		}
	    }
	    catch (Exception e)
	    {

		e.printStackTrace();
	    }
	    current_page += current_page + 1;
	    START_POSITION = MAX_RESULT + 1;

	}
	sendNotification(prefs.type.getNotificationEmailSubject());
	updateLastSyncedInPrefs();

    }

    //
    private void printPaymentDetails(Object object)
    {
	JSONObject customer = (JSONObject) object;

	try
	{

	    StringBuilder queryBuilder = new StringBuilder("SELECT * FROM Payment WHERE CustomerRef='").append(customer
		    .get("Id") + "'");
	    String invoiceQuery = queryBuilder.toString();
	    String invoicesURL = String.format(BASE_URL, prefs.othersParams, URLEncoder.encode(invoiceQuery));

	    String result = SignpostUtil
		    .accessURLWithOauth(Globals.QUICKBOOKS_CONSUMER_KEY, Globals.QUICKBOOKS_CONSUMER_SECRET,
			    prefs.token, prefs.secret, invoicesURL, "GET", "", "quickbooks");
	    JSONObject response = new JSONObject(result);
	    JSONObject queryResponse = (JSONObject) response.get("QueryResponse");
	    if (queryResponse.has("Payment"))
	    {
		JSONArray payments = (JSONArray) queryResponse.get("Payment");
		System.out
			.println("==================================================================================================");
		System.out
			.println("============================   Customer payment details ==========================================");
		for (int i = 0; i < payments.length(); i++)
		{
		    JSONObject payment = (JSONObject) payments.get(i);
		    JSONObject customerRef = (JSONObject) payment.get("CustomerRef");
		    JSONObject currencyRef = (JSONObject) payment.get("CurrencyRef");
		    System.out.println("Customer Name        :  " + customerRef.get("name"));
		    System.out.println("Total Amount paid    :  " + payment.get("TotalAmt") + " "
			    + currencyRef.get("value"));
		    System.out.println("Payment Refno        :  " + payment.get("PaymentRefNum"));
		    System.out.println("Trasaction Date      :  " + payment.get("TxnDate"));

		}
		System.out
			.println("===================================================================================================");

	    }

	}
	catch (Exception e)
	{

	    updateLastSyncedInPrefs();
	    e.printStackTrace();
	}

    }

    // add customer invoices as note
    private void addCustomerInvoiceNote(Contact contact, Object object)
    {
	JSONObject customer = (JSONObject) object;

	try
	{
	    JSONArray customerInvoices = getInvoices(customer, customer.get("Id"));

	    if (customerInvoices != null)
	    {
		for (int i = 0; i < customerInvoices.length(); i++)
		{
		    JSONObject invoice = (JSONObject) customerInvoices.get(i);
		    JSONObject currencyRef = (JSONObject) invoice.get("CurrencyRef");
		    Note note = new Note();
		    note.subject = "Invoice No # " + invoice.get("DocNumber");
		    JSONArray items = (JSONArray) invoice.get("Line");

		    for (int j = 0; j < items.length() - 1; j++)
		    {

			JSONObject salesItemLineDetail = (JSONObject) items.get(j);
			if (salesItemLineDetail.has("SalesItemLineDetail"))
			{
			    JSONObject salesInfo = (JSONObject) salesItemLineDetail.get("SalesItemLineDetail");
			    if (salesInfo.has("ItemRef"))
			    {
				JSONObject itemRef = (JSONObject) salesInfo.get("ItemRef");

				if (salesInfo.has("TaxCodeRef"))
				{

				    JSONObject taxCodeRef = (JSONObject) salesInfo.get("TaxCodeRef");

				    if (note.description == null)
				    {
					note.description = itemRef.get("name") + " Price # "
						+ salesInfo.get("UnitPrice") + " (" + currencyRef.get("value") + ")";
					if (!taxCodeRef.get("value").equals("NON"))
					{
					    note.description += "Tax # " + taxCodeRef.get("value") + " ("
						    + currencyRef.get("value") + ")";
					}
				    }
				    else
				    {
					note.description += "\n" + itemRef.get("name") + " Price # "
						+ salesInfo.get("UnitPrice") + " (" + currencyRef.get("value") + ")";
					if (!taxCodeRef.get("value").equals("NON"))
					{
					    note.description += "Tax # " + taxCodeRef.get("value") + " ("
						    + currencyRef.get("value") + ")";
					}
				    }

				}
			    }
			}

		    }
		    // adding total price in note description
		    if (items.length() >= 2)
		    {
			// get last item contains total info
			int lastIndex = items.length() - 1;
			JSONObject totalPriceDetail = (JSONObject) items.get(lastIndex);
			note.description += "\n Total Price :" + totalPriceDetail.get("Amount") + " ("
				+ currencyRef.get("value") + ")";

		    }
		    note.addRelatedContacts(contact.id.toString());
		    note.save();
		    
		    
		   
		    
		    
		}
	    }
	    
	    // add customer related notes
	    if(customer.has("Notes")){
	     addCustomerRelatedNote(customer.get("Notes"), contact);
	    }
	    
	    
	}
	catch (JSONException e)
	{
	    // update last sync date even if got some exceptions
	    updateLastSyncedInPrefs();
	    e.printStackTrace();
	}

    }
    
    private void addCustomerRelatedNote(Object noteObject, Contact contact)
    {
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
    }

    // retrieves all invoices related to customer
    private JSONArray getInvoices(JSONObject customer, Object customerId)
    {
	JSONArray allInvoices = new JSONArray();

	try
	{

	    
	    StringBuilder queryBuilder = new StringBuilder("SELECT * FROM Invoice");
	    if(prefs.lastSyncCheckPoint != null){
		queryBuilder.append(" Where MetaData.CreateTime > '"+prefs.lastSyncCheckPoint+"' AND CustomerRef = '"+customer.get("Id")+"'");
	    }else{
		
		queryBuilder.append(" Where CustomerRef='"+customer.get("Id")+"'");
	    }
	    String invoiceQuery = queryBuilder.toString();
	    String invoicesURL = String.format(BASE_URL, prefs.othersParams, URLEncoder.encode(invoiceQuery));

	    String result = SignpostUtil
		    .accessURLWithOauth(Globals.QUICKBOOKS_CONSUMER_KEY, Globals.QUICKBOOKS_CONSUMER_SECRET,
			    prefs.token, prefs.secret, invoicesURL, "GET", "", "quickbooks");
	    JSONObject response = new JSONObject(result);
	    JSONObject invoice = (JSONObject) response.get("QueryResponse");
	    if (invoice.has("Invoice"))
	    {
		allInvoices = (JSONArray) invoice.get("Invoice");
	    }
	}
	catch (Exception e)
	{
	    updateLastSyncedInPrefs();
	    e.printStackTrace();
	}

	return allInvoices;

    }

    @Override
    protected void updateLastSyncedInPrefs()
    {
	// get time zone of company
	String companyInfoQuery = "SELECT * FROM Company";
	String url = String.format(BASE_URL, prefs.othersParams, URLEncoder.encode(companyInfoQuery));
	try
	{
	    String result = SignpostUtil.accessURLWithOauth(Globals.QUICKBOOKS_CONSUMER_KEY,
		    Globals.QUICKBOOKS_CONSUMER_SECRET, prefs.token, prefs.secret, url, "GET", "", "quickbooks");
	    JSONObject response = new JSONObject(result);
	    JSONObject queryResponse = (JSONObject) response.get("QueryResponse");
	    if (queryResponse != null)
	    {
		JSONArray listCompany = (JSONArray) queryResponse.get("Company");
		JSONObject company = (JSONObject) listCompany.get(0);
		JSONObject metaInfo = (JSONObject) company.get("MetaData");
		String createdTime = (String) metaInfo.get("CreateTime");
		if (createdTime != null)
		{
		    // get time zone
		    TimeZone tz = TimeZoneUtil.getTimeZone(createdTime);
		    String offset = tz.getID().substring(3);
		    SimpleDateFormat df = new SimpleDateFormat("YYYY-MM-dd'T'hh:mm:ss");
		    df.setTimeZone(tz);
		    String currentDate = df.format(new Date()) + offset;
		    System.out.println("iso formate current date " + currentDate);
		    prefs.lastSyncCheckPoint = currentDate;
		    prefs.save();

		}
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    // Retrieve All customer using filter and cursor

    public JSONArray getCustomers(int startIndex, int maxResult)
    {
	JSONArray customers = new JSONArray();
	String query = "SELECT *  FROM Customer  STARTPOSITION " + startIndex + " MAXRESULTS " + maxResult + "";
	if (prefs.lastSyncCheckPoint != null)
	{
	    query = "SELECT *  FROM Customer WHERE MetaData.CreateTime > '" + prefs.lastSyncCheckPoint
		    + "' STARTPOSITION " + startIndex + " MAXRESULTS " + maxResult + "";
	}
	String customerAccessURl = String.format(BASE_URL, prefs.othersParams, URLEncoder.encode(query));

	try
	{
	    // get newly added customer after last sync

	    String response = SignpostUtil.accessURLWithOauth(Globals.QUICKBOOKS_CONSUMER_KEY,
		    Globals.QUICKBOOKS_CONSUMER_SECRET, prefs.token, prefs.secret, customerAccessURl, "GET", "",
		    "quickbooks");
	    JSONObject object = new JSONObject(response);

	    JSONObject queryResponse = (JSONObject) object.get("QueryResponse");
	    if (queryResponse != null)
	    {
		if (queryResponse.has("Customer"))
		{
		    customers = queryResponse.getJSONArray("Customer");
		}
	    }

	    // get updated customer

	    if (prefs.lastSyncCheckPoint != null)
	    {
		String updatedCustomerQuery = "SELECT *  FROM Customer WHERE MetaData.LastUpdatedTime > '"
			+ prefs.lastSyncCheckPoint + "'";
		String url = String.format(BASE_URL, prefs.othersParams, URLEncoder.encode(updatedCustomerQuery));
		String res = SignpostUtil.accessURLWithOauth(Globals.QUICKBOOKS_CONSUMER_KEY,
			Globals.QUICKBOOKS_CONSUMER_SECRET, prefs.token, prefs.secret, url, "GET", "", "quickbooks");
		JSONObject respObject = new JSONObject(res);

		JSONObject results = (JSONObject) respObject.get("QueryResponse");
		if (results != null)
		{
		    if (results.has("Customer"))
		    {
			JSONArray customerArray = results.getJSONArray("Customer");
			for (int i = 0; i < customerArray.length(); i++)
			{
			    customers.put(customerArray.get(i));
			}
		    }
		}

	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return customers;
    }

    public int getTotalCustomer()
    {
	String countQuery = "SELECT COUNT(*) FROM Customer";
	String  updatecountURL = null;
	if (prefs.lastSyncCheckPoint != null)
	{
	    countQuery = "SELECT COUNT(*) FROM Customer Where MetaData.CreateTime > '" + prefs.lastSyncCheckPoint + "'";
	    String updatedCountQuery = "SELECT COUNT(*) FROM Customer Where MetaData.LastUpdatedTime > '"
		    + prefs.lastSyncCheckPoint + "'";
	     updatecountURL = String.format(BASE_URL, prefs.othersParams, URLEncoder.encode(updatedCountQuery));
	}
	int count = 0;
	String countURL = String.format(BASE_URL, prefs.othersParams, URLEncoder.encode(countQuery));

	try
	{
	    String response = SignpostUtil.accessURLWithOauth(Globals.QUICKBOOKS_CONSUMER_KEY,
		    Globals.QUICKBOOKS_CONSUMER_SECRET, prefs.token, prefs.secret, countURL, "GET", "", "quickbooks");

	    JSONObject object = new JSONObject(response);

	    JSONObject queryResponse = object.getJSONObject("QueryResponse");
	    if (queryResponse.has("totalCount"))
	    {
		count = (int) queryResponse.get("totalCount");
	    }

	    if (prefs.lastSyncCheckPoint != null)
	    {
		String updateResponse = SignpostUtil.accessURLWithOauth(Globals.QUICKBOOKS_CONSUMER_KEY,
			Globals.QUICKBOOKS_CONSUMER_SECRET, prefs.token, prefs.secret, updatecountURL, "GET", "",
			"quickbooks");

		JSONObject updateCountResp = new JSONObject(updateResponse);

		JSONObject countResp = updateCountResp.getJSONObject("QueryResponse");
		if (countResp.has("totalCount"))
		{
		    count += (int) countResp.get("totalCount");
		}

	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return count;
    }

}
