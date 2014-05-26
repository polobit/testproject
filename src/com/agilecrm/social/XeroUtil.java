package com.agilecrm.social;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import oauth.signpost.OAuthConsumer;
import oauth.signpost.basic.DefaultOAuthConsumer;
import oauth.signpost.commonshttp.CommonsHttpOAuthConsumer;
import oauth.signpost.exception.OAuthException;
import oauth.signpost.exception.OAuthExpectationFailedException;
import oauth.signpost.exception.OAuthMessageSignerException;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

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

	private static final String apiURL = "https://api.xero.com/api.xro/2.0";

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
		JSONObject contactsJSON = null;
		String contactId = "";
		String response = "";
		JSONArray contactsArray = null;
		JSONObject resJson = new JSONObject();
		String res = "";
		// call to get contacts of email Id
		try
		{
			res = getContactsByEmail(email);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return e.getMessage();
		}
		if (res.contains("token_expired"))
		{
			return "Authentication Error.\r\nThe access token has expired. Please reconfigure your Xero integration.";
		}

		// get JSONObject from response
		try
		{
			contactsJSON = new JSONObject(res.toString());
			contactsArray = contactsJSON.getJSONArray("Contacts");
		}
		catch (JSONException e)
		{
			e.printStackTrace();
			return e.getMessage();
		}
		// get Contacts array from ContactsJson

		if (contactsArray.length() <= 0)
		{
			return "No contact found with email address  ";
		}
		else
		{
			contactJson = contactsArray.getJSONObject(0);
			contactId = contactJson.getString("ContactID");

		}
		if (!"".equalsIgnoreCase(contactId))
		{
			try
			{
				// Call to get invoices of a contact ID
				response = getInvoicesForContact(contactId);
				// System.out.println("invoices for the client is  "+response);
			}
			catch (Exception e)
			{
				e.printStackTrace();
			}
			try
			{
				JSONObject invoicesJSON = new JSONObject(response);
				invoicesArray = invoicesJSON.getJSONArray("Invoices");
			}
			catch (JSONException ex)
			{
				return ex.getMessage();
			}
			if (invoicesArray.length() <= 0)
				response = "No invoices Exist for this contact ";
		}

		resJson.put("Contact", contactJson);
		resJson.put("Invoices", invoicesArray);

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
		String query = URLEncoder.encode("EmailAddress=" + "\"" + email + "\"");
		String endPointURL = "https://api.xero.com/api.xro/2.0" + "/Contacts?where=" + query;
		String response = accessURLWithOauth(consumerKey, consumerSecret, accessToken, tokenSecret, endPointURL, "GET",
				null, "xero");
		// validateResponse(response);
		return response;
	}

	/**
	 * @param contactID
	 * @return
	 * @throws Exception
	 */
	public String getInvoicesForContact(String contactID) throws Exception
	{
		String query = URLEncoder.encode("Contact.ContactID=Guid(\"" + contactID + "\")");
		String endPointURL = "https://api.xero.com/api.xro/2.0" + "/Invoices?where=" + query;

		String response = accessURLWithOauth(consumerKey, consumerSecret, accessToken, tokenSecret, endPointURL, "GET",
				null, "xero");

		// validateResponse(response);
		return response;
	}

	/**
	 * CreateContact method creates contact in Xero server
	 * 
	 * @param name
	 * @param email
	 * @return
	 * @throws Exception
	 */

	public String addContact(Widget widget, String firstName, String lastName, String email)
	{

		JSONObject responseJSON = null;
		String endPointURL = apiURL + "/contacts";
		String content = "<Contact><Name>" + firstName + lastName + "</Name><EmailAddress>" + email + "</EmailAddress>";

		content += "<FirstName>" + firstName + "</FirstName>";
		content += "<LastName>" + lastName + "</LastName></Contact>";

		String response = null;
		try
		{
			response = postDataWithOauth(consumerKey, consumerSecret, accessToken, tokenSecret, endPointURL, "POST",
					content);
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}

		try
		{
			responseJSON = XML.toJSONObject(response).getJSONObject("Response");
		}
		catch (JSONException e)
		{
			e.printStackTrace();
		}
		System.out.println("Respone JSON: " + responseJSON);

		// checkResponseStatus(responseJSON);

		return "Contact created successfully.";
	}

	public String accessURLWithOauth(String consumerKey, String consumerSecret, String accessToken, String tokenSecret,
			String endPointURL, String requestMethod, String postData, String pluginName) throws IOException, Exception
	{
		HttpURLConnection request = null;
		BufferedReader rd = null;
		StringBuilder response = null;

		String errorMsg = "error: ";
		try
		{
			URL endpointUrl = new URL(endPointURL);
			request = (HttpURLConnection) endpointUrl.openConnection();

			request.setRequestProperty("Content-Type", "application/json");
			request.setRequestProperty("Accept", "application/json");
			try
			{
				OAuthConsumer consumer = new DefaultOAuthConsumer(consumerKey, consumerSecret);
				consumer.setTokenWithSecret(accessToken, tokenSecret);
				consumer.sign(request);
				request.connect();
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
			catch (OAuthException ex)
			{
				System.out.println("OAuth failed - " + ex.getMessage());
				errorMsg += "OAuthMessageSignerException " + ex.getMessage();
			}
			catch (Exception ex)
			{
				System.out.println("OAuth failed Exception super type- " + ex.getMessage());
				errorMsg += "OAuthMessageSignerException " + ex.getMessage();
			}

			// removed some response code conditions for desk.com
			if (request.getResponseCode() == 400 || request.getResponseCode() == 401
					|| request.getResponseCode() == 500 || request.getResponseCode() == 404)
				rd = new BufferedReader(new InputStreamReader(request.getErrorStream()));
			else
				rd = new BufferedReader(new InputStreamReader(request.getInputStream()));

			response = new StringBuilder();
			String line = null;
			while ((line = rd.readLine()) != null)
			{
				response.append(line + '\n');
			}
			// System.out.println("response xml  "+response);

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
				if(rd!=null)
				{
				rd.close();
				}
				rd=null;
			}
			catch(IOException e)
			{
				
			}
			catch (Exception e)
			{
			}
		}

		if (response != null)
			return response.toString();

		return errorMsg;
	}

	public static String postDataWithOauth(String consumerKey, String consumerSecret, String accessToken,
			String tokenSecret, String endPointURL, String requestMethod, String postData) throws IOException
	{
		String errorMsg = "error: ";
		String response = "";
		try
		{
			// Creating an instance of HttpPost.
			HttpPost httpost = new HttpPost(endPointURL);
			List<NameValuePair> temp = new ArrayList<NameValuePair>();
			temp.add(new BasicNameValuePair("xml", postData));
			temp.add(new BasicNameValuePair("Content-Type", "application/x-www-form-urlencoded"));
			httpost.setEntity(new UrlEncodedFormEntity(temp));

			try
			{
				OAuthConsumer consumer = new CommonsHttpOAuthConsumer(consumerKey, consumerSecret);
				consumer.setTokenWithSecret(accessToken, tokenSecret);
				consumer.sign(httpost);
				System.out.println("consumer sign");
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

			// send the request
			HttpClient httpClient = new DefaultHttpClient();
			HttpResponse httpResponse = httpClient.execute(httpost);
			System.out.println(httpResponse.getStatusLine().getStatusCode());
			
			response = IOUtils.toString(httpResponse.getEntity().getContent());
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage());
			e.printStackTrace();
			errorMsg += "Exception " + e.getMessage();
		}

		return response;
	}

}
