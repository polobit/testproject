package com.campaignio.tasklets.sms;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.account.util.SMSGatewayUtil;
import com.agilecrm.widgets.Widget;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;
import com.thirdparty.twilio.TwilioSMSUtil;

/**
 * <code>SendMessage</code> represents Send Message node in workflow. It send
 * SMS from an API which is configured in integrations.
 * 
 * @author Bhasuri
 * 
 */
public class SendMessage extends TaskletAdapter
{

	/**
	 * Twilio Account Subscriber ID
	 */
	public static String ACCOUNT_SID = "account_sid";

	/**
	 * Twilio Account Authentication Token
	 */
	public static String AUTH_TOKEN = "auth_token";

	/**
	 * Twilio Account SMS API
	 */
	public static String SMS_API = "TWILIO";

	/**
	 * Registered From Twilio Number
	 */
	public static String FROM_NUMBER = "from";

	/**
	 * Number to which user sends SMS
	 */
	public static String TO_NUMBER = "to";

	/**
	 * Message metadata
	 */
	public static String METADATA = "metadata";

	/**
	 * Body of the message
	 */
	public static String MESSAGE = "message";

	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		// Get From, To, Message
		String from = getStringValue(nodeJSON, subscriberJSON, data, FROM_NUMBER);
		String to = getStringValue(nodeJSON, subscriberJSON, data, TO_NUMBER);
		String message = getStringValue(nodeJSON, subscriberJSON, data, MESSAGE);

		if (StringUtils.isEmpty(to) || StringUtils.isEmpty(from))
		{
			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
					"SMS failed", LogType.SMS_FAILED.toString());

			// Execute Next One in Loop
			TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
			return;
		}

		if (!checkvalidFrom(from))
		{
			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
					"SMS failed as " + from + " is not verified number by twilio", LogType.SMS_FAILED.toString());

			// Execute Next One in Loop
			TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
			return;
		}
		if (checkvalidTo(to).equals("Invalid"))
		{
			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
<<<<<<< HEAD
					"SMS could not be sent -  Invalid phone number", LogType.SMS_FAILED.toString());
=======
					"SMS failed as " + to + " is invalid phone number", LogType.SMS_FAILED.toString());
>>>>>>> GooglePhoneAPI-SMS

			// Execute Next One in Loop
			TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
			return;
		}
<<<<<<< HEAD
=======

		if (checkvalidTo(to).equals("AlphaNumeric"))
		{
			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
					"SMS failed as " + to + " is alpha numeric", LogType.SMS_FAILED.toString());

			// Execute Next One in Loop
			TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
			return;
		}
		//
>>>>>>> GooglePhoneAPI-SMS

		/*
		 * if (checkvalidTo(to).equals("AlphaNumeric")) {
		 * LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON),
		 * AgileTaskletUtil.getId(subscriberJSON), "SMS failed as " + to +
		 * " is alpha numeric", LogType.SMS_FAILED.toString());
		 * 
		 * // Execute Next One in Loop TaskletUtil.executeTasklet(campaignJSON,
		 * subscriberJSON, data, nodeJSON, null); return; }
		 */

		TwilioSMSUtil.sendSMS(SMS_API, from, to, message, ACCOUNT_SID, AUTH_TOKEN);

		// Creates log for sending sms
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "SMS Sent ",
				LogType.SMS_SENT.toString());

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

	}

	private boolean checkvalidFrom(String from)
	{

		List<String> verifiedNumbers = getVerifiedTwilioNumbers();

		if (verifiedNumbers.isEmpty())
			return false;

		if (verifiedNumbers.contains(from))
			return true;

		return false;
	}

	private List<String> getVerifiedTwilioNumbers()
	{
		Widget widget = SMSGatewayUtil.getSMSGatewayWidget();
		try
		{
			String prefs = widget.prefs;
			JSONObject prefsJSON = new JSONObject(prefs);
			ACCOUNT_SID = prefsJSON.getString("account_sid");
			AUTH_TOKEN = prefsJSON.getString("auth_token");
			SMS_API = prefsJSON.getString("sms_api");

		}
		catch (Exception e)
		{

			System.out.println("Inside getVerifiedTwilioNumbers");
			System.err.println("Exception was thrown: getVerifiedTwilioNumbers " + e.toString());
			e.printStackTrace();
		}

		if (ACCOUNT_SID == null || AUTH_TOKEN == null)
			return null;

		return TwilioSMSUtil.verifiedTwilioNumbers(ACCOUNT_SID, AUTH_TOKEN);

	}

	private String checkvalidTo(String to)
	{

		PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
		try
		{
			PhoneNumber toPhoneNumber = phoneUtil.parse(to, null);
			if (phoneUtil.isValidNumber(toPhoneNumber))
				return "Valid";
		}
		catch (NumberParseException e)
		{
			System.out.println("Inside Send Message check valid 'to' number");

			/*
			 * if (phoneUtil.isAlphaNumber(to)) return "AlphaNumeric";
			 */
			System.err.println("NumberParseException was thrown: " + e.toString());
		}

		return "Invalid";
	}

}
