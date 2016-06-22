package com.agilecrm.account.util;

import java.util.List;
import java.util.Set;

import com.agilecrm.AllDomainStats;
import com.agilecrm.account.DomainLimits;
import com.agilecrm.alldomainstats.util.AllDomainStatsUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.limits.PlanLimits;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>DomainLimitsUtil</code> is a utility class to process the data of
 * DomainLimits class, it processes when fetching the data and saving the data.
 * <p>
 * This utility class includes methods needs to return count of particular limit
 * based on created time and etc.. *
 * </p>
 * 
 * @author Priyanka
 * 
 * */
public class DomainLimitsUtil {

	/**
	 * Declaring the TWEETS_LIMIT variable for the default value 25
	 * */
	public static int TWEETS_LIMIT = 25;

	/**
	 * ObjctifyDAO for DomainLimits
	 */
	public static ObjectifyGenericDao<DomainLimits> dao = new ObjectifyGenericDao<DomainLimits>(
			DomainLimits.class);

	/**
	 * save the all properties of DomainLimits in Database for all Domain
	 * 
	 * @param Object
	 *            of DomainLimits class
	 * @return
	 */

	public static void saveDefaultTweetLimit(DomainLimits domainLimits) {

		try {
			domainLimits.save();
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	/**
	 * campaign Tweet_node sendTweet_limit upto 25 in a day creating the method
	 * for the giving the default send tweet messsage limit upto 25 in a day
	 */

	public static DomainLimits setDefaultTweetLimit(String domain) {
	 
	 		String oldNamespace = NamespaceManager.get();
	 		DomainLimits domainlimits = null;
	 
	 		try {
	 			NamespaceManager.set("");
	 
	 			domainlimits = new DomainLimits(TWEETS_LIMIT, domain);
	 			domainlimits.save();
	 
	 		} catch (Exception e) {
	 			System.out.println("error occured:"  +e.getMessage());
	 
	 		} finally {
	 			NamespaceManager.set(oldNamespace);
	 		}
	 
	 		return domainlimits;
	 	}

	/**
	 * this method used for the to decrement the limit
	 */

	public static void decrementTweetLimit(String domain) {
		DomainLimits domainlimits = DomainLimitsUtil
				.getDomainLimitsFromDB(domain);

		domainlimits.setTweet_limit(domainlimits.getTweet_limit() - 1);
		domainlimits.save();
	}

	public static DomainLimits getDomainLimitsFromDB(String domain) {
	 
	 		String oldNamespace = NamespaceManager.get();
	 		DomainLimits domainlimits = null;
	 
	 		try {
	 			NamespaceManager.set("");
	 
	 			domainlimits = DomainLimits.dao.ofy().query(DomainLimits.class)
	 					.filter("domain", domain).get();
	 		} catch (Exception e) {
	 			System.out.println("error occured:"  +e.getMessage());
	 
	 		} finally {
	 			NamespaceManager.set(oldNamespace);
	 		}
	 
	 		return domainlimits;
	 	}

	/**
	 * Get the list of all limit report
	 * 
	 * @param max
	 * @param cursor
	 * @return List of DomainLimits
	 */
	public static List<DomainLimits> getAllDomainLimits() {

		String oldNamespace = NamespaceManager.get();

		try {
			NamespaceManager.set("");
			return dao.fetchAll();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		} finally {
			NamespaceManager.set(oldNamespace);

		}
	}

	public static DomainLimits checkDomainLimits(String domain) {
		DomainLimits domainLimits = DomainLimitsUtil
				.getDomainLimitsFromDB(domain);

		if (domainLimits == null)
			return DomainLimitsUtil.setDefaultTweetLimit(domain);

		return domainLimits;
	}

	public static void resetDefaultsForAllDomains() {
	 		try {
	 
	 			List<DomainLimits> domainlimit = getAllDomainLimits();
	 			for (DomainLimits domainlimit1 : domainlimit) {
	 				domainlimit1.tweet_limit = TWEETS_LIMIT;
	 				domainlimit1.save();
	 			}
	 
	 		} catch (Exception e) {
	 			System.out.println("Error occured:"  +e.getMessage());
	 
	 		}
	 	}
}
