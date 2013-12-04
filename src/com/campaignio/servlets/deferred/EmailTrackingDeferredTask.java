package com.campaignio.servlets.deferred;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.campaignio.cron.util.CronUtil;
import com.campaignio.tasklets.agile.SendEmail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>EmailTrackingDeferredTask</code> is the DeferredTask to wakeup the cron
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
public class EmailTrackingDeferredTask implements DeferredTask
{
    /**
     * Tracking Id.
     */
    String clickTrackingId = null;

    /**
     * clicked url json string
     */
    String longURL = null;

    /**
     * Open tracking id
     */
    String openTrackingId = null;

    /**
     * Constructs a new {@link EmailTrackingDeferredTask}.
     * 
     * @param clickTrackingId
     *            - click tracker Id.
     * @param longURL
     *            - clicked long url.
     * @param openTrackingId
     *            - email open tracking id
     */
    public EmailTrackingDeferredTask(String clickTrackingId, String longURL, String openTrackingId)
    {
	this.clickTrackingId = clickTrackingId;
	this.longURL = longURL;
	this.openTrackingId = openTrackingId;
    }

    public void run()
    {
	String oldNamespace = NamespaceManager.get();

	// Set empty namespace for cron
	NamespaceManager.set("");

	try
	{
	    // When interrupted from EmailOpenServlet, only openTracking id
	    // exists
	    if (StringUtils.isBlank(clickTrackingId) && StringUtils.isBlank(longURL))
	    {
		System.out.println("Interrupting only open tracking id crons...");

		CronUtil.interrupt(openTrackingId, null, null, null);
		return;
	    }

	    // Interrupt cron tasks of Clicked node.
	    CronUtil.interrupt(clickTrackingId, null, null, new JSONObject(longURL).put(SendEmail.VERIFY_OPEN_TID, openTrackingId));

	    // Interrupt the cron tasks of Opened node that matches with
	    // opentracker id
	    CronUtil.interrupt(openTrackingId, null, null,
		    new JSONObject(longURL).put(SendEmail.EMAIL_CLICK, true).put(SendEmail.VERIFY_CLICK_TID, clickTrackingId));
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured in EmailTrackingDeferredTask " + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}