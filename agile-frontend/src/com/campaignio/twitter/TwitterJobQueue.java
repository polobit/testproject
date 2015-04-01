package com.campaignio.twitter;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;

/**
 * <code>TwitterJobQueue</code> is responsible to post tweets at regular
 * intervals set by user. TwitterJobQueues are stored in empty namespace.
 * 
 * @author Manohar
 * 
 */
@Cached
public class TwitterJobQueue
{
    /**
     * TwitterJobQueue Id
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
     * Dao for TwitterJobQueue class
     */
    private static ObjectifyGenericDao<TwitterJobQueue> dao = new ObjectifyGenericDao<TwitterJobQueue>(
	    TwitterJobQueue.class);

    /**
     * Default TwitterJobQueue
     */
    TwitterJobQueue()
    {

    }

    /**
     * TwitterJobQueue with account and ratelimit
     * 
     * @param account
     *            Twitter account
     * @param rateLimit
     *            Rate Limit
     */
    public TwitterJobQueue(String account, String rateLimit)
    {
	this.account = account;
	this.rate_limit = rateLimit;
    }

    /**
     * Saves TwitterJobQueue
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
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Deletes TwitterJobQueue
     */
    public void delete()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    dao.delete(this);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}