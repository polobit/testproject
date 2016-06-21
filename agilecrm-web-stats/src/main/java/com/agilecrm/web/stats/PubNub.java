package com.agilecrm.web.stats;

import org.json.JSONArray;
import org.json.JSONObject;

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
    public static final String PUBNUB_PUBLISH_KEY = "pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274";
    public static final String PUBNUB_SUBSCRIBE_KEY = "sub-c-118f8482-92c3-11e2-9b69-12313f022c90";
    static Pubnub pubnub = new Pubnub(PUBNUB_PUBLISH_KEY, PUBNUB_SUBSCRIBE_KEY);
    
    /**
     * Publishes message to the given channel.
     * 
     * @param channel
     *            - pubnub channel.
     * @param messageJSON
     *            - pubnub message.
     * @return pubnub response.
     */
    public static void pubNubPush(String channel, JSONObject jsonMessage)
    {
	try
	{

	    // Publish Message - response with 0 for any error, 1 for success.
	    JSONArray response = pubnub.publish(channel, jsonMessage);

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