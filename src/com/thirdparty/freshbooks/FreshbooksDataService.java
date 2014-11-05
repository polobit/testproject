/**
 * 
 */
package com.thirdparty.freshbooks;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

/**
 * @author jitendra
 *
 */
public class FreshbooksDataService
{

    public static final String FRESHBOOK_API_URL = "https://$<dc>.freshbooks.com/api/2.1/xml-in";
    public static final String FRESHBOOK_URL = "https://$<ns>.freshbooks.com/";
    public static final String FRESHBOOKS_CLIENT__COUNT_REQUEST = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
	    + "<request method=\"$method\"><folder>active</folder></request>";
    public static final String FRESHBOOKS_CLIENT_REQUEST = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
	    + "<request method=\"$method\"><per_page>$total_record</per_page><page>$page_number</page><folder>active</folder></request>";
    public static final String FRESHBOOKS_CLIENT_REQUEST_BETWEEN_DATE = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
	    + "<request method=\"$method\"><updated_from>$updatedDateTime</updated_from><folder>active</folder></request>";

    public static final String FRESHBOOKS_INVOICE_REQUEST = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
	    + "<request method=\"$method\">$body   $status </request>";

    public String apiKey = null;
    public String freshBookNameSpace = null;

    public FreshbooksDataService(String apiKey, String freshBookNameSpace)
    {
	if (!StringUtils.isEmpty(apiKey) && !StringUtils.isEmpty(freshBookNameSpace))
	{
	    this.apiKey = apiKey.trim();
	    this.freshBookNameSpace = freshBookNameSpace.trim();
	}
    }

