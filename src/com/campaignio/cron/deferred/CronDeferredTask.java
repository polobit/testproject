package com.campaignio.cron.deferred;

import org.json.JSONObject;

import com.campaignio.cron.Cron;
import com.campaignio.tasklets.Tasklet;
import com.campaignio.tasklets.util.TaskletUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>CronDeferredTask</code> is the class that supports Cron with
 * DeferredTask.It runs tasklets that completes timeout period or gets
 * interrupted.It sets the namespace to old namespace.Usually SendEmail,Clicked
 * and Wait tasklets makes use of Cron in the campaign.
 * 
 * @author Manohar
 * 
 */
@SuppressWarnings("serial")
public class CronDeferredTask implements DeferredTask
{

    /**
     * Timeout or interrupt
     */
    String wakeupOrInterrupt;
    /**
     * Custom Data
     */
    String customDataString;
    /**
     * Json strings required for campaign
     */
    String campaignJSONString, dataString, subscriberJSONString,
	    nodeJSONString;

    /**
     * For namespace
     */
    String namespace;

    /**
     * Constructs {@link CronDeferredTask}
     * 
     * @param namespace
     *            Namespace
     * @param campaignJSONString
     *            Campaign JSON Data
     * @param dataString
     *            Workflow data
     * @param subscriberJSONString
     *            Contact JSON data
     * @param nodeJSONString
     *            Current Node
     * @param wakeupOrInterrupt
     *            Timeout or interrupt
     * @param customDataString
     *            CustomData
     */
    public CronDeferredTask(String namespace, String campaignJSONString,
	    String dataString, String subscriberJSONString,
	    String nodeJSONString, String wakeupOrInterrupt,
	    String customDataString)
    {

	this.campaignJSONString = campaignJSONString;
	this.dataString = dataString;
	this.subscriberJSONString = subscriberJSONString;
	this.nodeJSONString = nodeJSONString;
	this.wakeupOrInterrupt = wakeupOrInterrupt;
	this.customDataString = customDataString;
	this.namespace = namespace;
    }

    @Override
    public void run()
    {
	String oldNameSpace = NamespaceManager.get();

	NamespaceManager.set(namespace);

	try
	{
	    // Add in mem_cache
	    JSONObject campaignJSON = new JSONObject(campaignJSONString);
	    JSONObject data = new JSONObject(dataString);
	    JSONObject subscriberJSON = new JSONObject(subscriberJSONString);
	    JSONObject nodeJSON = new JSONObject(nodeJSONString);
	    JSONObject customData = new JSONObject(customDataString);

	    // Get Tasklet
	    Tasklet tasklet = TaskletUtil.getTasklet(nodeJSON);
	    if (tasklet != null)
	    {
		System.out.println("Executing tasklet from CRON ");

		if (wakeupOrInterrupt.equalsIgnoreCase(Cron.CRON_TYPE_TIME_OUT))
		    tasklet.timeOutComplete(campaignJSON, subscriberJSON, data,
			    nodeJSON);
		else
		    tasklet.interrupted(campaignJSON, subscriberJSON, data,
			    nodeJSON, customData);
	    }

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in Cron " + e.getMessage());
	    e.printStackTrace();
	}

	NamespaceManager.set(oldNameSpace);
    }
}
