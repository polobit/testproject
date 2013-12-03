package com.campaignio.servlets.deferred;

import com.campaignio.cron.util.CronUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

@SuppressWarnings("serial")
public class EmailOpenDeferredTask implements DeferredTask
{
    String openTrackingId = null;

    public EmailOpenDeferredTask(String openTrackingId)
    {
	this.openTrackingId = openTrackingId;
    }

    public void run()
    {
	String oldNamespace = NamespaceManager.get();

	// Set empty namespace for cron
	NamespaceManager.set("");

	try
	{ // Interrupt the cron tasks with opentracker id
	    CronUtil.interrupt(openTrackingId, null, null, null);
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
