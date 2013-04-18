package com.campaignio.twitter;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Indexed;

/**
 * <code>TwitterQueue</code> is responsible to post tweets at regular intervals
 * set by user.
 * 
 * @author Manohar
 * 
 */
public class TwitterQueue
{
    /**
     * TwitterQueue Id
     */
    @Id
    public Long id;

    /**
     * List of Twitter Jobs
     */
    @Embedded
    public List<TwitterJob> twitter_jobs = new ArrayList<TwitterJob>();

    /**
     * Twitter Account
     */
    public String account;

    /**
     * Rate limit
     */
    public String rate_limit;

    /**
     * Namespace
     */
    @Indexed
    public String namespace;

    /**
     * 5 tweets per hour
     */
    public static final String TWITTER_DB_RATE_LIMIT_HOURLY_5 = "rate_limit_5";
    /**
     * 10 tweets per hour
     */
    public static final String TWITTER_DB_RATE_LIMIT_HOURLY_10 = "rate_limit_10";
    /**
     * 20 tweets per hour
     */
    public static final String TWITTER_DB_RATE_LIMIT_HOURLY_20 = "rate_limit_20";

    /**
     * Dao for TwitterQueue class
     */
    private static ObjectifyGenericDao<TwitterQueue> dao = new ObjectifyGenericDao<TwitterQueue>(
	    TwitterQueue.class);

    /**
     * Default TwitterQueue
     */
    TwitterQueue()
    {

    }

    /**
     * Twitter Queue with account and ratelimit
     * 
     * @param account
     *            Twitter account
     * @param rateLimit
     *            Rate Limit
     */
    public TwitterQueue(String account, String rateLimit)
    {
	this.account = account;
	this.rate_limit = rateLimit;
    }

    /**
     * Saves TwitterQueue
     */
    public void save()
    {
	// Set namespace for first time.
	if (id == null)
	    namespace = NamespaceManager.get();

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    dao.put(this);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Deletes TwitterQueue
     */
    public void delete()
    {
	dao.delete(this);
    }

}
