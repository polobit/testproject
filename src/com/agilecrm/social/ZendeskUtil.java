package com.agilecrm.social;

import java.io.IOException;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.Widget;

/*       
 * The <code>ZendeskUtil</code> class acts as a Client to ClickDeskPlugins
 * server
 * 
 * <code>ZendeskUtil</code> class contains methods for interacting with the
 * ClickDeskPlugins server using REST API.
 * 
 * @author Tejaswi
 * @since February 2013
 */
public class ZendeskUtil
{

    /**
     * ClickDesk plugins Server URL
     */
    public static final String pluginURL = "http://ec2-72-44-57-140.compute-1.amazonaws.com:8080/ClickdeskPlugins/";

    /**
     * Calls method in ClickDeskPlugins server using REST API to get the details
     * of the contact
     * 
     * @param widget
     *            {@link Widget} to retrieve plugin prefs from zendesk account
     *            of agile user
     * @param email
     *            {@link String} email of contact
     * @return {@link String} with the client response
     * @throws Exception
     *             if the response is an exception
     */
    public static String getContactTickets(Widget widget, String email)
	    throws Exception
    {
	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);
	JSONObject contactPrefsJSON = new JSONObject().put("visitor_email",
		email);

	if (pluginPrefsJSON == null || contactPrefsJSON == null)
	    throw new Exception("Something went wrong. Please try agian");

	JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON",
		pluginPrefsJSON).put("visitorJSON", contactPrefsJSON);

	String response = HTTPUtil.accessHTTPURL(pluginURL
		+ "core/agile/zendesk/get", prefsJSON.toString(), "PUT");

	return response;

    }

    // Each Chat
    /**
     * Calls chat method of pluginName type class in ClickDeskPlugins server
     * using REST API to add ticket in Zendesk
     * 
     * @param widget
     *            {@link Widget} to retrieve plugin prefs from zendesk account
     *            of agile user
     * @param agileUserName
     *            {@link String} current agile user name
     * @param description
     *            {@link String} description of the ticket
     * 
     * @return {@link String} with the client response
     * @throws Exception
     *             if the response is an exception
     */
    public static String addTicket(Widget widget, String name, String email,
	    String subject, String description) throws Exception
    {

	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);
	JSONObject contactPrefsJSON = new JSONObject().put("visitor_email",
		email).put("visitor_name", name);
	JSONObject messageJSON = new JSONObject().put("subject", subject).put(
		"message", description);

	if (pluginPrefsJSON == null || contactPrefsJSON == null)
	    throw new Exception("Something went wrong. Please try agian");

	JSONObject json = new JSONObject()
		.put("pluginPrefsJSON", pluginPrefsJSON)
		.put("visitorJSON", contactPrefsJSON)
		.put("messageJSON", messageJSON);

	String response = HTTPUtil.accessHTTPURL(pluginURL
		+ "core/agile/zendesk/add", json.toString(), "PUT");

	return response;

    }

    /**
     * Calls chat method of zendesk class in ClickDeskPlugins server using REST
     * API to update ticket in Zendesk
     * 
     * @param widget
     *            {@link Widget} to retrieve plugin prefs from zendesk account
     *            of agile user
     * @param ticketNumber
     *            {@link String} id of the ticket to update it
     * @param description
     *            {@link String} description of the ticket
     * 
     * @return {@link String} with the client response
     * @throws Exception
     *             if the response is an exception
     */
    public static String updateTicket(Widget widget, String ticketNumber,
	    String description) throws Exception
    {
	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);
	JSONObject messageJSON = new JSONObject().put("ticketId", ticketNumber)
		.put("message", description);

	if (pluginPrefsJSON == null || messageJSON == null)
	    throw new Exception("Something went wrong. Please try agian");

	JSONObject json = new JSONObject().put("pluginPrefsJSON",
		pluginPrefsJSON).put("messageJSON", messageJSON);

	String response = HTTPUtil.accessHTTPURL(pluginURL
		+ "core/agile/zendesk/update", json.toString(), "PUT");

	return response;

    }

    /**
     * Retrieves info of the Zendesk user based on his email.
     * 
     * @param widget
     *            {@link Widget}
     * @return {@link String} form of JSON
     * @throws Exception
     */
    public static String getUserInfo(Widget widget) throws Exception
    {
	String email = widget.getProperty("zendesk_username");

	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);
	JSONObject contactPrefsJSON = new JSONObject().put("visitor_email",
		email);

	if (pluginPrefsJSON == null || contactPrefsJSON == null)
	    throw new Exception("Something went wrong. Please try agian");

	JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON",
		pluginPrefsJSON).put("visitorJSON", contactPrefsJSON);

	String response = HTTPUtil.accessHTTPURL(pluginURL
		+ "core/agile/zendesk/users", prefsJSON.toString(), "PUT");

	System.out.println("zendeks users " + response);
	try
	{
	    new JSONObject(response);
	}
	catch (Exception e)
	{
	    if (response.contains("404"))
		throw new IOException("");
	    if (response.contains("401") || response.contains("302"))
		throw new Exception("Authentication failed. Please try again");

	}

	return response;
    }

    /**
     * Retrieves tickets for an email and filters them on ticket status
     * 
     * @param widget
     *            {@link Widget}
     * @param email
     *            {@link String} email, for which tickets are retrieved
     * @param status
     *            {@link String} status of ticket
     * @return {@link String} form of JSON
     * @throws Exception
     */
    public static String getTicketsByStatus(Widget widget, String email,
	    String status) throws Exception
    {
	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);
	JSONObject contactPrefsJSON = new JSONObject().put("visitor_email",
		email);
	JSONObject messageJSON = new JSONObject().put("ticket_status", status);

	JSONObject prefsJSON = new JSONObject()
		.put("pluginPrefsJSON", pluginPrefsJSON)
		.put("visitorJSON", contactPrefsJSON)
		.put("messageJSON", messageJSON);

	String response = HTTPUtil.accessHTTPURL(pluginURL
		+ "core/agile/zendesk/tickets/status", prefsJSON.toString(),
		"PUT");

	return response;
    }

    /**
     * Retrieves info of Zendesk user and retrieves contacts based on the email
     * of contact
     * 
     * @param widget
     *            {@link Widget}
     * @param email
     *            {@link String} email, for which tickets are retrieved
     * @return {@link String} form of JSON
     * @throws Exception
     */
    public static String getZendeskProfile(Widget widget, String email)
	    throws Exception
    {

	String userInfo = getUserInfo(widget);
	System.out.println("----------userinfo-------------");
	System.out.println(userInfo);
	String allTickets = getContactTickets(widget, email);

	JSONObject zendeskInfo = new JSONObject();
	try
	{
	    zendeskInfo.put("user_info",
		    new JSONObject(userInfo).getJSONArray("users")
			    .getJSONObject(0));
	}
	catch (JSONException e)
	{
	    zendeskInfo.put("user_info", userInfo);
	}

	zendeskInfo.put("all_tickets", allTickets);

	return zendeskInfo.toString();
    }

    /**
     * Retrieves Zendesk preferences from {@link Widget} and stores into a
     * {@link JSONObject}
     * 
     * @param widget
     *            {@link Widget} to retrieve Zendesk preferences from zendesk
     *            account of agile user
     * @return {@link JSONObject} with Zendesk preferences
     */
    public static JSONObject buildPluginPrefsJSON(Widget widget)
    {
	try
	{
	    JSONObject pluginPrefs = new JSONObject()
		    .put("zendesk_username",
			    widget.getProperty("zendesk_username"))
		    .put("zendesk_password",
			    widget.getProperty("zendesk_password"))
		    .put("zendesk_url", widget.getProperty("zendesk_url"));

	    return pluginPrefs;
	}
	catch (JSONException e)
	{
	    System.out.println(e.getMessage());
	    return null;
	}

    }

}
