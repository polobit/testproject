package com.thirdparty.twilio;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.account.util.SMSGatewayUtil;
import com.agilecrm.widgets.Widget;
import com.google.appengine.api.NamespaceManager;
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.thirdparty.twilio.sdk.TwilioRestException;
import com.thirdparty.twilio.sdk.TwilioRestResponse;

/**
 * <code>TwilioSMS</code> is where the message sending is initiated from. It is
 * like a Util class for only Twilio SMS
 * 
 * @author Bhasuri
 * 
 */

public class TwilioSMSUtil
{

	/**
	 * Base url to make URL request
	 */
	public static final String TWILIO_ENDPOINT = "https://api.twilio.com";

	/**
	 * Twilio Account Version
	 */
	public static final String TWILIO_VERSION = "2010-04-01";

	/**
	 * Twilio Account
	 */
	public static final String TWILIO_ACCOUNTS = "Accounts";

	/**
	 * Twilio Account Response
	 */
	public static final String TWILIO_RESPONSE = "TwilioResponse";

	/**
	 * Twilio Phone Number
	 */
	public static final String TWILIO_PHONE_NUMBER = "PhoneNumber";

	/**
	 * Twilio Message
	 */
	public static final String TWILIO_MESSAGES = "Messages";

	/**
	 * Twilio Account Incoming phone number
	 */
	public static final String TWILIO_INCOMING_NUMBERS = "IncomingPhoneNumbers";

	/**
	 * Twilio Account SID
	 */
	public static String TWILIO_ACCOUNT_SID = "account_sid";

	/**
	 * Twilio Account Authentication Token
	 */
	public static String TWILIO_AUTH_TOKEN = "auth_token";

	/**
	 * List of Numbers from which the SMS can be sent.
	 */
	public static List<String> TWILIO_INCOMING_LIST;

	public TwilioSMSUtil()
	{

	}

	/**
	 * Returns a list of Twilio from numbers
	 */
	public static List<String> verifiedTwilioNumbers(String account_SID, String auth_token)
	{

		if (account_SID == null || auth_token == null)
			return null;
		TwilioRestClient client = new TwilioRestClient(account_SID, auth_token, TWILIO_ENDPOINT);
		List<String> verifiredTwilioNumbers = new ArrayList<String>();
		try
		{
			TwilioRestResponse response = client.request("/" + TWILIO_VERSION + "/" + TWILIO_ACCOUNTS + "/"
					+ account_SID + "/" + TWILIO_INCOMING_NUMBERS, "GET", null);

			/*
			 * If error occurs, return null
			 */
			if (response.isError())
				return null;

			JSONObject result = XML.toJSONObject(response.getResponseText()).getJSONObject(TWILIO_RESPONSE)
					.getJSONObject(TWILIO_INCOMING_NUMBERS);

			JSONArray incomingNumberArray = result.getJSONArray("IncomingPhoneNumber");

			int incomingNumberCount = result.getJSONArray("IncomingPhoneNumber").length();

			for (int i = 0; i < incomingNumberCount; i++)
				verifiredTwilioNumbers.add(incomingNumberArray.getJSONObject(i).get("PhoneNumber").toString());
		}
		catch (Exception e)
		{
			System.out.println("Exception in TwilioSMS");
			e.printStackTrace();
		}

		return verifiredTwilioNumbers;

	}

