package com.agilecrm.social;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.Widget;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.thirdparty.twilio.sdk.TwilioRestResponse;
import com.twilio.sdk.client.TwilioCapability;
import com.twilio.sdk.client.TwilioCapability.DomainException;

/**
 * The <code>TwilioUtil</code> class acts as a Client to Twilio server
 * 
 * <code>TwilioUtil</code> class contains methods for making calls, recording
 * calls, retrieving call logs and so on
 * 
 * @author Tejaswi
 * @since February 2013
 */
public class TwilioUtil
{
    /** Twilio REST API version */
    public static final String APIVERSION = "2010-04-01";

    /**
     * Twilio authentication token of the account which contains Agile
     * application
     */
    public static final String authToken = "5e7085bb019e378fb18822f319a3ec46"; // default

    /**
     * Creates a {@link TwilioRestClient} instance and sets the account SID of
     * {@link AgileUser} Twilio account and authentication token of Agile Twilio
     * account which contains Agile Application.
     * 
     * @param widget
     *            {@link Widget} to get account SID
     * @return {@link TwilioRestClient} after setting authorization required to
     *         connect with the Twilio server.
     * @throws Exception
     */
    private static TwilioRestClient getTwilioClient(Widget widget) throws Exception
    {
	// Fetch account SID from widget preferences
	String accountSid = widget.getProperty("account_sid");

	/*
	 * Build Twilio REST client with the account SID of the logged in person
	 * and agile authentication token
	 */
	return new TwilioRestClient(accountSid, authToken, null);

    }

    /**
     * Retrieves the outgoing number in Twilio account with the given account
     * SID, to make calls from that account
     * 
     * @param widget
     *            {@link Widget} to retrieve account SID
     * @return {@link JSONArray} with outgoing number
     * @throws Exception
     */
    public static JSONArray getOutgoingNumber(Widget widget) throws Exception
    {
	// Get Twilio client configured with account SID and authToken
	TwilioRestClient client = getTwilioClient(widget);

	TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + client.getAccountSid()
		+ "/OutgoingCallerIds", "GET", null);

	System.out.println("Twilio outgoing No: " + response.getResponseText());

	/*
	 * If error occurs, throw exception based on its status else return
	 * outgoing numbers
	 */
	if (response.isError())
	    throwProperException(response);

	JSONObject outgoingCallerIds = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
		.getJSONObject("OutgoingCallerIds");

	System.out.println("OutgoingCallerID's: " + outgoingCallerIds);

	// If no numbers, return empty object
	if (Integer.parseInt(outgoingCallerIds.getString("total")) == 0)
	    return new JSONArray();

	/*
	 * Response may be array or single object, check and return the first
	 * number if it is an array
	 */
	if (outgoingCallerIds.get("OutgoingCallerId") instanceof JSONObject)
	    return new JSONArray().put(outgoingCallerIds.getJSONObject("OutgoingCallerId"));

