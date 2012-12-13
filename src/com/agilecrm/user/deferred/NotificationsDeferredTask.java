package com.agilecrm.user.deferred;

import java.net.URLEncoder;

import org.json.simple.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.user.NotificationPrefs.Type;
import com.agilecrm.util.Util;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>NotificationsDeferredTask</code> implements google appengine's
 * DeferredTask interface.Fetches api key from {@link APIKey} and sends post
 * request with object,type and api-key.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class NotificationsDeferredTask implements DeferredTask
{

    /**
     * Notification type
     */
    Type type;
    /**
     * Object data
     */
    String objectData = null;
    /**
     * To access url from Util class
     */
    String url = null;
    /**
     * JSONObject to put object and type
     */
    JSONObject objectJson = null;

    public NotificationsDeferredTask(Type type, String objectData)
    {
	this.type = type;
	this.objectData = objectData;
    }

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

	System.out.println("The json after converting" + objectJson);

	url = "https://stats.agilecrm.com:90/push?custom="
		+ URLEncoder.encode(objectJson.toString()) + "&agile_id="
		+ URLEncoder.encode(apiKey) + "&type="
		+ URLEncoder.encode(type.toString());

	System.out.println("encoded url " + url);

	String output = Util.accessURL(url);
	System.out.println(output);
    }
}

