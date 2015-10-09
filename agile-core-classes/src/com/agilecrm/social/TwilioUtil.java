package com.agilecrm.social;

import java.net.URI;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.Widget;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.thirdparty.twilio.sdk.TwilioRestResponse;
import com.twilio.sdk.client.TwilioCapability;
import com.twilio.sdk.client.TwilioCapability.DomainException;
import com.twilio.sdk.verbs.Play;
import com.twilio.sdk.verbs.TwiMLException;
import com.twilio.sdk.verbs.TwiMLResponse;

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
		if (response.isError()){
			throwProperException(response);
		}

		JSONObject outgoingCallerIds = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
				.getJSONObject("OutgoingCallerIds");

		System.out.println("OutgoingCallerID's: " + outgoingCallerIds);

		// If no numbers, return empty object
		
		  if (outgoingCallerIds.has("total") && Integer.parseInt(outgoingCallerIds.getString("total")) == 0){
			  return new JSONArray();
		  }
		 
		  if(!outgoingCallerIds.has("OutgoingCallerId")){
				return new JSONArray();	
		  }

		/*
		 * Response may be array or single object, check and return the first
		 * number if it is an array
		 */
		if (outgoingCallerIds.get("OutgoingCallerId") instanceof JSONObject){
			return new JSONArray().put(outgoingCallerIds.getJSONObject("OutgoingCallerId"));
		}

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

		// Parameters to be sent in the verification process
		Map<String, String> params = new HashMap<String, String>();
		params.put("PhoneNumber", from);
		params.put("StatusCallback", "https://" + NamespaceManager.get() + ".agilecrm.com/verification?user_id="
				+ SessionManager.get().getDomainId() + "&verified_number=" + from);

		// Make a post request to verify number
		TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + client.getAccountSid()
				+ "/OutgoingCallerIds", "POST", params);

		System.out.println("Twilio verify: " + response.getResponseText());

		/*
		 * If error occurs, throw exception based on its status else return
		 * response from Twilio
		 */
		if (response.isError()){
			throwProperException(response);
		}

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
		if (response.isError()){
			throwProperException(response);
		}

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
	public static JSONArray getCallLogsWithRecordings(TwilioRestClient client, String to, String page, String pageToken)
			throws Exception
	{
		JSONArray logs = new JSONArray();

		try
		{
			// retrieve call logs from Twilio
			JSONArray array = getCallLogs(client, to, page, pageToken);
			String callSid;
			String url1 = array.getString(array.length() - 1);
			List<NameValuePair> params1 = URLEncodedUtils.parse(new URI(url1), "UTF-8");
			JSONObject nextLogsRequest1 = new JSONObject();

			for (NameValuePair param1 : params1)
			{
				if (param1.getName().equalsIgnoreCase("Page")){
					nextLogsRequest1.put("page", param1.getValue().toString());
				}
				if (param1.getName().equalsIgnoreCase("PageToken")){
					nextLogsRequest1.put("pageToken", param1.getValue().toString());
				}
			}

			logs.put(nextLogsRequest1);

			System.out.println("logs: " + logs);

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
				if (callSid.equals("{}")){
					continue;
				}

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
			System.out.println(e.getMessage());
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
	private static JSONArray getCallLogs(TwilioRestClient client, String to, String page, String pageToken)
			throws Exception
	{
		// parameters required to retrieve logs
		Map<String, String> params = new HashMap<String, String>();
		params.put("To", to);
		params.put("PageSize", "10");

		if (page != null && pageToken != null){
			params.put("Page", page);
			params.put("PageToken", pageToken);
		}

		// request the client to retrieve call logs
		TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + client.getAccountSid()
				+ "/Calls", "GET", params);

		/*
		 * If error occurs, throw exception based on its status else return call
		 * logs
		 */
		if (response.isError()){
			throwProperException(response);
		}

		JSONArray logs = new JSONArray();
		try
		{
			JSONObject calls = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
					.getJSONObject("Calls");

			System.out.println("Calls in twilio logs " + calls);

			// When single call log, need to make array from object
			if (calls.get("Call") instanceof JSONObject){
				logs = new JSONArray("[" + calls.getJSONObject("Call").toString() + "]");
			}else{
				// When multiple call logs, get array
				logs = calls.getJSONArray("Call");
			}
			// To fetch next page of call logs
			logs.put(calls.getString("nextpageuri"));

			System.out.println("In getCallLogs logs: " + logs);
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
		// Request the client to retrieve recordings
		TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + client.getAccountSid()
				+ "/Calls/" + callSid + "/Recordings", "GET", null);

		System.out.println("Twilio recordings: " + response.getResponseText());

		/*
		 * If error occurs, throw exception based on its status else return
		 * recordings
		 */
		if (response.isError()){
			throwProperException(response);
		}

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
		if (response.isError()){
			throwProperException(response);
		}

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
			for (int i = 0; i < array.length(); i++){
				if (array.getJSONObject(i).getString("To").contains(to)){
					logs.put(array.getJSONObject(i));
				}
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
		if (response.isError()){
			throwProperException(response);
		}

		JSONObject result = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
				.getJSONObject("IncomingPhoneNumbers");

		/*
		 * Response may be array or single object, check and return the first
		 * number if it is an array
		 */
		if (result.get("IncomingPhoneNumber") instanceof JSONArray){
			return result.getJSONArray("IncomingPhoneNumber").getJSONObject(0);
		}
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
		if (response.getHttpStatus() == 401 && response.getResponseText().contains("20006")){
			throw new Exception("Your Twilio account needs a recharge. Please add credit and refresh.");
		}

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
				e.printStackTrace();
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

		if (hasError){
			return false;
		}else{
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

		/*
		 * If error occurs, throw exception based on its status else return
		 * outgoing numbers
		 */
		if (response.isError())
			TwilioUtil.throwProperException(response);
		JSONObject result = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
				.getJSONObject("IncomingPhoneNumbers");

		// If no numbers, return empty object
		 if (result.has("total") && Integer.parseInt(result.getString("total")) == 0){
			 return new JSONArray();
		 }
		 
		 if(!result.has("IncomingPhoneNumber")){
			 return new JSONArray();
		 }
		 
		/*
		 * Response may be array or single object, check and return the first
		 * number if it is an array
		 */
		if (result.get("IncomingPhoneNumber") instanceof JSONObject){
			return new JSONArray().put(result.getJSONObject("IncomingPhoneNumber"));
		}
		
		return result.getJSONArray("IncomingPhoneNumber");
	}

	/**
	 * Gets the outgoing twilio number.
	 * 
	 * @param client
	 * @return
	 * @throws Exception
	 */
	public static Object getOutgoingNumberTwilioIO(TwilioRestClient client) throws Exception
	{
		TwilioRestResponse response = client
				.request("/" + TwilioUtil.APIVERSION + "/Accounts/" + client.getAccountSid() + "/OutgoingCallerIds",
						"GET", null);

		/*
		 * If error occurs, throw exception based on its status else return
		 * outgoing numbers
		 */
		if (response.isError()){
			TwilioUtil.throwProperException(response);
		}
		
		JSONObject outgoingCallerIds = XML.toJSONObject(response.getResponseText()).getJSONObject("TwilioResponse")
				.getJSONObject("OutgoingCallerIds");
		
		// If no numbers, return empty object
		if (outgoingCallerIds.has("total") && Integer.parseInt(outgoingCallerIds.getString("total")) == 0){
			return new JSONArray();
		}
				
		if(!outgoingCallerIds.has("OutgoingCallerId")){
			return new JSONArray();		
		}

		/*
		 * Response may be array or single object, check and return the first
		 * number if it is an array
		 */
		if (outgoingCallerIds.get("OutgoingCallerId") instanceof JSONObject){
			return new JSONArray().put(outgoingCallerIds.getJSONObject("OutgoingCallerId"));
		}

		return outgoingCallerIds.getJSONArray("OutgoingCallerId");
	}

	/**
	 * Creates the app sid twilio.
	 * 
	 * @param accountSID
	 * @param authToken
	 * @param numberSid
	 * @param record
	 * @param twimletUrl
	 * @return
	 * @throws Exception
	 */
	public static String createAppSidTwilioIO(String accountSID, String authToken, String numberSid, String record,
			String twimletUrl) throws Exception
	{
		// Get current logged in agile user
		Long agileUserID = AgileUser.getCurrentAgileUser().id;
		// Encode twimlet url
		String twimletUrlToSend = URLEncoder.encode(twimletUrl, "UTF-8");
		// Get Twilio client configured with account SID and authToken
		TwilioRestClient client = new TwilioRestClient(accountSID, authToken, null);

		// parameters required to create application
		Map<String, String> params = new HashMap<String, String>();
		params.put("FriendlyName", "Agile CRM Twilio Saga");

		// For Local Host
		/*
		 * params.put("VoiceUrl",
		 * "http://1-dot-twiliovoicerecord.appspot.com/voice?record=" + record +
		 * "&agileuserid=" + agileUserID + "&twimleturl=" + twimletUrlToSend);
		 */

		// For Main
		params.put("VoiceUrl", "https://" + NamespaceManager.get() + ".agilecrm.com/twilioiovoice?record=" + record
				+ "&agileuserid=" + agileUserID + "&twimleturl=" + twimletUrlToSend);

		// For Beta
		/*
		 * params.put("VoiceUrl", "https://" + NamespaceManager.get() +
		 * "-dot-sandbox-dot-agilecrmbeta.appspot.com/twilioiovoice?record=" +
		 * record + "&agileuserid=" + agileUserID+ "&twimleturl=" +
		 * twimletUrlToSend);
		 */

		// For Version
		/*
		 * params.put("VoiceUrl", "https://" + NamespaceManager.get() +
		 * "-dot-5-2-dot-agile-crm-cloud.appspot.com/twilioiovoice?record=" +
		 * record + "&agileuserid=" + agileUserID + "&twimleturl=" +
		 * twimletUrlToSend);
		 */

		params.put("VoiceMethod", "GET");

		// params.put("StatusCallback", "https://" + NamespaceManager.get()
		// + ".agilecrm.com/twilioiostatuscallback?sessionmngrid=" +
		// SessionManager.get().getDomainId());
		// params.put("StatusCallbackMethod", "GET");

		// Make a POST request to create application
		TwilioRestResponse response = client.request("/2010-04-01/Accounts/" + client.getAccountSid()
				+ "/Applications.json", "POST", params);

		/*
		 * If error occurs, throw exception based on its status else return
		 * application SID
		 */
		if (response.isError()){
			throwProperException(response);
		}

		String appSid = new JSONObject(response.getResponseText()).getString("sid");

		/* ****** Add application to twilio number ***** */
		if (!numberSid.equalsIgnoreCase("None"))
		{
			// parameters required to create application
			params = new HashMap<String, String>();
			params.put("VoiceApplicationSid", appSid);

			// Make a POST request to add application to twilio number
			// /IncomingPhoneNumbers/PNa96612e977cc4a8c8b6cb0c14dd43e88
			response = client.request("/2010-04-01/Accounts/" + client.getAccountSid() + "/IncomingPhoneNumbers/"
					+ numberSid, "POST", params);

			/*
			 * If error occurs, throw exception based on its status else return
			 * application SID
			 */
			if (response.isError()){
				throwProperException(response);
			}
		}
		return appSid;
	}

	/**
	 * Gets the last call log status.
	 * 
	 * @author Purushotham
	 * @created 28-Nov-2014
	 * 
	 */
	public static JSONObject getLastCallLogStatus(String account_sid, String auth_token, String call_sid)
			throws JSONException, Exception
	{
		TwilioRestClient client = new TwilioRestClient(account_sid, auth_token, "");
		Map<String, String> params = new HashMap<String, String>();
		params.put("ParentCallSid", call_sid);
		TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + account_sid + "/Calls.json",
				"GET", params);
		JSONObject responseJSON = new JSONObject(response);
		return responseJSON;
	}

	/**
	 * Gets the last child log status.
	 * 
	 * @author Purushotham
	 * @created 28-Nov-2014
	 * 
	 */
	public static JSONObject getLastChildCallLogStatus(String account_sid, String auth_token, String call_sid)
			throws JSONException, Exception
	{
		TwilioRestClient client = new TwilioRestClient(account_sid, auth_token, "");
		TwilioRestResponse response = client.request("/" + APIVERSION + "/Accounts/" + account_sid + "/Calls/"
				+ call_sid + ".json", "GET", null);
		JSONObject responseJSON = new JSONObject(response);
		return responseJSON;
	}

	/**
	 * Send the audio file to twilio.
	 * 
	 * @author Purushotham
	 * @created 04-Dec-2014
	 * 
	 */
	public static String sendAudioFileToTwilio(String fileUrl)
	{
		// Create a TwiML response and add our friendly message.
		TwiMLResponse twiml = new TwiMLResponse();
		String filePath = "https://s3.amazonaws.com/agilecrm/audiofiles/" + NamespaceManager.get() + "/" + fileUrl;
		// Play an MP3 for incoming callers.
		Play play = new Play(filePath);
		try{
			twiml.append(play);
		}catch (TwiMLException e){
			e.printStackTrace();
		}
		return twiml.toXML();
	}

	/**
	 * Sends the voice mail.
	 * 
	 * @author Purushotham
	 * @created 10-Dec-2014
	 * 
	 */
	public static void sendVoiceMailRedirect(String account_sid, String auth_token, String call_sid, String fileSelected)
			throws JSONException, Exception
	{
		TwilioRestClient client = new TwilioRestClient(account_sid, auth_token, "");
		Map<String, String> params = new HashMap<String, String>();

		if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development){
			// For LOCAL
			params.put("Url", "http://demo.twilio.com/docs/voice.xml");
		}else{
			// For BETA
			// params.put("Url", "https://" + NamespaceManager.get() +
			// "-dot-sandbox-dot-agilecrmbeta.appspot.com/twiml?type=1&fid="+fileSelected);

			// For Version
			// params.put("Url", "https://" + NamespaceManager.get() +
			// "-dot-5-0-dot-agile-crm-cloud.appspot.com/twiml?type=1&fid="+fileSelected);

			// For LIVE
			params.put("Url", "https://" + NamespaceManager.get() + ".agilecrm.com/twiml?type=1&fid=" + fileSelected);
		}

		params.put("Method", "POST");
		// params.put("Status", "completed");
		client.request("/" + APIVERSION + "/Accounts/" + account_sid + "/Calls/" + call_sid + ".json", "POST", params);
		return;
	}

	/**
	 * Gets the call log with recording from twilio.
	 * 
	 * @param widget
	 * @param to
	 * @return
	 * @throws Exception
	 */
	public static JSONArray getCallLogsWithRecordingsFromTwilioIO(Widget widget, String to) throws Exception
	{
		JSONArray logs = new JSONArray();

		try
		{
			// Get New twilio call logs and recording
			// Fetch account SID from widget preferences
			String accountSid = widget.getProperty("twilio_acc_sid");

			// Fetch auth token from widget preferences
			String accAuthToken = widget.getProperty("twilio_auth_token");

			/*
			 * Build Twilio REST client with the account SID of the logged in
			 * person and agile authentication token
			 */
			TwilioRestClient newClient = new TwilioRestClient(accountSid, accAuthToken, null);
			logs = getCallLogsWithRecordings(newClient, to, null, null);

			System.out.println("TwilioIO call logs : " + logs);
			return logs;
		}
		catch (JSONException e)
		{
			return logs;
		}
	}

	/**
	 * Gets the call log from paging.
	 * 
	 * @param widget
	 * @param to
	 * @param page
	 * @param pageToken
	 * @return
	 * @throws Exception
	 */
	public static JSONArray getCallLogsByPage(Widget widget, String to, String page, String pageToken) throws Exception
	{
		JSONArray logs = new JSONArray();
		try
		{
			// Get New twilio call logs and recording
			// Fetch account SID from widget preferences
			String accountSid = widget.getProperty("twilio_acc_sid");

			// Fetch auth token from widget preferences
			String accAuthToken = widget.getProperty("twilio_auth_token");

			/*
			 * Build Twilio REST client with the account SID of the logged in
			 * person and agile authentication token
			 */
			TwilioRestClient newClient = new TwilioRestClient(accountSid, accAuthToken, null);
			logs = getCallLogsWithRecordings(newClient, to, page, pageToken);
			System.out.println("getCallLogsByPage call logs : " + logs);
			return logs;
		}
		catch (JSONException e)
		{
			return logs;
		}
	}
}