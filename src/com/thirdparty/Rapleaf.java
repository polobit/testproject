package com.thirdparty;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.util.Util;

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

    public static JSONObject getRapportiveValue(String email)
    {
	return getRapportiveValue(email, "15fd166425666ca2ddc857d00e777bee");
    }

    public static JSONObject getRapportiveValue(String email, String api_key)
    {
	try
	{
	    System.out.println("Retrieving RapLeaf for " + email);
	    String url = RAPPORT_URL.replace("$email", email);
	    url = url.replace("$apikey", api_key);
	    System.out.println(url);
	    String rapleafResponse = Util.accessURL(url);
	    System.out.println(rapleafResponse);
	    JSONObject rapleafJSONObject = new JSONObject(rapleafResponse);

	    System.out.println("Rapleaf Response" + rapleafJSONObject);
	    return rapleafJSONObject.put(RAPPORTIVE_RESULT,
		    RAPPORTIVE_RESULT_SUCCESS);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    try
	    {
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