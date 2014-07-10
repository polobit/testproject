package com.agilecrm.social;

import java.net.URLEncoder;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.scribe.util.SignpostUtil;
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
		String widget_id = widget.id.toString();
		
		//get invoices from url
		String res = HTTPUtil.accessHTTPURL("http://ec2-72-44-57-140.compute-1.amazonaws.com:8080/ClickdeskPlugins/core/agile/xero/invoice",(new JSONObject(widget.prefs).put("email",email).put("widget_id", widget_id).put("callbackUrl","http://localhost:1234/backend/XeroServlet?data=")).toString(), "PUT");
		
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
		//http://ec2-72-44-57-140.compute-1.amazonaws.com:8080/ClickdeskPlugins/core/rest/agile-xero/
		 return HTTPUtil.accessHTTPURL("http://ec2-72-44-57-140.compute-1.amazonaws.com:8080/ClickdeskPlugins/core/agile/xero/addcontact",(new JSONObject(widget.prefs).put("name",firstName+" "+lastName).put("email",email)).toString(), "PUT");
		
		
	}

	/**
	 * return line items for the given invoice id
	 * @param invoiceId
	 * @return
	 * @throws Exception
	 */
	public String getLineItemsOfInvoice(String invoiceId,Widget widget) throws Exception
	{
		
		return HTTPUtil.accessHTTPURL("http://ec2-72-44-57-140.compute-1.amazonaws.com:8080/ClickdeskPlugins/core/agile/xero/lineitems",(new JSONObject(widget.prefs).put("invoiceId",invoiceId)).toString(), "PUT");
	}

}