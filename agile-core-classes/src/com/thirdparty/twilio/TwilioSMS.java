package com.thirdparty.twilio;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.account.util.SMSGatewayUtil;
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

public class TwilioSMS
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

	public TwilioSMS()
	{

	}

	/**
	 * Returns a list of Twilio from numbers
	 */
	public static List<String> verifiedTwilioNumbers(String account_SID, String auth_token)
	{

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
		}

		return verifiredTwilioNumbers;

	}

	/**
	 * Adds sms to the queue with the body parameters
	 * 
	 * @param account_sid
	 * @param auth_token
	 * @param smsEndpoint
	 * @param version
	 * @param fromNumber
	 * @param toNumber
	 * @param message
	 * @param metadata
	 * @return
	 * @throws TwilioRestException
	 */
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

	/**
	 * Sets gateway to the request
	 * 
	 * @param SMSGatewayType
	 * @param from
	 * @param to
	 * @param message
	 * @param account_sid
	 * @param auth_token
	 */
	public static void sendSMS(String SMSGatewayType, String from, String to, String message, String account_sid,
			String auth_token)
	{
		String domain = NamespaceManager.get();

		SMSGatewayUtil.sendSMS(SMSGatewayType, domain, TWILIO_VERSION, from, to, message, account_sid, auth_token,
				TWILIO_ENDPOINT, "");

	}
}
