package com.campaignio.tasklets.sms;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.account.util.SMSGatewayUtil;
import com.agilecrm.social.PlivoUtil;
import com.agilecrm.social.TwilioUtil;
import com.agilecrm.widgets.Widget;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber.PhoneNumber;

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
	 * SMS Gateway Account Subscriber ID
	 */
	public static String ACCOUNT_ID = "account_id";

	/**
	 * SMS Gateway Account Authentication Token
	 */
	public static String AUTH_TOKEN = "auth_token";

	/**
	 * SMS Gateway Account SMS API
	 */
	public static String SMS_API = "TWILIO";

	/**
	 * Registered From Number
	 */
	public static String FROM_NUMBER = "from";

	/**
	 * Number to which user sends SMS
	 */
	public static String TO_NUMBER = "to";

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
		try
		{
			if (StringUtils.isEmpty(to) || StringUtils.isEmpty(from))
			{
				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"SMS failed", LogType.SMS_FAILED.toString());

				// Execute Next One in Loop
				TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
				return;
			}

			if (!checkValidFromNumber(from))
			{
				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"SMS failed as " + from + " is not verified number", LogType.SMS_FAILED.toString());

				// Execute Next One in Loop
				TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
				return;
			}

			if (!checkValidToNumber(to))
			{
				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"SMS could not be sent -  Invalid phone number", LogType.SMS_FAILED.toString());

				// Execute Next One in Loop
				TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
				return;
			}

			SMSGatewayUtil.sendSMS(SMS_API, from, to, message, ACCOUNT_ID, AUTH_TOKEN);

			// Creates log for sending sms
			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
					"SMS Sent ", LogType.SMS_SENT.toString());
		}
		catch (Exception e)
		{
			System.err.println("Exception ins SendMessage: " + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

	}

	private boolean checkValidFromNumber(String from)
	{

		List<String> verifiedNumbers = getVerifiedNumbers();

		if (verifiedNumbers.isEmpty())
			return false;

		if (verifiedNumbers.contains(from))
			return true;

		return false;
	}

	private List<String> getVerifiedNumbers()
	{
		Widget widget = SMSGatewayUtil.getSMSGatewayWidget();

		if (widget == null)
			return new ArrayList<String>();

		SMS_API = SMSGatewayUtil.getSMSType(widget);

		if (SMS_API.equals("TWILIO"))
		{
			ACCOUNT_ID = TwilioUtil.getAccountSID(widget);
			AUTH_TOKEN = TwilioUtil.getAuthToken(widget);
		}
		else if (SMS_API.equals("PLIVO"))
		{
			ACCOUNT_ID = PlivoUtil.getAccountID(widget);
			AUTH_TOKEN = PlivoUtil.getAuthToken(widget);
		}

		return SMSGatewayUtil.incomingNumbers(widget);
	}

	private boolean checkValidToNumber(String to)
	{

		PhoneNumberUtil phoneUtil = PhoneNumberUtil.getInstance();
		try
		{
			PhoneNumber toPhoneNumber = phoneUtil.parse(to, null);
			if (phoneUtil.isValidNumber(toPhoneNumber))
				return true;
		}
		catch (NumberParseException e)
		{
			System.out.println("Inside Send Message check valid 'to' number");
			System.err.println("NumberParseException was thrown: " + e.toString());
		}
		return false;
	}

}