package com.campaignio.tasklets.social;

import org.json.JSONObject;

import com.campaignio.TwitterQueue;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.TaskletManager;

public class TwitterSendMessage extends TaskletAdapter
{
    // Fields
    public static String TOKEN = "twitter_token";
    public static String TOKEN_SECRET = "twitter_token_secret";
    public static String ACCOUNT = "twitter_account";
    public static String MESSAGE = "message";

    public static String RATE_LIMIT = "message";
    public static String RATE_LIMIT_5 = "5";
    public static String RATE_LIMIT_10 = "10";
    public static String RATE_LIMIT_20 = "20";

    // Success Branch
    public static String SUCCESS_BRANCH = "success";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON,
	    JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Account & Rate-limit
	String account = getStringValue(nodeJSON, subscriberJSON, data, ACCOUNT);
	String token = getStringValue(nodeJSON, subscriberJSON, data, TOKEN);
	String tokenSecret = getStringValue(nodeJSON, subscriberJSON, data,
		TOKEN_SECRET);
	String message = getStringValue(nodeJSON, subscriberJSON, data, MESSAGE);
	String rateLimit = getStringValue(nodeJSON, subscriberJSON, data,
		RATE_LIMIT);

	if (rateLimit.equalsIgnoreCase(RATE_LIMIT_10))
	    rateLimit = TwitterQueue.TWITTER_DB_RATE_LIMIT_HOURLY_10;
	else if (rateLimit.equalsIgnoreCase(RATE_LIMIT_20))
	    rateLimit = TwitterQueue.TWITTER_DB_RATE_LIMIT_HOURLY_20;
	else
	    rateLimit = TwitterQueue.TWITTER_DB_RATE_LIMIT_HOURLY_5;

	log(campaignJSON, subscriberJSON, "Adding tweet for this user: "
		+ message);

	TwitterQueue.addToTwitterQueue(account, token, tokenSecret, message,
		rateLimit, subscriberJSON, campaignJSON);

	// Execute Next One in Loop
	TaskletManager.executeTasklet(campaignJSON, subscriberJSON, data,
		nodeJSON, null);
    }

}
