package com.agilecrm.account;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import com.agilecrm.AllDomainStats;
import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Indexed;

/**
 * <code>DomainLimts</code> class stores the details of a tweet_limit  
 * The properties (created_time, updated_time, tweet_limit and  fields and
 * etc..) of  domain are stored in this class. 
 * 
 * @author Priyanka
 * 
 */


public class DomainLimits {
	/**
	 * Tweet_limit's Id
	 */
	@Id
	public Long id;

	/**
	 * Created Time
	 */
	@Indexed
	public long created_time = 0L;
	@Indexed
	public long updated_time = 0L;
	/**
	 * creating an variable for the 
	 * tweet_limit
	 * */
	public Integer tweet_limit;
	/**//**
	 * creating an domain here for the all planner user
	 * *//*
*/	public String domain = null;

	/**
	 * Stores the property names in final variables, for reading flexibility of
	 * the property values
	 */
	/*public static final String TWEET_LIMITS = "tweet_limit";

	public static final String DOMAIN = "domain";*/

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public long getCreated_time() {
		return created_time;
	}

	public void setCreated_time(long created_time) {
		this.created_time = created_time;
	}

	public long getUpdated_time() {
		return updated_time;
	}

	public void setUpdated_time(long updated_time) {
		this.updated_time = updated_time;
	}

	public Integer getTweet_limit() {
		return tweet_limit;
	}

	public void setTweet_limit(Integer tweet_limit) {
		this.tweet_limit = tweet_limit;
	}

	public String getDomain() {
		return domain;
	}

	public void setDomain(String domain) {
		this.domain = domain;
	}

	/**
	 * ObjctifyDAO for DomainLimits
	 */
	public static ObjectifyGenericDao<DomainLimits> dao = new ObjectifyGenericDao<DomainLimits>(
			DomainLimits.class);

	public DomainLimits() {
	}

	public DomainLimits(Integer tweet_limit, String domain) {
		this.tweet_limit = tweet_limit;
		this.domain = domain;
	}

	/**
	 * Saves a tweet_limit Report in the database
	 */
	public void save() {
		String currentNameSpace = NamespaceManager.get();
		NamespaceManager.set("");
		try {
			dao.put(this);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			NamespaceManager.set(currentNameSpace);
		}
	}
	
	@PrePersist
	void PrePersist()
	{
		if(id==null)
		{
			created_time = System.currentTimeMillis()/1000;
			return;
		}
		
		updated_time = System.currentTimeMillis()/1000;
		
		
	}

	@Override
	public String toString() {
		return "DomainLimits [id=" + id + ", created_time=" + created_time
				+ ", updated_time=" + updated_time + ", tweet_limit="
				+ tweet_limit + ", domain=" + domain + "]";
	}

}
