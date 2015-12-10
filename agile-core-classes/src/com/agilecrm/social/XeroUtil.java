package com.agilecrm.social;

import org.json.JSONObject;

import com.agilecrm.util.HTTPUtil;
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

	public String callbackUrl = "%s/XeroServlet?data=";
	// http://integrations.clickdesk.com:8080/
	//if use local use http://localhost:8080/
	private String xeroPluginurl = "http://integrations.clickdesk.com:8080/ClickdeskPlugins/core/agile/xero";

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
		String widget_id = widget.id.toString();
		System.out.println("callbackUrl in XeroUtil : " + callbackUrl);
		// Get invoices from url
		String res = HTTPUtil.accessHTTPURL(xeroPluginurl + "/invoice",
				(new JSONObject(widget.prefs).put("email", email).put("widget_id", widget_id).put("callbackUrl",
						callbackUrl)).toString(), "PUT");

		if (res.contains("token_expired")){
			throw new Exception(
					"Authentication Error.\r\nThe access token has expired. Please reconfigure your Xero integration.");
		}
		return res;
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
		// Call to create contact in xero
		return HTTPUtil.accessHTTPURL(xeroPluginurl + "/addcontact",
				(new JSONObject(widget.prefs).put("name", (firstName + " " + lastName).trim()).put("email", email).put(
						"callbackUrl", callbackUrl)).toString(), "PUT");
	}

	/**
	 * return line items for the given invoice id
	 * 
	 * @param invoiceId
	 * @return
	 * @throws Exception
	 */
	public String getLineItemsOfInvoice(String invoiceId, Widget widget) throws Exception
	{
		// Call to get lineitems in xero for invoice id
		return HTTPUtil.accessHTTPURL(xeroPluginurl + "/lineitems",
				(new JSONObject(widget.prefs).put("invoiceId", invoiceId).put("callbackUrl", callbackUrl)).toString(),
				"PUT");
	}

	/**
	 * Gets the organisation info.
	 * 
	 * @param widget
	 * @return
	 * @throws Exception
	 */
	public String getOrganisationInfo(Widget widget) throws Exception
	{
		// Call to get lineitems in xero for invoice id
		return HTTPUtil.accessHTTPURL(xeroPluginurl + "/organisation",
				(new JSONObject(widget.prefs).put("callbackUrl", callbackUrl)).toString(), "PUT");
	}
	
	/**
	 * Refresh the xero access token.
	 * 
	 * @param widget
	 * @return
	 * @throws Exception
	 */
	public Widget refreshToken(Widget widget) throws Exception
	{
		String returnStr = HTTPUtil.accessHTTPURL(xeroPluginurl + "/refreshtoken",
				(new JSONObject(widget.prefs).put("callbackUrl", callbackUrl)).toString(), "PUT");	
		System.out.println("New accessToken JSON: " + returnStr);
	
		if (returnStr.contains("xero_access_token")) {
			System.out.println("Before renew: "+widget.prefs);
			JSONObject jsObj = new JSONObject(returnStr);
			widget.addProperty("xero_access_token", jsObj.getString("xero_access_token"));
			widget.addProperty("xero_token_secret", jsObj.getString("xero_token_secret"));
			widget.addProperty("xero_oauth_handler", jsObj.getString("xero_oauth_handler"));
			widget.addProperty("oauth_expires_in", jsObj.getString("oauth_expires_in"));
			widget.addProperty("oauth_created_time", jsObj.getString("oauth_created_time"));
			widget.save();
			System.out.println("After renew: "+widget.prefs);
		}
		return widget;
	}

}