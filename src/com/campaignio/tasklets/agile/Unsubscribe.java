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
 * <code>URLVisited</code> represents URLVisited node in the workflow. It access
 * given url. If output obtained is JSONObject, the node under branch Yes is
 * processed, otherwise branch No is processed.
 * 
 * @author Naresh
 * 
 */
public class Unsubscribe extends TaskletAdapter
{
	/**
	 * Selected property - Yes
	 */
	public static String BRANCH_YES = "All";

	/**
	 * Selected property - No
	 */
	public static String BRANCH_NO = "No";

	/*
	 * Unsubscibe select field
	 */
	public static String SELECT_ID = "unsubscribe";

	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		// Get URL value and type
		String unsubscribeFrom = getStringValue(nodeJSON, subscriberJSON, data, SELECT_ID);

		String subscriberID = AgileTaskletUtil.getId(subscriberJSON);

		String campaignID = AgileTaskletUtil.getId(campaignJSON);

		// Get list of all workflows
		if (BRANCH_YES.equals(unsubscribeFrom))
			if (unsubscribeAll(subscriberJSON, subscriberID, campaignID))
				return;

		List<String> campaignIDs = getListOfCampaignIDs(nodeJSON, subscriberJSON, subscriberID, campaignJSON);

		int campaignIDsSize = campaignIDs.size();

		List<String> campaignNames = new ArrayList<String>();

		for (int i = 0; i < campaignIDsSize; i++)
			campaignNames.add(setStatus(campaignIDs.get(i), subscriberID));

		String message = getMessage(campaignNames);
		System.out.println(message + "fdsfadsf");

		LogUtil.addLogToSQL(campaignID, subscriberID, "Contact unsubscribed from " + message,
				LogType.UNSUBSCRIBED_CAMPAIGN.toString());

		if (campaignIDs.contains(campaignID))
			return;

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

	}

	private boolean unsubscribeAll(JSONObject subscriberJSON, String subscriberID, String campaignID)
	{

		Iterator<String> workflowsIDs;
		workflowsIDs = ContactUtil.workflowListOfAContact(Long.parseLong(subscriberID)).iterator();

		List<String> campaignNames = new ArrayList<String>();

		// remove each workflow from cron and set their status to removed
		while (workflowsIDs.hasNext())
			campaignNames.add(setStatus(workflowsIDs.next(), subscriberID));

		String message = getMessage(campaignNames);

		System.out.println("mesages is");
		LogUtil.addLogToSQL(campaignID, subscriberID, "Contact unsubscribed from " + message,
				LogType.UNSUBSCRIBED_CAMPAIGN.toString());
		return true;
	}

	private String getMessage(List<String> campaignNames)
	{
		int listSize = campaignNames.size();

		String message = null;

		if (listSize == 1)
			return message = campaignNames.get(0) + ".";
		else
		{
			for (int i = 0; i < listSize - 1; i++)
				message += campaignNames.get(i) + ", ";

			message = " and " + campaignNames.get(listSize) + ".";
		}
		return message;
	}

	private List<String> getListOfCampaignIDs(JSONObject nodeJSON, JSONObject subscriberJSON, String subscriberID,
			JSONObject campaignJSON)
	{
		List<String> campaignIDs = new ArrayList<String>();
		JSONArray jsonArray;
		try
		{
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
			// TODO Auto-generated catch block
			e.printStackTrace();
			return new ArrayList<String>();
		}

		return campaignIDs;
	}

	private String setStatus(String workflowID, String subscriberID)
	{

		// remove workflow from cron
		CronUtil.removeTask(workflowID, subscriberID);

		// set status as removed
		return CampaignStatusUtil.setSatatusOfCampaignWithNames(subscriberID, workflowID, "", Status.REMOVED);
	}
}