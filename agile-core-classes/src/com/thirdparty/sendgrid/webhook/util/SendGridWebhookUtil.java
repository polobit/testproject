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

		// If exists already return
		// if (isWebhookAlreadyExists(apiUser))
		// return "Agile Mandrill Webhook already exists for given api key " +
		// apiUser;

		String response = null;

		try
		{

			String webhookURL = "https://agilecrmbeta.appspot.com/backend/sendgridwebhook";

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

	// /**
	// * Returns json array of required webhook events
	// *
	// * @return JSONArray
	// */
	// public static JSONArray getWebhookEvents()
	// {
	// JSONArray events = new JSONArray();
	//
	// events.put(MandrillWebhook.HARD_BOUNCE);
	// events.put(MandrillWebhook.SOFT_BOUNCE);
	// events.put(MandrillWebhook.SPAM);
	//
	// return events;
	// }
	//
	// /**
	// * Returns all available webhooks for given Mandrill api key account
	// *
	// * @param apiKey
	// * - Mandrill api key
	// * @return String
	// */
	// public static String getAllWebhooks(String apiKey)
	// {
	// String response = null;
	//
	// try
	// {
	// JSONObject key = new JSONObject();
	// key.put(KEY, apiKey);
	//
	// response = HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL +
	// MANDRILL_API_WEBHOOK_LIST_CALL,
	// key.toString());
	//
	// }
	// catch (Exception e)
	// {
	// System.err.println("Exception occured while fetching all webhooks..." +
	// e.getMessage());
	// e.printStackTrace();
	// }
	//
	// return response;
	// }
	//
	// /**
	// * Verifies whether Agile Mandrill webhook exists for given Mandrill api
	// * account
	// *
	// * @param apiKey
	// * - Mandrill apiKey
	// * @return boolean
	// */
	// public static boolean isWebhookAlreadyExists(String apiKey)
	// {
	// // If Agile webhook doesn't exists
	// if (getAgileWebhook(apiKey) == null)
	// return false;
	//
	// return true;
	// }
	//
	// /**
	// * Returns Agile webhook JSONObject
	// *
	// * @param apiKey
	// * - Mandrill api key
	// * @return JSONObject
	// */
	// private static JSONObject getAgileWebhook(String apiKey)
	// {
	// // Fetch all webhooks
	// String webhooks = getAllWebhooks(apiKey);
	//
	// try
	// {
	// JSONArray webhooksArray = new JSONArray(webhooks);
	//
	// // Verify whether Agile webhook is configured
	// for (int i = 0, len = webhooksArray.length(); i < len; i++)
	// {
	// JSONObject webhook = webhooksArray.getJSONObject(i);
	//
	// // If exists return
	// if (webhook.has(URL) &&
	// (webhook.getString(URL).equals(AGILE_MANDRILL_WEBHOOK_URL) ||
	// webhook.getString(URL).equals("https://agilecrmbeta.appspot.com/backend/mandrillwebhook")))
	// return webhook;
	// }
	//
	// }
	// catch (Exception e)
	// {
	// System.err.println("Exception occured while checking Agile webhook..." +
	// e.getMessage());
	// e.printStackTrace();
	// }
	//
	// return null;
	// }
	//
	// /**
	// * Deletes agile webhook from given api Mandrill account
	// *
	// * @param apiKey
	// * - Mandrill api key
	// * @return String
	// */
	// public static String deleteWebhook(String apiKey)
	// {
	// String response = null;
	// String webhookId = null;
	//
	// try
	// {
	// JSONObject webhook = getAgileWebhook(apiKey);
	//
	// // If no Agile Webhook
	// if (webhook == null)
	// return null;
	//
	// // Get webhook Id
	// if (webhook.has(ID))
	// webhookId = webhook.getString(ID);
	//
	// // If no webhook Id
	// if (webhookId == null)
	// return null;
	//
	// // Delete json
	// JSONObject key = new JSONObject();
	// key.put(KEY, apiKey);
	// key.put(ID, webhookId);
	//
	// response = HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL +
	// MANDRILL_API_WEBHOOK_DELETE_CALL,
	// key.toString());
	//
	// }
	// catch (Exception e)
	// {
	// System.err.println("Exception occured while deleting webhook..." +
	// e.getMessage());
	// e.printStackTrace();
	// }
	//
	// return response;
	// }
	
	public static void main(String[] args)
	{
		addWebhook("agilecrm1", "send@agile1");
	}
}
