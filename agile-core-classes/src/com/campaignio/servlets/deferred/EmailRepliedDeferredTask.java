package com.campaignio.servlets.deferred;

import com.campaignio.cron.util.CronUtil;
import com.campaignio.tasklets.util.CampaignConstants;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>EmailRepliedDeferredTask</code> is the deferred task that handles campaign email
 * Replied tasklet cron jobs.
 *
 * @author Ramesh
 * 
 */
@SuppressWarnings("serial")
public class EmailRepliedDeferredTask implements DeferredTask
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
    public EmailRepliedDeferredTask(String campaignId, String subscriberId, String customData)
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
	    // Interrupt Replied node
	    CronUtil.interrupt(campaignId,CampaignConstants.EMAIL_REPLIED,subscriberId,null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in EmailRepliedDeferredTask " + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
