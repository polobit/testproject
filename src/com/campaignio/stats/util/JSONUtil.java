package com.campaignio.stats.util;

import org.json.JSONObject;

public class JSONUtil
{
    // Returns value of an element in JSON. If not present or null, returns ""
    public static String getJSONValue(JSONObject jsonObject, String propertyName)
    {

	if (jsonObject == null || propertyName == null)
	    return "";

	if (!jsonObject.has(propertyName))
	    return "";

	try
	{
	    return jsonObject.getString(propertyName);
	}
	catch (Exception e)
	{
	    return "";
	}
    }

}