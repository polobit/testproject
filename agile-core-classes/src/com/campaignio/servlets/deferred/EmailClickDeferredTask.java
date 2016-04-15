package com.campaignio.servlets.deferred;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.campaignio.cron.util.CronUtil;
import com.campaignio.urlshortener.URLShortener.ShortenURLType;
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
     * URL shortener click tracking id 
     */
    String urlShortenerTrackerId = null;
    
    ShortenURLType type = ShortenURLType.SMS;
    
    /**
     * Constructs a new {@link EmailClickDeferredTask}.
     * 
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
    
    /**
     * Constructs a new {@link EmailClickDeferredTask}
     * 
     * @param urlShortenerTrackerId - tracking Id
     * @param type - ShortenURLType
     * @param interruptedData - data passed 
     */
    public EmailClickDeferredTask(String urlShortenerTrackerId, ShortenURLType type, String interruptedData)
    {
    	this.urlShortenerTrackerId = urlShortenerTrackerId;
    	this.type = type;
    	this.interruptedData = interruptedData;
    }

    public void run()
    {
	String oldNamespace = NamespaceManager.get();

	// Set empty namespace for cron
	NamespaceManager.set("");

	try
	{
		if(StringUtils.isNotBlank(urlShortenerTrackerId))
		{
		
			if(interruptedData == null)
				interruptedData = "{}";
			
			CronUtil.interrupt(urlShortenerTrackerId, type.toString(), null, new JSONObject(interruptedData));
			return;
		}
		
	    if (StringUtils.isBlank(clickTrackingId))
	    {
		// Wakeup Clicked node - campaignId and subscriberId as LAST two
		// custom params
		CronUtil.interrupt(null, campaignId, subscriberId, new JSONObject(interruptedData));
	    }
	    else
	    {
		// When requested from shorten url
		CronUtil.interrupt(clickTrackingId, null, null, new JSONObject(interruptedData));
	    }

	    // Wakeup Opened node - campaignId and subscriberId as FIRST two
	    // custom params
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