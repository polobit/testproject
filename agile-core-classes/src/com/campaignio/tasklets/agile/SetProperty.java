package com.campaignio.tasklets.agile;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
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

	//radio button 
	public static String ACTION="action";
	//radio button value
	public static String SET_NULL="SET_NULL";
	
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
		String action=getStringValue(nodeJSON,subscriberJSON,data,ACTION);
		
		// updates property
		JSONObject new_subscriber_json = update(updated_field, updated_value, action, campaignJSON, subscriberJSON);

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, new_subscriber_json, data, nodeJSON, null);

	}

	/**
	 * Updates or creates a new property for the contact. If the field already
	 * exists, this method updates the new value else creates a new property
	 * 
	 * @param updated_field
	 *            - Contact's field which has to be updated
	 * @param action
	 *				-radio button value
	 * @param updated_value
	 *            - Value of the Contact's field
	 * @param campaignJSON
	 *            - complete workflow json
	 * @param subscriberJSON
	 *            - contact json
	 */
	private JSONObject update(String updated_field, String updated_value, String action, JSONObject campaignJSON,
			JSONObject subscriberJSON)
	{
		try
		{

			// Get Contact Id and Contact
			String contactId = AgileTaskletUtil.getId(subscriberJSON);
			Contact contact = ContactUtil.getContact(Long.parseLong(contactId));

			if (contact == null)
				return subscriberJSON;
			
			//When clicks radio button set to null
			if(StringUtils.equalsIgnoreCase(SET_NULL, action))
			{
				contact.removeProperty(updated_field);
				contact.save();	
				
				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"Property " + updated_field + " is updated to empty",
						LogType.SET_PROPERTY.toString());
				
				return AgileTaskletUtil.getUpdatedSubscriberJSON(contact, subscriberJSON);

			}

			if (FieldType.SYSTEM == new ContactField(updated_field, updated_value, null).getFieldType())
				return update_system_property(contact, updated_field, updated_value, campaignJSON, subscriberJSON);

			// Get Custom field definition
			CustomFieldDef customFieldDef = CustomFieldDefUtil.getFieldByName(updated_field, SCOPE.CONTACT);

			if (customFieldDef == null)
			{
				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"Unable to set property '" + updated_field
								+ "' since there is no such Contact custom field defined.",
						LogType.SET_PROPERTY_FAILED.toString());

				return subscriberJSON;
			}

			// Get contact field
			ContactField field = contact.getContactField(updated_field);

			String isDate = "";
			switch (customFieldDef.field_type)
			{
			case NUMBER:
				if (field == null)
					field = numberSetProperty(true, updated_field, updated_value, new ContactField(updated_field,
							updated_value, null), campaignJSON, subscriberJSON);
				else
					field = numberSetProperty(false, updated_field, updated_value, field, campaignJSON, subscriberJSON);
				break;

			case DATE:
				if (field == null)
					field = dateSetProperty(true, updated_field, updated_value, new ContactField(updated_field,
							updated_value, null), campaignJSON, subscriberJSON);
				else
					field = dateSetProperty(false, updated_field, updated_value, field, campaignJSON, subscriberJSON);
				if (isIncOrDesc(updated_value))
					isDate = " days";

				break;

			case LIST:
				if (field == null)
					field = listSetProperty(true, updated_field, updated_value, new ContactField(updated_field,
							updated_value, null), campaignJSON, subscriberJSON, customFieldDef);
				else
					field = listSetProperty(true, updated_field, updated_value, field, campaignJSON, subscriberJSON,
							customFieldDef);
				break;

			default:
				if (field == null)
					field = new ContactField(updated_field, updated_value, null);
				else
					field.value = updated_value;
				break;
			}

			contact.addProperty(field);
			// Company gets removed in postload if not set to null
			contact.contact_company_id = null;
			System.out.println("Field is: " + field);
			if (field != null)
			{
				contact.save();

				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"Property " + updated_field + " is updated to " + updated_value + isDate,
						LogType.SET_PROPERTY.toString());
			}

			// Update subscriberJSON
			subscriberJSON = AgileTaskletUtil.getUpdatedSubscriberJSON(contact, subscriberJSON);

			return subscriberJSON;

		}
		catch (Exception e)
		{
			System.out.println("Exception occured in SetProperty tasklet..." + e.getMessage());
			return subscriberJSON;
		}

	}

	private JSONObject update_system_property(Contact contact, String updated_field, String updated_value,
			JSONObject campaignJSON, JSONObject subscriberJSON)
	{
		try
		{
			ContactField field = contact.getContactField(updated_field);

			if (field == null)
			{
				// create a new field
				ContactField newField = new ContactField(updated_field, updated_value, "");
				contact.addProperty(newField);
			}
			else
			{
				// update existing field
				field.value = updated_value;

				// Company gets removed in postload if not set to null
				contact.contact_company_id = null;
				contact.save();
			}

			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
					"Property " + updated_field + " is updated to " + updated_value, LogType.SET_PROPERTY.toString());

			// Update subscriberJSON
			subscriberJSON = AgileTaskletUtil.getUpdatedSubscriberJSON(contact, subscriberJSON);

			return subscriberJSON;
		}
		catch (Exception e)
		{
			System.out.println("Exception while updating system property" + e.getMessage());
			return subscriberJSON;
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
				System.out.println("Inside set property. The list doesn't have the given option");
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
							sdf = new SimpleDateFormat(DateUtil.WaitTillDateFormat);
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
						DateUtil dateUtil = new DateUtil();

						dateUtil.toTZ(timezone);
						dateUtil.setTime(new Date(Long.parseLong(contact_field.value) * 1000));
						dateUtil.addDays(updatedNumber);

						System.out.println("date util" + dateUtil.getTime().getTime());

						contact_field.value = dateUtil.getTime().getTime() / 1000L + "";
						return contact_field;
					}

					contact_field.value = (calendar.getTimeInMillis() / 1000L) + "";
				}
				else
				{
					contact_field.value = updated_value;
				}
			}
			else
				return null;
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
			try
			{
				if (isIncOrDesc(updated_value))
					contact_field.value = isNew ? Long.parseLong(updated_value) + "" : Long
							.parseLong(contact_field.value) + Long.parseLong(updated_value) + "";
				else
				{
					try
					{
						contact_field.value = Long.parseLong(updated_value) + "";
					}
					catch (Exception e)
					{
						System.out.println("Not a number");
						contact_field = null;
					}
				}
			}
			catch (Exception e)
			{
				System.out.println("Not a number");
				contact_field = null;
			}
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