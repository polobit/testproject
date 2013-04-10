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
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class EmailClickDeferredTask implements DeferredTask
{
    /**
     * Tracking Id.
     */
    String trackerId;

    String longURL;

    /**
     * Constructs a new {@link EmailClickDeferredTask}.
     * 
     * @param trackerId
     *            - tracker Id.
     */
    public EmailClickDeferredTask(String trackerId, String longURL)
    {
	this.trackerId = trackerId;
	this.longURL = longURL;
    }

    public void run()
    {
	String oldNamespace = NamespaceManager.get();

	// Set empty namespace for cron
	NamespaceManager.set("");

	try
	{
	    // Interrupt the cron tasks with trackerId
	    CronUtil.interrupt(trackerId, null, null, new JSONObject(longURL));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
