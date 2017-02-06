package com.agilecrm;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.util.HTTPUtil;

/**
 * 
 * <code>NexmoSMS</code> is where the message sending is initiated from. It is
 * like a Util class for only Nexmo SMS
 * 
 * @author Priyanka
 * @since January 2017
 */

public class NexmoSMS {

	/**
	 * Nexmo_BASE_URL is for tto account Number verification
	 * */
	public static final String NEXMO_BASE_URL = "https://rest.nexmo.com/account/numbers";
	/**
	 * Nexmo base Url for sending the message
	 * */
	public static final String BASE_URL = "https://rest.nexmo.com/sms/json";

	// public static final String BASE_URL_AUTH =
	// "https://rest.nexmo.com/search/message";
	/***
	 * Nexmo API key
	 * */
	public static final String NEXMO_API_KEY = "api_key";

	/**
	 * Nexmo secret key
	 * */
	public static final String NEXMO_API_SECRET = "api_secret";

	/**
	 * Nexmo from number
	 * */

	public static final String SMS_FROM = "from";

	/***
	 * Nexmo to number
	 */

	public static final String SMS_TO = "to";

	/***
	 * Nexmo text
	 */
	public static final String SMS_TEXT = "sms_text";

	/**
	 * public static final variable for the sms send activity
	 * 
	 * */

	public static final String SMS_SENT = "SMS Sent";

	/**
	 * public static final variable for the sms send activity
	 * */

	public static final String SMS_SENDING_FAILED = "SMS Failed";

	public static void main(String asd[]) throws Exception {
		System.out.println(checkNexmoAuthentication("fjhhg", "dfhjdghghfh"));

	}

	/**
	 * 
	 * @param apiKey
	 * @param secretKey
	 * @param from
	 * @param to
	 * @param text
	 * @return
	 * @throws Exception
	 */
	public static int sendNexmoSMS(String apiKey, String secretKey, String to,
			String from, String text) throws Exception {

		if (StringUtils.isBlank(apiKey) || StringUtils.isBlank(apiKey))
			return 1;

		String url = BASE_URL + "?";

		url += "&api_key=" + URLEncoder.encode(apiKey, "UTF-8");

		url += "&api_secret=" + URLEncoder.encode(secretKey, "UTF-8");

		url += "&to=" + URLEncoder.encode(to, "UTF-8");

		url += "&from=" + URLEncoder.encode(from, "UTF-8");

		url += "&text=" + URLEncoder.encode(text, "UTF-8");

		// Send sms
		String response = HTTPUtil.accessURL(url);
		System.out.println("respose" + response);
		int status = 1;

		if (StringUtils.isNotBlank(response)) {
			JSONObject jsonObject = new JSONObject(response);
			status = jsonObject.getJSONArray("messages").getJSONObject(0)
					.getInt("status");
		}

		return status;
	}

	/***
	 * 
	 * 
	 * @param apiKey
	 * @param secretKey
	 * @return
	 * @throws UnsupportedEncodingException
	 * @throws JSONException
	 */
	public static String getNexmoFromNumbers(String apiKey, String secretKey)
			throws UnsupportedEncodingException, JSONException {

		if (StringUtils.isBlank(apiKey) || StringUtils.isBlank(apiKey))
			return null;

		String url = NEXMO_BASE_URL + "?";

		url += NEXMO_API_KEY + "=" + URLEncoder.encode(apiKey, "UTF-8");

		url += "&api_secret=" + URLEncoder.encode(secretKey, "UTF-8");

		System.out.println(url);
		// Send sms
		String response = HTTPUtil.accessURL(url);

		String status = "";

		if (StringUtils.isNotBlank(response)) {
			JSONObject jsonObject = new JSONObject(response);
			// status =
			// jsonObject.getJSONArray("messages").getJSONObject(0).getInt("status");
		}

		return status;

	}

	/***
	 * 
	 * @param apikey
	 * @param scretekey
	 * @return
	 */

	public static boolean checkNexmoAuthentication(String apikey,
			String scretekey) {
		boolean flag = false;

		if (!(StringUtils.isBlank(apikey) && StringUtils.isBlank(scretekey))) {
			try {
				String url = "https://rest.nexmo.com/account/numbers" + "?";

				url += "api_key=" + URLEncoder.encode(apikey, "UTF-8");

				url += "&api_secret=" + URLEncoder.encode(scretekey, "UTF-8");

				// Check authentication key
				String response = HTTPUtil.accessURL(url);
				System.out.println("response:" + response);

				if (response != null) {
					flag = true;
				}
			} catch (Exception e) {
				System.out.println("Exception occured " + e.getMessage());
			}
		}
		return flag;
	}
}