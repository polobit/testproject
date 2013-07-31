package com.agilecrm.social;

import org.json.JSONArray;

import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.Widget;

public class ClickDeskUtil
{

    public final static String CLICKDESK_CHATS_URL = "https://my.clickdesk.com/rest/dev/api/getchats/<email>?offset=<offset>";
    public final static String CLICKDESK_TICKETS_URL = "https://my.clickdesk.com/rest/dev/api/gettickets/<email>?offset=<offset>";

    public static JSONArray getChats(Widget widget, String email, String offset)
	    throws Exception
    {
	String url = CLICKDESK_CHATS_URL.replace("<email>", email).replace(
		"<offset>", offset);
	System.out.println(url);
	String response = "";

	System.out.println("from widegte"
		+ widget.getProperty("clickdesk_username"));
	System.out.println("from widegte"
		+ widget.getProperty("clickdesk_username"));

	response = HTTPUtil.accessURLUsingAuthentication(url,
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

	String url = CLICKDESK_TICKETS_URL.replace("<email>", email).replace(
		"<offset>", offset);
	System.out.println(url);

	String response = "";

	System.out.println("from widegte"
		+ widget.getProperty("clickdesk_username"));
	System.out.println("from widegte"
		+ widget.getProperty("clickdesk_username"));

	response = HTTPUtil.accessURLUsingAuthentication(url,
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

    /**
     * @param args
     */
    public static void main(String[] args)
    {
	String email = "tejaswitest@gmail.com";
	// email = "govind@invox.com";
	// email = "mantra@gmail.com";

	// String clickDeskUserName = "govindarajulu3@gmail.com";
	// String clickDeskAPIKey = "j65p3kfqtflvjkcddcfo3bmpnp";
	//
	// clickDeskUserName = "gouthamirao22@gmail.com";
	// clickDeskAPIKey = "ggku9raaj7hvglib0e5hn2cr97";

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

}
