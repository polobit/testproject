package com.agilecrm.account.util;

import org.json.JSONException;

import com.agilecrm.AgileQueues;
import com.agilecrm.queues.backend.BackendUtil;
import com.agilecrm.queues.util.PullQueueUtil;
import com.agilecrm.sms.util.deferred.SMSDeferredTask;
import com.agilecrm.social.TwilioUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.widgets.Widget;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>SMSGatewayUtil</code> is utility class for SMS integrations
 * 
 * @author Bhasuri
 * 
 */
public class SMSGatewayUtil
{
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
			e.printStackTrace();
		}

	}

	/**
	 * 
	 * @param smsGatewaytype
	 *            - the current SMS gateway type(Twilio)
	 * @param domain
	 *            - The current namespacemanager domain
	 * @param version
	 *            - Version of Twilio
	 * @param from
	 *            - From number
	 * @param to
	 *            - To number
	 * @param message
	 *            - Body of the message to be sent
	 * @param account_sid
	 *            - Account SID
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
				"bulk".equals(BackendUtil.getCurrentBackendName()) ? AgileQueues.BULK_SMS_PULL_QUEUE
						: AgileQueues.NORMAL_SMS_PULL_QUEUE, smsDeferredTask, from);

	}

	public static boolean checkCredentials(Widget smsGatewayWidget) throws JSONException, Exception
	{
		// smsGatewayWidget.getSMSAPI().equals(SMSGateway.SMS_API.TWILIO)
		return TwilioUtil.checkCredentials(TwilioUtil.getAccountSID(smsGatewayWidget),
				TwilioUtil.getAuthToken(smsGatewayWidget));

	}

}
