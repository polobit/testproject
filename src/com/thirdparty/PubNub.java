package com.thirdparty;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.pubnub.api.Pubnub;

/**
 * <code>PubNub</code> is the base class that handles publishing messages of
 * agilecrm to the required channel. Inorder to publish to pubnub, publish key,
 * subscribe key, channel and message are required.
 * <p>
 * Related to pubnub the adjacent link provides examples and documentation -
 * https://github.com/pubnub/pubnub-api
 * </p>
 * 
 * @author Naresh
 * 
 */
public class PubNub
{

    /**
     * Publishes message to the given channel.
     * 
     * @param channel
     *            - pubnub channel.
     * @param messageJSON
     *            - pubnub message.
     * @return pubnub response.
     */
    public static void pubNubPush(String channel, JSONObject messageJSON)
    {
	try
	{
	    Pubnub pubnub = new Pubnub(Globals.PUBNUB_PUBLISH_KEY, Globals.PUBNUB_SUBSCRIBE_KEY);

	    // Publish Message - response with 0 for any error, 1 for success.
	    JSONArray response = pubnub.publish(channel, messageJSON);

	    System.out.println("Response " + response);

	    // if error
	    if (response.length() != 0 && 0 == (Integer) response.get(0))
	    {
		System.err.println(response);
		return;
	    }

	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in PubNub " + e.getMessage());
	}
    }
}