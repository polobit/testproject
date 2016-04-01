package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.ticket.utils.TicketsUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>TicketEmailUser</code> represents
 * 
 * @author Vaishnavi
 * 
 */
public class TicketEmailUser extends TaskletAdapter
{

	/**
	 * Ticket
	 */
	public static String TICKET = "ticket";

	/**
	 * Ticket Group id
	 */
	public static String EMAIL_USER = "email-user";

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

			JSONObject ticketJSON = data.getJSONObject(TICKET);

			if (ticketJSON != null)
			{

				// Get email user
				String emailUserId = getStringValue(nodeJSON, subscriberJSON, data, EMAIL_USER);

				// Ticket subject
				String subject = getStringValue(nodeJSON, subscriberJSON, data, SUBJECT);

				// Ticket body
				String emailBody = getStringValue(nodeJSON, subscriberJSON, data, BODY);

				// Change Group and Assignee
				TicketsUtil.sendEmailToUser(emailUserId, subject, emailBody);

				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"Ticket(#" + ticketJSON.getString("id") + ") email sent to user - " + emailUserId,
						LogType.TICKET_EMAIL_USER.toString());

			}

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("Got Exception while Sending email to user ..." + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}

}