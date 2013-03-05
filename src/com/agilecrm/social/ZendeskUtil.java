package com.agilecrm.social;

import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriBuilder;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.widgets.Widget;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;
import com.sun.jersey.api.client.config.ClientConfig;
import com.sun.jersey.api.client.config.DefaultClientConfig;

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
     * Plugin Server URL
     */
    private static final String pluginURL = "http://ec2-72-44-57-140.compute-1.amazonaws.com:8080/ClickdeskPlugins/";

    /**
     * This method is used to create a client to the ClickDeskConnector
     * 
     * @return resource after building the client
     */

    private static WebResource getResource()
    {
	ClientConfig config = new DefaultClientConfig();
	Client client = Client.create(config);
	return client.resource(UriBuilder.fromUri(pluginURL).build());
    }

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

    public static String getContactTickets(Widget widget, String email)
	    throws Exception
    {

	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);
	JSONObject contactPrefsJSON = new JSONObject().put("visitor_email",
		email);

	if (pluginPrefsJSON == null || contactPrefsJSON == null)
	    throw new Exception("zendesk preferences null");

	JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON",
		pluginPrefsJSON).put("visitorJSON", contactPrefsJSON);

	/**
	 * Holds a {@link WebResource} object with the credentials of the
	 * current user to authenticate user when a request is made
	 */
	WebResource resource = null;
	ClientResponse response = null;

	// Get ClickDesk res
	resource = getResource();
	response = resource.path("/core/agile/zendesk/get")
		.type(MediaType.APPLICATION_JSON)
		.put(ClientResponse.class, prefsJSON.toString());

	return response.getEntity(String.class);

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
	    throw new Exception("zendesk preferences null");

	JSONObject json = new JSONObject()
		.put("pluginPrefsJSON", pluginPrefsJSON)
		.put("visitorJSON", contactPrefsJSON)
		.put("messageJSON", messageJSON);

	/**
	 * Holds a {@link WebResource} object with the credentials of the
	 * current user to authenticate user when a request is made
	 */
	WebResource resource = null;
	ClientResponse response = null;

	resource = getResource();
	response = resource.path("/core/agile/zendesk/add")
		.type(MediaType.APPLICATION_JSON)
		.put(ClientResponse.class, json.toString());

	return response.getEntity(String.class);

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

    public static String updateTicket(Widget widget, String ticketNumber,
	    String description) throws Exception
    {

	JSONObject pluginPrefsJSON = buildPluginPrefsJSON(widget);
	JSONObject messageJSON = new JSONObject().put("ticketId", ticketNumber)
		.put("message", description);

	if (pluginPrefsJSON == null || messageJSON == null)
	    throw new Exception("zendesk preferences null");

	JSONObject json = new JSONObject().put("pluginPrefsJSON",
		pluginPrefsJSON).put("messageJSON", messageJSON);

	/**
	 * Holds a {@link WebResource} object with the credentials of the
	 * current user to authenticate user when a request is made
	 */
	WebResource resource = null;
	ClientResponse response = null;

	resource = getResource();
	response = resource.path("/core/agile/zendesk/update")
		.type(MediaType.APPLICATION_JSON)
		.put(ClientResponse.class, json.toString());
	return response.getEntity(String.class);

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
