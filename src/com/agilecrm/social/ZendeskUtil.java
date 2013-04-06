package com.agilecrm.social;

import org.json.JSONException;
import org.json.JSONObject;

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

    // Run - Before Chat
    /**
     * Calls preChat method of zendesk class in ClickDeskPlugins server using
     * REST API to get the details of the contact
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

    public static String getContactTickets(Widget widget, String email) throws Exception
    {

	return null;

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

    public static String addTicket(Widget widget, String name, String email, String subject, String description) throws Exception
    {

	return null;

    }

    // Run - Post Chat
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

    public static String updateTicket(Widget widget, String ticketNumber, String description) throws Exception
    {

	return null;

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
	    JSONObject pluginPrefs = new JSONObject().put("zendesk_username", widget.getProperty("zendesk_username"))
		    .put("zendesk_password", widget.getProperty("zendesk_password")).put("zendesk_url", widget.getProperty("zendesk_url"));
	    return pluginPrefs;
	}
	catch (JSONException e)
	{
	    System.out.println(e.getMessage());
	    return null;
	}

    }

}
