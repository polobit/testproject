package com.thirdparty.xero;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import oauth.signpost.OAuthConsumer;
import oauth.signpost.basic.DefaultOAuthConsumer;
import oauth.signpost.exception.OAuthExpectationFailedException;
import oauth.signpost.exception.OAuthMessageSignerException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.service.OneWaySyncService;
import com.agilecrm.contact.sync.wrapper.IContactWrapper;

public class XeroSyncImpl extends OneWaySyncService
{
    private int currentPage = 1;
    private static String BASE_URL = "https://api.xero.com/api.xro/2.0/%s";

    @Override
    public Class<? extends IContactWrapper> getWrapperService()
    {
	return XeroContactWrapperImpl.class;
    }

    @Override
    public void initSync()
    {

	while (true)
	{

	    try
	    {
		String contactURl = String.format(BASE_URL + "?page=" + currentPage + "", "Contacts");
		String result = accessURLWithOauth(Globals.XERO_API_KEY, Globals.XERO_CLIENT_ID, prefs.token,
			prefs.secret, contactURl, "GET");
		JSONObject response = new JSONObject(result);
		if (response.has("Contacts"))
		{
		    JSONArray contacts = (JSONArray) response.get("Contacts");

		    if (contacts.length() > 0)
		    {

			for (int i = 0; i < contacts.length(); i++)
			{

			    Contact agileContact = wrapContactToAgileSchemaAndSave(contacts.get(i));
			    addCustomerInvoiceNote(agileContact, contacts.get(i));
			}

		    }
		    else
		    {
			break;
		    }
		}

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
		break;
	    }

	    currentPage += 1;
	}
	// send email notification after import
	sendNotification(prefs.type.getNotificationEmailSubject());
	// update last sync time
	updateLastSyncedInPrefs();
    }

    private void addCustomerInvoiceNote(Contact contact, Object object)
    {
	JSONObject customer = (JSONObject) object;
	try
	{
	    JSONObject invoiceObject = getInvoice(customer.get("ContactID"));

	    if (invoiceObject != null)
	    {
		JSONArray invoices = (JSONArray) invoiceObject.get("Invoices");

		for (int i = 0; i < invoices.length(); i++)
		{
		    Note invoiceNote = new Note();
		    JSONObject invoice = (JSONObject) invoices.get(i);
		    if (invoice.has("LineItems"))
		    {
			JSONArray items = (JSONArray) invoice.get("LineItems");

			if (items.length() > 0)
			{

			    invoiceNote.subject = "Invoice No # " + invoice.get("InvoiceNumber");
			    for (int j = 0; j < items.length(); j++)
			    {
				JSONObject itemDetails = (JSONObject) items.get(j);

				if (itemDetails.length() > 0)
				{

				    if (invoiceNote.description == null)
				    {
					invoiceNote.description = itemDetails.get("ItemCode") + " Amount "
						+ itemDetails.get("UnitAmount") + "(" + invoice.get("CurrencyCode")
						+ ")" + " Tax " + itemDetails.get("TaxAmount") + "("
						+ invoice.get("CurrencyCode") + ")";
				    }
				    else
				    {
					invoiceNote.description += "\n" + itemDetails.get("ItemCode")
						+ " Amount " + itemDetails.get("UnitAmount") + "("
						+ invoice.get("CurrencyCode") + ")" + " Tax "
						+ itemDetails.get("TaxAmount") + "(" + invoice.get("CurrencyCode")
						+ ")";
				    }
				    invoiceNote.description += "\nTotal Amount " + invoice.get("Total") + "("
					    + invoice.get("CurrencyCode") + ")";
				}

			    }

			}
			System.out.println(items);
		    }
		    invoiceNote.addRelatedContacts(contact.id.toString());
		    invoiceNote.save();
		}
	    }

	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}

    }

    private JSONObject getInvoice(Object contactID)
    {
	JSONObject response = null;
	String invoiceURL = String.format(BASE_URL, "invoices");
	String url = invoiceURL + "?where=Contact.ContactID+%3d+Guid(%22" + contactID + "%22)&page=1";
	try
	{
	    String result = accessURLWithOauth(Globals.XERO_API_KEY, Globals.XERO_CLIENT_ID, prefs.token, prefs.secret,
		    url, "GET");

	    response = new JSONObject(result);

	}
	catch (IOException | JSONException e)
	{
	    e.printStackTrace();
	}
	return response;

    }

