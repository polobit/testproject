package com.thirdparty.twilio;

import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
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
			return new ArrayList<String>();
		TwilioRestClient client = new TwilioRestClient(account_SID, auth_token, TWILIO_ENDPOINT);
		List<String> verifiredTwilioNumbers = new ArrayList<String>();
		JSONObject result = null;
		try
		{
			TwilioRestResponse response = client.request("/" + TWILIO_VERSION + "/" + TWILIO_ACCOUNTS + "/"
					+ account_SID + "/" + TWILIO_INCOMING_NUMBERS, "GET", null);

			/*
			 * If error occurs, return null
			 */
			if (response.isError())
				return new ArrayList<String>();

			result = XML.toJSONObject(response.getResponseText()).getJSONObject(TWILIO_RESPONSE)
					.getJSONObject(TWILIO_INCOMING_NUMBERS);

			if (result.get("IncomingPhoneNumber") instanceof JSONObject)
			{
				verifiredTwilioNumbers.add(result.getJSONObject("IncomingPhoneNumber").get("PhoneNumber").toString());
				return verifiredTwilioNumbers;
			}

			JSONArray incomingNumberArray = result.getJSONArray("IncomingPhoneNumber");

			int incomingNumberCount = result.getJSONArray("IncomingPhoneNumber").length();

			for (int i = 0; i < incomingNumberCount; i++)
				verifiredTwilioNumbers.add(incomingNumberArray.getJSONObject(i).get("PhoneNumber").toString());
		}
		catch (Exception e)
		{
			System.out.println("Exception in TwilioSMS: " + e.getMessage());
			System.out.println("The result is " + result);
		}

		return verifiredTwilioNumbers;

	}

	/**
	 * Returns logs of a Twilio number
	 */
	public static JSONObject getTwilioLogs(String account_SID, String auth_token)
	{

		JSONObject logJSON = new JSONObject();
		int thisMonthCount = 0;
		int lastMonthCount = 0;
		int todaysCount = 0;
		int yesterdaysCount = 0;
		int deliveredCount = 0;
		int queuedCount = 0;
		int undeliveredCount = 0;
		int failedCount = 0;

		if (account_SID == null || auth_token == null)
			return null;

		TwilioRestClient client = new TwilioRestClient(account_SID, auth_token, TWILIO_ENDPOINT);
		SimpleDateFormat sdfMap = new SimpleDateFormat("yyyy-MM-dd");
		Calendar gc = Calendar.getInstance();
		gc.add(Calendar.DAY_OF_YEAR, 1);
		String endLogDate = sdfMap.format(gc.getTime());

		gc.add(Calendar.MONTH, -2);

		String startLogDate = sdfMap.format(gc.getTime());

		Map<String, String> dateRange = new HashMap<String, String>();

		try
		{
			dateRange.put(URLEncoder.encode("DateSent>", "UTF-8"), startLogDate);
			dateRange.put(URLEncoder.encode("DateSent<", "UTF-8"), endLogDate);

			TwilioRestResponse messages = client.request("/" + TWILIO_VERSION + "/" + TWILIO_ACCOUNTS + "/"
					+ account_SID + "/" + "Messages.json", "GET", dateRange);

			if (messages.isError())
				return null;

			JSONObject responseMessageText = new JSONObject(messages.getResponseText());
			JSONArray messageArray = responseMessageText.getJSONArray("messages");
			int numberOfMessages = messageArray.length();

			SimpleDateFormat sdfActual = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss Z");
			SimpleDateFormat sdfConverted = new SimpleDateFormat("dd MMM yyyy");

			Date messageDate = null;
			Date oneMonthBackEnd = null;
			Date oneMonthBackStart = null;
			Date currentdate = null;
			Date thisMonthDate = null;
			Date yesterdayDate = null;
			Date lastOneMonth = null;

			currentdate = sdfConverted.parse(sdfConverted.format(Calendar.getInstance().getTime()));
			Calendar currentDate = Calendar.getInstance();
			currentDate.add(Calendar.MONTH, -1);
			lastOneMonth = sdfConverted.parse(sdfConverted.format(currentDate.getTime()));

			/*
			 * ======= Calendar currentDate = Calendar.getInstance();
			 * currentDate.add(Calendar.MONTH, -1); lastOneMonth =
			 * sdfConverted.parse(sdfConverted.format(currentDate.getTime()));
			 * >>>>>>> 012109f... Plivo SMS
			 */
			Calendar calDate = Calendar.getInstance();

			calDate.add(Calendar.DATE, -1);
			yesterdayDate = sdfConverted.parse(sdfConverted.format(calDate.getTime()));

			calDate.set(Calendar.DATE, 1);
			thisMonthDate = sdfConverted.parse(sdfConverted.format(calDate.getTime()));
			calDate.add(Calendar.MONTH, -1);
			oneMonthBackStart = sdfConverted.parse(sdfConverted.format(calDate.getTime()));
			Calendar calMonth = Calendar.getInstance();
			calMonth.add(Calendar.MONTH, -1);
			calMonth.set(Calendar.DAY_OF_MONTH, calMonth.getActualMaximum(Calendar.DAY_OF_MONTH));
			oneMonthBackEnd = sdfConverted.parse(sdfConverted.format(calMonth.getTime()));

			try
			{
				for (int i = 0; i < numberOfMessages; i++)
				{
					Object status = messageArray.getJSONObject(i).get("status");
					String date = (String) messageArray.getJSONObject(i).get("date_updated");
					messageDate = sdfActual.parse(date);
					messageDate = sdfConverted.parse(sdfConverted.format(messageDate));

					if (status.toString().equals("delivered") && messageDate.compareTo(lastOneMonth) >= 0)
						deliveredCount++;

					if (status.toString().equals("queued") && messageDate.compareTo(lastOneMonth) >= 0)
						queuedCount++;

					if (status.toString().equals("undelivered") && messageDate.compareTo(lastOneMonth) >= 0)
						undeliveredCount++;

					if (status.toString().equals("failed") && messageDate.compareTo(lastOneMonth) >= 0)
						failedCount++;

					if (messageDate.compareTo(thisMonthDate) >= 0)
						thisMonthCount++;

					if (messageDate.compareTo(oneMonthBackStart) >= 0 && messageDate.compareTo(oneMonthBackEnd) <= 0)
						lastMonthCount++;

					if (messageDate.compareTo(currentdate) >= 0)
						todaysCount++;

					if (messageDate.compareTo(yesterdayDate) == 0)
						yesterdaysCount++;
				}
			}
			catch (Exception e)
			{
				System.out.println("inside twilio getTwilioLogs for loop");
				e.printStackTrace();
			}

			logJSON.put("Delivered", deliveredCount);
			logJSON.put("Queued", queuedCount);
			logJSON.put("Undelivered", undeliveredCount);
			logJSON.put("Failed", failedCount);
			logJSON.put("ThisMonth", thisMonthCount);
			logJSON.put("LastMonth", lastMonthCount);
			logJSON.put("Today", todaysCount);
			logJSON.put("Yesterday", yesterdaysCount);
			logJSON.put("Stats-Type", "TWILIO");

		}
		catch (JSONException e)
		{
			System.out.println("Exception in getTwilioLogs JSONException");
			e.printStackTrace();
		}
		catch (Exception e)
		{
			System.out.println("Exception in getTwilioLogs");
			e.printStackTrace();
		}

		return logJSON;

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

	public static JSONObject currentTwilioLogs()
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

	public static List<String> incomingNumbers(Widget widget)
	{
		if (widget == null)
			return new ArrayList<String>();

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
			return new ArrayList<String>();

		return verifiedTwilioNumbers(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

	}

	public static JSONObject currentSMSLogs(Widget widget)
	{

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