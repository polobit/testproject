package com.campaignio.tasklets.agile;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.account.util.DomainLimitsUtil;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.agile.util.AgileTaskletUtil;
import com.campaignio.tasklets.sms.SendMessage;
import com.campaignio.tasklets.util.TaskletUtil;
import com.campaignio.twitter.TwitterJobQueue;
import com.campaignio.twitter.util.TwitterJobQueueUtil;
import com.campaignio.urlshortener.URLShortener.ShortenURLType;
import com.google.appengine.api.NamespaceManager;

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
    
	 /**
     * Click event tracking id
     */
    public static String TWEET_CLICK_TRACKING_ID = "tweet_click_tracking_id";

    public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON) throws Exception
    {

	// Get Account & Rate-limit
	String account = getStringValue(nodeJSON, subscriberJSON, data, ACCOUNT);
	String token = getStringValue(nodeJSON, subscriberJSON, data, TOKEN);
	String tokenSecret = getStringValue(nodeJSON, subscriberJSON, data, TOKEN_SECRET);
	String message = getStringValue(nodeJSON, subscriberJSON, data, MESSAGE);
	String rateLimit = getStringValue(nodeJSON, subscriberJSON, data, RATE_LIMIT);
	String trackClicks = getStringValue(nodeJSON, subscriberJSON, data, SendEmail.TRACK_CLICKS);

	try
	{
		if (rateLimit.equalsIgnoreCase(RATE_LIMIT_10))
		    rateLimit = TwitterJobQueue.TWITTER_DB_RATE_LIMIT_HOURLY_10;
		else if (rateLimit.equalsIgnoreCase(RATE_LIMIT_20))
		    rateLimit = TwitterJobQueue.TWITTER_DB_RATE_LIMIT_HOURLY_20;
		else
		    rateLimit = TwitterJobQueue.TWITTER_DB_RATE_LIMIT_HOURLY_5;
	
		data.put(TWEET_CLICK_TRACKING_ID, System.currentTimeMillis());
		
		data.remove(SendMessage.SMS_CLICK_TRACKING_ID);
		data.remove(SendEmail.CLICK_TRACKING_ID);
		
		if(trackClicks != null
		        && (!trackClicks.equalsIgnoreCase(SendEmail.TRACK_CLICKS_NO)))
		{	
			message = SendMessage.shortenLongURLs(message, AgileTaskletUtil.getId(subscriberJSON), 
					AgileTaskletUtil.getId(campaignJSON), data.getString(TWEET_CLICK_TRACKING_ID), "twt", ShortenURLType.TWEET, trackClicks);
		}
		/**
		  * checking condition here for the tweet_limit for the Domain user 25 in a
		  * day if its reaches to its limit then
		  * after one day it domain user an send the tweet message
		  * if a day completed and someone trying to send tweet 
		  * then Simply this message will 
		
		  *shown into the screen  */
	   try{
		if(DomainLimitsUtil.checkDomainLimits(NamespaceManager.get()).getTweet_limit()  > 0)
		{	 
		    TwitterJobQueueUtil.addToTwitterQueue(account, token, tokenSecret, message, rateLimit, subscriberJSON, campaignJSON);
		    DomainLimitsUtil.decrementTweetLimit(NamespaceManager.get());
		 }
		else{
			 LogUtil.addLogToSQL(AgileTaskletUtil.getId(campaignJSON), AgileTaskletUtil.getId(subscriberJSON), "25 Tweets per day limit reached.",LogType.TWEET.toString()); 

		 }
	   }catch(Exception e){
		   System.out.println("error occured:"+e.getMessage());
		   
	   }
	}
	catch(Exception e)
	{
		System.out.println(ExceptionUtils.getFullStackTrace(e));
		System.err.println("Exception occured in TwitterSendMessage node - " + e.getMessage());
	}
	// Execute Next One in Loop
	TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, null);
   }



		
}