    @Override
    protected void updateLastSyncedInPrefs()
    {

	try
	{
	    String result = accessURLWithOauth(Globals.XERO_API_KEY, Globals.XERO_CLIENT_ID, prefs.token, prefs.secret,
		    "https://api.xero.com/api.xro/2.0/organisation", "GET");

	    JSONObject response = new JSONObject(result);
	    if (response.has("DateTimeUTC"))
	    {
		String jsonDate = response.getString("DateTimeUTC");
		Date date = new Date(Long.parseLong(jsonDate.replaceAll("[/()]", "").substring(4)));
		System.out.println(date.toLocaleString());
		SimpleDateFormat df = new SimpleDateFormat("yyyy-mm-dd'T'hh:mm:ss");
		//df.setTimeZone(TimeZone.getTimeZone(ID));
		String currentDate = df.format(date);
		System.out.println("iso formate current date " + currentDate);
		prefs.lastSyncCheckPoint = currentDate;
		prefs.save();
	    }

	}
	catch (IOException | JSONException e)
	{
	    e.printStackTrace();
	}

    }

    private String accessURLWithOauth(String consumerKey, String consumerSecret, String accessToken,
	    String tokenSecret, String endPointURL, String requestMethod) throws IOException
    {

	HttpURLConnection request = null;
	BufferedReader rd = null;
	StringBuilder response = null;

	String errorMsg = "error: ";
	try
	{
	    URL endpointUrl = new URL(endPointURL);
	    request = (HttpURLConnection) endpointUrl.openConnection();

	    requestMethod = (requestMethod.isEmpty()) ? "GET" : requestMethod;
	    request.setRequestMethod(requestMethod);

	    request.setRequestProperty("Content-Type", "application/json");
	    request.setRequestProperty("Accept", "application/json");

	    if (prefs.lastSyncCheckPoint != null)
	    {
		request.setRequestProperty("If-Modified-Since", prefs.lastSyncCheckPoint);
	    }
	    request.setDoOutput(true);

	    try
	    {
		OAuthConsumer consumer = new DefaultOAuthConsumer(consumerKey, consumerSecret);
		consumer.setTokenWithSecret(accessToken, tokenSecret);
		consumer.sign(request);
	    }
	    catch (OAuthMessageSignerException ex)
	    {
		System.out.println("OAuth Signing failed - " + ex.getMessage());
		errorMsg += "OAuthMessageSignerException " + ex.getMessage();
	    }
	    catch (OAuthExpectationFailedException ex)
	    {
		System.out.println("OAuth failed - " + ex.getMessage());
		errorMsg += "OAuthMessageSignerException " + ex.getMessage();
	    }

	    request.connect();
	    System.out.println(request.getResponseCode());
	    // removed some response code conditions for desk.com
	    if (request.getResponseCode() == 400 || request.getResponseCode() == 401
		    || request.getResponseCode() == 500 || request.getResponseCode() == 404)
		rd = new BufferedReader(new InputStreamReader(request.getErrorStream(), "UTF-8"));
	    else
		rd = new BufferedReader(new InputStreamReader(request.getInputStream(), "UTF-8"));

	    response = new StringBuilder();
	    String line = null;
	    while ((line = rd.readLine()) != null)
	    {
		response.append(line + '\n');
	    }
	}
	catch (Exception e)
	{
	    System.out.println("Exception: " + e.getMessage());
	    e.printStackTrace();
	    errorMsg += "Exception " + e.getMessage();
	}
	finally
	{
	    try
	    {
		request.disconnect();
	    }
	    catch (Exception e)
	    {
	    }

	    if (rd != null)
	    {
		try
		{
		    rd.close();
		}
		catch (IOException ex)
		{
		}
		rd = null;
	    }
	}

	if (response != null)
	    return response.toString();

	return errorMsg;

    }

}
