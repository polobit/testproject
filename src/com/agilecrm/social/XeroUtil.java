package com.agilecrm.social;

import java.net.URLEncoder;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.scribe.util.SignpostUtil;
import com.agilecrm.widgets.Widget;

/**
 * <code>XeroUtil</code> class acts as a Client to ClickDeskPlugins server
 * 
 * <code>XeroUtil</code> class contains methods for interacting with the
 * ClickDeskPlugins server using REST API.
 * 
 * @author Rajitha
 * @since May 2014
 */
public class XeroUtil
{

	/** The field holds agent's Xero account consumer key */
	private String consumerKey;

	/** The field holds agent's Xero account consumer secret */
	private String consumerSecret;

	/** The field holds agent's Xero account access token */
	private String accessToken;

	/** The field holds agent's Xero account token secret */
	private String tokenSecret;

	private static final String APIURL = "https://api.xero.com/api.xro/2.0";

	/** Parameterized constructor for initializing the instance variables */
	public XeroUtil(String consumerKey, String consumerSecret, String accessToken, String tokenSecret)
	{
		this.consumerKey = consumerKey;
		this.consumerSecret = consumerSecret;
		this.accessToken = accessToken;
		this.tokenSecret = tokenSecret;
	}

	/**
	 * Calls method in ClickDeskPlugins server using REST API to get invoices of
	 * client from Xero
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve plugin preferences from Xero
	 *            account of agile user
	 * @param clientId
	 *            {@link String} client id of contact
	 * @return {@link String} with the client response
	 * @throws Exception
	 *             if the response is an exception
	 */

	public String getInvoicesOfClient(Widget widget, String email) throws Exception
	{

		JSONObject contactJson = null;
		JSONArray invoicesArray = null;
		JSONArray contactsArray = null;
		JSONObject resJson = new JSONObject();
		String res = "";
		// call to get contacts of email Id

		res = getContactsByEmail(email);

		if (res.contains("token_expired"))
		{
			return "Authentication Error.\r\nThe access token has expired. Please reconfigure your Xero integration.";
		}
		try
		{
			// get JSONObject from response
			contactsArray = new JSONObject(res).getJSONArray("Contacts");
			if (contactsArray.length() == 0)
			{
				return "No contact found with email address  ";
			}
			else
			{
				contactJson = contactsArray.getJSONObject(0);
			
				// Call to get invoices of a contact ID
				res = getInvoicesForContact(contactJson.getString("ContactID"));

				// System.out.println("invoices for the client is  "+response);
				invoicesArray = new JSONObject(res).getJSONArray("Invoices");
				
			}
			resJson.put("Contact", contactJson);
			resJson.put("Invoices", invoicesArray);	
		}
		catch (JSONException ex)
		{
			ex.printStackTrace();
		}
		return resJson.toString();
	}

	/**
	 * GetContactsByEmail method fetches contacts based on email from Xero
	 * server
	 * 
	 * @param email
	 * @return Xero contact
	 * @throws Exception
	 */
	public String getContactsByEmail(String email) throws Exception
	{
		String query = URLEncoder.encode("EmailAddress=" + "\"" + email + "\"","UTF-8");
		String endPointURL = APIURL + "/Contacts?where=" + query;
		return SignpostUtil.accessURLWithOauth(consumerKey, consumerSecret, accessToken, tokenSecret,
				endPointURL, "GET", null, "xero");
	}

	/**
	 * get getInvoicesForContact fetched Invoices based on contactId
	 * 
	 * @param contactID
	 * @return
	 * @throws Exception
	 */
	public String getInvoicesForContact(String contactID) throws Exception
	{
		String query = URLEncoder.encode("Contact.ContactID=Guid(\"" + contactID + "\")" ,"UTF-8");
		String endPointURL = APIURL + "/Invoices?where=" + query;

		return  SignpostUtil.accessURLWithOauth(consumerKey, consumerSecret, accessToken, tokenSecret,
				endPointURL, "GET", null, "xero");

		
	}

	/**
	 * CreateContact method creates contact in Xero server
	 * 
	 * @param name
	 * @param email
	 * @return
	 * @throws Exception
	 */

	public String addContact(Widget widget, String firstName, String lastName, String email) throws Exception
	{

		JSONObject responseJSON = null;
		String endPointURL = APIURL + "/contacts";
		String content = "<Contact><Name>" + firstName + lastName + "</Name><EmailAddress>" + email + "</EmailAddress>";

		content += "<FirstName>" + firstName + "</FirstName>";
		content += "<LastName>" + lastName + "</LastName></Contact>";

		String response = null;
		response = SignpostUtil.postDataWithOauth(consumerKey, consumerSecret, accessToken, tokenSecret, endPointURL,
				"POST", content);
		responseJSON = XML.toJSONObject(response).getJSONObject("Response");
		System.out.println("Respone JSON: " + responseJSON);

		return responseJSON.toString();
	}

}
