package com.agilecrm.social;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.Widget;

/**
 * <code>FreshBooksUtil</code> class acts as a Client to ClickDeskPlugins server
 * 
 * <code>ZendeskUtil</code> class contains methods for interacting with the
 * ClickDeskPlugins server using REST API.
 * 
 * @author Tejaswi
 * @since April 2013
 */
public class FreshBooksUtil
{

	public static final String FRESHBOOKS_API_KEY = "freshbooks_apiKey";
	public static final String FRESHBOOKS_URL = "freshbooks_url";

	/**
	 * Calls method in ClickDeskPlugins server using REST API to get clients
	 * from FreshBooks
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve plugin preferences from FreshBooks
	 *            account of agile user
	 * @param email
	 *            {@link String} email of contact
	 * @return {@link String} with the client response
	 * @throws Exception
	 *             if the response is an exception
	 */
	public static String getClients(Widget widget, String email) throws Exception
	{
		JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);
		System.out.println(email);
		String[] emails = email.split(",");
		String response = "";
		for (int i = 0; i < emails.length; i++)
		{
			JSONObject contactPrefsJSON = new JSONObject().put("visitor_email", emails[i]);
			JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON", pluginPrefsJSON).put("visitorJSON",
					contactPrefsJSON);
			// send request to plugins server
			response = HTTPUtil.accessHTTPURL(ZendeskUtil.pluginURL + "core/agile/freshbooks/clients/get",
					prefsJSON.toString(), "PUT");

			System.out.println("response in freshbooks " + response);

			if (response.contains("client"))
			{
				break;
			}
		}
		/*
		 * Exceptions from plugins server are returned as strings, if response
		 * is not JSON, it is an exception
		 */
		try
		{
			new JSONObject(response);
		}
		catch (Exception e)
		{
			/*
			 * FreshBooks returns 401 and system does not exist messages for
			 * improper details
			 */
			if (response.contains("401") || response.contains("System does not exist")){
				throw new Exception("Authentication failed. Please try again");
			}
		}
		return response;
	}

	/**
	 * Calls method in ClickDeskPlugins server using REST API to get invoices of
	 * client from FreshBooks
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve plugin preferences from FreshBooks
	 *            account of agile user
	 * @param clientId
	 *            {@link String} client id of contact
	 * @return {@link String} with the client response
	 * @throws Exception
	 *             if the response is an exception
	 */
	public static String getInvoicesOfClient(Widget widget, String clientId) throws Exception
	{
		JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);
		JSONObject messageJSON = new JSONObject().put("client_id", clientId);

		JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON", pluginPrefsJSON).put("messageJSON", messageJSON);

		// send request to plugins server and return response
		return HTTPUtil.accessHTTPURL(ZendeskUtil.pluginURL + "core/agile/freshbooks/invoices/get",
				prefsJSON.toString(), "PUT");

	}

	/**
	 * Calls method in ClickDeskPlugins server using REST API to get invoices of
	 * client from FreshBooks
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve plugin preferences from FreshBooks
	 *            account of agile user
	 * @return {@link String} with the client response
	 * @throws Exception
	 *             if the response is an exception
	 */
	public static String getItems(Widget widget) throws Exception
	{
		JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);

		JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON", pluginPrefsJSON);

		// send request to plugins server and return response
		return HTTPUtil.accessHTTPURL(ZendeskUtil.pluginURL + "core/agile/freshbooks/items/get", prefsJSON.toString(),
				"PUT");

	}

	/**
	 * Calls method in ClickDeskPlugins server using REST API to get Taxes from
	 * FreshBooks
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve plugin preferences from FreshBooks
	 *            account of agile user
	 * @return {@link String} with the client response
	 * @throws Exception
	 *             if the response is an exception
	 */
	public static String getTaxes(Widget widget) throws Exception
	{
		JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);

		JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON", pluginPrefsJSON);

		// send request to plugins server and return response
		return HTTPUtil.accessHTTPURL(ZendeskUtil.pluginURL + "core/agile/freshbooks/taxes/get", prefsJSON.toString(),
				"PUT");

	}

	/**
	 * Calls method in ClickDeskPlugins server using REST API to add client to
	 * FreshBooks
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve plugin preferences from FreshBooks
	 *            account of agile user
	 * @param firstName
	 *            {@link String} first name of the contact
	 * @param lastName
	 *            {@link String} last name of the contact
	 * @param email
	 *            {@link String} email of the contact
	 * @return {@link String} with the client response
	 * @throws Exception
	 *             if the response is an exception
	 */	
	public static String addClient(Widget widget, String firstName, String lastName, String email, String organisation) throws Exception
	{
		JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);

		JSONObject contactPrefsJSON = new JSONObject().put("visitor_email", email).put("first_name", firstName)
				.put("last_name", lastName).put("organisation", organisation);

		JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON", pluginPrefsJSON).put("visitorJSON",
				contactPrefsJSON);

		// send request to plugins server and return response
		return HTTPUtil.accessHTTPURL(ZendeskUtil.pluginURL + "core/agile/freshbooks/client/add", prefsJSON.toString(),
				"PUT");

	}

	/**
	 * Calls method in ClickDeskPlugins server using REST API to add invoice to
	 * client in FreshBooks
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve plugin prefs from FreshBooks
	 *            account of agile user
	 * @param firstName
	 *            {@link String} first name of the contact
	 * @param lastName
	 *            {@link String} last name of the contact
	 * @param email
	 *            {@link String} email of the contact
	 * @param invoiceLines
	 *            {@link String} name of the item
	 * @param quantity
	 *            {@link String} quantity of items
	 * @return {@link String} with the client response
	 * @throws Exception
	 *             if the response is an exception
	 */
	public static String addInvoice(Widget widget, String firstName, String lastName, String email, String invoiceLines)
			throws Exception
	{
		JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);

		JSONObject contactPrefsJSON = new JSONObject().put("visitor_email", email).put("first_name", firstName)
				.put("last_name", lastName);
		JSONObject messageJSON = new JSONObject().put("lines_json", invoiceLines);

		JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON", pluginPrefsJSON)
				.put("visitorJSON", contactPrefsJSON).put("messageJSON", messageJSON);

		// send request to plugins server and return response
		return HTTPUtil.accessHTTPURL(ZendeskUtil.pluginURL + "core/agile/freshbooks/invoice/add",
				prefsJSON.toString(), "PUT");

	}

	/**
	 * Retrieves FreshBooks preferences from {@link Widget} and stores into a
	 * {@link JSONObject}
	 * 
	 * @param widget
	 *            {@link Widget} to retrieve FreshBooks preferences from
	 *            FreshBooks account of agile user
	 * @return {@link JSONObject} with FreshBooks preferences
	 * @throws Exception
	 */
	public static JSONObject buildPluginPrefsJSON(Widget widget) throws Exception
	{
		try
		{
			// If widget properties null, exception occurs
			JSONObject pluginPrefs = new JSONObject().put(FRESHBOOKS_API_KEY, widget.getProperty(FRESHBOOKS_API_KEY))
					.put(FRESHBOOKS_URL, widget.getProperty(FRESHBOOKS_URL));

			System.out.println("plugin prefs in freshbooks: " + pluginPrefs);

			return pluginPrefs;
		}
		catch (JSONException e)
		{
			System.out.println(e.getMessage());
			throw new Exception("Something went wrong. Please try again.");
		}

	}
}
