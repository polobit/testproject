package com.agilecrm.workflows.util;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.workflows.status.util.CampaignSubscribersUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.twitter.util.TwitterJobQueueUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>WorkflowDeleteUtil</code> is the utility class that handles deleting
 * workflow related entities on deletion of workflow. It deletes logs from SQL,
 * twitterCrons and campaign crons.
 * 
 */
public class WorkflowDeleteUtil
{
    /**
     * Deletes Campaign Stats, Cron Tasks related to campaigns that are selected
     * for delete.
     * 
     * @param campaignIds
     *            - Campaign Id of deleted campaign.
     */
    public static void deleteRelatedEntities(JSONArray campaignIds)
    {
	String campaignId = "";
	String namespace = NamespaceManager.get();

	for (int i = 0; i < campaignIds.length(); i++)
	{
	    try
	    {
		campaignId = campaignIds.getString(i);
		// System.out.println("CampaignId " + campaignId);
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }

	    // Deletes Related Crons.
	    CronUtil.removeTask(campaignId, null);

	    // Deletes logs of workflow
	    LogUtil.deleteSQLLogs(campaignId, null);

	    // Deletes twitter-jobs of campaign
	    TwitterJobQueueUtil.removeTwitterJobs(campaignId, null, namespace);

	    // Deletes CampaignStatus from contact
	    CampaignSubscribersUtil.removeCampaignStatus(campaignId);

	}
    }
}
