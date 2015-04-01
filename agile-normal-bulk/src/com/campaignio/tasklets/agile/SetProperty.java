package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
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

			// get the field to be updated
			if (contact == null)
				return;

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

		}
		catch (Exception e)
		{
			System.err.println("Exception occured in SetProperty tasklet..." + e.getMessage());
			e.printStackTrace();
		}

	}

}
