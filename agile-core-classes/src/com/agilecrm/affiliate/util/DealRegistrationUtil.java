/**
 * 
 */
package com.agilecrm.affiliate.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.affiliate.AffiliateDeal;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.util.DomainUserUtil;

/**
 * Utility functions for Affiliate Registered Deals
 * 
 * @author Santhosh
 *
 */
public class DealRegistrationUtil {
			
	public static List<AffiliateDeal> getRegisteredDeal(Long userId, Long startTime, Long endTime, int max, String cursor, String orderBy){
		Map<String, Object> map = new HashMap<String, Object>();
		if(startTime != null && endTime != null){
			map.put("createdTime >=", startTime);
			map.put("createdTime <=", endTime);
		}
		if(userId != null)
			map.put("relatedUserId", userId);
		return dao.fetchAllByOrder(max, cursor, map, true, false, orderBy);
	}
	
	public static AffiliateDeal registerDeal(AffiliateDeal deal){
		deal.setRelatedUserId(DomainUserUtil.getCurrentDomainUser().id);
		save(deal);
		return deal;
	}
	
	/**
	 * Dao
	 */
	static ObjectifyGenericDao<AffiliateDeal> dao = new ObjectifyGenericDao<AffiliateDeal>(AffiliateDeal.class);
	
	public static void save(AffiliateDeal deal){
		deal.setUpdatedTime(System.currentTimeMillis()/1000);
		if(deal.getId() == null){
			deal.setCreatedTime(System.currentTimeMillis()/1000);
		}
		dao.put(deal);
	}
	
	public static void delete(AffiliateDeal deal){
		dao.delete(deal);
	}
}
