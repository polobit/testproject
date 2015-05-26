package com.agilecrm.account.util;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.Globals;
import com.agilecrm.queues.backend.ModuleUtil;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.sms.util.deferred.SMSDeferredTask;
import com.agilecrm.social.PlivoUtil;
import com.agilecrm.social.TwilioUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.widgets.Widget;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.thirdparty.plivo.PlivoSMSUtil;
import com.thirdparty.twilio.TwilioSMSUtil;

/**
 * <code>SMSGatewayUtil</code> is utility class for SMS integrations
 * 
 * @author Bhasuri
 * 
 */
public class SMSGatewayUtil
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
	 * Plivo Account Version
	 */
	public static final String PLIVO_VERSION = "v1";

	/**
	 * Metadata
	 */
	public static final String TWILIO_METADATA = "metadata1";

	/**
	 * Checks in cache first if that widget exists else makes a call to
	 * datastore.
	 * 
	 * @return SMS-Gateway widget
	 */
	public static Widget getSMSGatewayWidget()
	{

		Widget widget = (Widget) CacheUtil.getCache(NamespaceManager.get() + "_sms_gateway");

		if (widget != null)
		{
			System.out.println("Returning gateway from Cache...");
			return widget;
		}
		Objectify ofy = ObjectifyService.begin();

		return ofy.query(Widget.class).filter("name", "SMS-Gateway").get();
	}

	/**
	 * Gets current SMS Gateway widget and adds it to queue
	 * 
	 */
	public static void sendSMS(String SMSGatewayType, String domain, String version, String from, String to,
			String message, String account_sid, String auth_token, String endpoint, String metadata)
	{
		try
		{
			// Get Current SMS Gateway API SMSGateway.getSMSGateway()

			// Add to Pull Queue
			addToQueue(SMSGatewayType, domain, version, from, to, message, account_sid, auth_token, endpoint, metadata);
			return;

		}
		catch (Exception e)
		{
			System.err.println("Exception occured while adding to queue..." + e.getMessage());
		}

	}

	/**
	 * 
	 * @param smsGatewaytype
	 *            - the current SMS gateway type
	 * @param domain
	 *            - The current namespacemanager domain
	 * @param version
	 *            - Version of Gateway
	 * @param from
	 *            - From number
	 * @param to
	 *            - To number
	 * @param message
	 *            - Body of the message to be sent
	 * @param account_id
	 *            - Account ID
	 * @param auth_token
	 *            - Authentication token
	 * @param endpoint
	 *            - The base url for making a URL request to twilio
	 * @param metadata
	 */

	private static void addToQueue(String smsGatewaytype, String domain, String version, String from, String to,
			String message, String account_sid, String auth_token, String endpoint, String metadata)
	{
		SMSDeferredTask smsDeferredTask = new SMSDeferredTask(smsGatewaytype, domain, version, from, to, message,
				account_sid, auth_token, endpoint, metadata);

		// Add to pull queue with from number as Tag
		PullQueueUtil.addToPullQueue(
				Globals.BULK_BACKENDS.equals(ModuleUtil.getCurrentModuleName()) ? AgileQueues.BULK_SMS_PULL_QUEUE
						: AgileQueues.NORMAL_SMS_PULL_QUEUE, smsDeferredTask, from);

	}

	public static boolean checkCredentials(Widget smsGatewayWidget) throws JSONException, Exception
	{
		JSONObject prefsJSON = new JSONObject(smsGatewayWidget.prefs);
		String smsAPI = (String) prefsJSON.get("sms_api");

		if (smsAPI.equals("TWILIO"))
			return TwilioUtil.checkCredentials(TwilioUtil.getAccountSID(smsGatewayWidget),
					TwilioUtil.getAuthToken(smsGatewayWidget));

		else if (smsAPI.equals("PLIVO"))
			return PlivoUtil.checkCredentials(PlivoUtil.getAccountID(smsGatewayWidget),
					TwilioUtil.getAuthToken(smsGatewayWidget));
		else
			return false;

	}

	/**
	 * 
	 * @param smsGatewayWidget
	 * @return
	 */
	public static List<String> incomingNumbers(Widget smsGatewayWidget)
	{
		JSONObject prefsJSON;
		try
		{
			prefsJSON = new JSONObject(smsGatewayWidget.prefs);
			String smsAPI = (String) prefsJSON.get("sms_api");

			if (smsAPI.equals("TWILIO"))
				return TwilioSMSUtil.incomingNumbers(smsGatewayWidget);
			if (smsAPI.equals("PLIVO"))
				return PlivoSMSUtil.incomingNumbers(smsGatewayWidget);
			else
				return new ArrayList<String>();
		}

		catch (Exception e)
		{
			e.printStackTrace();
			return new ArrayList<String>();
		}

	}

	/**
	 * Returns list of numbers which are verified in the current sms gateway for
	 * the node dropdown
	 * 
	 * @return list of numbers
	 */
	public static List<String> currentGatewayNumbers()
	{
		Widget smsGatewayWidget = getSMSGatewayWidget();

		if (smsGatewayWidget == null)
			return null;

		return incomingNumbers(smsGatewayWidget);
	}

	/**
	 * Send sms and add them to queue
	 * 
	 * @param SMSGatewayType
	 * @param from
	 * @param to
	 * @param message
	 * @param account_id
	 * @param auth_token
	 */
	public static void sendSMS(String SMSGatewayType, String from, String to, String message, String account_id,
			String auth_token)
	{

		String domain = NamespaceManager.get();

		if (SMSGatewayType.equals("TWILIO"))
			sendSMS(SMSGatewayType, domain, TWILIO_VERSION, from, to, message, account_id, auth_token, TWILIO_ENDPOINT,
					TWILIO_METADATA);

		if (SMSGatewayType.equals("PLIVO"))
			sendSMS(SMSGatewayType, domain, PLIVO_VERSION, from, to, message, account_id, auth_token, "", "");

	}

	/**
	 * Returns a link where he can configure the SMS api
	 * 
	 * @param smsGatewayWidget
	 * @return url
	 */
	public static String getLink(Widget smsGatewayWidget)
	{

		JSONObject prefsJSON;
		try
		{
			prefsJSON = new JSONObject(smsGatewayWidget.prefs);
			String smsAPI = (String) prefsJSON.get("sms_api");
			if (smsAPI.equals("TWILIO"))
				return "https://www.twilio.com/user/account/phone-numbers/incoming";
			if (smsAPI.equals("PLIVO"))
				return "https://manage.plivo.com/number/search/";
		}
		catch (Exception e)
		{
			System.out.println("Exception while sending out configured url in SMSGateway" + e.getMessage());
		}
		return "";

	}

	/**
	 * Returns the type of widget which is configured either twilio or plivo
	 * 
	 * @param smsGatewayWidget
	 * @return sms gateway type
	 */
	public static String getSMSType(Widget smsGatewayWidget)
	{
		JSONObject prefsJSON;
		try
		{
			prefsJSON = new JSONObject(smsGatewayWidget.prefs);
			return (String) prefsJSON.get("sms_api");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		return "";

	}

	/**
	 * SMS logs of the gateway
	 * 
	 * @return JSON object of the gateway
	 */
	public static JSONObject getSMSLogs()
	{

		Widget widget = SMSGatewayUtil.getSMSGatewayWidget();
		if (widget == null)
			return null;

		String smsType = getSMSType(widget);

		if ("TWILIO".equals(smsType))
			return TwilioSMSUtil.currentSMSLogs(widget);
		if ("PLIVO".equals(smsType))
			return PlivoSMSUtil.currentSMSLogs(widget);

		return null;

	}
}