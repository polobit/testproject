package com.campaignio.tasklets.agile;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.user.DomainUser;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.googlecode.objectify.Key;

/**
 * <code>CloseTask</code> represents close_task node in campaigns. It will mark
 * the tasks for that owner related to the contact as complete.
 * 
 * @author Kona
 * 
 */
public class CloseTask extends TaskletAdapter
{
	/**
	 * Owner Id
	 */
	public static String OWNER_ID = "owner_id";

	/**
	 * Any owner
	 */
	public static String ANY_OWNER = "any_owner";

	/**
	 * Contact owner
	 */
	public static String CONTACT_OWNER = "contact_owner";

	/**
	 * Branch Yes
	 */
	public static String BRANCH_YES = "yes";

	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		String givenOwnerID = getStringValue(nodeJSON, subscriberJSON, data, OWNER_ID);

		try
		{

			Key<DomainUser> contactOwnerKey = getContactOwnerDomainKey(subscriberJSON, givenOwnerID);

			Key<Contact> contactKey = getContactKey(subscriberJSON);

			List<Task> incompleteTasks = TaskUtil.getIncompleteTasks(contactOwnerKey, contactKey);

			if (incompleteTasks.size() > 0)
				TaskUtil.setStatusAsComplete(incompleteTasks);

			// Creates log for sending email
			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
					"Close task campaign log text", LogType.CLOSE_TASK.toString());

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured in CloseTask.java and the message is: " + e.getMessage());
		}

		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}

	private Key<Contact> getContactKey(JSONObject subscriberJSON)
	{
		String contactId = AgileTaskletUtil.getId(subscriberJSON);
		try
		{
			if (!StringUtils.isEmpty(contactId))
				return new Key<Contact>(Contact.class, Long.parseLong(contactId));
		}
		catch (Exception e)
		{
			System.out.println("Inside getContactOwnerKey in CloseTask.java :" + e.getMessage());
			return null;
		}
		return null;
	}

	private Key<DomainUser> getContactOwnerDomainKey(JSONObject subscriberJSON, String givenOwnerID)
	{
		try
		{
			String contactOwnerID = AgileTaskletUtil.getContactOwnerIdFromSubscriberJSON(subscriberJSON);

			Long actualOwnerID = null;
			if (!StringUtils.isEmpty(contactOwnerID))
				actualOwnerID = AgileTaskletUtil.getOwnerId(givenOwnerID, Long.parseLong(contactOwnerID));

			if (actualOwnerID != null)
				return new Key<DomainUser>(DomainUser.class, actualOwnerID);

		}
		catch (Exception e)
		{
			System.out.println("Inside getContactOwnerKey in CloseTask.java :" + e.getMessage());
			return null;
		}
		return null;

	}
}
