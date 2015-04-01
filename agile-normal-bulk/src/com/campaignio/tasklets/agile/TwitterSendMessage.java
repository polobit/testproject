package com.campaignio.tasklets.agile;

import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;
import com.campaignio.twitter.TwitterJobQueue;
import com.campaignio.twitter.util.TwitterJobQueueUtil;

/**
 * <code>TwitterSendMessage</code> is the base class for tweet node of
 * campaigns. It sends tweets on Hourly basis. It fetches twitter-token, token
 * secret automatically when user login into twitter account.
 * 
 * 
 */
public class TwitterSendMessage extends TaskletAdapter
{
    // Fields
    public static String TOKEN = "twitter_token";
    public static String TOKEN_SECRET = "twitter_token_secret";
    public static String ACCOUNT = "twitter_account";
    public static String MESSAGE = "message";

    // Rate Limit
    public static String RATE_LIMIT = "rate_limit";
    public static String RATE_LIMIT_5 = "5";
    public static String RATE_LIMIT_10 = "10";
    public static String RATE_LIMIT_20 = "20";

    // Success Branch
    public static String SUCCESS_BRANCH = "success";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Account & Rate-limit
	String account = getStringValue(nodeJSON, subscriberJSON, data, ACCOUNT);
	String token = getStringValue(nodeJSON, subscriberJSON, data, TOKEN);
	String tokenSecret = getStringValue(nodeJSON, subscriberJSON, data, TOKEN_SECRET);
	String message = getStringValue(nodeJSON, subscriberJSON, data, MESSAGE);
	String rateLimit = getStringValue(nodeJSON, subscriberJSON, data, RATE_LIMIT);

	if (rateLimit.equalsIgnoreCase(RATE_LIMIT_10))
	    rateLimit = TwitterJobQueue.TWITTER_DB_RATE_LIMIT_HOURLY_10;
	else if (rateLimit.equalsIgnoreCase(RATE_LIMIT_20))
	    rateLimit = TwitterJobQueue.TWITTER_DB_RATE_LIMIT_HOURLY_20;
	else
	    rateLimit = TwitterJobQueue.TWITTER_DB_RATE_LIMIT_HOURLY_5;

	TwitterJobQueueUtil.addToTwitterQueue(account, token, tokenSecret, message, rateLimit, subscriberJSON, campaignJSON);

	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
    }
}