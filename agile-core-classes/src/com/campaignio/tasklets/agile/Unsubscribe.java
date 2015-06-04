package com.campaignio.tasklets.agile;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>Unsubscribe</code> represents Unsubscribe node in the workflow. It
 * either unsubscribes from few selected campaigns or all of them
 * 
 * 
 * @author Kona
 * 
 */
public class Unsubscribe extends TaskletAdapter
{
	/**
	 * Selected property - All
	 */
	public static String SELECT_ALL = "All";

	/*
	 * Unsubscibe select field
	 */
	public static String SELECT_ID = "unsubscribe";

	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		// Get unsubscribe List
		String unsubscribeFrom = getStringValue(nodeJSON, subscriberJSON, data, SELECT_ID);

		String subscriberID = AgileTaskletUtil.getId(subscriberJSON);

		String campaignID = AgileTaskletUtil.getId(campaignJSON);

		try
		{
			// Get list of all workflows
			if (SELECT_ALL.equals(unsubscribeFrom))
				if (unsubscribeAll(subscriberJSON, subscriberID, campaignID))
				{
					CampaignStatusUtil.setStatusOfCampaignWithName(subscriberID, campaignID, "", Status.DONE);
					return;
				}

			List<String> campaignIDs = getListOfCampaignIDs(nodeJSON, subscriberJSON, subscriberID, campaignJSON);

			int campaignIDsSize = campaignIDs.size();

			List<String> campaignNames = new ArrayList<String>();

			// Returns list of active campaigns
			List<String> activeCampaigns = ContactUtil.workflowListOfAContact(Long.parseLong(subscriberID));

			// Remove campaigns from cron
			for (int i = 0; i < campaignIDsSize; i++)
			{
				if (activeCampaigns.contains(campaignIDs.get(i)))
					campaignNames.add(setStatus(campaignIDs.get(i), subscriberID));
			}
			String message = "none.";
			if (campaignNames.size() != 0)
				message = getMessage(campaignNames);

			System.out.println("The message is: " + message + " and the campaign names are :" + campaignNames);
			LogUtil.addLogToSQL(campaignID, subscriberID, "Contact unsubscribed from " + message,
					LogType.UNSUBSCRIBE.toString());

			// If current campaigns
			if (campaignIDs.contains(campaignID))
			{
				CampaignStatusUtil.setStatusOfCampaignWithName(subscriberID, campaignID, "", Status.DONE);
				return;
			}
		}
		catch (Exception e)
		{
			System.out.println(" Exception in Unsubscribe Node " + e.getMessage());
		}

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

	}

	/**
	 * Unsubscribes all the campaigns and removes them from cron
	 * 
	 * @param subscriberJSON
	 * @param subscriberID
	 * @param campaignID
	 * @return true if unsubscribed
	 */
	private boolean unsubscribeAll(JSONObject subscriberJSON, String subscriberID, String campaignID)
	{

		Iterator<String> workflowsIDs;

		// List of active workflow
		workflowsIDs = ContactUtil.workflowListOfAContact(Long.parseLong(subscriberID)).iterator();

		List<String> campaignName = new ArrayList<String>();

		// remove each workflow from cron and set their status to removed
		while (workflowsIDs.hasNext())
		{
			String workflow = workflowsIDs.next();
			if (!workflow.equals(campaignID))
				campaignName.add(setStatus(workflow, subscriberID));
		}
		String message = "none.";
		if (campaignName.size() != 0)
			message = getMessage(campaignName);

		System.out.println("The message is: " + message + " and the campaign names are :" + campaignName);
		LogUtil.addLogToSQL(campaignID, subscriberID, "Contact unsubscribed from " + message,
				LogType.UNSUBSCRIBE.toString());
		return true;
	}

	private String getMessage(List<String> campaignName)
	{
		String message = "";
		int listSize = campaignName.size();
		if (listSize == 1)
			return "'" + campaignName.get(0) + "'.";
		else
		{
			for (int i = 0; i < listSize - 1; i++)
			{
				message += " '" + campaignName.get(i) + "'";
				if ((i + 1) != (listSize - 1))
					message += ", ";
			}
			message += " and '" + campaignName.get(listSize - 1) + "'.";

		}
		return message;
	}

	/**
	 * Returns list of Campaign ids from the select field
	 * 
	 * @param nodeJSON
	 * @param subscriberJSON
	 * @param subscriberID
	 * @param campaignJSON
	 * @return list of campaigns to be unsubscribed
	 */
	private List<String> getListOfCampaignIDs(JSONObject nodeJSON, JSONObject subscriberJSON, String subscriberID,
			JSONObject campaignJSON)
	{
		List<String> campaignIDs = new ArrayList<String>();
		JSONArray jsonArray;
		try
		{
			// This array consists of selected campaigns
			jsonArray = nodeJSON.getJSONArray(JSON_VALUES);

			int jsonArrayLength = jsonArray.length();

			// Iterate through name/value pairs. First one is the select option
			// ID and multi select ID

			for (int i = 1; i < jsonArrayLength; i++)
			{
				// Get the each JSON data

				JSONObject json = jsonArray.getJSONObject(i);

				// For Serialized data from ui - you will get name, value
				// pairs
				if (json.has("name"))
					campaignIDs.add((String) json.get("value"));

			}
		}
		catch (JSONException e)
		{
			return new ArrayList<String>();
		}

		return campaignIDs;
	}

	/**
	 * Sets status of the campaign to "REMOVED"
	 * 
	 * @param workflowID
	 * @param subscriberID
	 * @return Campaign Name
	 */
	private String setStatus(String workflowID, String subscriberID)
	{

		// remove workflow from cron
		CronUtil.removeTask(workflowID, subscriberID);

		// set status as removed
		return CampaignStatusUtil.setStatusOfCampaignWithName(subscriberID, workflowID, "", Status.REMOVED);
	}
}