package com.campaignio.tasklets.util;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.user.DomainUser;

/**
 * <code>MergeFieldsUitl</code> class is the utility class for merge fields
 * 
 * @author Bhasuri
 * 
 */
public class MergeFieldsUtil
{
	/**
	 * Adds calendar url to the subscriber json
	 * 
	 * @param domainUser
	 * @param subscriberJSON
	 * @return calendar URL
	 */
	public static String addCalendarMergeField(DomainUser domainUser, JSONObject subscriberJSON)
	{
		// local http://localhost:8888
		// beta-sandbox
		// "https://"+domainUser.domain+"-dot-sandbox-dot-agilecrmbeta.appspot.com"
		// version "https://"+domainUser.domain+".agilecrm.com"

		String schedule_id = domainUser.schedule_id;
		String calendar_url = "https://" + domainUser.domain + ".agilecrm.com";

		if (schedule_id == null)
			schedule_id = domainUser.name;
		calendar_url += "/calendar/" + schedule_id;

		return calendar_url;

	}

	public static String firstNameFix(JSONObject subscriberJSON)
	{
		String firstName;
		try
		{
			firstName = subscriberJSON.getString("first_name");
			if (firstName.equals("null"))
				return "";

			return getFirstUpperCaseChar(firstName);
		}
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
			return "";
		}
		catch (Exception e)
		{
			System.err.println("Exception in firstNameFix:" + e.getMessage());
			return "";
		}

	}

	private static String getFirstUpperCaseChar(String name)
	{
		String firstUpperCaseCharacter = "";
		name = name.replaceAll("[\\s&&[^\\n]]+", " ");
		name = name.toLowerCase();
		String nameArray[] = name.trim().split(" ");
		for (String word : nameArray)
			firstUpperCaseCharacter += Character.toString(word.charAt(0)).toUpperCase() + word.substring(1) + " ";
		return firstUpperCaseCharacter.trim();
	}

	public static String lastNameFix(JSONObject subscriberJSON)
	{
		String lastName;
		try
		{
			lastName = subscriberJSON.getString("last_name");
			if (lastName.equals("null"))
				return "";

			return getFirstUpperCaseChar(lastName);
		}
		catch (JSONException e)
		{
			e.printStackTrace();
			return "";
		}
		catch (Exception e1)
		{
			System.err.println("Exception in lastNameFix:" + e1.getMessage());
			return "";
		}
	}

}
