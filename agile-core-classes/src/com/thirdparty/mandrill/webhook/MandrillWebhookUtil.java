package com.thirdparty.mandrill.webhook;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.VersioningUtil;
import com.google.appengine.api.utils.SystemProperty;
import com.thirdparty.mandrill.Mandrill;

/**
 * <code>MandrillWebhookUtil</code> is the utility class for Mandrill Webhook to
 * add new webhook or fetching available webhooks through api
 * 
 * @author naresh
 * 
 */
/**
 * @author naresh
 * 
 */
public class MandrillWebhookUtil
{

	public static final String AGILE_MANDRILL_WEBHOOK_URL = "https://agile-crm-cloud.appspot.com/backend/mandrillwebhook";

	public static final String KEY = "key";
	public static final String ID = "id";
	public static final String URL = "url";
	public static final String DESCRIPTION = "description";
	public static final String EVENTS = "events";

	public static final String MANDRILL_API_WEBHOOK_ADD_CALL = "/webhooks/add.json";
	public static final String MANDRILL_API_WEBHOOK_LIST_CALL = "/webhooks/list.json";
	public static final String MANDRILL_API_WEBHOOK_DELETE_CALL = "/webhooks/delete.json";

	/**
	 * Adds webhook to Mandrill account
	 * 
	 * @param apiKey
	 *            - Mandrill API Key
	 */
	public static String addWebhook(String apiKey)
	{

		// If empty return
		if (StringUtils.isBlank(apiKey))
			return "API Key is empty.";

		// If exists already return
		if (isWebhookAlreadyExists(apiKey))
			return "Agile Mandrill Webhook already exists for given api key " + apiKey;

		String response = null;

		// Webhook json
		JSONObject webhook = new JSONObject();

		try
		{
			webhook.put(KEY, apiKey);

			String webhookURL = AGILE_MANDRILL_WEBHOOK_URL;

			// If Application is beta, add beta url
			if (StringUtils.equals(SystemProperty.applicationId.get(), "agilecrmbeta"))
				webhookURL = "https://agilecrmbeta.appspot.com/backend/mandrillwebhook";

			webhook.put(URL, webhookURL);
			webhook.put(DESCRIPTION, "AgileCRM webhook for Hardbounce, SoftBounce and Spam complaint");
			webhook.put(EVENTS, getWebhookEvents());

			response = HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL + MANDRILL_API_WEBHOOK_ADD_CALL,
					webhook.toString());

			System.out.println("Response for adding webhook: " + response);

		}
		catch (Exception e)
		{
			System.err.println("Exception occured while adding Agile webhook..." + e.getMessage());
			e.printStackTrace();
		}

		return response;
	}

	/**
	 * Returns json array of required webhook events
	 * 
	 * @return JSONArray
	 */
	public static JSONArray getWebhookEvents()
	{
		JSONArray events = new JSONArray();

		events.put(MandrillWebhook.HARD_BOUNCE);
		events.put(MandrillWebhook.SOFT_BOUNCE);
		events.put(MandrillWebhook.SPAM);

		return events;
	}

	/**
	 * Returns all available webhooks for given Mandrill api key account
	 * 
	 * @param apiKey
	 *            - Mandrill api key
	 * @return String
	 */
	public static String getAllWebhooks(String apiKey)
	{
		String response = null;

		try
		{
			JSONObject key = new JSONObject();
			key.put(KEY, apiKey);

			response = HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL + MANDRILL_API_WEBHOOK_LIST_CALL,
					key.toString());

		}
		catch (Exception e)
		{
			System.err.println("Exception occured while fetching all webhooks..." + e.getMessage());
			e.printStackTrace();
		}

		return response;
	}

	/**
	 * Verifies whether Agile Mandrill webhook exists for given Mandrill api
	 * account
	 * 
	 * @param apiKey
	 *            - Mandrill apiKey
	 * @return boolean
	 */
	public static boolean isWebhookAlreadyExists(String apiKey)
	{
		// If Agile webhook doesn't exists
		if (getAgileWebhook(apiKey) == null)
			return false;

		return true;
	}

	/**
	 * Returns Agile webhook JSONObject
	 * 
	 * @param apiKey
	 *            - Mandrill api key
	 * @return JSONObject
	 */
	private static JSONObject getAgileWebhook(String apiKey)
	{
		// Fetch all webhooks
		String webhooks = getAllWebhooks(apiKey);

		try
		{
			JSONArray webhooksArray = new JSONArray(webhooks);

			// Verify whether Agile webhook is configured
			for (int i = 0, len = webhooksArray.length(); i < len; i++)
			{
				JSONObject webhook = webhooksArray.getJSONObject(i);

				// If exists return
				if (webhook.has(URL))
				{

					if (VersioningUtil.isProductionAPP() && (webhook.getString(URL).equals(AGILE_MANDRILL_WEBHOOK_URL)))
						return webhook;

					if (VersioningUtil.getApplicationAPPId().equals("agilecrmbeta")
							&& (webhook.getString(URL)
									.equals("https://agilecrmbeta.appspot.com/backend/mandrillwebhook")))
						return webhook;
				}
			}

		}
		catch (Exception e)
		{
			System.err.println("Exception occured while checking Agile webhook..." + e.getMessage());
			e.printStackTrace();
		}

		return null;
	}

	/**
	 * Deletes agile webhook from given api Mandrill account
	 * 
	 * @param apiKey
	 *            - Mandrill api key
	 * @return String
	 */
	public static String deleteWebhook(String apiKey)
	{
		String response = null;
		String webhookId = null;

		try
		{
			JSONObject webhook = getAgileWebhook(apiKey);

			// If no Agile Webhook
			if (webhook == null)
				return null;

			// Get webhook Id
			if (webhook.has(ID))
				webhookId = webhook.getString(ID);

			// If no webhook Id
			if (webhookId == null)
				return null;

			// Delete json
			JSONObject key = new JSONObject();
			key.put(KEY, apiKey);
			key.put(ID, webhookId);

			response = HTTPUtil.accessURLUsingPost(Mandrill.MANDRILL_API_POST_URL + MANDRILL_API_WEBHOOK_DELETE_CALL,
					key.toString());

		}
		catch (Exception e)
		{
			System.err.println("Exception occured while deleting webhook..." + e.getMessage());
			e.printStackTrace();
		}

		return response;
	}
}
