package com.agilecrm.user.notification.deferred;

import java.net.URLEncoder;

import org.json.simple.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.account.APIKey;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.util.Util;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>NotificationsDeferredTask</code> implements google appengine's
 * DeferredTask interface. Fetches api key from {@link APIKey} and sends post
 * request with object, type and api-key.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class NotificationsDeferredTask implements DeferredTask
{
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
     * Constructs a new {@link NotificationsDeferredTask}.
     * 
     * @param type
     *            Notification type.
     * @param objectData
     *            Object like Contact, Deals etc.
     */
    public NotificationsDeferredTask(Type type, String objectData)
    {
	this.type = type;
	this.objectData = objectData;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Runnable#run()
     */
    @SuppressWarnings({ "deprecation", "unchecked" })
    public void run()
    {
	// Get API Key
	APIKey api = APIKey.getAPIKey();
	String apiKey = api.api_key;

	// Inorder to get type along with notification
	objectJson = new JSONObject();
	objectJson.put("object", objectData);
	objectJson.put("type", type.toString());

	url = Globals.PUSH_STATS + "?custom="
		+ URLEncoder.encode(objectJson.toString()) + "&agile_id="
		+ URLEncoder.encode(apiKey) + "&type="
		+ URLEncoder.encode(type.toString());

	String output = Util.accessURL(url);
	System.out.println(output);
    }
}