package com.thirdparty.plivo;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.util.SMSGatewayUtil;
import com.agilecrm.widgets.Widget;
import com.google.appengine.api.NamespaceManager;
import com.plivo.helper.api.client.RestAPI;
import com.plivo.helper.api.response.message.MessageResponse;
import com.plivo.helper.api.response.number.Number;
import com.plivo.helper.api.response.number.NumberSearchFactory;
import com.plivo.helper.exception.PlivoException;

public class PlivoSMSUtil
{
	/**
	 * PLIVO Account Authentication ID
	 */
	public static String PLIVO_ACCOUNT_ID = "account_id";

	/**
	 * PLIVO Account Authentication Token
	 */
	public static String PLIVO_AUTH_TOKEN = "auth_token";

	/**
	 * PLIVO Version
	 */
	public static String PLIVO_VERSION = "v1";

	/**
	 * Returns list of incoming numbers
	 * 
	 * @param widget
	 * @return
	 */
	public static List<String> incomingNumbers(Widget widget)
	{
		if (widget == null)
			new ArrayList<String>();

		try
		{
			String prefs = widget.prefs;
			JSONObject prefsJSON = new JSONObject(prefs);
			PLIVO_ACCOUNT_ID = prefsJSON.getString("account_id");
			PLIVO_AUTH_TOKEN = prefsJSON.getString("auth_token");

			if (PLIVO_ACCOUNT_ID == null || PLIVO_AUTH_TOKEN == null)
				new ArrayList<String>();

			return verifiedPlivoNumbers(PLIVO_ACCOUNT_ID, PLIVO_AUTH_TOKEN);
		}
		catch (PlivoException e)
		{
			System.out.println("Inside getVerifiedPLIVONumbers");
		}
		catch (Exception e)
		{

			System.out.println("Inside getVerifiedPLIVONumbers");
		}
		return new ArrayList<String>();
	}

	/**
	 * 
	 * @param authId
	 * @param auth_token
	 * @return
	 * @throws PlivoException
	 */
	public static List<String> verifiedPlivoNumbers(String authId, String auth_token) throws PlivoException
	{

		NumberSearchFactory numbers = new NumberSearchFactory();
		RestAPI restAPI = new RestAPI(authId, auth_token, PLIVO_VERSION);
		List<Number> numberList = null;
		List<String> numberStringList = new ArrayList<String>();

		try
		{
			numbers = restAPI.getNumbers();
			numberList = numbers.numberList;
			Iterator<Number> numberIterator = numberList.iterator();
			while (numberIterator.hasNext())
				numberStringList.add("+" + numberIterator.next().number.toString());

		}
		catch (PlivoException plivoException)
		{
			System.out.println("Exception in plivo while getting verified numbers.." + plivoException.getMessage());

			return new ArrayList<String>();
		}
		catch (Exception e)
		{
			System.out.println("Exception in plivo while getting verified numbers.." + e.getMessage());
			return new ArrayList<String>();
		}

		return numberStringList;
	}

	public static void sendSMS(String SMSGatewayType, String from, String to, String message, String account_id,
			String auth_token)
	{
		String domain = NamespaceManager.get();

		SMSGatewayUtil
				.sendSMS(SMSGatewayType, domain, PLIVO_VERSION, from, to, message, account_id, auth_token, "", "");

	}

	public static String sendSMS(String account_sid, String auth_token, String smsEndpoint, String version,
			String fromNumber, String toNumber, String message, String metadata)
	{
		RestAPI api = new RestAPI(account_sid, auth_token, PLIVO_VERSION);

		LinkedHashMap<String, String> parameters = new LinkedHashMap<String, String>();
		parameters.put("src", fromNumber);
		parameters.put("dst", toNumber);
		parameters.put("text", message);
		MessageResponse msgResponse = null;
		try
		{
			msgResponse = api.sendMessage(parameters);
			System.out.println("The message has been sent to " + toNumber + " from " + fromNumber);

		}
		catch (PlivoException e)
		{
			System.out.println("The message has failed which is sent to " + toNumber + " from " + fromNumber
					+ "account details: " + account_sid + " and account token: " + auth_token);
			System.out.println(e.getMessage());
		}
		catch (Exception e)
		{
			System.out.println("The message has failed which is sent to(unknown exception) " + toNumber + " from "
					+ fromNumber + "account details: " + account_sid + " and account token: " + auth_token);
		}
		return msgResponse.toString();

	}

	/**
	 * Returns SMS logs for plivo
	 * 
	 * @param widget
	 * @return
	 */
	public static JSONObject currentSMSLogs(Widget widget)
	{

		// TODO Auto-generated method stub
		JSONObject logJSON = new JSONObject();
		try
		{
			logJSON.put("Stats-Type", "PLIVO");
		}
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		//
		return logJSON;

	}
}