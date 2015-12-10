package com.thirdparty.sendgrid.webhook.util;

import java.net.URLEncoder;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.utils.SystemProperty;
import com.thirdparty.sendgrid.SendGrid;

public class SendGridWebhookUtil
{

	public static final String SENDGRID_WEBHOOK_URL = "https://api.sendgrid.com/api/filter.setup.json";
	public static final String SENDGRID_EVENT_NOTIFY = "eventnotify";

	public static final String SENDGRID_EVENT_NAME = "name";
	public static final String SENDGRID_EVENT_PROCESSED = "processed";
	public static final String SENDGRID_EVENT_DROPPED = "dropped";
	public static final String SENDGRID_EVENT_DEFERRED = "deferred";
	public static final String SENDGRID_EVENT_DELIVERED = "delivered";
	public static final String SENDGRID_EVENT_BOUNCE = "bounce";
	public static final String SENDGRID_EVENT_CLICK = "click";
	public static final String SENDGRID_EVENT_UNSUBSCRIBE = "unsubscribe";
	public static final String SENDGRID_EVENT_SPAMREPORT = "spamreport";
	public static final String SENDGRID_EVENT_URL = "url";

	/**
	 * Adds webhook to SendGrid account
	 * 
	 * @param apiUser
	 *            - Sendgrid API Key
	 * @param password
	 *            - SendGrid Password
	 */
	public static String addWebhook(String apiUser, String password)
	{

		// If empty return
		if (StringUtils.isBlank(apiUser) && StringUtils.isBlank(password))
			return "API Key is empty.";

		String response = null;

		try
		{

			String webhookURL = "https://agile-crm-cloud.appspot.com/backend/sendgridwebhook";

			// If Application is beta, add beta url
			if (StringUtils.equals(SystemProperty.applicationId.get(), "agilecrmbeta"))
				webhookURL = "https://agilecrmbeta.appspot.com/backend/sendgridwebhook";

			String queryString = "";

			queryString = SendGrid.SENDGRID_API_PARAM_API_USER + "=" + URLEncoder.encode(apiUser, "UTF-8") + "&"
					+ SendGrid.SENDGRID_API_PARAM_API_KEY + "=" + URLEncoder.encode(password, "UTF-8") + "&"
					+ SENDGRID_EVENT_NAME + "=" + URLEncoder.encode(SENDGRID_EVENT_NOTIFY, "UTF-8") + "&"
					+ SENDGRID_EVENT_PROCESSED + "=" + URLEncoder.encode("0", "UTF-8") + "&" 
					+ SENDGRID_EVENT_DROPPED + "=" + URLEncoder.encode("0", "UTF-8") + "&" 
					+ SENDGRID_EVENT_DEFERRED + "="	+ URLEncoder.encode("1", "UTF-8") + "&" 
					+ SENDGRID_EVENT_DELIVERED + "=" + URLEncoder.encode("0", "UTF-8") + "&" 
					+ SENDGRID_EVENT_BOUNCE + "=" + URLEncoder.encode("1", "UTF-8") + "&"
					+ SENDGRID_EVENT_CLICK + "=" + URLEncoder.encode("0", "UTF-8") + "&" 
					+ SENDGRID_EVENT_UNSUBSCRIBE + "=" + URLEncoder.encode("0", "UTF-8") + "&"
					+ SENDGRID_EVENT_SPAMREPORT + "=" + URLEncoder.encode("1", "UTF-8") + "&" 
					+ SENDGRID_EVENT_URL + "=" + URLEncoder.encode(webhookURL, "UTF-8");

			response = HTTPUtil.accessURLUsingPost(SENDGRID_WEBHOOK_URL, queryString);

			System.out.println("Response for adding webhook: " + response);

		}
		catch (Exception e)
		{
			System.err.println("Exception occured while adding Agile webhook..." + e.getMessage());
			e.printStackTrace();
		}

		return response;
	}
}
