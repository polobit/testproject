package com.campaignio.tasklets.agile;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.util.DateUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>SetProperty</code> represents update node in workflow. It updates a
 * particular field(including custom fields) of a contact.
 * 
 * @author Bhasuri
 * 
 */

public class SetProperty extends TaskletAdapter
{

	/**
	 * The field to be updated.
	 */
	public static String UPDATED_FIELD = "updated_field";

	/**
	 * The value of the field which has to be updated.
	 */
	public static String UPDATED_VALUE = "updated_value";

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
	 * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
	 */

	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		String updated_field = getStringValue(nodeJSON, subscriberJSON, data, UPDATED_FIELD);
		String updated_value = getStringValue(nodeJSON, subscriberJSON, data, UPDATED_VALUE);

		// updates property
		update(updated_field, updated_value, campaignJSON, subscriberJSON);

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

	}

	/**
	 * Updates or creates a new property for the contact. If the field already
	 * exists, this method updates the new value else creates a new property
	 * 
	 * @param updated_field
	 *            - Contact's field which has to be updated
	 * @param updated_value
	 *            - Value of the Contact's field
	 * @param campaignJSON
	 *            - complete workflow json
	 * @param subscriberJSON
	 *            - contact json
	 */
	private void update(String updated_field, String updated_value, JSONObject campaignJSON, JSONObject subscriberJSON)
	{

		try
		{

			// Get Contact Id and Contact
			String contactId = AgileTaskletUtil.getId(subscriberJSON);
			Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

			if (contact == null)
				return;

			// Get Custom field definition
			CustomFieldDef customFieldDef = CustomFieldDefUtil.getFieldByName(updated_field, SCOPE.CONTACT);

			if (customFieldDef == null)
			{
				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"There is no custom field -" + updated_field, LogType.SET_PROPERTY.toString());

				return;
			}

			// Get contact field
			ContactField field = contact.getContactField(updated_field);

			switch (customFieldDef.field_type)
			{
			case NUMBER:
				if (field == null)
					field = numberSetProperty(true, updated_field, updated_value, field, campaignJSON, subscriberJSON);
				else
					field = numberSetProperty(false, updated_field, updated_value, field, campaignJSON, subscriberJSON);
				break;

			case DATE:
				if (field == null)
					field = dateSetProperty(true, updated_field, updated_value, field, campaignJSON, subscriberJSON);
				else
					field = dateSetProperty(false, updated_field, updated_value, field, campaignJSON, subscriberJSON);
				break;

			case LIST:
				if (field == null)
					field = listSetProperty(true, updated_field, updated_value, field, campaignJSON, subscriberJSON,
							customFieldDef);
				else
					field = listSetProperty(true, updated_field, updated_value, field, campaignJSON, subscriberJSON,
							customFieldDef);
				break;

			default:
				break;
			}

			contact.addProperty(field);
			// Company gets removed in postload if not set to null
			contact.contact_company_id = null;
			System.out.println("Field is: " + field);
			if (field != null)
				contact.save();

		}
		catch (Exception e)
		{
			System.err.println("Exception occured in SetProperty tasklet..." + e.getMessage());
			e.printStackTrace();
		}

	}

	private ContactField listSetProperty(boolean isNew, String updated_field, String updated_value,
			ContactField contact_field, JSONObject campaignJSON, JSONObject subscriberJSON,
			CustomFieldDef customFieldDef)
	{
		try
		{

			// Get all the items of the current list
			List<String> list = new ArrayList<String>(Arrays.asList(customFieldDef.field_data.split(";")));

			if (!list.contains(updated_value))
			{
				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"The value entered is not a value in  " + customFieldDef.field_label + updated_field,
						LogType.SET_PROPERTY.toString());
				return null;
			}

			contact_field.value = updated_value;

		}
		catch (Exception e)
		{
			System.out.println("Inside set property. Exception caught in list type: " + e.getMessage());
			return null;
		}
		return contact_field;
	}

	private ContactField dateSetProperty(boolean isNew, String updated_field, String updated_value,
			ContactField contact_field, JSONObject campaignJSON, JSONObject subscriberJSON)
	{
		String timezone = null;
		int updatedNumber = 0;
		try
		{
			timezone = subscriberJSON.getJSONObject("data").getString("timezone");
		}
		catch (Exception e)
		{
			System.out.println("No timezone found in subscriberJSON: " + e.getMessage());
			timezone = AccountPrefsUtil.getTimeZone();
		}

		try
		{
			SimpleDateFormat sdf = null;
			Pattern calendarPattern = Pattern.compile(DateUtil.WaiTillDateRegEx);
			Matcher calendarMatcher = calendarPattern.matcher(updated_value);

			if (calendarMatcher.matches())
				sdf = new SimpleDateFormat(DateUtil.WaitTillDateFormat);
			if (sdf == null)
				if (isIncOrDesc(updated_value))
				{
					updatedNumber = Integer.parseInt(updated_value);

					if (!isNew)
						if (updatedNumber != 0)
						{
							Matcher calendarMatcherOld = calendarPattern.matcher(contact_field.value);
							if (calendarMatcherOld.matches())
								sdf = new SimpleDateFormat(DateUtil.WaitTillDateFormat);
						}
				}

			if (sdf != null)
			{
				TimeZone timeZone = null;
				if (!StringUtils.isEmpty(timezone))
				{
					timeZone = TimeZone.getTimeZone(timezone);

					Calendar calendar = Calendar.getInstance(timeZone);
					if (updatedNumber == 0)
						calendar.setTime(sdf.parse(updated_value));
					else
					{
						calendar.setTime(sdf.parse(contact_field.value));
						calendar.add(Calendar.DATE, updatedNumber);
					}

					contact_field.value = (calendar.getTimeInMillis() / 1000L) + "";
				}
				else
				{
					contact_field.value = updated_value;
				}
			}
			else
			{
				contact_field.value = updated_value;
			}
		}
		catch (Exception e)
		{
			System.out.println("Inside set property. Exception caught in list type: " + e.getMessage());
			contact_field.value = updated_value;
			return null;
		}

		return contact_field;
	}

	private ContactField numberSetProperty(boolean isNew, String updated_field, String updated_value,
			ContactField contact_field, JSONObject campaignJSON, JSONObject subscriberJSON)
	{
		try
		{
			if (isIncOrDesc(updated_value))
				contact_field.value = isNew ? Long.parseLong(updated_value.substring(1)) + "" : Long
						.parseLong(contact_field.value) + Long.parseLong(updated_value) + "";
			else
				contact_field.value = updated_value;
		}
		catch (Exception e)
		{
			notANumber(e.getMessage(), campaignJSON, subscriberJSON, updated_field);
			return null;
		}
		return contact_field;
	}

	private void notANumber(String exception_message, JSONObject campaignJSON, JSONObject subscriberJSON,
			String updated_field)
	{
		System.out.println("Inside set property. Exception caught in initilising number type: " + exception_message);
		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
				"The value entered is not a number for custom field " + updated_field, LogType.SET_PROPERTY.toString());
	}

	private boolean isIncOrDesc(String updatedValue)
	{

		if (StringUtils.isEmpty(updatedValue))
			return false;
		try
		{
			Integer.parseInt(updatedValue);
		}
		catch (Exception e)
		{
			System.out.println("Not a number");
			return false;
		}
		if (updatedValue.charAt(0) == '+' || updatedValue.charAt(0) == '-')
			return true;

		return false;
	}

}