package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.agilecrm.ticket.utils.TicketsUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>TicketTags</code> represents
 * 
 * @author Vaishnavi
 * 
 */
public class TicketTags extends TaskletAdapter
{

	public static String TICKET = "ticket";

	/**
	 * Type - Add/Delete
	 */
	public static String TYPE = "type";

	/**
	 * Type Add for adding tags
	 */
	public static String ADD = "add";

	/**
	 * Type Delete for deleting tags
	 */
	public static String DELETE = "delete";

	/**
	 * Tags that are added
	 */
	public static String TAG_NAMES = "tag_names";

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

			// Get Tags and Type
			String type = getStringValue(nodeJSON, subscriberJSON, data, TYPE);
			String tagNames = getStringValue(nodeJSON, subscriberJSON, data, TAG_NAMES);

			JSONObject ticketJSON = data.getJSONObject(TICKET);

			if (ticketJSON != null)
			{
				String ticketId = ticketJSON.getString("id");

				String tags = AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', tagNames);

				System.out.println("Normalized tags are " + tags);

				String[] tagsArray = tags.split(",");

				TicketsUtil.updateTags(ticketId, tagsArray, type);

			}

		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("Got Exception while updating ticket tags... " + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
	}
}