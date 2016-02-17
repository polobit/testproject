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
 * <code>TicketGroup</code> represents
 * 
 * @author Vaishnavi
 * 
 */
public class TicketGroup extends TaskletAdapter
{

	/**
	 * Ticket
	 */
	public static String TICKET = "ticket";

	/**
	 * Group id
	 */
	public static String TICKET_GROUP_ID = "group_id";

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
				// Get group ID
				String ticketGroupId = getStringValue(nodeJSON, subscriberJSON, data, TICKET_GROUP_ID);

				// Change Group and Assignee
				TicketsUtil.changeGroup(ticketJSON.getLong("id"), Long.parseLong(ticketGroupId));

				String message = "Ticket(#" + ticketJSON.getString("id") + ") group changed";
				try
				{
					message = message + " - "
							+ TicketGroups.ticketGroupsDao.get(Long.parseLong(ticketGroupId)).group_name;
				}
				catch (Exception e)
				{
				}

				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						message, LogType.TICKET_GROUP_CHANGED.toString());
			}

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("Got Exception while Changing Group ..." + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}
}