	/**
	 * Returns a list of Twilio from numbers
	 */
	public static JSONArray getTwilioLogs(String account_SID, String auth_token)
	{

		JSONArray incomingNumberArray = null;

		JSONArray logsArray = null;
		if (account_SID == null || auth_token == null)
			return null;
		TwilioRestClient client = new TwilioRestClient(account_SID, auth_token, TWILIO_ENDPOINT);
		List<String> verifiredTwilioNumbers = new ArrayList<String>();
		try
		{
			TwilioRestResponse response = client.request("/" + TWILIO_VERSION + "/" + TWILIO_ACCOUNTS + "/"
					+ account_SID + "/" + TWILIO_MESSAGES, "GET", null);

			/*
			 * If error occurs, return null
			 */
			if (response.isError())
				return null;

			JSONArray result = XML.toJSONObject(response.getResponseText()).getJSONObject(TWILIO_RESPONSE)
					.getJSONObject("Messages").getJSONArray("Message");
			System.out.println(result);
			// incomingNumberArray = result.getJSONArray("IncomingPhoneNumber");

			// int incomingNumberCount =
			// result.getJSONArray("IncomingPhoneNumber").length();

			// or (int i = 0; i < incomingNumberCount; i++)
			// verifiredTwilioNumbers.add(incomingNumberArray.getJSONObject(i).get("PhoneNumber").toString());

			logsArray = new JSONArray();
			for (int i = 0; i < result.length(); i++)
			{
				JSONObject tempLog = new JSONObject();

				tempLog.put("DateSent", result.getJSONObject(i).get("DateSent"));
				tempLog.put("To", result.getJSONObject(i).get("To"));
				tempLog.put("From", result.getJSONObject(i).get("From"));
				tempLog.put("Status", result.getJSONObject(i).get("Status"));
				tempLog.put("Price", result.getJSONObject(i).get("Price"));
				tempLog.put("ErrorCode", result.getJSONObject(i).get("ErrorCode"));
				tempLog.put("ErrorMessage", result.getJSONObject(i).get("ErrorMessage"));

				logsArray.put(tempLog);
			}

			System.out.println(logsArray);
			System.out.println(logsArray);
		}

		catch (Exception e)
		{
			System.out.println("Exception in TwilioSMS");
			e.printStackTrace();
		}

		return logsArray;

	}

	public static String sendSMS(String account_sid, String auth_token, String smsEndpoint, String version,
			String fromNumber, String toNumber, String message, String metadata) throws TwilioRestException
	{

		String response = null;

		TwilioRestClient client = new TwilioRestClient(account_sid, auth_token, "");

		Map<String, String> params = new HashMap<String, String>();
		params.put("To", toNumber);
		params.put("From", fromNumber);
		params.put("Body", message);

		TwilioRestResponse twilioResponse = client.request("/" + version + "/" + TWILIO_ACCOUNTS + "/" + account_sid
				+ "/" + TWILIO_MESSAGES, "POST", params);

		response = twilioResponse.getResponseText();

		System.out.println("Twilio verify: " + response);

		return response;

	}

	public static void sendSMS(String SMSGatewayType, String from, String to, String message, String account_sid,
			String auth_token)
	{
		String domain = NamespaceManager.get();

		SMSGatewayUtil.sendSMS(SMSGatewayType, domain, TWILIO_VERSION, from, to, message, account_sid, auth_token,
				TWILIO_ENDPOINT, "");

	}

	public static List<String> currentTwilioNumbers()
	{
		Widget widget = SMSGatewayUtil.getSMSGatewayWidget();

		if (widget == null)
			return null;

		try
		{
			String prefs = widget.prefs;
			JSONObject prefsJSON = new JSONObject(prefs);
			TWILIO_ACCOUNT_SID = prefsJSON.getString("account_sid");
			TWILIO_AUTH_TOKEN = prefsJSON.getString("auth_token");

		}
		catch (Exception e)
		{

			System.out.println("Inside getVerifiedTwilioNumbers");
			e.printStackTrace();
		}

		if (TWILIO_ACCOUNT_SID == null || TWILIO_AUTH_TOKEN == null)
			return null;

		return TwilioSMSUtil.verifiedTwilioNumbers(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
	}

	public static JSONArray currentTwilioLogs()
	{
		Widget widget = SMSGatewayUtil.getSMSGatewayWidget();

		if (widget == null)
			return null;

		try
		{
			String prefs = widget.prefs;
			JSONObject prefsJSON = new JSONObject(prefs);
			TWILIO_ACCOUNT_SID = prefsJSON.getString("account_sid");
			TWILIO_AUTH_TOKEN = prefsJSON.getString("auth_token");

		}
		catch (Exception e)
		{

			System.out.println("Inside getVerifiedTwilioNumbers");
			e.printStackTrace();
		}

		if (TWILIO_ACCOUNT_SID == null || TWILIO_AUTH_TOKEN == null)
			return null;

		return TwilioSMSUtil.getTwilioLogs(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
	}
}