    /**
     * Return customers between given date
     * 
     * @param pageNumber
     * @return
     */
    public JSONArray getCustomers(int pageNumber, String lastUpdatedDate)
    {
	JSONArray customers = null;

	String url = FRESHBOOK_API_URL.replace("$<dc>", freshBookNameSpace);

	String request = FRESHBOOKS_CLIENT_REQUEST.replace("$method", "client.list").replace("$total_record", "" + 50)
		.replace("$page_number", "" + pageNumber);
	if (!StringUtils.isBlank(lastUpdatedDate))
	{
	    request = FRESHBOOKS_CLIENT_REQUEST_BETWEEN_DATE.replace("$method", "client.list")
		    .replace("$total_record", "" + 50).replace("$page_number", "" + pageNumber)
		    .replace("$updatedDateTime", lastUpdatedDate);
	}

	String response;
	try
	{
	    response = FreshbooksConnectionUtil.accessUrlusingAuthentication(url, apiKey, "x", request,
		    "application/xml", "POST");

	    JSONObject responseJson = XML.toJSONObject(response).getJSONObject("response");
	    verifyResponse(responseJson);
	    JSONObject result = responseJson.getJSONObject("clients");
	    if (result != null && result.length() > 0)
	    {
		// checking total records b/c if records is 1 its returning as
		// json Object throws class class exception
		int total = Integer.parseInt((String) result.get("total"));
		if (total == 1)
		{
		    customers = new JSONArray();
		    customers.put(result.get("client"));
		}
		else
		{
		    customers = (JSONArray) result.get("client");
		}
	    }

	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return customers;

    }

    /**
     * utility function calculate total records found in freshbooks
     * 
     * @param clientJson
     * @return
     * @throws Exception
     */

    public int getTotalCount(String lastSyncDate)
    {

	int total = 0;
	String url = FRESHBOOK_API_URL.replace("$<dc>", freshBookNameSpace);

	String request = FRESHBOOKS_CLIENT__COUNT_REQUEST.replace("$method", "client.list");
	if (!StringUtils.isBlank(lastSyncDate))
	{
	    request = FRESHBOOKS_CLIENT_REQUEST_BETWEEN_DATE.replace("$method", "client.list")
		    .replace("$total_record", "" + 1).replace("$page_number", "" + 1)
		    .replace("$updatedDateTime", lastSyncDate);
	}

	String response;
	try
	{
	    response = FreshbooksConnectionUtil.accessUrlusingAuthentication(url, apiKey, "x", request,
		    "application/xml", "POST");

	    JSONObject responseJson = XML.toJSONObject(response).getJSONObject("response");
	    verifyResponse(responseJson);
	    JSONObject results = responseJson.getJSONObject("clients");
	    if (results.has("pages"))
	    {
		System.out.println(results.get("pages"));
		total = Integer.parseInt((String) results.get("pages"));
	    }
	    return total;
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return total;

    }

    private JSONArray getArrayOfClients(JSONObject clientJson) throws Exception
    {
	if (Integer.parseInt(clientJson.getString("total")) == 0)
	    throw new Exception("There are no contacts with this email. " + "To add this contact, please send \\add");

	JSONArray usersJsonArray = new JSONArray();

	Object clientObj = clientJson.get("client");

	if (clientObj instanceof JSONObject)
	    usersJsonArray.put(clientObj);
	else
	    usersJsonArray = (JSONArray) clientObj;

	return usersJsonArray;
    }

    private void verifyResponse(JSONObject responseJson) throws Exception
    {
	System.out.println(responseJson);
	if (responseJson.getString("status").equalsIgnoreCase("fail"))
	    throw new Exception(responseJson.getString("error"));
    }

    private String getDisplayInfo(JSONArray usersJsonAray) throws Exception
    {
	String result = usersJsonAray.length() + " client(s) found with this email \r\n";

	for (int i = 0; i < usersJsonAray.length(); i++)
	{
	    JSONObject eachClientJson = usersJsonAray.getJSONObject(i);

	    result += "First Name: " + eachClientJson.getString("first_name") + "\r\n";
	    result += "Last Name: " + eachClientJson.getString("last_name") + "\r\n";
	    result += "Organisation: " + eachClientJson.getString("organization") + "\r\n";
	    result += "City: " + eachClientJson.getString("p_city") + "\r\n";
	    result += "Phone No: " + eachClientJson.getString("work_phone") + "\r\n";

	    String client_id = eachClientJson.getString("client_id");
	    result += "Past Invoices: " + FRESHBOOK_URL.replace("$<ns>", this.freshBookNameSpace)
		    + "/showStatement?userid=" + client_id + "\r\n";
	    result += "Profile URL: " + FRESHBOOK_URL.replace("$<ns>", this.freshBookNameSpace) + "/showUser?userid="
		    + client_id + "\r\n";

	    result += "\r\n";
	}
	return result;
    }

    /**
     * helper function will return invoices related to client/customer
     * 
     * @param clientId
     * @return
     * @throws Exception
     */
    public JSONArray getInvoices(String clientId) throws Exception
    {
	JSONArray invoices = new JSONArray();
	if (StringUtils.isBlank(clientId))
	    return null;

	String draft = FRESHBOOKS_INVOICE_REQUEST.replace("$method", "invoice.list")
		.replace("$body", "<client_id>" + clientId + "</client_id>")
		.replace("$status", "<status>draft</status>");
	String paid = FRESHBOOKS_INVOICE_REQUEST.replace("$method", "invoice.list")
		.replace("$body", "<client_id>" + clientId + "</client_id>")
		.replace("$status", "<status>paid</status>");
	String autopaid = FRESHBOOKS_INVOICE_REQUEST.replace("$method", "invoice.list")
		.replace("$body", "<client_id>" + clientId + "</client_id>")
		.replace("$status", "<status>auto-paid</status>");
	String unpaid = FRESHBOOKS_INVOICE_REQUEST.replace("$method", "invoice.list")
		.replace("$body", "<client_id>" + clientId + "</client_id>")
		.replace("$status", "<status>unpaid</status>");

	String url = FRESHBOOK_API_URL.replace("$<dc>", freshBookNameSpace);
	String[] requests = { draft, paid, autopaid, unpaid };

	for (String s : requests)
	{

	    String response = FreshbooksConnectionUtil.accessUrlusingAuthentication(url, apiKey, "x", s,
		    "application/xml", "POST");

	    JSONObject responseJSON = XML.toJSONObject(response).getJSONObject("response");
	    verifyResponse(responseJSON);
	    JSONObject invoiceObject = responseJSON.getJSONObject("invoices");
	    if (invoiceObject != null && invoiceObject.length() > 0)
	    {
		if (invoiceObject.has("invoice"))
		{
		    Object invoice = invoiceObject.get("invoice");
		    if (invoice instanceof JSONObject)
		    {
			invoices.put(invoice);
		    }
		    else
		    {
			JSONArray list = (JSONArray) invoiceObject.get("invoice");
			for (int i = 0; i < list.length(); i++)
			{
			    invoices.put(list.get(i));
			}
		    }

		}
	    }
	}

	return invoices;
    }

    public String getLastUpdatedTime()
    {
	String lastUpdatedTime = null;

	String url = FRESHBOOK_API_URL.replace("$<dc>", freshBookNameSpace);

	String request = FRESHBOOKS_CLIENT_REQUEST.replace("$method", "client.list").replace("$total_record", "" + 1)
		.replace("$page_number", "" + 1);

	String response;
	try
	{
	    response = FreshbooksConnectionUtil.accessUrlusingAuthentication(url, apiKey, "x", request,
		    "application/xml", "POST");

	    JSONObject responseJson = XML.toJSONObject(response).getJSONObject("response");
	    verifyResponse(responseJson);
	    JSONObject result = responseJson.getJSONObject("clients");
	    if (result != null && result.length() > 0)
	    {
		JSONObject client = (JSONObject) result.get("client");
		if (client.has("updated"))
		{
		    lastUpdatedTime = (String) client.get("updated");
		}
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return lastUpdatedTime;
    }
}
