package com.thirdparty;

import java.net.URLEncoder;

import com.agilecrm.util.HTTPUtil;

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
    private static String SECRET_KEY = "sec-c-YTQ3NzNlYjMtNGE3NC00NTZiLWJlZWMtMWUyMDYzZmJlZjI4";

    // optional host.
    private static String PUBNUB_HOST = "http://pubsub.pubnub.com";

    /**
     * PubNub Publish REST URL Params:
     * "/publish/PUBLISH_KEY/SUBSCRIBE_KEY/SECRET_KEY
     * /CHANNEL/JSONP_CALLBACK/JSON_MESSAGE"
     */

    /**
     * Publishes message to the given channel.
     * 
     * @param channel
     *            - pubnub channel.
     * @param message
     *            - pubnub message.
     * @return pubnub response.
     */
    public static String accessPubNubPublish(String channel, String message)
    {
	String pubnubUrl = PUBNUB_HOST + "/publish/"
		+ URLEncoder.encode(PUBLISH_KEY) + "/"
		+ URLEncoder.encode(SUBSCRIBE_KEY) + "/"
		+ URLEncoder.encode(SECRET_KEY) + "/"
		+ URLEncoder.encode(channel) + "/0/"
		+ URLEncoder.encode(message);

	String response = HTTPUtil.accessURL(pubnubUrl);
	System.out.println(pubnubUrl);

	return response;
    }
}
