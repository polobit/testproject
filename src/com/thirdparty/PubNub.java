package com.thirdparty;

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
    private static String PUBLISH_KEY = "pub-c-e4c8fdc2-40b1-443d-8bb0-2a9c8facd274";
    private static String SUBSCRIBE_KEY = "sub-c-118f8482-92c3-11e2-9b69-12313f022c90";

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
	Pubnub pubnub = new Pubnub(PUBLISH_KEY, SUBSCRIBE_KEY);

	// Publish Message - response with 0 for any error, 1 for success.
	JSONArray response = pubnub.publish(channel, messageJSON);

	System.out.println(response);
    }

}
