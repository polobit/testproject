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
	System.out.println("Clickdesk request URL : " + url);
	String response = "";

	response = HTTPUtil.accessURLUsingAuthentication(url,
		widget.getProperty("clickdesk_username"),
		widget.getProperty("clickdesk_api_key"), null,
		"application/json", "GET", "application/json");
	System.out.println("ClickDesk response : " + response);

	// response is not JSON if the preferences are incorrect, and ClickDesk
	// does not throws it as string instead of exception
	try
	{
	    return new JSONArray(response);
	}
	catch (Exception e)
	{
	    System.out.println("in catch");
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new Exception("Authentication failed. Please try again");
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
	System.out.println("Clickdesk request URL : " + url);

	String response = "";

	response = HTTPUtil.accessURLUsingAuthentication(url,
		widget.getProperty("clickdesk_username"),
		widget.getProperty("clickdesk_api_key"), null,
		"application/json", "GET", "application/json");

	System.out.println("ClickDesk response : " + response);
	try
	{
	    return new JSONArray(response);
	}
	catch (Exception e)
	{
	    System.out.println("in catch");
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new Exception("Authentication failed. Please try again");
	}

    }

}
