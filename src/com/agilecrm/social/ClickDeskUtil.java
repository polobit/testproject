package com.agilecrm.social;

import org.json.JSONArray;

import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.Widget;

public class ClickDeskUtil
{

    public final static String CLICKDESK_CHATS_URL = "https://my.clickdesk.com/rest/dev/api/getchats/<email>?offset=<offset>";
    public final static String CLICKDESK_TICKETS_URL = "https://my.clickdesk.com/rest/dev/api/gettickets/<email>?offset=<offset>";
    public static String clickDeskUserName;
    public static String clickDeskAPIKey;

    public static JSONArray getChats(Widget widget, String email, String offset)
	    throws Exception
    {
	initilaizePrefs(widget);
	String url = CLICKDESK_CHATS_URL.replace("<email>", email).replace(
		"<offset>", offset);
	System.out.println(url);
	String response = "";
	System.out.println(clickDeskUserName);
	System.out.println("from widegte"
		+ widget.getProperty("clickdesk_username"));
	System.out.println("from widegte"
		+ widget.getProperty("clickdesk_username"));

	response = HTTPUtil.accessUrlusingAuthentication(url,
		widget.getProperty("clickdesk_username"),
		widget.getProperty("clickdesk_api_key"), null,
		"application/json", "GET", "application/json");
	System.out.println(response);
	try
	{
	    return new JSONArray(response);
	}
	catch (Exception e)
	{
	    System.out.println("in catch");
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new Exception("Unauthorized enter proper details");
	}

    }

    public static JSONArray getTickets(Widget widget, String email,
	    String offset) throws Exception
    {

	initilaizePrefs(widget);
	String url = CLICKDESK_TICKETS_URL.replace("<email>", email).replace(
		"<offset>", offset);
	System.out.println(url);

	String response = "";

	System.out.println(clickDeskUserName);
	response = HTTPUtil.accessUrlusingAuthentication(url,
		clickDeskUserName, clickDeskAPIKey, null, "application/json",
		"GET", "application/json");

	System.out.println(response);
	try
	{
	    return new JSONArray(response);
	}
	catch (Exception e)
	{
	    System.out.println("in catch");
	    e.printStackTrace();
	    System.out.println(e.getMessage());
	    throw new Exception("Unauthorized enter proper details");
	}

    }

    /**
     * @param args
     */
    public static void main(String[] args)
    {
	String email = "tejaswitest@gmail.com";
	// email = "govind@invox.com";
	// email = "mantra@gmail.com";

	try
	{
	    System.out.println(getChats(null, email, "0"));
	    System.out.println(getTickets(null, email, "0"));
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    System.out.println(e.getMessage());
	    e.printStackTrace();
	}

    }

    public static void initilaizePrefs(Widget widget)
    {
	// System.out.println(clickDeskUserName);
	// System.out.println(clickDeskAPIKey);
	System.out.println(widget.getProperty("clickdesk_username"));
	System.out.println(widget.getProperty("clickdesk_api_key"));
	clickDeskUserName = widget.getProperty("clickdesk_username");
	clickDeskAPIKey = widget.getProperty("clickdesk_api_key");
	//
	// System.out.println(clickDeskUserName);
	// System.out.println(clickDeskAPIKey);
	// clickDeskUserName = "govindarajulu3@gmail.com";
	// clickDeskAPIKey = "j65p3kfqtflvjkcddcfo3bmpnp";
	//
	// clickDeskUserName = "gouthamirao22@gmail.com";
	// clickDeskAPIKey = "ggku9raaj7hvglib0e5hn2cr97";
    }
}
