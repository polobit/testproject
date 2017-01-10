/**
 * 
 */
package com.agilecrm.addon;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.access.UserAccessScopes;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowUtil;

/**
 * Utility functions for AddOn Entity
 * @author Santhosh
 *
 */
public class AddOnUtil {
	
	/*
	 * DAO
	 */
	private static ObjectifyGenericDao<AddOn> dao = new ObjectifyGenericDao<AddOn>(AddOn.class);
	
	/**
	 * Get addon from cache. If not available fetches from DB
	 * If no addons exists returns default Addon with 0 quantity
	 * @return Addon
	 */
	public static AddOn getAddOn(){
		AddOn addOn;
		addOn = (AddOn) CacheUtil.getCache(AddOn.getCacheKey());
		if(addOn != null)
			return addOn;
		addOn =  dao.ofy().query(AddOn.class).get();
		if(addOn == null){
			addOn = new AddOn();
		}
		CacheUtil.setCache(AddOn.getCacheKey(), addOn);
		return addOn;
	}
	
	/**
	 * Forcefully fetch Addon from DB
	 * @param force
	 * @return Addon
	 */
	public static AddOn getAddOn(boolean force){
		AddOn addOn =  dao.ofy().query(AddOn.class).get();
		if(addOn == null){
			addOn = new AddOn();
		}
		return addOn;
	}
	
	/**
	 * check for credit card from Subscription Entity
	 * Get the Subscription
	 * If billing_data exist then customer has the credit  card
	 */
	public static boolean isCreditCardExist(){
		Subscription subscription = SubscriptionUtil.getSubscription();
		if(subscription.billing_data_json_string == null)
			return false;
		return true;
	}
	
	/**
	 * Set acl scopes to the defaults.
	 * @param domainIdList
	 */
	public static void setDefaultAcls(Set<Long> domainIdList){
		for(Long id : domainIdList){
			System.out.println("Setting ACLs to defaults for: "+id);
			DomainUser user = DomainUserUtil.getDomainUser(id);
			List<UserAccessScopes> newscopes = UserAccessScopes.customValues();
			newscopes.remove(UserAccessScopes.UPDATE_CONTACT);
			newscopes.remove(UserAccessScopes.ADD_NEW_TAG);
			user.newscopes = new LinkedHashSet<UserAccessScopes>(newscopes);
			user.newMenuScopes = null;
			user.menu_scopes = null;
			user.restricted_scopes = null;
			user.restricted_menu_scopes = null;
			try {
				user.save();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				System.out.println(ExceptionUtils.getMessage(e));
				e.printStackTrace();
			}
		}
	}
	/**
	 * Checks if credit card exists
	 * @throws Exception
	 */
	public static void checkForCreditCard() throws Exception{
		if(!AddOnUtil.isCreditCardExist())
			throw new Exception("This feature is only for paid users.");
	}
	
	/**
	 * Checks if can downgrade his campaigns or not
	 * @param count
	 * @return
	 */
	public static boolean canDowngradeCampaigns(int count){
		int workflowsCount = WorkflowUtil.getCount();
		Subscription subscription = SubscriptionUtil.getSubscription();
		int limit = subscription.planLimits.getWorkflowLimitWithoutAddons();
		int totalLimit = limit + count;
		if(totalLimit < workflowsCount)
			return false;
		return true;
	}
	
	/**
	 * Checks if can downgrade his triggers or not
	 * @param count
	 * @return
	 */
	public static boolean canDowngradeTriggers(int count){
		int triggersCount = TriggerUtil.getCount();
		Subscription subscription = SubscriptionUtil.getSubscription();
		int limit = subscription.planLimits.getTriggersLimitWithoutAddons();
		int totalLimit = limit + count;
		if(totalLimit < triggersCount)
			return false;
		return true;
	}
	
	 /**
	 * Checks is admin or not
	 * @param count
	 * @return
	 */
	public static void checkForPriviliges() throws Exception{
		//If uesr is not admin throw exception
		DomainUser user = DomainUserUtil.getCurrentDomainUser();
		if (!user.is_admin)
		{
			throw new Exception("Sorry. Only users with admin privileges can change the addons. Please contact your administrator for further assistance.");
		}
	}
	
	/**
	 * Delete addon from DB
	 */
	public static void deleteAddOn(){
		AddOn addOn = getAddOn();
		if(addOn != null && addOn.id != null)
			addOn.delete();
	}
	
	/**
	 * Get acl addon users list and check if domainUserId exists in that list or not
	 * @param domainUserId
	 * @return
	 */
	public static boolean aclAddOnExist(Long domainUserId){
		if(domainUserId == null)
			return false;
		AddOn addon = getAddOn();
		Set<Long> idList = addon.getAclUsers();
		if(idList != null && idList.contains(domainUserId))
			return true;
		return false;
	}

}
