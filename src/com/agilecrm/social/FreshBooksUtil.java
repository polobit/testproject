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

    /**
     * Calls method in ClickDeskPlugins server using REST API to get clients
     * from FreshBooks
     * 
     * @param widget
     *            {@link Widget} to retrieve plugin prefs from FreshBooks
     *            account of agile user
     * @param email
     *            {@link String} email of contact
     * @return {@link String} with the client response
     * @throws Exception
     *             if the response is an exception
     */
    public static String getClients(Widget widget, String email)
	    throws Exception
    {
	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);
	JSONObject contactPrefsJSON = new JSONObject().put("visitor_email",
		email);

	if (pluginPrefsJSON == null || contactPrefsJSON == null)
	    throw new Exception("Freshbooks preferences null");

	JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON",
		pluginPrefsJSON).put("visitorJSON", contactPrefsJSON);

	String response = HTTPUtil.accessHTTPURL(ZendeskUtil.pluginURL
		+ "core/agile/freshbooks/clients/get", prefsJSON.toString(),
		"PUT");

	return response;

    }

    /**
     * Calls method in ClickDeskPlugins server using REST API to get invoices of
     * client from FreshBooks
     * 
     * @param widget
     *            {@link Widget} to retrieve plugin prefs from FreshBooks
     *            account of agile user
     * @param clientId
     *            {@link String} client id of contact
     * @return {@link String} with the client response
     * @throws Exception
     *             if the response is an exception
     */
    public static String getInvoicesOfClient(Widget widget, String clientId)
	    throws Exception
    {
	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);
	JSONObject messageJSON = new JSONObject().put("client_id", clientId);

	if (pluginPrefsJSON == null || messageJSON == null)
	    throw new Exception("Freshbooks preferences null");

	JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON",
		pluginPrefsJSON).put("messageJSON", messageJSON);

	String response = HTTPUtil.accessHTTPURL(ZendeskUtil.pluginURL
		+ "core/agile/freshbooks/invoices/get", prefsJSON.toString(),
		"PUT");

	return response;

    }

    /**
     * Calls method in ClickDeskPlugins server using REST API to get invoices of
     * client from FreshBooks
     * 
     * @param widget
     *            {@link Widget} to retrieve plugin prefs from FreshBooks
     *            account of agile user
     * @return {@link String} with the client response
     * @throws Exception
     *             if the response is an exception
     */
    public static String getItems(Widget widget) throws Exception
    {
	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);

	if (pluginPrefsJSON == null)
	    throw new Exception("Freshbooks preferences null");

	JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON",
		pluginPrefsJSON);

	String response = HTTPUtil.accessHTTPURL(ZendeskUtil.pluginURL
		+ "core/agile/freshbooks/items/get", prefsJSON.toString(),
		"PUT");

	return response;

    }

    /**
     * Calls method in ClickDeskPlugins server using REST API to add client to
     * FreshBooks
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
     * @return {@link String} with the client response
     * @throws Exception
     *             if the response is an exception
     */
    public static String addClient(Widget widget, String firstName,
	    String lastName, String email) throws Exception
    {
	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);

	JSONObject contactPrefsJSON = new JSONObject()
		.put("visitor_email", email).put("first_name", firstName)
		.put("last_name", lastName);

	if (pluginPrefsJSON == null || contactPrefsJSON == null)
	    throw new Exception("Freshbooks preferences null");

	JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON",
		pluginPrefsJSON).put("visitorJSON", contactPrefsJSON);

	String response = HTTPUtil.accessHTTPURL(ZendeskUtil.pluginURL
		+ "core/agile/freshbooks/client/add", prefsJSON.toString(),
		"PUT");

	return response;

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
     * @param itemName
     *            {@link String} name of the item
     * @param quantity
     *            {@link String} quantity of items
     * @return {@link String} with the client response
     * @throws Exception
     *             if the response is an exception
     */
    public static String addInvoice(Widget widget, String firstName,
	    String lastName, String email, String itemName, String quantity)
	    throws Exception
    {
	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);

	JSONObject contactPrefsJSON = new JSONObject()
		.put("visitor_email", email).put("first_name", firstName)
		.put("last_name", lastName);
	JSONObject messageJSON = new JSONObject().put("item_name", itemName)
		.put("quantity", quantity);

	if (pluginPrefsJSON == null || contactPrefsJSON == null
		|| messageJSON == null)
	    throw new Exception("Freshbooks preferences null");

	JSONObject prefsJSON = new JSONObject()
		.put("pluginPrefsJSON", pluginPrefsJSON)
		.put("visitorJSON", contactPrefsJSON)
		.put("messageJSON", messageJSON);

	String response = HTTPUtil.accessHTTPURL(ZendeskUtil.pluginURL
		+ "core/agile/freshbooks/invoice/add", prefsJSON.toString(),
		"PUT");

	return response;

    }

    /**
     * Retrieves FreshBooks preferences from {@link Widget} and stores into a
     * {@link JSONObject}
     * 
     * @param widget
     *            {@link Widget} to retrieve FreshBooks preferences from
     *            FreshBooks account of agile user
     * @return {@link JSONObject} with FreshBooks preferences
     */
    public static JSONObject buildPluginPrefsJSON(Widget widget)
    {
	try
	{
	    // JSONObject pluginPrefs = new
	    // JSONObject().put("freshbooks_apiKey",
	    // widget.getProperty("freshbooks_apiKey")).put(
	    // "freshbooks_url", widget.getProperty("freshbooks_url"));

	    JSONObject pluginPrefs = new JSONObject().put("freshbooks_apiKey",
		    "55b352b9e2c08f778c50c0de6f26f1ab").put("freshbooks_url",
		    "https://clickdesk-billing.freshbooks.com");

	    return pluginPrefs;
	}
	catch (JSONException e)
	{
	    System.out.println(e.getMessage());
	    return null;
	}

    }

    public static void main(String[] args)
    {

	try
	{
	    // System.out.println(getClients(null, "tejaswitest@gmail.com"));
	    // System.out.println(getInvoicesOfClient(null, "28"));
	    // System.out.println(getItems(null));
	    System.out.println(addClient(null, "teju-agile", "test",
		    "test4@agile.com"));
	    System.out.println(addInvoice(null, "teju-agile", "test",
		    "test3@agile.com", "mobile", "3"));
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	    e.printStackTrace();
	}
    }

}
