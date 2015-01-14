package com.agilecrm.sms.util.deferred;

import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.plivo.PlivoSMSUtil;
import com.thirdparty.twilio.TwilioSMSUtil;
import com.thirdparty.twilio.sdk.TwilioRestException;

/**
 * <code>SMSDeferredTask</code> is the deferred task that handles send SMS
 * details of every task
 * 
 * @author Bhasuri
 * 
 */

@SuppressWarnings("serial")
public class SMSDeferredTask implements DeferredTask
{
	public String smsGatewayType = null;
	public String account_sid = null;
	public String auth_token = null;
	public String smsEndpoint = null;
	public String version = null;
	public String domain = null;
	public String fromNumber = null;
	public String toNumber = null;
	public String body = null;
	public String metadata = null;

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
	public SMSDeferredTask(String smsGatewayType, String domain, String version, String fromNumber, String toNumber,
			String body, String account_sid, String auth_token, String smsEndpoint, String metadata)
	{
		this.smsGatewayType = smsGatewayType;
		this.domain = domain;
		this.version = version;
		this.fromNumber = fromNumber;
		this.toNumber = toNumber;
		this.body = body;
		this.account_sid = account_sid;
		this.auth_token = auth_token;
		this.smsEndpoint = smsEndpoint;
		this.metadata = metadata;
	}

	public void run()
	{
		System.out.println("SMSDeferredTask run...");

		try
		{
			if (smsGatewayType.equals("PLIVO"))
				PlivoSMSUtil.sendSMS(account_sid, auth_token, smsEndpoint, version, fromNumber, toNumber, body,
						metadata);
			if (smsGatewayType.equals("TWILIO"))
				TwilioSMSUtil.sendSMS(account_sid, auth_token, smsEndpoint, version, fromNumber, toNumber, body,
						metadata);
		}
		catch (TwilioRestException e)
		{
			System.out.println("TwilioRestException in SMSDefferedTask");
			e.printStackTrace();
		}
		catch (Exception e)
		{
			System.out.println("Exceptiom in SMSDefferedTask");
			e.printStackTrace();
		}
	}
}