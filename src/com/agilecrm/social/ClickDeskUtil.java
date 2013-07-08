package com.agilecrm.social;

import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.Widget;

public class ClickDeskUtil
{

    public final static String CLICKDESK_CHATS_URL = "https://my.clickdesk.com/rest/dev/api/getchats/<email>";
    public final static String CLICKDESK_TICKETS_URL = "https://my.clickdesk.com/rest/dev/api/gettickets/<email>";
    public static String clickDeskUserName;
    public static String clickDeskAPIKey;

    public static JSONObject getChats(Widget widget, String email)
	    throws Exception
    {
	initilaizePrefs(widget);
	String url = CLICKDESK_CHATS_URL.replace("<email>", email);
	String response = HTTPUtil.accessUrlusingAuthentication(url,
		clickDeskUserName, clickDeskAPIKey, null, "application/xml",
		"GET");
	return XML.toJSONObject(response);
    }

    public static JSONObject getTickets(Widget widget, String email)
	    throws Exception
    {

	initilaizePrefs(widget);
	String url = CLICKDESK_TICKETS_URL.replace("<email>", email);
	String response = HTTPUtil.accessUrlusingAuthentication(url,
		clickDeskUserName, clickDeskAPIKey, null, "application/xml",
		"GET");
	return XML.toJSONObject(response);
    }

    /**
     * @param args
     */
    public static void main(String[] args)
    {
	String email = "tejaswitest@gmail.com";

	try
	{
	    System.out.println(getChats(null, email));
	    System.out.println(getTickets(null, email));
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
	clickDeskUserName = widget.getProperty("clickdesk_username");
	clickDeskAPIKey = widget.getProperty("clickdesk_api_key");

	// clickDeskUserName = "govindarajulu3@gmail.com";
	// clickDeskAPIKey = "j65p3kfqtflvjkcddcfo3bmpnp";
    }
}
