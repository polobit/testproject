package com.agilecrm.util;

import org.json.JSONException;
import org.json.JSONObject;

public class JSAPIUtil
{
    public static enum Errors
    {
	UNAUTHORIZED("Invalid API key"), CONTACT_MISSING("Contact not found"), INVALID_PARAMETERS("Invalid parameter"), API_KEY_MISSING(
		"API key missing"), DUPLICATE_CONTACT("Duplicate found for \"%s\""), CONTACT_LIMIT_REACHED(
		"Contacts limit reached");

	String errorMessage;

	Errors(String errorMessage)
	{
	    this.errorMessage = errorMessage;
	}

	public String getErrorMessage()
	{
	    return this.errorMessage;
	}
    }

    public static String generateBasicErrorMessage()
    {
	JSONObject object = new JSONObject();
	try
	{
	    object.put("error", -1);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return object.toString();
    }

    public static String generateJSONErrorResponse(Errors error, String... parameters)
    {
	JSONObject object = new JSONObject();
	try
	{
	    if (parameters.length > 0)
		object.put("error", String.format(error.getErrorMessage(), parameters));
	    else
		object.put("error", error.getErrorMessage());
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return object.toString();
    }

    public static String generateContactMissingError()
    {
	return generateJSONErrorResponse(Errors.CONTACT_MISSING);
    }
}
