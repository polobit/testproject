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
	public static JSONArray getChats(Widget widget, String email, String offset) throws Exception
	{
		String url = CLICKDESK_CHATS_URL.replace("<email>", email).replace("<offset>", offset);
		System.out.println("ClickDesk request URL : " + url);

		// connect to ClickDesk
		String response = HTTPUtil.accessURLUsingAuthentication(url, widget.getProperty("clickdesk_username"),
				widget.getProperty("clickdesk_api_key"), "GET", null, false, "application/json", "application/json");
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
			 * Checks for the response and modifies it to throw proper
			 * exceptions
			 */
			throw new Exception(checkResponse(response));
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
	public static JSONArray getTickets(Widget widget, String email, String offset) throws Exception
	{

		String url = CLICKDESK_TICKETS_URL.replace("<email>", email).replace("<offset>", offset);
		System.out.println("ClickDesk request URL : " + url);

		// connect to ClickDesk and retrieve tickets
		String response = HTTPUtil.accessURLUsingAuthentication(url, widget.getProperty("clickdesk_username"),
				widget.getProperty("clickdesk_api_key"), "GET", null, false, "application/json", "application/json");

		System.out.println("ClickDesk response : " + response);

		return new JSONArray(response);
	}

	/**
	 * Checks response returned from ClickDesk and returns proper exception
	 * message to throw it
	 * 
	 * @param response
	 *            {@link String} exception response from ClickDesk
	 * @return {@link String} with proper exception message
	 * @throws Exception
	 */
	public static String checkResponse(String response) throws Exception
	{
		// ClickDesk returns 401 for improper details
		if (response.contains("401"))
			return "Authentication failed. Please try again";

		/*
		 * ClickDesk returns 404 for IO exception, else exception returned from
		 * clickDesk is thrown
		 */
		if (response.contains("404"))
			return "An error occured. Refresh and try again.";

		return response;
	}

}
