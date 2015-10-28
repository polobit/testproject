package com.campaignio.tasklets.util.deferred;

import org.json.JSONObject;

import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.tasklets.util.TaskCore;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>TaskletWorkflowDeferredTask</code> is the base class to execute
 * tasklets in DeferredTask. When there are list of subscribers, DeferredTask
 * runs workflow subscribing each contact in the list.
 * 
 * @author Manohar
 * 
 */
@SuppressWarnings("serial")
public class TaskletWorkflowDeferredTask implements DeferredTask
{
	String campaignId, subscriberJSONString;
	public String namespace;

	/**
	 * Constructs a new {@link TaskletWorkflowDeferredTask}.
	 * 
	 * @param campaignId
	 *            CampaignId - to avoid 'Task too large' Exception
	 * @param subscriberJSONString
	 *            contact details.
	 */
	public TaskletWorkflowDeferredTask(String campaignId, String subscriberJSONString, String namespace)
	{
		this.campaignId = campaignId;
		this.subscriberJSONString = subscriberJSONString;
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
		String oldNamespace = NamespaceManager.get();

		try
		{
			NamespaceManager.set(namespace);

			System.out.println("Executing tasklet in namespace " + NamespaceManager.get());

			JSONObject subscriberJSON = new JSONObject(subscriberJSONString);

			// Fetching campaignJSON within the task, to avoid 'Task too large
			// Exception.'
			JSONObject campaignJSON = WorkflowUtil.getWorkflowJSON(Long.parseLong(campaignId));

			// In case workflow is deleted or disabled.
			if (campaignJSON == null || campaignJSON.getBoolean("is_disabled"))
				return;

			TaskCore.executeWorkflow(campaignJSON, subscriberJSON);
		}
		catch (Exception e)
		{
			System.err.println("Exception occured in TaskletUtilDeferredTask " + e.getMessage());
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}
}