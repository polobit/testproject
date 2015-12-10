package com.campaignio.tasklets.util;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.VersioningUtil;

/**
 * <code>MergeFieldsUitl</code> class is the utility class for merge fields
 * 
 * @author Kona
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
		String calendar_url = VersioningUtil.getHostURLByApp(domainUser.domain);

		if (schedule_id == null)
			schedule_id = domainUser.name;
		calendar_url += "calendar/" + schedule_id;

		return calendar_url;

	}

	/**
	 * Returns first name of a contact with all the first characters in upper
	 * case
	 * 
	 * @param subscriberJSON
	 * @return string
	 * 
	 */
	public static String firstNameFix(JSONObject subscriberJSON)
	{
		String firstName;
		try
		{
			firstName = subscriberJSON.getString("first_name");
			if (firstName.equals("null"))
				return "";

			return getUpperCase(getFirstWord(firstName));
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

	/**
	 * Returns a string with all the characters before space in upper case
	 * 
	 * @param name
	 * @return string
	 */
	public static String getFirstUpperCaseChar(String name)
	{
		String firstUpperCaseCharacter = "";
		name = name.replaceAll("[\\s&&[^\\n]]+", " ");
		name = name.toLowerCase();
		String nameArray[] = name.trim().split(" ");
		for (String word : nameArray)
			firstUpperCaseCharacter += Character.toString(word.charAt(0)).toUpperCase() + word.substring(1) + " ";
		return firstUpperCaseCharacter.trim();
	}

	/**
	 * Returns last name of a contact with all the first characters in upper
	 * case
	 * 
	 * @param subscriberJSON
	 * @return string
	 * 
	 */
	public static String lastNameFix(JSONObject subscriberJSON)
	{
		String lastName;
		try
		{
			lastName = subscriberJSON.getString("last_name");
			if (lastName.equals("null"))
				return "";

			return getUpperCase(getFirstWord(lastName));
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

	/**
	 * 
	 * @param domainUser
	 *            Domain User is the contact's owner
	 * @param subscriberJSON
	 * @return owner signature
	 * 
	 */
	public static String addSignatureMergeField(DomainUser domainUser, JSONObject subscriberJSON)
	{
		// Get AgileUser from domain User
		AgileUser agileUser = null;
		try
		{
			if (domainUser != null)
			{
				agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);

				UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);

				if (userPrefs != null)
					return userPrefs.signature;

			}
			System.out.println("The UserPrefs is null");
			return null;
		}
		catch (Exception e)
		{
			System.out.println("Exception in addSignatureMergeField.." + e.getMessage());
			return null;
		}
	}

	/**
	 * Returns first word in a string. Checks for a space and returns the first
	 * word with first letter in upper case
	 * 
	 * @param name
	 * @return string
	 */
	public static String getFirstWord(String name)
	{
		if (!StringUtils.isEmpty(name))
			return name.contains(" ") ? name.split(" ")[0] : name;

		return "";
	}

	public static String getUpperCase(String word)
	{
		String a = Character.toString(word.charAt(0)).toUpperCase() + word.substring(1);
		return a;
	}
}
