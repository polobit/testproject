package com.agilecrm.social;

import org.json.JSONObject;

import com.agilecrm.widgets.Widget;
import com.plivo.helper.api.client.RestAPI;
import com.plivo.helper.exception.PlivoException;

public class PlivoUtil
{
	/** Plivo API version */
	public static final String PLIVO_VERSION = "v1";

	/**
	 * PLIVO authentication token of the account which contains Agile
	 * application
	 */
	public static final String AUTH_TOKEN = null; // default

	/**
	 * Checks the given Account ID and Auth Token is valid or not
	 * 
	 * @author Bhasuri
	 * 
	 **/
	public static boolean checkCredentials(String authId, String auth_token)
	{
		RestAPI api = new RestAPI(authId, auth_token, PLIVO_VERSION);
		try
		{
			api.getAccount();
		}
		catch (PlivoException e)
		{
			System.out.println(e.getLocalizedMessage());
			return false;
		}
		catch (Exception e)
		{
			System.out.println();
			return false;
		}

		return true;
	}

	/**
	 * Returns Account ID from a widget
	 * 
	 * @author Bhasuri
	 **/
	public static String getAccountID(Widget widget)
	{

		String account_id = null;
		try
		{
			String prefs = widget.prefs;
			JSONObject prefsJSON = new JSONObject(prefs);
			account_id = prefsJSON.getString("account_id");
		}
		catch (Exception e)
		{

			System.out.println("Inside getAccountID");
			e.printStackTrace();
		}

		return account_id;
	}

	/**
	 * Returns Auth token from a widget
	 * 
	 * @author Bhasuri
	 **/
	public static String getAuthToken(Widget widget)
	{

		String auth_token = null;

		try
		{
			String prefs = widget.prefs;
			JSONObject prefsJSON = new JSONObject(prefs);
			auth_token = prefsJSON.getString("auth_token");
		}
		catch (Exception e)
		{
			System.out.println("Inside getAuthToken");
			e.printStackTrace();
		}

		return auth_token;
	}

}