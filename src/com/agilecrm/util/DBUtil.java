package com.agilecrm.util;

import org.json.JSONObject;

public class DBUtil
{

	// JSON - Google App Engine DB Key
	public final static String DATASTORE_KEY_IN_JSON = "id";

	// Get ID from JSONObject - gets id and thn $oid
	public static String getId(JSONObject json)
	{

		try
		{
			return json.getString(DATASTORE_KEY_IN_JSON);
		}
		catch (Exception e)
		{
			return null;
		}
	}

}
