package com.campaignio.tasklets.agile;

import java.util.Calendar;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.ticket.utils.TicketsUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>TicketSetSLA</code> class represents set SLA time on ticket. Wait is to
 * set SLA duration period in the workflow. It consists of duration period and
 * duration type.
 * 
 * @author Vaishnavi
 * 
 */
public class TicketSetSLA extends TaskletAdapter
{
	/**
	 * Duration period
	 */
	public static String DURATION = "duration";

	/**
	 * Duration type such as Days,Hours and Minutes
	 */
	public static String DURATION_TYPE = "duration_type";

	/**
	 * Ticket
	 */
	public static String TICKET = "ticket";

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
	 * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
	 */
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		// Get Duration, Type
		String duration = getStringValue(nodeJSON, subscriberJSON, data, DURATION);
		String durationType = getStringValue(nodeJSON, subscriberJSON, data, DURATION_TYPE);

		System.out.println("Waiting for " + duration + " " + durationType);

		Calendar cal = Calendar.getInstance();
		Long SLATime = cal.getTimeInMillis();

		if (StringUtils.isNotBlank(durationType) && StringUtils.equalsIgnoreCase(durationType, "hours"))
			SLATime = SLATime + (Integer.parseInt(duration) * 60 * 60 * 1000);

		try
		{
			JSONObject ticketJSON = data.getJSONObject(TICKET);

			Long ticketID = ticketJSON.getLong("id");
			
			if (ticketJSON != null && StringUtils.isNotBlank(durationType) && StringUtils.isNotBlank(duration))
			{
				// Set SLA
				TicketsUtil.changeDueDate(ticketID, SLATime, true);

				LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
						"Ticket(#" + ticketID + ") SLA changed - " + duration + " hours",
						LogType.TICKET_SET_SLA.toString());

			}
		}
		catch (Exception e)
		{
			System.out.println("Exception in TicketsUtil.changeDueDate :" + e.getMessage());
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

	}
}
