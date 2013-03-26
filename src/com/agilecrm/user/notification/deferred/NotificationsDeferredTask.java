package com.agilecrm.user.notification.deferred;

import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.PubNub;

/**
 * <code>NotificationsDeferredTask</code> implements google appengine's
 * DeferredTask interface. Access pubnub url to publish notification in deferred
 * task.
 * 
 * @author Naresh
 * 
 */

public class NotificationsDeferredTask implements DeferredTask
{
    /**
     * Serial ID
     */
    private static final long serialVersionUID = 2713282877446898897L;

    /**
     * Object data
     * */
    String message = null;

    /**
     * Channel for pubnub
     */
    String channel = null;

    /**
     * Constructs a new {@link NotificationsDeferredTask}.
     * 
     * @param channel
     *            channel
     * @param message
     *            Object like Contact, Deals etc.
     * 
     */
    public NotificationsDeferredTask(String channel, String message)
    {
	this.channel = channel;
	this.message = message;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Runnable#run()
     */
    @SuppressWarnings({ "deprecation", "unchecked", "unused" })
    public void run()
    {
	String response = PubNub.accessPubNubPublish(channel, message);
	System.out.println("Pubnub response: " + response);
    }
}