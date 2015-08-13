package com.agilecrm.user.notification.deferred;

import org.json.JSONException;
import org.json.JSONObject;

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
	 * Serial id
	 */
	private static final long serialVersionUID = 3267669025920944585L;

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
    public void run()
    {
	JSONObject jsonMessage = null;
	try
	{
	    jsonMessage = new JSONObject(message);
	    PubNub.pubNubPush(channel, jsonMessage);
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	    System.out.println("Got exception in NotificationDeferredTask " + e);
	}
    }
}