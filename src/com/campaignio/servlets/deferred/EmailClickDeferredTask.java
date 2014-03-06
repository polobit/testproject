package com.campaignio.servlets.deferred;

import org.json.JSONObject;

import com.campaignio.cron.util.CronUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>EmailClickDeferredTask</code> is the DeferredTask to wakeup the cron
 * jobs for links clicked. Tracking Id is given as one of the custom values. The
 * cron that matches the tracking Id is get to wake up and interrupted method of
 * Clicked node is called inside Cron class.
 * <p>
 * It wakes up crons based on open tracking id for opened node.
 * </p>
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class EmailClickDeferredTask implements DeferredTask
{
    /**
     * Click Tracking Id.
     */
    String clickTrackingId = null;

    /**
     * Campaign id.
     */
    String campaignId = null;

    /**
     * Subscriber id.
     */
    String subscriberId = null;

    /**
     * custom data to pass to respective tasklet
     */
    String interruptedData = null;

    /**
     * Constructs a new {@link EmailClickDeferredTask}.
     * 
     * @param clickTrackingId
     *            - id to get respective clicked cron jobs
     * @param campaignId
     *            - Campaign id
     * @param subscriberId
     *            - subscriber id
     * @param interruptedData
     *            - data passed to interrupted method of tasklet.
     */
    public EmailClickDeferredTask(String clickTrackingId, String campaignId, String subscriberId, String interruptedData)
    {
	this.clickTrackingId = clickTrackingId;
	this.campaignId = campaignId;
	this.subscriberId = subscriberId;
	this.interruptedData = interruptedData;
    }

    public void run()
    {
	String oldNamespace = NamespaceManager.get();

	// Set empty namespace for cron
	NamespaceManager.set("");

	try
	{
	    // Wakeup Clicked node. Clicked node consists of
	    // tracking id when Track Clicks is set to Yes in SendEmail node.
	    CronUtil.interrupt(clickTrackingId, null, null, new JSONObject(interruptedData));

	    // Wakeup Opened node based on campaignId and
	    // subscriberId.
	    CronUtil.interrupt(campaignId, subscriberId, null, new JSONObject(interruptedData));

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in EmailClickDeferredTask " + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}