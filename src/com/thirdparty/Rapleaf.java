package com.thirdparty;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.util.Util;

/**
 * <code>Rapleaf</code> connects to Rapleaf (which provides information about a
 * person based on the email address). This classes connects to rapleaf using
 * unique api_key provided, and fetches the information.
 * 
 * @author invox-4
 * 
 */
public class Rapleaf
{

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
    public static final String RAPPORT_URL = "https://personalize.rapleaf.com/v4/dr?email=$email&api_key=$apikey&show_available";

    /**
     * Fetches information using rapleaf, sends email and api key to connect to
     * rapleaf, which returns information available regarding the email sent in
     * request
     * 
     * @param email
     *            Email address
     * @return {@link JSONObject} return information as json object
     */
    public static JSONObject getRapportiveValue(String email)
    {
	return getRapportiveValue(email, "15fd166425666ca2ddc857d00e777bee");
    }

    /**
     * Connects to rapleaf using the url specified, replacing the email address
     * on which information search is to done
     * 
     * @param email
     * @param api_key
     * @return {@link JSONObject} returns details as a json
     */
    public static JSONObject getRapportiveValue(String email, String api_key)
    {
	try
	{
	    // Replaces contact email in the url
	    String url = RAPPORT_URL.replace("$email", email);

	    // Replate the api key to make connection based on api_key
	    url = url.replace("$apikey", api_key);

	    // Access the url with email address and api key in it returns
	    // response a JSON String
	    String rapleafResponse = Util.accessURL(url);

	    // Converts JSON string into JSONObject
	    JSONObject rapleafJSONObject = new JSONObject(rapleafResponse);

	    // Returns the response sent as a JSONObject mapped with key
	    // "result" and success in addition to information sent from rapleaf
	    return rapleafJSONObject.put(RAPPORTIVE_RESULT,
		    RAPPORTIVE_RESULT_SUCCESS);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    try
	    {
		// If an exception raised failure message is sent in json object
		return new JSONObject().put(RAPPORTIVE_RESULT,
			RAPPORTIVE_RESULT_FAILURE);
	    }
	    catch (JSONException e1)
	    {
		e1.printStackTrace();

	    }
	}

	return new JSONObject();
    }
}