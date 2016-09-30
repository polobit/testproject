/**
 * 
 */
package com.agilecrm.affiliate.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.affiliate.AffiliateDetails;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * Utility functions for AffiliateDetails
 * @author Santhosh
 *
 */
public class AffiliateDetailsUtil {
	
	private static ObjectifyGenericDao<AffiliateDetails> dao = new ObjectifyGenericDao<AffiliateDetails>(AffiliateDetails.class);
	
	public static List<AffiliateDetails> getAllUsersAffiliateDetails(){
		return dao.fetchAll();
	}
	
	/**
	 * fetch specific user Affiliate Details
	 */
	public static AffiliateDetails getAffiliateDetailsbyUserId(Long userId){
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");
		try{
			if(userId != null){
				return dao.getByProperty("userId", userId);
			}
			return null;
		}finally{
			NamespaceManager.set(oldNamespace);
		}
	}
	
	public static AffiliateDetails getAffiliateDetails(){
		return getAffiliateDetailsbyUserId(DomainUserUtil.getCurrentDomainUser().id);
	}
	
	public static void save(AffiliateDetails affiliateDetails){
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");
		try{
			if(affiliateDetails.getId() == null){
				affiliateDetails.setCreatedTime(System.currentTimeMillis()/1000);
			}
			dao.put(affiliateDetails);
		}finally{
			NamespaceManager.set(oldNamespace);
		}
	}
	
	public static List<AffiliateDetails> getAffiliateDetailsList(Long userId, Long startTime, Long endTime, int max, String cursor, String orderBy, String filterBy){
		Map<String, Object> map = new HashMap<String, Object>();
		if(startTime != null && endTime != null && filterBy != null){
			map.put(filterBy+" >=", startTime);
			map.put(filterBy+" <=", endTime);
		}
		if(userId != null)
			map.put("userId", userId);
		return dao.fetchAllByOrder(max, cursor, map, true, false, orderBy);
	}
	
	/**
	 * update the lastAffiliateAddedTime property value
	 */
	public static void setLastAffiliateAddedTime(Long userId){
		AffiliateDetails affiliateDetails = getAffiliateDetailsbyUserId(userId);
		affiliateDetails.setLastAffiliateAddedTime(System.currentTimeMillis()/1000);
		save(affiliateDetails);
	}
	
}
