package com.campaignio.twitter;

import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;

import com.agilecrm.Globals;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;

/**
 * 
 * <code>TwitterJob</code> is the base class to post status in twitter.Token and
 * token secret are generated when the user logs into twitter using this
 * app.Using those token and token secret twitterjob posts status in twitter.
 * 
 * @author Manohar
 * 
 */
public class TwitterJob
{

    /**
     * Consumer Key
     */
    static final String CONSUMER_KEY = Globals.TWITTER_API_KEY;

    /**
     * Consumer secret
     */
    static final String CONSUMER_SECRET = Globals.TWITTER_SECRET_KEY;

    /**
     * Token generated by twitter
     */
    public String token;

    /**
     * Token secret generated by twitter
     */
    public String token_secret;

    /**
     * Tweet to be posted
     */
    public String status;

    /**
     * Contact id that subscribes to campaign
     */
    public String subscriber_id;

    /**
     * Campaign Id
     */
    public String campaign_id;

    /**
     * Default Constructor.
     */
    TwitterJob()
    {

    }

    /**
     * Constructs a new {@link TwitterJob}
     * 
     * @param token
     *            Token generated by twitter
     * @param tokenSecret
     *            Token secret generated by twitter
     * @param status
     *            Tweet to be posted
     * @param subscriberId
     *            Contact id that subscribes to campaign
     * @param campaignId
     *            Campaign Id
     */
    public TwitterJob(String token, String tokenSecret, String status, String subscriberId, String campaignId)
    {
	this.token = token;
	this.token_secret = tokenSecret;
	this.status = status;
	this.subscriber_id = subscriberId;
	this.campaign_id = campaignId;
    }

    /**
     * Post tweet in the twitter
     * 
     * @return Boolean value-true if tweet posted successfully otherwise false
     */
    public boolean postStatus(String tweet)
    {
	try
	{
	    Twitter twitter = new TwitterFactory().getInstance();
	    twitter.setOAuthConsumer(CONSUMER_KEY, CONSUMER_SECRET);

	    AccessToken accessToken = new AccessToken(token, token_secret);
	    twitter.setOAuthAccessToken(accessToken);

	    // System.out.println("Twitter Screename " +
	    // twitter.getScreenName());

	    Status status = twitter.updateStatus(tweet);
	    LogUtil.addLogToSQL(campaign_id, subscriber_id, "Twitter - Successfully updated the status to [" + status.getText() + "].",
		    LogType.TWEET.toString());

	    return true;

	}
	catch (Exception e)
	{
	    LogUtil.addLogToSQL(campaign_id, campaign_id, "Tweeting failed " + e.getMessage(), LogType.TWEET.toString());
	    return false;
	}
    }
}