	return outgoingCallerIds.getJSONArray("OutgoingCallerId");

    }

    /**
     * Verifies a number whether it is verified in Twilio account associated
     * with the given account SID
     * 
     * @param widget
     *            {@link Widget} to retrieve account SID
     * @param from
     *            "From" number to be verified
     * @return {@link JSONObject} with the verification status
     * @throws Exception
     */
    public static JSONObject verifyOutgoingNumbers(Widget widget, String from) throws Exception
    {
	// Get Twilio client configured with account SID and authToken
	TwilioRestClient client = getTwilioClient(widget);

	// parameters to be sent in the verification process
	Map<String, String> params = new HashMap<String, String>();
	params.put("PhoneNumber", from);
	params.put("StatusCallback", "https://" + NamespaceManager.get() + ".agilecrm.com/verification?user_id="
		+ SessionManager.get().getDomainId() + "&verified_number=" + from);

	// make a post request to verify number
	TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + client.getAccountSid()
		+ "/OutgoingCallerIds", "POST", params);

	System.out.println("Twilio verify: " + response.getResponseText());

	/*
	 * If error occurs, throw exception based on its status else return
	 * response from Twilio
	 */
	if (response.isError())
	    throwProperException(response);

	return XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse");

    }

    /**
     * Creates an application on behalf on Agile in the Twilio account of Agile
     * user and retrieves its SID, which is required further to generate token
     * 
     * @param widget
     *            {@link Widget} to retrieve account SID
     * @return {@link String} SID of the application
     * @throws Exception
     */
    public static String getTwilioAppSID(Widget widget) throws Exception
    {
	// Get Twilio client configured with account SID and authToken
	TwilioRestClient client = getTwilioClient(widget);

	// parameters required to create application
	Map<String, String> params = new HashMap<String, String>();
	params.put("FriendlyName", "Agile CRM");
	params.put("VoiceUrl", "https://agile-crm-cloud.appspot.com/backend/voice");
	params.put("VoiceMethod", "GET");

	// Make a POST request to create application
	TwilioRestResponse response = client.request("/2010-04-01/Accounts/" + client.getAccountSid()
		+ "/Applications.json", "POST", params);

	System.out.println("Twilio app sid : " + response.getResponseText());

	/*
	 * If error occurs, throw exception based on its status else return
	 * application SID
	 */
	if (response.isError())
	    throwProperException(response);

	return new JSONObject(response.getResponseText()).getString("sid");

    }

    /**
     * Generates token which is required to make calls specific to the
     * application based on application SID
     * 
     * @param widget
     *            {@link Widget} to retrieve account SID and application SID
     * @return {@link String} token
     * @throws Exception
     */
    public static String generateTwilioToken(Widget widget) throws Exception
    {
	String accountSid = widget.getProperty("account_sid");
	String appSid = widget.getProperty("app_sid");

	/*
	 * Build Twilio capability object with the account SID of the logged in
	 * person and agile authentication token
	 */
	TwilioCapability capability = new TwilioCapability(accountSid, authToken);

	// allow outgoing from agile application
	capability.allowClientOutgoing(appSid);

	try
	{
	    // generate token to make calls
	    String token = capability.generateToken();
	    System.out.println("Twilio token: " + token);
	    return token;
	}
	catch (DomainException e)
	{
	    System.out.println("Twilio Exception while creating token : " + e.getMessage());
	    return "";
	}
    }

    /**
     * Retrieves call logs for a specific number and also retrieves recording
     * for each call if recorded
     * 
     * @param widget
     *            {@link Widget} to retrieve account SID
     * @param to
     *            Number to which calls are made
     * @return {@link JSONArray} of calls with their recordings
     * @throws Exception
     */
    public static JSONArray getCallLogsWithRecordings(Widget widget, String to) throws Exception
    {
	// Get Twilio client configured with account SID and authToken
	TwilioRestClient client = getTwilioClient(widget);

	JSONArray logs = new JSONArray();
	try
	{
	    // retrieve call logs from Twilio
	    JSONArray array = getCallLogs(client, to);
	    String callSid;

	    // Iterate through the array to get recordings
	    for (int i = 0; i < array.length(); i++)
	    {
		JSONObject callWithRecordings = new JSONObject();

		// Get call SID of each call
		callSid = array.getJSONObject(i).getString("ParentCallSid");

		/*
		 * This will be {} for the calls made by Twilio internally
		 * before calling the "To" number
		 */
		if (callSid.equals("{}"))
		    continue;

		// Retrieves recorded details for each call
		JSONObject recordings = getRecordings(client, callSid);

		// Build JSON with call and recording details for each call
		callWithRecordings.put("call", array.getJSONObject(i));
		callWithRecordings.put("recording", recordings);
		logs.put(callWithRecordings);

		System.out.println("Call Details: " + callWithRecordings);
	    }

	    System.out.println("Twilio call logs : " + logs);
	    return logs;
	}
	catch (JSONException e)
	{
	    return logs;
	}

    }

    /**
     * Retrieves call logs from Twilio based on the given configured
     * {@link TwilioRestClient}
     * 
     * @param client
     *            {@link TwilioRestClient} configured with account SID and
     *            Authentication token
     * @param to
     *            Number to which calls are made
     * @return {@link JSONArray} of call logs
     * @throws Exception
     */
    private static JSONArray getCallLogs(TwilioRestClient client, String to) throws Exception
    {
	// parameters required to retrieve logs
	Map<String, String> params = new HashMap<String, String>();
	params.put("To", to);

	// request the client to retrieve call logs
	TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + client.getAccountSid()
		+ "/Calls", "GET", params);

	/*
	 * If error occurs, throw exception based on its status else return call
	 * logs
	 */
	if (response.isError())
	    throwProperException(response);

	JSONArray logs = new JSONArray();
	try
	{
	    JSONObject calls = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
		    .getJSONObject("Calls");

	    System.out.println("Calls in twilio logs " + calls);

	    // If no calls, return empty array
	    if (Integer.parseInt(calls.getString("total")) == 0)
		return logs;

	    logs = calls.getJSONArray("Call");
	    return logs;
	}
	catch (JSONException e)
	{
	    return logs;
	}
    }

    /**
     * Retrieves recordings from Twilio based on the given configured
     * {@link TwilioRestClient}
     * 
     * @param client
     *            {@link TwilioRestClient} configured with account SID and
     *            Authentication token
     * @param callSid
     *            SID of the call
     * @return {@link JSONObject} with the recorded details for call
     * @throws Exception
     */
    private static JSONObject getRecordings(TwilioRestClient client, String callSid) throws Exception
    {
	// request the client to retrieve recordings
	TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + client.getAccountSid()
		+ "/Calls/" + callSid + "/Recordings", "GET", null);

	System.out.println("Twilio recordings: " + response.getResponseText());

	/*
	 * If error occurs, throw exception based on its status else return
	 * recordings
	 */
	if (response.isError())
	    throwProperException(response);

	return XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse").getJSONObject("Recordings");
    }

    /**
     * Retrieves call logs from Agile user Twilio account based on his Twilio
     * account SID
     * 
     * @param widget
     *            {@link Widget} to retrieve account SID
     * @return {@link JSONArray} of calls
     * @throws Exception
     */
    public static JSONArray getCallLogs(Widget widget, String to) throws Exception
    {
	// Get Twilio client configured with account SID and authToken
	TwilioRestClient client = getTwilioClient(widget);

	TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + client.getAccountSid()
		+ "/Calls", "GET", null);

	/*
	 * If error occurs, throw exception based on its status else build call
	 * logs and return them
	 */
	if (response.isError())
	    throwProperException(response);

	System.out.println("Twilio calls : " + response.getResponseText());
	JSONArray logs = new JSONArray();
	try
	{
	    JSONArray array = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
		    .getJSONObject("Calls").getJSONArray("Call");

	    /*
	     * Check whether to number is available and return only those calls
	     * which matches with the given "to" number
	     */
	    for (int i = 0; i < array.length(); i++)
		if (array.getJSONObject(i).getString("To").contains(to))
		    logs.put(array.getJSONObject(i));

	    System.out.println("Twilio call logs : " + logs);
	    return logs;
	}
	catch (JSONException e)
	{
	    return logs;
	}

    }

    /**
     * Retrieves incoming number in the Twilio account associated with the given
     * account SID
     * 
     * @param widget
     *            {@link Widget} to retrieve account SID
     * @return {@link JSONObject} with the incoming number
     * @throws Exception
     */
    public static JSONObject getIncomingNumber(Widget widget) throws Exception
    {
	// Get Twilio client configured with account SID and authToken
	TwilioRestClient client = getTwilioClient(widget);

	TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + client.getAccountSid()
		+ "/IncomingPhoneNumbers", "GET", null);

	System.out.println(response.getResponseText());

	/*
	 * If error occurs, throw exception based on its status else return
	 * outgoing numbers
	 */
	if (response.isError())
	    throwProperException(response);

	JSONObject result = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
		.getJSONObject("IncomingPhoneNumbers");

	/*
	 * Response may be array or single object, check and return the first
	 * number if it is an array
	 */
	if (result.get("IncomingPhoneNumber") instanceof JSONArray)
	    return result.getJSONArray("IncomingPhoneNumber").getJSONObject(0);
	return result.getJSONObject("IncomingPhoneNumber");

    }

    /**
     * Checks Twilio response and throws proper exception
     * 
     * @param response
     *            {@link TwilioRestResponse}
     * @throws Exception
     */
    public static void throwProperException(TwilioRestResponse response) throws Exception
    {
	// If account doesn't have balance this error is shown
	if (response.getHttpStatus() == 401 && response.getResponseText().contains("20006"))
	    throw new Exception("Your Twilio account needs a recharge. Please add credit and refresh.");

	// Proper message is formed out of the given error
	if (response.getResponseText().startsWith("<?xml "))
	{
	    try
	    {
		JSONObject json = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
			.getJSONObject("RestException");
		System.out.println(json);

		throw new Exception(json.getString("Code") + " - " + json.getString("Message"));
	    }
	    catch (JSONException e)
	    {
	    }
	}

	throw new Exception("Error in Twilio : " + response.getHttpStatus() + "\n" + response.getResponseText());
    }

    /**
     * Checks the given Account SID and Auth Token is valid or not
     * 
     * @author Bhasuri
     * 
     **/
    public static boolean checkCredentials(String account_sid, String auth_token) throws JSONException, Exception
    {

	TwilioRestClient client = new TwilioRestClient(account_sid, auth_token, "");

	boolean hasError = false;

	TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + account_sid, "GET", null);

	JSONObject responseJSON = new JSONObject(response);

	hasError = (boolean) responseJSON.get("error");

	if (hasError)
	    return false;
	else
	{
	    return true;
	}
    }

    /**
     * Returns Account SID from a widget
     * 
     * @author Bhasuri
     **/
    public static String getAccountSID(Widget widget)
    {

	String account_sid = null;

	try
	{
	    String prefs = widget.prefs;

	    JSONObject prefsJSON = new JSONObject(prefs);

	    account_sid = prefsJSON.getString("account_sid");

	}
	catch (Exception e)
	{

	    System.out.println("Inside getAccountSID");
	    e.printStackTrace();
	}

	return account_sid;
    }

    /**
     * Returns Account SID from a widget
     * 
     * @author Bhasuri
     **/
    public static String getAuthToken(Widget widget)
    {

	String auth_token = null;

	try
	{
	    String prefs = widget.prefs;

	    JSONObject prefsJSON = new JSONObject(prefs);

	    auth_token = prefsJSON.getString("auth_token");

	}
	catch (Exception e)
	{
	    System.out.println("Inside getAuthToken");
	    e.printStackTrace();
	}

	return auth_token;
    }

    /****************************************
     * Following methods for Twilio IO
     ****************************************/

    public static Object getIncomingNumberTwilioIO(TwilioRestClient client) throws Exception
    {
	TwilioRestResponse response = client.request(
		"/" + TwilioUtil.APIVERSION + "/Accounts/" + client.getAccountSid() + "/IncomingPhoneNumbers", "GET",
		null);

	System.out.println(response.getResponseText());

	/*
	 * If error occurs, throw exception based on its status else return
	 * outgoing numbers
	 */
	if (response.isError())
	    TwilioUtil.throwProperException(response);

	JSONObject result = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
		.getJSONObject("IncomingPhoneNumbers");

	System.out.println("response: " + XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse"));
	System.out.println("incoming number result: " + result);

	System.out.println(result.getString("total"));
	// If no numbers, return empty object
	if (Integer.parseInt(result.getString("total")) == 0)
	    return new JSONArray();

	/*
	 * Response may be array or single object, check and return the first
	 * number if it is an array
	 */
	if (result.get("IncomingPhoneNumber") instanceof JSONObject)
	    return new JSONArray().put(result.getJSONObject("IncomingPhoneNumber"));

	return result.getJSONArray("IncomingPhoneNumber");
    }

    public static Object getOutgoingNumberTwilioIO(TwilioRestClient client) throws Exception
    {
	TwilioRestResponse response = client
		.request("/" + TwilioUtil.APIVERSION + "/Accounts/" + client.getAccountSid() + "/OutgoingCallerIds",
			"GET", null);

	System.out.println("Twilio outgoing No: " + response.getResponseText());

	/*
	 * If error occurs, throw exception based on its status else return
	 * outgoing numbers
	 */
	if (response.isError())
	    TwilioUtil.throwProperException(response);

	JSONObject outgoingCallerIds = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
		.getJSONObject("OutgoingCallerIds");

	System.out.println("OutgoingCallerID's: " + outgoingCallerIds);

	// If no numbers, return empty object
	if (Integer.parseInt(outgoingCallerIds.getString("total")) == 0)
	    return new JSONArray();

	/*
	 * Response may be array or single object, check and return the first
	 * number if it is an array
	 */
	if (outgoingCallerIds.get("OutgoingCallerId") instanceof JSONObject)
	    return new JSONArray().put(outgoingCallerIds.getJSONObject("OutgoingCallerId"));

	return outgoingCallerIds.getJSONArray("OutgoingCallerId");
    }

    public static String createAppSidTwilioIO(String accountSID, String authToken, String numberSid) throws Exception
    {
	System.out.println("In createAppSidTwilioIO");

	// Get Twilio client configured with account SID and authToken
	TwilioRestClient client = new TwilioRestClient(accountSID, authToken, null);
	System.out.println(client.getAccountSid());

	// parameters required to create application
	Map<String, String> params = new HashMap<String, String>();
	params.put("FriendlyName", "Agile CRM Twilio Saga");
	// params.put("VoiceUrl",
	// "http://1-dot-onlyvoiceservlet.appspot.com/voice");

	// params.put("VoiceUrl",
	// "http://1-dot-bothservlet.appspot.com/backend/twilioiovoice");
	params.put("VoiceUrl", "https://" + NamespaceManager.get()
		+ ".agilecrm.com/twilioiovoice");
	params.put("VoiceMethod", "GET");
	// params.put("StatusCallback",+
	// "http://1-dot-bothservlet.appspot.com/backend/twilioiostatuscallback");
	params.put("StatusCallback", "https://" + NamespaceManager.get()
		+ ".agilecrm.com/twilioiostatuscallback?sessionmngrid="
		+ SessionManager.get().getDomainId());
	params.put("StatusCallbackMethod", "GET");

	// Make a POST request to create application
	TwilioRestResponse response = client.request("/2010-04-01/Accounts/" + client.getAccountSid()
		+ "/Applications.json", "POST", params);

	System.out.println("Twilio app sid : " + response.getResponseText());

	/*
	 * If error occurs, throw exception based on its status else return
	 * application SID
	 */
	if (response.isError())
	    throwProperException(response);

	String appSid = new JSONObject(response.getResponseText()).getString("sid");

	System.out.println("appSid" + appSid);

	/* ****** Add application to twilio number ***** */
	if (!numberSid.equalsIgnoreCase("None"))
	{
	    // parameters required to create application
	    params = new HashMap<String, String>();
	    params.put("VoiceApplicationSid", appSid);

	    System.out.println("params" + params.toString());
	    // Make a POST request to add application to twilio number
	    // /IncomingPhoneNumbers/PNa96612e977cc4a8c8b6cb0c14dd43e88
	    response = client.request("/2010-04-01/Accounts/" + client.getAccountSid() + "/IncomingPhoneNumbers/"
		    + numberSid, "POST", params);

	    System.out.println("Twilio app added to number : " + response.getResponseText());

	    /*
	     * If error occurs, throw exception based on its status else return
	     * application SID
	     */
	    if (response.isError())
		throwProperException(response);
	}
	return appSid;
    }
}
