package com.thirdparty;

import java.io.IOException;
import java.net.SocketTimeoutException;

import org.json.JSONObject;

import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.Widget;

/**
 * <code>Rapleaf</code> connects to Rapleaf (which provides information about a
 * person based on the email address). This classes connects to rapleaf using
 * unique api_key provided, and fetches the information.
 * 
 * @author invox-4
 * 
 */

public class Rapleaf {
	public static final String DATA = "Email";

	public static final String RAPLEAF = "rapleaf";

	// Results
	public static final String RAPPORTIVE_RESULT = "result";
	public static final String RAPPORTIVE_RESULT_SUCCESS = "success";
	public static final String RAPPORTIVE_RESULT_FAILURE = "failure";
	public static final String RAPPORTIVE_RESULT_FAILURE_MSSG = "failure_mssg";

	// Gender
	public static final String RAPPORTIVE_RESULT_GENDER = "gender";
	public static final String RAPPORTIVE_RESULT_GENDER_MALE = "Male";
	public static final String RAPPORTIVE_RESULT_GENDER_FEMALE = "Female";

	public static final String RAPPORTIVE_RESULT_LOCATION = "location";
	public static final String RAPPORTIVE_RESULT_AGE = "age";

	// URL
	public static final String RAPPORT_URL = "https://personalize.rapleaf.com/v4/dr?email=$email&api_key=$apikey";

	/**
	 * Fetches information using Rapleaf, sends email and API key to connect to
	 * Rapleaf, which returns information available regarding the email sent in
	 * request
	 * 
	 * @param email
	 *            Email address
	 * @return {@link JSONObject} return information as json object
	 * @throws Exception
	 */
	public static JSONObject getRapportiveValue(String email) throws Exception {
		return getRapportiveValue(email, "f3e71aadbbc564750d2057612a775ec6");// "15fd166425666ca2ddc857d00e777bee");
	}

	/**
	 * Connects to Rapleaf using the URL specified and API key fetched from
	 * widget
	 * 
	 * @param widget
	 *            {@link Widget} to fetch API key
	 * @param email
	 *            {@link String} email to fetch details for it
	 * @return {@link JSONObject} with Rapleaf details
	 * @throws Exception
	 */
	public static JSONObject getRapportiveValue(Widget widget, String email)
			throws SocketTimeoutException, IOException, Exception {
		System.out.println("In Rapleaf widget api_key "
				+ widget.getProperty("rapleaf_api_key"));
		JSONObject jobj = getRapportiveValue(email,
				widget.getProperty("rapleaf_api_key"));
		return jobj;
	}

	/**
	 * Connects to Rapleaf using the URL specified, replacing the email address
	 * on which information search is to done
	 * 
	 * @param email
	 *            {@link String} email to fetch details for it
	 * @param api_key
	 *            {@link String} API key of Rapleaf account
	 * @return {@link JSONObject} returns details as a JSON
	 * @throws Exception
	 */
	public static JSONObject getRapportiveValue(String email, String api_key)
			throws Exception {
		// Replaces contact email in the URL
		String url = RAPPORT_URL.replace("$email", email);

		// Replace the API key to make connection based on api_key
		url = url.replace("$apikey", api_key);

		/*
		 * Access the URL with email address and API key in it returns response
		 * a JSON String
		 */
		String rapleafResponse = HTTPUtil.accessURLUsingPost(url, null);

		System.out.println("Rapleaf response " + rapleafResponse);

		// If response is null or empty, return failure
		if (rapleafResponse == null || rapleafResponse.equals("{}")) {
			return new JSONObject().put(RAPPORTIVE_RESULT,
					RAPPORTIVE_RESULT_FAILURE);
		}

		// If it is not JSON, an exception is raised
		if (!rapleafResponse.startsWith("{")) {
			throw new Exception(rapleafResponse);
		}

		// Converts JSON string into JSONObject
		JSONObject rapleafJSONObject = new JSONObject(rapleafResponse);

		/*
		 * Returns the response sent as a JSONObject mapped with key "result"
		 * and success in addition to information sent from rapleaf
		 */
		return rapleafJSONObject.put(RAPPORTIVE_RESULT,
				RAPPORTIVE_RESULT_SUCCESS);
	}
}