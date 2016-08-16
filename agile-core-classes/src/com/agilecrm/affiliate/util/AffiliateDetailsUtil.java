/**
 * 
 */
package com.agilecrm.affiliate.util;

import java.util.List;

import com.agilecrm.affiliate.AffiliateDetails;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.util.DomainUserUtil;

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
		if(userId != null){
			return dao.getByProperty("userId", userId);
		}
		return null;	
	}
	
	public static AffiliateDetails getAffiliateDetails(){
		return getAffiliateDetailsbyUserId(DomainUserUtil.getCurrentDomainUser().id);
	}
	
}
