package com.campaignio.cron.deferred;

import org.json.JSONObject;

import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.cron.Cron;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.Tasklet;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>CronDeferredTask</code> is the class that supports Cron with
 * DeferredTask. It runs tasklets that completes timeout period or gets
 * interrupted. It sets the namespace to old namespace. Usually SendEmail,
 * Clicked and Wait tasklets makes use of Cron in the campaign.
 * 
 * @author Manohar
 * 
 */
@SuppressWarnings("serial")
public class CronDeferredTask implements DeferredTask
{
	/**
	 * Timeout or interrupt.
	 */
	String wakeupOrInterrupt;

	/**
	 * Custom Data.
	 */
	String customDataString;

	/**
	 * Campaign Id.
	 */
	String campaignId;

	/**
	 * Json strings required for campaign.
	 */
	String dataString, subscriberJSONString, nodeJSONString;

	/**
	 * For namespace.
	 */
	String namespace;

	/**
	 * Constructs a new {@link CronDeferredTask}.
	 * 
	 * @param namespace
	 *            Namespace.
	 * @param campaignId
	 *            CampaignId.
	 * @param dataString
	 *            Workflow data.
	 * @param subscriberJSONString
	 *            Contact JSON data.
	 * @param nodeJSONString
	 *            Current Node.
	 * @param wakeupOrInterrupt
	 *            Timeout or interrupt.
	 * @param customDataString
	 *            CustomData.
	 */
	public CronDeferredTask(String namespace, String campaignId, String dataString, String subscriberJSONString,
			String nodeJSONString, String wakeupOrInterrupt, String customDataString)
	{
		this.campaignId = campaignId;
		this.dataString = dataString;
		this.subscriberJSONString = subscriberJSONString;
		this.nodeJSONString = nodeJSONString;
		this.wakeupOrInterrupt = wakeupOrInterrupt;
		this.customDataString = customDataString;
		this.namespace = namespace;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Runnable#run()
	 */
	@Override
	public void run()
	{
		String oldNameSpace = NamespaceManager.get();

		NamespaceManager.set(namespace);

		JSONObject campaignJSON = null;
		JSONObject subscriberJSON = null;
		try
		{
			// Gets workflow json from campaignId.
			campaignJSON = WorkflowUtil.getWorkflowJSON(Long.parseLong(campaignId));

			if (campaignJSON == null)
				return;

			JSONObject data = new JSONObject(dataString);

			// Get updated subscriber json
			subscriberJSON = AgileTaskletUtil.getUpdatedSubscriberJSON(new JSONObject(subscriberJSONString));

			JSONObject nodeJSON = new JSONObject(nodeJSONString);
			// Get updated node JSON
			JSONObject updatedNodeJSON = TaskletUtil.getNodeJSON(campaignJSON, nodeJSON.getString("id"));
			JSONObject customData = new JSONObject(customDataString);

			// Get Tasklet
			Tasklet tasklet = TaskletUtil.getTasklet(updatedNodeJSON);
			if (tasklet != null)
			{
				System.out.println("Executing tasklet from CRON ");

				if (wakeupOrInterrupt.equalsIgnoreCase(Cron.CRON_TYPE_TIME_OUT))
					tasklet.timeOutComplete(campaignJSON, subscriberJSON, data, updatedNodeJSON);
				else
					tasklet.interrupted(campaignJSON, subscriberJSON, data, updatedNodeJSON, customData);
			}
		}
		catch (NullPointerException npe)
		{
			// Creates log current node which is not found
			LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON),
					"Campaign stopped on the contact since the campaign got modified.",
					LogType.CAMPAIGN_STOPPED.toString());
			CampaignStatusUtil.setStatusOfCampaignWithName(AgileTaskletUtil.getId(subscriberJSON),
					AgileTaskletUtil.getId(campaignJSON), "", Status.REMOVED);

			npe.printStackTrace();
		}
		catch (Exception e)
		{
			System.err.println("Exception occured in Cron " + e.getMessage());
			e.printStackTrace();
		}

		NamespaceManager.set(oldNameSpace);
	}
}