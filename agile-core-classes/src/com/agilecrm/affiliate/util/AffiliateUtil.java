/**
 * 
 */
package com.agilecrm.affiliate.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.affiliate.Affiliate;
import com.agilecrm.affiliate.AffiliateDetails;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.PropertyProjection;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.googlecode.objectify.Query;

/**
 * Utility functions for Affiliate
 * 
 * @author Santhosh
 *
 */
public class AffiliateUtil {
	
	private static ObjectifyGenericDao<Affiliate> dao = new ObjectifyGenericDao<Affiliate>(Affiliate.class);
	
	public static List<Affiliate> getAffiliates(Long userId){
		return getAffiliates(userId, null, null, 100, null);
	}
	
	public static List<Affiliate> getAffiliates(Long userId,int max, String cursor){
		return getAffiliates(userId, null, null, max, cursor);
	}
	
	public static List<Affiliate> getAffiliates(Long userId, Long startTime, Long endTime, int max, String cursor){
		Map<String, Object> map = new HashMap<String, Object>();
		if(startTime != null && endTime != null){
			map.put("createdTime >=", startTime);
			map.put("createdTime <=", endTime);
		}
		if(userId != null)
			map.put("relatedUserId", userId);
		return dao.fetchAll(max, cursor, map, true, false);
	}
	
	public static String getTotalCommisionAmount(Long userId, Long startTime, Long endTime) throws JSONException{
		DatastoreService dataStore = DatastoreServiceFactory.getDatastoreService();
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("Affiliate");
		query.addProjection(new PropertyProjection("amount", Integer.class));
		query.addProjection(new PropertyProjection("commission", Integer.class));
		if(userId != null)
			query.addFilter("relatedUserId", FilterOperator.EQUAL, userId);
		if(startTime != null && endTime != null){
			query.addFilter("createdTime", FilterOperator.GREATER_THAN_OR_EQUAL, startTime);
			query.addFilter("createdTime", FilterOperator.LESS_THAN_OR_EQUAL, endTime);
		}
		List<Entity> list = dataStore.prepare(query).asList(FetchOptions.Builder.withDefaults());
		long totalCommissionAmount = 0;
		for(Entity entity : list){
			Long amount = (Long)entity.getProperty("amount");
			Long commission = (Long)entity.getProperty("commission");
			totalCommissionAmount = totalCommissionAmount + ((amount / 100) * commission);
		}
		JSONObject json = new JSONObject();
		json.put("count", list.size());
		json.put("commission", totalCommissionAmount);
		AffiliateDetails affDetails = AffiliateDetailsUtil.getAffiliateDetailsbyUserId(userId);
		if(affDetails != null)
			json.put("amountAdded", affDetails.getAmount());
		else
			json.put("amountAdded", 0);
		return json.toString();
	}
	
	public static Affiliate createAffiliate(int amount){
		AccountPrefs accPrefs = AccountPrefsUtil.getAccountPrefs();
		if(accPrefs.affiliatedBy == null){
			System.out.println("No affiliated by id found. Returning null");
			return null;
		}
		DomainUser user = DomainUserUtil.getCurrentDomainUser();
		Subscription subscription = SubscriptionUtil.getSubscription();
		String oldNamespace = NamespaceManager.get();
		DomainUser affiliatedBy = DomainUserUtil.getDomainUser(accPrefs.affiliatedBy);
		if(affiliatedBy == null){
			System.out.println("Domain user with id "+accPrefs.affiliatedBy+" not found. Returning null");
			return null;
		}
		System.out.println("Setting namespace to "+affiliatedBy.domain);
		NamespaceManager.set(affiliatedBy.domain);
		try{
			if(dao.ofy().query(Affiliate.class).filter("domain", user.domain).count() == 0){
				Affiliate affiliate = new Affiliate();
				affiliate.setDomain(user.domain);
				affiliate.setEmail(user.email);
				affiliate.setPlan(subscription.plan.plan_type);
				affiliate.setUsersCount(subscription.plan.quantity);
				affiliate.setRelatedUserId(accPrefs.affiliatedBy);
				affiliate.setAmount(amount);
				affiliate.setCommission(Globals.AFFILIATE_COMMISION);
				affiliate.save();
				return affiliate;
			}
		}finally{
			NamespaceManager.set(oldNamespace);
		}
		return null;
	}
}
