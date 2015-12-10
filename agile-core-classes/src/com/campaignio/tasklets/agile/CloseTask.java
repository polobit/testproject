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
			// Gets owner key
			Key<DomainUser> contactOwnerKey = getContactOwnerDomainKey(subscriberJSON, givenOwnerID);

			// Gets contact key
			Key<Contact> contactKey = AgileTaskletUtil.getContactKey(subscriberJSON);

			// Gets list of incomplete tasks
			List<Task> incompleteTasks = TaskUtil.getIncompleteTasks(contactOwnerKey, contactKey);
			String message = "";

			if (incompleteTasks.size() > 0)
			{
				// sets tasks as completed
				TaskUtil.setStatusAsComplete(incompleteTasks);

				// Gets message to be displayed in UI
				message = getMessage(incompleteTasks);

				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"Marked Task " + message + "  as completed.", LogType.CLOSED_TASK.toString());
			}
			else

				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"No tasks found.", LogType.CLOSED_TASK.toString());

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.err.println("Exception occured in CloseTask.java and the message is: " + e.getMessage());
		}

		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}

	/**
	 * @param subscriberJSON
	 *            - Subscriber json
	 * @return - Key of the owner of the contact associated with ID inside
	 *         subscriberJSON
	 */
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

	/**
	 * 
	 * @param incompleteTasks
	 *            - List of incomplete tasks
	 * @return - a message where the name of tasks are comma separated with
	 *         "and" before the last task
	 */
	private String getMessage(List<Task> incompleteTasks)
	{
		String message = "";
		int listSize = incompleteTasks.size();
		if (listSize == 1)
			return "'" + incompleteTasks.get(0).subject + "'";
		else
		{
			for (int i = 0; i < listSize - 1; i++)
			{
				message += " '" + incompleteTasks.get(i).subject + "'";
				if ((i + 1) != (listSize - 1))
					message += ", ";
			}
			message += " and '" + incompleteTasks.get(listSize - 1).subject + "'";

		}
		return message;
	}
}
