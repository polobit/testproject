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

	private String callbackUrl = "https://agilecrmbeta.appspot.com/XeroServlet?data=";
	private String xeroPluginurl ="http://integrations.clickdesk.com:8080/ClickdeskPlugins/core/agile/xero";

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
		
		//get invoices from url
		String res = HTTPUtil.accessHTTPURL(xeroPluginurl+"/invoice",(new JSONObject(widget.prefs).put("email",email).put("widget_id", widget_id).put("callbackUrl",callbackUrl)).toString(), "PUT");
		
		if (res.contains("token_expired"))
		{
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
		//call to create contact in xero
		 return HTTPUtil.accessHTTPURL(xeroPluginurl+"/addcontact",(new JSONObject(widget.prefs).put("name",firstName+" "+lastName).put("email",email).put("callbackUrl",callbackUrl)).toString(), "PUT");
	}

	/**
	 * return line items for the given invoice id
	 * @param invoiceId
	 * @return
	 * @throws Exception
	 */
	public String getLineItemsOfInvoice(String invoiceId,Widget widget) throws Exception
	{
		//call to get lineitems in xero for invoice id
		return HTTPUtil.accessHTTPURL(xeroPluginurl+"/lineitems",(new JSONObject(widget.prefs).put("invoiceId",invoiceId).put("callbackUrl",callbackUrl)).toString(), "PUT");
	}

}