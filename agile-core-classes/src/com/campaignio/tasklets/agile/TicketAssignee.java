package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.ticket.utils.TicketsUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>TicketAssignee</code>
 * 
 * @author Vaishnavi
 * 
 */
public class TicketAssignee extends TaskletAdapter
{

	/**
	 * Ticket
	 */
	public static String TICKET = "ticket";

	/**
	 * Ticket Group
	 */
	public static String TICKET_GROUP_ID = "group-id";

	/**
	 * Ticket assignee
	 */
	public static String TICKET_ASSIGNEE_ID = "assignee-id";

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
				// Get group
				String ticketGroupId = getStringValue(nodeJSON, subscriberJSON, data, TICKET_GROUP_ID);

				// Get assignee
				String ticketAssigneeId = getStringValue(nodeJSON, subscriberJSON, data, TICKET_ASSIGNEE_ID);

				// Change Group and Assignee
				TicketsUtil.changeGroupAndAssignee(ticketJSON.getLong("id"), Long.parseLong(ticketGroupId),
						Long.parseLong(ticketAssigneeId));
			}

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("Got Exception while Changing Assignee ..." + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}
}