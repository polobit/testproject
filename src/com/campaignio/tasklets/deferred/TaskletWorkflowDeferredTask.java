package com.campaignio.tasklets.deferred;

import org.json.JSONObject;

import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>TaskletWorkflowDeferredTask</code> is the base class to execute
 * tasklets in DeferredTask.When there are list of subscribers,DeferredTask runs
 * workflow subscribing each contact in the list.
 * 
 * 
 * 
 */
@SuppressWarnings("serial")
public class TaskletWorkflowDeferredTask implements DeferredTask
{

    String campaignJSONString, subscriberJSONString;

    /**
     * Constructs a new {@link TaskletWorkflowDeferredTask}.
     * 
     * @param campaignJSONString
     *            nodes that are connected in a workflow
     * @param subscriberJSONString
     *            contact details
     */
    public TaskletWorkflowDeferredTask(String campaignJSONString,
	    String subscriberJSONString)
    {

	this.campaignJSONString = campaignJSONString;
	this.subscriberJSONString = subscriberJSONString;
    }

    @Override
    public void run()
    {
	try
	{
	    System.out.println("Executing tasklet in namespace "
		    + NamespaceManager.get());

	    // Get Campaign JSON & SubscriberJSON from String
	    JSONObject campaignJSON = new JSONObject(campaignJSONString);
	    JSONObject subscriberJSON = new JSONObject(subscriberJSONString);

	    // Check in memcache if it is already executing
	    TaskletUtil.executeWorkflow(campaignJSON, subscriberJSON);

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in Cron " + e.getMessage());
	    e.printStackTrace();
	}
    }
}
