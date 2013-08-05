package com.agilecrm.social;

import org.json.JSONArray;

import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.Widget;

/**
 * <code>ClickDeskUtil</code> contains methods to retrieve chats and tickets
 * from ClickDesk server
 * 
 * @author Tejaswi
 * 
 */
public class ClickDeskUtil
{

    /**
     * Base URL to retrieve chats from ClickDesk
     */
    public final static String CLICKDESK_CHATS_URL = "https://my.clickdesk.com/rest/dev/api/getchats/<email>?offset=<offset>";

    /**
     * Base URL to retrieve tickets from ClickDesk
     */
    public final static String CLICKDESK_TICKETS_URL = "https://my.clickdesk.com/rest/dev/api/gettickets/<email>?offset=<offset>";

    /**
     * Interacts with ClickDesk server and retrieves chats from ClickDesk
     * 
     * @param widget
     *            {@link Widget}
     * @param email
     *            {@link String} email to retrieve chats for
     * @param offset
     *            No. of chats to retrieved per request
     * @return {@link JSONArray} of chats
     * @throws Exception
     */
    public static JSONArray getChats(Widget widget, String email, String offset)
	    throws Exception
    {
	String url = CLICKDESK_CHATS_URL.replace("<email>", email).replace(
		"<offset>", offset);
	System.out.println("ClickDesk request URL : " + url);

	// connect to ClickDesk
	String response = HTTPUtil.accessURLUsingAuthentication(url,
		widget.getProperty("clickdesk_username"),
		widget.getProperty("clickdesk_api_key"), null,
		"application/json", "GET", "application/json");
	System.out.println("ClickDesk response : " + response);

	/*
	 * Exceptions from ClickDesk server are returned as HTML strings, if
	 * response is not JSON, it is an exception
	 */
	try
	{
	    return new JSONArray(response);
	}
	catch (Exception e)
	{
	    System.out.println("In ClickDesk exception: ");
	    e.printStackTrace();

	    /*
	     * ClickDesk returns 401 for improper details, else exception
	     * returned from clickDesk is thrown
	     */
	    if (response.contains("401"))
		throw new Exception("Authentication failed. Please try again");
	    throw e;
	}

    }

    /**
     * Interacts with ClickDesk server and retrieves tickets from ClickDesk
     * 
     * @param widget
     *            {@link Widget}
     * @param email
     *            {@link String} email to retrieve tickets for
     * @param offset
     *            No. of tickets to retrieved per request
     * @return {@link JSONArray} of tickets
     * @throws Exception
     */
    public static JSONArray getTickets(Widget widget, String email,
	    String offset) throws Exception
    {

	String url = CLICKDESK_TICKETS_URL.replace("<email>", email).replace(
		"<offset>", offset);
	System.out.println("ClickDesk request URL : " + url);

	// connect to ClickDesk and retrieve tickets
	String response = HTTPUtil.accessURLUsingAuthentication(url,
		widget.getProperty("clickdesk_username"),
		widget.getProperty("clickdesk_api_key"), null,
		"application/json", "GET", "application/json");

	System.out.println("ClickDesk response : " + response);

	return new JSONArray(response);
    }

}
