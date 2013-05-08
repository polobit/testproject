package com.agilecrm.social;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.widgets.Widget;
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.thirdparty.twilio.sdk.TwilioRestResponse;
import com.twilio.sdk.client.TwilioCapability;
import com.twilio.sdk.client.TwilioCapability.DomainException;

public class TwilioUtil
{
    /* Twilio REST API version */
    public static final String APIVERSION = "2010-04-01";

    public static String generateTwilioToken(String accountSid, String appSID)
	    throws Exception
    {
	// String authToken = "b6420aa8715bad58ad2cff61036b4640";
	String authToken = "5e7085bb019e378fb18822f319a3ec46";

	TwilioCapability capability = new TwilioCapability(accountSid,
		authToken);

	capability.allowClientOutgoing(appSID);

	String token = null;
	try
	{
	    token = capability.generateToken();
	    System.out.println(token);
	    return token;
	}
	catch (DomainException e)
	{
	    System.out.println(e.getMessage());
	    return "";
	}
    }

    public static String getTwilioAppSID(String accountSID) throws Exception
    {
	// String authToken = "b6420aa8715bad58ad2cff61036b4640";
	// test account token
	String authToken = "5e7085bb019e378fb18822f319a3ec46";

	TwilioRestClient client = new TwilioRestClient(accountSID, authToken,
		null);
	TwilioRestResponse response;

	Map<String, String> params = new HashMap<String, String>();
	params.put("FriendlyName", "Phone Me");
	params.put("VoiceUrl", "https://teju-first.appspot.com/twilio/voice");
	params.put("VoiceMethod", "GET");

	response = client.request(
		"/2010-04-01/Accounts/" + client.getAccountSid()
			+ "/Applications.json", "POST", params);

	if (response.isError())
	    throw new Exception("Error fetching recent calls: "
		    + response.getHttpStatus() + "\n"
		    + response.getResponseText());
	else
	{
	    System.out.println(response.getResponseText());
	    return new JSONObject(response.getResponseText()).getString("sid");
	}

    }

    /**
     * Retrieves the call logs from agent Twilio account based on his Twilio
     * account SID
     * 
     * @param accountSid
     *            {@link String} accountSid of agent Twilio account
     * @return {@link JSONArray} of calls
     * @throws Exception
     */
    public static JSONArray getCallLogs(Widget widget, String to)
	    throws Exception
    {

	String accountSid = widget.getProperty("account_sid");
	String authToken = widget.getProperty("token");

	TwilioRestClient client = new TwilioRestClient(accountSid, authToken,
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
	    // System.out.println(response.getResponseText());
	    try
	    {
		JSONObject xml = XML.toJSONObject(response.getResponseText());
		System.out.println(xml);
		JSONArray array = xml.getJSONObject("TwilioResponse")
			.getJSONObject("Calls").getJSONArray("Call");
		JSONArray logs = new JSONArray();

		for (int i = 0; i < array.length(); i++)
		{
		    System.out.print(array.getJSONObject(i).get("From") + "-");
		    System.out.println(array.getJSONObject(i).get("To"));

		    if (array.getJSONObject(i).getString("To").contains(to))
			logs.put(array.getJSONObject(i));
		}
		System.out.println(logs);
		return logs;

	    }
	    catch (JSONException e)
	    {
		return null;
	    }
	}

    }

    /**
     * Making an outgoing call based on account SID and the phone numbers
     * 
     * @param accountSid
     *            {@link String} accountSid of agent Twilio account
     * @param from
     *            {@link String} caller id of the phone call
     * @param to
     *            {@link String} phone number to be called
     * @param url
     *            {@link String} URL to execute when the called party answers
     * @throws Exception
     */
    public static JSONObject makeCall(Widget widget, String from, String to,
	    String url) throws Exception
    {

	String accountSid = widget.getProperty("account_sid");
	String authToken = widget.getProperty("token");

	TwilioRestClient client = new TwilioRestClient(accountSid, authToken,
		null);

	// build map of post parameters
	Map<String, String> params = new HashMap<String, String>();
	params.put("From", from);
	params.put("To", to);
	params.put("Url", url);
	params.put("IfMachine", "Continue");

	TwilioRestResponse response;
	response = client.request(
		"/" + APIVERSION + "/Accounts/" + client.getAccountSid()
			+ "/Calls", "POST", params);

	if (response.isError())
	    throw new Exception("Error making outgoing call: "
		    + response.getHttpStatus() + "\n"
		    + response.getResponseText());
	else
	{
	    try
	    {
		JSONObject xml = XML.toJSONObject(response.getResponseText());
		System.out.println(xml);
		JSONObject callJSON = xml.getJSONObject("Call");

		return callJSON;
	    }
	    catch (JSONException e)
	    {
		return null;
	    }
	}

    }

