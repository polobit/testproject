package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>TicketPriority</code> represents
 * 
 * @author Vaishnavi
 * 
 */
public class TicketPriority extends TaskletAdapter
{

	/**
	 * Ticket
	 */
	public static String TICKET = "ticket";

	/**
	 * Ticket priority
	 */
	public static String PRIORITY = "priority";

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

			// Get priority
			String priority = getStringValue(nodeJSON, subscriberJSON, data, PRIORITY);

			JSONObject ticketJSON = data.getJSONObject(TICKET);

			System.out.println("ticketJSON: " + ticketJSON);

			if (ticketJSON != null)
			{
				TicketsUtil.changePriority(ticketJSON.getLong("id"), Tickets.Priority.valueOf(priority));

				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"Ticket(#" + ticketJSON.getString("id") + ") priority changed - " + priority,
						LogType.TICKET_PRIORITY.toString());

			}

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("Got Exception while Changing ticket Priority..." + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}

}