package com.agilecrm.workflows.util;

import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.AgileQueues;
import com.agilecrm.contact.util.BulkActionUtil;
import com.campaignio.twitter.util.TwitterJobQueueUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.TaskOptions.Method;

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
		System.out.println("CampaignId in deleteRelatedEntities " + campaignId + " of namespace " + namespace);
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }

	    // Deletes twitter-jobs of campaign
	    TwitterJobQueueUtil.removeTwitterJobs(campaignId, null, namespace);

	    // Deletes remaining related entities using backend, to avoid
	    // Deadline exception.
	    BulkActionUtil.postDataToBulkActionBackend("/core/api/bulk-actions/remove-workflow-related/" + campaignId,
		    "", AgileQueues.WORKFLOWS_RELATED_QUEUE, Method.POST, campaignId);

	}
    }
}