    /**
     * Retrieving recent error and warning notifications from your account
     * 
     * @param accountSid
     *            {@link String} accountSid of agent Twilio account
     * @throws Exception
     */
    public static void getNotificationsExample(Widget widget) throws Exception
    {

	String accountSid = widget.getProperty("account_sid");
	String authToken = widget.getProperty("token");

	TwilioRestClient client = new TwilioRestClient(accountSid, authToken,
		null);

	TwilioRestResponse response;
	response = client.request(
		"/" + APIVERSION + "/Accounts/" + client.getAccountSid()
			+ "/Notifications", "GET", null);

	if (response.isError())
	    System.out.println("Error fetching recent notifications: "
		    + response.getHttpStatus() + "\n"
		    + response.getResponseText());
	else
	{
	    System.out.println(response.getResponseText());
	}
    }

    /**
     * Example of retrieving the Recordings for an account, filtered by call id
     * 
     * @param accountSid
     *            {@link String} accountSid of agent Twilio account
     * @param callSid
     *            {@link String} SID of Twilio call for which recording is
     *            required
     * @throws Exception
     */
    public static void getRecordingsExample(Widget widget, String callSid)
	    throws Exception
    {

	String accountSid = widget.getProperty("account_sid");
	String authToken = widget.getProperty("token");

	TwilioRestClient client = new TwilioRestClient(accountSid, authToken,
		null);

	// build map of parameters
	Map<String, String> params = new HashMap<String, String>();
	params.put("CallSid", callSid);

	TwilioRestResponse response;
	response = client.request(
		"/" + APIVERSION + "/Accounts/" + client.getAccountSid()
			+ "/Recordings", "GET", params);

	if (response.isError())
	    System.out.println("Error fetching recordings: "
		    + response.getHttpStatus() + "\n"
		    + response.getResponseText());
	else
	{
	    System.out.println(response.getResponseText());
	}
    }

    /**
     * Deleting a recording from agent Twilio account
     * 
     * @param accountSid
     *            {@link String} accountSid of agent Twilio account
     * @param recordingSid
     *            {@link String} Twilio Recording Id you wish to delete
     * @throws Exception
     */
    public static void deleteRecordingsExample(Widget widget,
	    String recordingSid) throws Exception
    {
	String accountSid = widget.getProperty("account_sid");
	String authToken = widget.getProperty("token");

	TwilioRestClient client = new TwilioRestClient(accountSid, authToken,
		null);

	TwilioRestResponse response;
	response = client.request(
		"/" + APIVERSION + "/Accounts/" + client.getAccountSid()
			+ "/Recordings/" + recordingSid, "GET", null);

	if (response.isError())
	    System.out.println("Error deleting recording: "
		    + response.getHttpStatus() + "\n"
		    + response.getResponseText());
	else
	{
	    System.out.println(response.getResponseText());
	}
    }

    public static String getOutgoingNumbers(String accountSid, String from)
	    throws Exception
    {

	String authToken = "5e7085bb019e378fb18822f319a3ec46";

	// String authToken = "b6420aa8715bad58ad2cff61036b4640";

	TwilioRestClient client = new TwilioRestClient(accountSid, authToken,
		null);
	TwilioRestResponse response;

	Map<String, String> params = new HashMap<String, String>();
	params.put("PhoneNumber", from);
	params.put("VoiceUrl",
		"https://agile-crm-cloud.appspot.com/backend/voice");
	params.put("VoiceMethod", "GET");
	params.put("FriendlyName", "AGILECRM");
	params.put("AreaCode", "510");

	response = client.request(
		"/" + APIVERSION + "/Accounts/" + client.getAccountSid()
			+ "/IncomingPhoneNumbers.json", "POST", params);

	// /2010-04-01/Accounts/AC0079cf757ae0a3e1915a3ce40d4c65ee/AvailablePhoneNumbers
	if (response.isError())
	{
	    throw new Exception("Error sending message: "
		    + response.getHttpStatus() + "\n"
		    + response.getResponseText());
	}
	else
	{

	    System.out.println(response.getResponseText());

	    // JSONObject json = XML.toJSONObject(response.getResponseText());
	    // JSONArray array = json.getJSONObject("TwilioResponse")
	    // .getJSONObject("OutgoingCallerIds")
	    // .getJSONArray("OutgoingCallerId");
	    // JSONArray arrayOfNums = new JSONArray();
	    // for (int i = 0; i < array.length(); i++)
	    // {
	    // System.out.println(array.getJSONObject(i).getString(
	    // "PhoneNumber"));
	    // arrayOfNums.put(i,
	    // array.getJSONObject(i).getString("PhoneNumber"));
	    // }
	    return response.getResponseText();

	}

    }

    public static void main(String[] args)
    {
	try
	{
	    TwilioUtil.getOutgoingNumbers("ACd1fe050ffa754cabc100a3acc93d8d1b",
		    "+14076411314");

	    // ACd1fe050ffa754cabc100a3acc93d8d1b
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
}
