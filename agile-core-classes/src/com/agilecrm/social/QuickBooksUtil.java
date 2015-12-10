package com.agilecrm.social;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.scribe.util.SignpostUtil;

public class QuickBooksUtil
{
    String accessToken;
    String tokenSecret;
    String consumerKey;
    String consumerSecret;
    String APIURL = "https://quickbooks.api.intuit.com/v3/company/$companyID";

    /**
     * @param accessToken
     * @param tokenSecret
     * @param consumerKey
     * @param consumerSecret
     * @param companyID
     */
    public QuickBooksUtil(String accessToken, String tokenSecret, String consumerKey, String consumerSecret,
	    String companyID)
    {
	this.accessToken = accessToken;
	this.tokenSecret = tokenSecret;
	this.consumerKey = consumerKey;
	this.consumerSecret = consumerSecret;
	this.APIURL = APIURL.replace("$companyID", companyID);

    }

    /**
     * return Invoices for Contact Id from QuickBooks
     * 
     * @param contactId
     * @return
     * @throws Exception
     */
    public String getInvoicesByContactRef(String contactId) throws Exception
    {
	String query = "/query?query=SELECT%20%2A%20FROM%20Invoice%20where%20CustomerRef%20%3D%20%27"
		+ contactId.trim() + "%27";

	// Authenticating & retrieving result from quickbooks.com
	String response = SignpostUtil.accessURLWithOauth(this.consumerKey, this.consumerSecret, this.accessToken,
		this.tokenSecret, APIURL + query, "POST", "", "quickbooks");

	validateResponse(response);

	return response;

    }

    /**
     * Get Custimer Details from QuickBooks Base on Email
     * 
     * @param email
     * @return
     * @throws Exception
     */
    public String getCustomersByEmail(String email) throws Exception
    {
	StringBuffer query = new StringBuffer(
		"/query?query=select%20%2A%20from%20Customer%20where%20PrimaryEmailAddr%20IN%20%28");
	String emailArr[] = email.split(",");
	// build query wit multiple email
	for (int i = 0; i < emailArr.length; i++)
	{
	    if (i == 0){
	    	query.append("%27" + emailArr[i].replace("@", "%40") + "%27%20");
	    }else {
	    	query.append("%20%2C" + "%27" + emailArr[i].replace("@", "%40") + "%27");
	    }
	}
	query.append("%29");

	// get customer details from quickbooks.com
	String response = SignpostUtil.accessURLWithOauth(this.consumerKey, this.consumerSecret, this.accessToken,
		this.tokenSecret, APIURL + query.toString(), "POST", "", "quickbooks");
	validateResponse(response);
	return response;
    }

    /**
     * Create Customer in QuickBooks with firstname,lastname,email
     * 
     * @param firstname
     * @param lastname
     * @param email
     * @return
     * @throws Exception
     */
    public String createCustomer(String firstname, String lastname, String email) throws Exception
    {
	String endPointURL = APIURL + "/customer";

	JSONObject customerJSON = new JSONObject();

	customerJSON.put("GivenName", firstname);
	customerJSON.put("FamilyName", lastname);

	customerJSON.put("DisplayName", (firstname + " " + lastname).trim());
	JSONObject emailJSON = new JSONObject();
	emailJSON.put("Address", email);
	customerJSON.put("PrimaryEmailAddr", emailJSON);

	System.out.println(customerJSON.toString());

	// authenthicating & retreiving result from quickbooks.com
	String response = SignpostUtil.accessURLWithOauth(this.consumerKey, this.consumerSecret, this.accessToken,
		this.tokenSecret, endPointURL, "POST", customerJSON.toString(), "quickbooks");
	validateResponse(response);

	return response;
    }

    /**
     * Get Quickbooks profile based on Email
     * 
     * @param email
     * @return
     */
    public String getQuickBooksProfile(String email) throws Exception
    {
	JSONObject qbUser = new JSONObject();
	JSONArray invoicesarr = null;
	try
	{
	    // call getCustomersByEmail method to get customer details based on
	    // email
	    JSONObject queryres = new JSONObject(getCustomersByEmail(email)).getJSONObject("QueryResponse");

	    if (queryres.isNull("Customer")){
	    	return "Contact not Found";
	    }

	    JSONArray tempjsarr = queryres.getJSONArray("Customer");
	    qbUser.put("Customer", tempjsarr.get(0));

	    // Call getInvoicesByContactRef to get Invoice based on contactId
	    String invoices = getInvoicesByContactRef(((JSONObject) tempjsarr.get(0)).getString("Id"));

	    queryres = new JSONObject(invoices).getJSONObject("QueryResponse");

	    if (queryres.isNull("Invoice")){
			qbUser.put("Invoices", invoicesarr);
			return qbUser.toString();
	    }
	    invoicesarr = queryres.getJSONArray("Invoice");
	    qbUser.put("Invoices", invoicesarr);

	}
	catch (JSONException e)
	{
	    e.printStackTrace();

	}

	return qbUser.toString();
    }

    /**
     * Validate response
     * 
     * @param response
     * @throws Exception
     */
    public void validateResponse(String response) throws Exception
    {
	System.out.println("Validating response: " + response);
	JSONObject responseJSON = null;

	try
	{
	    responseJSON = new JSONObject(response);
	}
	catch (Exception e)
	{
	    String err = response;
	    if (response.contains("401"))
		err = "Authentication Error. Please re-configure you QuickBooks integration.";

	    throw new Exception(err);
	}

	if (!responseJSON.has("Fault")){
	    return;
	}

	JSONArray errorJSONArray = responseJSON.getJSONObject("Fault").getJSONArray("Error");

	String details = errorJSONArray.getJSONObject(0).getString("Detail");

	if (details.contains("Business Validation Error")){
	    throw new Exception(
		    "Not a valid customer name.\nNames must have at least one character and cannot include tabs, newlines or ':'.");
	}else if (details.contains("name supplied already")){
	    throw new Exception("Customer already exists");
	}else if (details.contains("String length specified does not match the supported length")){
	    throw new Exception("String length specified does not match the supported length");
	}else{
	    throw new Exception(details);
	}
    }
}
