package com.campaignio.tasklets.agile;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.sun.org.apache.xalan.internal.xsltc.compiler.sym;

/**
 * <code>TicketStatus</code> represents
 * 
 * @author Manohar
 * 
 */
public class TicketStatus extends TaskletAdapter
{

	/**
	 * Ticket
	 */
	public static String TICKET = "ticket";

	/**
	 * Ticket status
	 */
	public static String STATUS = "status";

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

			// Get ststus
			String status = getStringValue(nodeJSON, subscriberJSON, data, STATUS);

			JSONObject ticketJSON = data.getJSONObject(TICKET);
           
			System.out.println("status changed to through campaign: "+StringUtils.capitalize(status.toLowerCase()));
            
			if (ticketJSON != null)
			{
				TicketsUtil.changeStatus(ticketJSON.getLong("id"), Tickets.Status.valueOf(status), true);

				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"Ticket(" + ticketJSON.getString("id") + ") status changed  - " + StringUtils.capitalize(status.toLowerCase()),
						LogType.TICKET_STATUS.toString());

			}

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("Got Exception while Changing ticket Status..." + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}
	
}