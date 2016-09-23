/**
 * 
 */
package com.agilecrm.affiliate.util;

import java.util.List;

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
	
}
