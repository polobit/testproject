package com.thirdparty;

import java.util.HashMap;

import com.agilecrm.FreshBooksApi;
import com.agilecrm.Globals;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.labs.repackaged.org.json.JSONArray;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.appengine.labs.repackaged.org.json.XML;
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.thirdparty.twilio.sdk.TwilioRestException;
import com.thirdparty.twilio.sdk.TwilioRestResponse;

public class Test
{

    /**
     * @param args
     */
    public static void main(String[] args)
    {
	// try
	// {
	// System.out.println(getNumbers());
	// }
	// catch (Exception e)
	// {
	// System.out.println(e.getMessage());
	// e.printStackTrace();
	// }

	// JSONObject pluginPrefsJSON;
	// try
	// {
	// pluginPrefsJSON = new JSONObject()
	// .put("zendesk_username", "tejaswi@faxdesk.com")
	// .put("zendesk_password", "clickdesk")
	// .put("zendesk_url", "https://tejaswi.zendesk.com");
	//
	// JSONObject contactPrefsJSON = new JSONObject().put("visitor_email",
	// "test@agile.com");
	//
	// if (pluginPrefsJSON == null || contactPrefsJSON == null)
	// throw new Exception("zendesk preferences null");
	//
	// JSONObject prefsJSON = new JSONObject().put("pluginPrefsJSON",
	// pluginPrefsJSON).put("visitorJSON", contactPrefsJSON);
	//
	// String response = HTTPUtil
	// .accessHTTPURL(
	// "http://ec2-72-44-57-140.compute-1.amazonaws.com:8080/ClickdeskPlugins/core/agile/zendesk/users",
	// prefsJSON.toString(), "PUT");
	// System.out.println(response);
	// }
	// catch (Exception e)
	// {
	// // TODO Auto-generated catch block
	// e.printStackTrace();
	// }

	HashMap<String, String> map = new HashMap<String, String>();
	map.put("oauth_version", "1.0");
	map.put("oauth_consumer_key", Globals.FRESHBOOKS_API_KEY);
	map.put("oauth_token", "");
	map.put("oauth_timestamp", "");
	map.put("", "");

	try
	{
	    HTTPUtil.accessHTTPURL(FreshBooksApi.REQUEST_TOKEN_URL, "", "POST");
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    public static final String APIVERSION = "2010-04-01";
    /* Twilio AccountSid and AuthToken */
    public static String AccountSid = // "AC79bd0a3da6b29949f0dab6fc5221d5fb";
    "AC0079cf757ae0a3e1915a3ce40d4c65ee";
    // "AC8603326f8088c6679b41be5cbf17552c";
    public static String AuthToken = // "5e7085bb019e378fb18822f319a3ec46";
    "b6420aa8715bad58ad2cff61036b4640";

    // "86635fe4bafb61fc78f5eb7324e14021";

    public static JSONArray getNumbers() throws Exception
    {

	TwilioRestClient client = new TwilioRestClient(AccountSid, AuthToken,
		null);
	TwilioRestResponse response;

	response = client.request(
		"/" + APIVERSION + "/Accounts/" + client.getAccountSid()
			+ "/Calls", "GET", null);

	if (response.isError())
	    throw new Exception("Error fetching recent calls: "
		    + response.getHttpStatus() + "\n"
		    + response.getResponseText());
	else
	{
	    JSONArray array;
	    // System.out.println(response.getResponseText());
	    try
	    {
		JSONObject xml = XML.toJSONObject(response.getResponseText());
		System.out.println(xml);
		array = xml.getJSONObject("TwilioResponse")
			.getJSONObject("Calls").getJSONArray("Call");

		for (int i = 0; i < array.length(); i++)
		{
		    System.out.print(array.getJSONObject(i).get("From") + "-");
		    System.out.println(array.getJSONObject(i).get("To"));
		}
	    }
	    catch (Exception e)
	    {
		return null;
	    }

	    return array;

	}

    }

    public static String getAuthToken(TwilioRestClient client)
    {
	TwilioRestResponse response = null;
	try
	{
	    response = client.request("/" + APIVERSION + "/Accounts/"
		    + AccountSid, "GET", null);
	}
	catch (TwilioRestException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return response.getResponseText();
    }
}
