package com.campaignio;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Id;

import org.json.JSONObject;

import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.auth.AccessToken;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.util.DBUtil;
import com.campaignio.logger.util.LogUtil;

class TwitterJob
{

    // Constants
    static final String CONSUMER_KEY = "PtWo0H7yLiEZv46r3FDJbw";
    static final String CONSUMER_SECRET = "kntZFSrFVGogu9DF6OszABqm6N3eQcprN2QT3bm3S8";

    // Online, Offline or Unknown
    public String token;
    public String token_secret;
    public String status;
    public String subscriber_id;
    public String campaign_id;

    TwitterJob(String token, String tokenSecret, String status,
	    String subscriberId, String campaignId)
    {
	this.token = token;
	this.token_secret = tokenSecret;
	this.status = status;
	this.subscriber_id = subscriberId;
	this.campaign_id = campaignId;
    }

    public boolean postStatus()
    {
	try
	{

	    Twitter twitter = new TwitterFactory().getInstance();
	    twitter.setOAuthConsumer(CONSUMER_KEY, CONSUMER_SECRET);

	    AccessToken accessToken = new AccessToken(token, token_secret);
	    twitter.setOAuthAccessToken(accessToken);

	    // System.out.println("Twitter Screename " +
	    // twitter.getScreenName());

	    Status status = twitter.updateStatus(token_secret);
	    LogUtil.addLogFromID(
		    campaign_id,
		    subscriber_id,
		    "Twitter - Successfully updated the status to ["
			    + status.getText() + "].");

	    return true;

	}
	catch (Exception e)
	{
	    LogUtil.addLogFromID(campaign_id, campaign_id,
		    "Tweeting failed " + e.getMessage());
	    return false;
	}
    }

}

public class TwitterQueue
{

    // Key
    @Id
    public Long id;

    // Queue
    public List<TwitterJob> twitter_jobs = new ArrayList<TwitterJob>();

    // Twitter Account
    public String account;

    // Rate Limit
    public String rate_limit;

    public static final String TWITTER_DB_RATE_LIMIT_HOURLY_5 = "rate_limit_5";
    public static final String TWITTER_DB_RATE_LIMIT_HOURLY_10 = "rate_limit_10";
    public static final String TWITTER_DB_RATE_LIMIT_HOURLY_20 = "rate_limit_20";

    // Dao
    private static ObjectifyGenericDao<TwitterQueue> dao = new ObjectifyGenericDao<TwitterQueue>(
	    TwitterQueue.class);

    TwitterQueue()
    {

    }

    TwitterQueue(String account, String rateLimit)
    {
	this.account = account;
	this.rate_limit = rateLimit;

    }

    public static boolean addToTwitterQueue(String account, String token,
	    String tokenSecret, String message, String rateLimit,
	    JSONObject subscriberJSON, JSONObject campaignJSON)
    {

	// Add to Twitter Queue
	try
	{
	    // Get Existing Queue
	    TwitterQueue twitterQueue = getTwitterQueueForAccount(account,
		    rateLimit);
	    if (twitterQueue == null)
	    {
		twitterQueue = new TwitterQueue(account, rateLimit);
	    }

	    // Add to Old JSONArray
	    String campaignId = DBUtil.getId(campaignJSON);
	    String subscriberId = DBUtil.getId(subscriberJSON);
	    TwitterJob twitterJob = new TwitterJob(token, tokenSecret, message,
		    subscriberId, campaignId);
	    twitterQueue.twitter_jobs.add(twitterJob);

	    return true;

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return false;

    }

    public static TwitterQueue getTwitterQueueForAccount(String account,
	    String rateLimit)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();
	searchMap.put("account", account);
	searchMap.put("rate_limit", rateLimit);

	return dao.getByProperty(searchMap);
    }

    public static List<TwitterQueue> getTwitterQueue(String rateLimit)
    {

	return dao.listByProperty("rate_limit", rateLimit);
    }

    // Delete Contact
    public void delete()
    {
	dao.delete(this);
    }

    public void save()
    {
	dao.put(this);
    }

    public static void runTwitterQueues(String rateLimit)
    {
	// Get All Queues for specified RateLimit
	List<TwitterQueue> twitterQueues = getTwitterQueue(rateLimit);

	System.out.println("Tweeting " + twitterQueues.size());

	for (TwitterQueue twitterQueue : twitterQueues)
	{
	    try
	    {

		List<TwitterJob> twitterJobs = twitterQueue.twitter_jobs;

		System.out.println("Queue " + twitterJobs.size());

		// Get First Job, Execute it
		if (twitterJobs.size() > 0)
		{

		    try
		    {
			twitterJobs.get(0).postStatus();
		    }
		    catch (Exception e)
		    {
			e.printStackTrace();
		    }

		    twitterJobs.remove(0);

		    // Delete the queue for that account if no more jobs are
		    // pending
		    if (twitterJobs.size() == 0)
			twitterQueue.delete();
		    else
		    {
			twitterQueue.twitter_jobs = twitterJobs;
			twitterQueue.save();
		    }
		}

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
    }

}
