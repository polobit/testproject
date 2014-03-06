package com.campaignio.servlets.deferred;

import org.json.JSONObject;

import com.campaignio.cron.util.CronUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>EmailOpenDeferredTask</code> is the deferred task that handles campaign
 * Opened tasklet cron jobs.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class EmailOpenDeferredTask implements DeferredTask
{
    /**
     * Campaign Id
     */
    String campaignId = null;

    /**
     * Subscriber Id
     */
    String subscriberId = null;

    /**
     * Custom data to tasklet
     */
    String customData = null;

    /**
     * Construct a {@link EmailOpenDeferredTask}
     * 
     * @param campaignId
     *            - campaign id
     * @param subscriberId
     *            - subscriber id
     * @param customData
     *            - data passed to tasklet
     */
    public EmailOpenDeferredTask(String campaignId, String subscriberId, String customData)
    {
	this.campaignId = campaignId;
	this.subscriberId = subscriberId;
	this.customData = customData;
    }

    public void run()
    {
	String oldNamespace = NamespaceManager.get();

	// Set empty namespace for cron
	NamespaceManager.set("");
	try
	{
	    // Interrupt Opened node
	    CronUtil.interrupt(campaignId, subscriberId, null, new JSONObject(customData));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in EmailOpenDeferredTask " + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
