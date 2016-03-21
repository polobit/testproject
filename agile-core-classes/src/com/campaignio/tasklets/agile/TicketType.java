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
 * <code>TicketType</code> represents
 * 
 * @author Vaishnavi
 * 
 */
public class TicketType extends TaskletAdapter
{

	/**
	 * Ticket
	 */
	public static String TICKET = "ticket";

	/**
	 * Ticket type
	 */
	public static String TYPE = "ticket-type";

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

			// Get Type
			String ticketType = getStringValue(nodeJSON, subscriberJSON, data, TYPE);

			JSONObject ticketJSON = data.getJSONObject(TICKET);

			if (ticketJSON != null)
			{
				TicketsUtil.changeTicketType(ticketJSON.getLong("id"), Tickets.Type.valueOf(ticketType), true);

				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"Ticket(" + ticketJSON.getString("id") + ") type changed  - " + ticketType,
						LogType.TICKET_TYPE.toString());
			}

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("Got Exception while Changing ticket Type ..." + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}
}