package com.agilecrm.user.notification.deferred;

import java.net.URLEncoder;

import org.json.simple.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.account.APIKey;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.util.HTTPUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>NotificationsDeferredTask</code> implements google appengine's
 * DeferredTask interface. Fetches api key from {@link APIKey} and sends post
 * request with object, type and api-key.
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
     * Notification type.
     */
    Type type;

    /**
     * Object data.
     */
    String objectData = null;

    /**
     * To access url from Util class.
     */
    String url = null;

    /**
     * JSONObject to put object and type.
     */
    JSONObject objectJson = null;

    /**
     * To get apiKey
     */
    String apiKey = null;

    /**
     * Constructs a new {@link NotificationsDeferredTask}.
     * 
     * @param type
     *            Notification type.
     * @param objectData
     *            Object like Contact, Deals etc.
     * @param apiKey
     *            ApiKey.
     */
    public NotificationsDeferredTask(Type type, String objectData, String apiKey)
    {
	this.type = type;
	this.objectData = objectData;
	this.apiKey = apiKey;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Runnable#run()
     */
    @SuppressWarnings({ "deprecation", "unchecked", "unused" })
    public void run()
    {
	try
	{
	    // Inorder to get type along with notification
	    objectJson = new JSONObject();
	    objectJson.put("object", objectData);
	    objectJson.put("type", type.toString());

	    url = Globals.PUSH_STATS + "?custom="
		    + URLEncoder.encode(objectJson.toString()) + "&agile_id="
		    + URLEncoder.encode(apiKey) + "&type="
		    + URLEncoder.encode(type.toString());
	    System.out.println(url);
	    String output = HTTPUtil.accessURL(url);
	    // System.out.println(output);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }
}