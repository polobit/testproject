package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>TicketEmailGroup</code> represents
 * 
 * @author Vaishnavi
 * 
 */
public class TicketEmailGroup extends TaskletAdapter
{

	/**
	 * Ticket
	 */
	public static String TICKET = "ticket";

	/**
	 * Ticket Group id
	 */
	public static String TICKET_GROUP_ID = "email-group";

	/**
	 * Email Subject
	 */
	public static String SUBJECT = "subject";

	/**
	 * Email Body
	 */
	public static String BODY = "email-body";

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
	 * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
	 */
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		try
		{
			System.out.println("TicketEmailGroup: Intiated");
			
			JSONObject ticketJSON = data.getJSONObject(TICKET);

			if (ticketJSON != null)
			{
				// Get group id
				String groupId = getStringValue(nodeJSON, subscriberJSON, data, TICKET_GROUP_ID);

				// Ticket subject
				String subject = getStringValue(nodeJSON, subscriberJSON, data, SUBJECT);

				// Ticket body
				String emailBody = getStringValue(nodeJSON, subscriberJSON, data, BODY);
				
				System.out.println("TicketEmailGroup groupId: " + groupId);
				
				// Change Group and Assignee
				TicketsUtil.sendEmailToGroup(Long.parseLong(groupId), subject, emailBody);

				String message = "Ticket(#" + ticketJSON.getString("id") + ") email sent to group";
				try
				{
					message = message + " - " + TicketGroups.ticketGroupsDao.get(Long.parseLong(groupId)).group_name;
				}
				catch (Exception e)
				{
				}

				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						message, LogType.TICKET_EMAIL_GROUP.toString());

			}

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("Got Exception while Sending email to group ..." + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}
}