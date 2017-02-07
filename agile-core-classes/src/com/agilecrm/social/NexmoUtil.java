package com.agilecrm.social;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.NexmoSMS;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;
import com.google.gson.JsonArray;

/**
 * The <code>NexmoUtil</code> class acts as a Client to Nexmo server
 * 
 * <code>NexmoUtil</code> class contains methods for sending sms, recording
 * calls, retrieving sms logs and so on
 * 
 * @author Priyanka
 * @since January 2017
 */

public class NexmoUtil {

	/**
	 * <p>
	 * Method for to send sms with oauth
	 * <p>
	 * 
	 * @author Priyanka
	 * @param apiKey
	 * @param secretKey
	 * @param from
	 * @param to
	 * @param text
	 * @return
	 * @throws Exception
	 */
	public static void sendNexmoSMS(String to, String message, String contactId) {

		Widget widget = WidgetUtil.getWidget("Nexmo");
		if (widget == null)
			return;
		JSONObject json;
		try {
			json = new JSONObject(widget.prefs);

			String nexmo_number = json.getString("nexmo_number");

			String nexmo_api_key = json.getString("nexmo_api_key");

			String nexmo_secret_key = json.getString("nexmo_secret_key");

			int status = NexmoSMS.sendNexmoSMS(nexmo_api_key, nexmo_secret_key,
					to, nexmo_number, message);

			if (status == 0) {

				ActivityUtil.createLogForSMS(to, nexmo_number, message,
						NexmoSMS.SMS_SENT, "NEXMO", contactId);

			} else

				ActivityUtil.createLogForSMS(to, nexmo_number, message,
						NexmoSMS.SMS_SENDING_FAILED, "NEXMO", contactId);
		} catch (Exception e) {
			System.out
					.println("While Sending Error Occured ." + e.getMessage());
			throw ExceptionUtil.catchWebException(e);

		}

	}

	/**
	 * <p>
	 * Method for to get the nexmo from number
	 * </p>
	 * Checks the given Account SID and Auth Token is valid or not fetching the
	 * nexmo number and checking its response if single number then return
	 * single 0 index object else if more then one nexmo number then ittirate it
	 * .
	 * 
	 * 
	 **/
	public static String getNexmoFromNumbers(String apiKey, String secretKey) {

		try {

			if (StringUtils.isBlank(apiKey) || StringUtils.isBlank(apiKey))
				return null;

			String url = NexmoSMS.NEXMO_BASE_URL + "?";

			url += "&api_key=" + URLEncoder.encode(apiKey, "UTF-8");

			url += "&api_secret=" + URLEncoder.encode(secretKey, "UTF-8");

			System.out.println(url);
			// Send sms
			String response = HTTPUtil.accessURL(url);

			if (StringUtils.isNotBlank(response)) {

				JSONObject jsonObject = new JSONObject(response);

				JSONArray jsonArrayRespose = jsonObject.getJSONArray("numbers");

				JSONArray numberJson = new JSONArray();

				for (int index = 0; index < jsonArrayRespose.length(); index++) {
					numberJson.put(jsonArrayRespose.getJSONObject(index)
							.getString("msisdn"));
				}// for closing
				return numberJson.toString();
			}// if closing

		} catch (Exception e) {
			System.out
					.println("Error occured while fetching the nexmo numbers :"
							+ e.getMessage());

		}
		return "";
	}

	/***
	 * <p>
	 * Method is check the User nexmo account oauth if api_key and secret_key is
	 * valid then then it will return true else false
	 * </p>
	 * 
	 * @param apikey
	 * @param scretekey
	 * @return
	 */
	public static boolean checkNexmoAuthentication(String apikey,
			String scretekey) {

		if (StringUtils.isBlank(apikey) || StringUtils.isBlank(apikey))
			return false;
		try {
			String url = NexmoSMS.NEXMO_BASE_URL + "?";

			url += "api_key=" + URLEncoder.encode(apikey, "UTF-8");

			url += "&api_secret=" + URLEncoder.encode(scretekey, "UTF-8");

			// Check authentication key
			String response = HTTPUtil.accessURL(url);
			System.out.println("response:" + response);

			if (!StringUtils.contains(response, "authentication failed"))
				return true;
		} catch (Exception e) {
			System.out.println("Exception occured " + e.getMessage());
		}
		return false;
	}

}
