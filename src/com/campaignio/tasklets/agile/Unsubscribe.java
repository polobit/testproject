package com.campaignio.tasklets.agile;

import java.util.Iterator;

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
	 * Given URL
	 */
	public static String URL_VALUE = "url_value";

	/**
	 * Given URL type
	 */
	public static String TYPE = "type";

	/**
	 * Exact URL type
	 */
	public static String EXACT_MATCH = "exact_match";

	/**
	 * Like URL type
	 */
	public static String CONTAINS = "contains";

	/**
	 * Branch Yes
	 */
	public static String BRANCH_YES = "yes";

	/**
	 * Branch No
	 */
	public static String BRANCH_NO = "no";

	/**
	 * Number of days or hours to be considered
	 */
	public static final String DURATION = "duration";

	/**
	 * Days or Hours
	 */
	public static final String DURATION_TYPE = "duration_type";

	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{

		// Get URL value and type
		String unsubscribeFrom = getStringValue(nodeJSON, subscriberJSON, data, "unsubscribe");

		if (unsubscribeFrom.equals("All"))
		{
			// List<Workflow> workflows= W
			ContactUtil.workflowListOfAContact((long) subscriberJSON.get("id"));

			Iterator<String> workflowIt = ContactUtil.workflowListOfAContact((long) subscriberJSON.get("id"))
					.iterator();

			while (workflowIt.hasNext())
			{
				String w = workflowIt.next();

				CronUtil.removeTask(w, String.valueOf(subscriberJSON.get("id")));
				CampaignStatusUtil.setStatusOfCampaign(AgileTaskletUtil.getId(subscriberJSON), w, "", Status.REMOVED);

			}
			CampaignStatusUtil.setStatusOfCampaign(AgileTaskletUtil.getId(subscriberJSON),
					AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getCampaignNameFromJSON(campaignJSON),
					Status.DONE);

			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
					"We are unsubscribed from all ", LogType.SMS_SENT.toString());
			return;
		}
		CronUtil.removeTask(String.valueOf(campaignJSON.get("id")), String.valueOf(subscriberJSON.get("id")));
		CampaignStatusUtil.setStatusOfCampaign(AgileTaskletUtil.getId(subscriberJSON),
				String.valueOf(campaignJSON.get("id")), "", Status.REMOVED);

		LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
				"We are unsubscribed from this ", LogType.SMS_SENT.toString());

		// Execute Next One in Loop
		TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);

	}
}