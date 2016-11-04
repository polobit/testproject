package com.agilecrm.subscription.deferred;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.util.CacheUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>EmailsAddedDeferredTask</code> is the class which sends 
 * an email to the customer when he got the free 5000 emails.
 * 
 * @author Mogulla
 *
 */
public class RenewalCreditsDeferredTask implements DeferredTask {

	/**
	 * Serial ID
	 */
	private static final long serialVersionUID = 1L;
	
	String domainUser;
	
	int quantity;
	
	int decrementCount;

	@Override
	public void run() {
		System.out.println("Domain:: "+domainUser);
		String oldNamespace= NamespaceManager.get();
		NamespaceManager.set(domainUser);
		try {
			String auto_renewal_status = (String) CacheUtil.getCache(domainUser+"_auto_renewal_billing_failed");
			if(auto_renewal_status == null)
				SubscriptionUtil.getSubscription().purchaseEmailCredits(quantity, decrementCount);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println(ExceptionUtils.getMessage(e));
			e.printStackTrace();
		}finally{
			NamespaceManager.set(oldNamespace);
		}
		
	}
	
	/**
	 * Sets domain name which can be used for a task to work
	 * @param domain_user - domain user
	 */
	public RenewalCreditsDeferredTask(String domain_user, int quantity, int decrementCount){
		this.domainUser = domain_user;
		this.quantity = quantity;
		this.decrementCount = decrementCount;
	}

}
