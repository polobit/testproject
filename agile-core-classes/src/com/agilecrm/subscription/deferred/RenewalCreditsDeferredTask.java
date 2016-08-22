package com.agilecrm.subscription.deferred;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
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
	
	Integer quantity;

	@Override
	public void run() {
		System.out.println("Domain:: "+domainUser);
		NamespaceManager.set(domainUser);
		try {
			SubscriptionUtil.getSubscription().purchaseEmailCredits(quantity);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			System.out.println(ExceptionUtils.getMessage(e));
			e.printStackTrace();
		}
		
	}
	
	/**
	 * Sets domain name which can be used for a task to work
	 * @param domain_user - domain user
	 */
	public RenewalCreditsDeferredTask(String domain_user, Integer quantity){
		this.domainUser = domain_user;
		this.quantity = quantity;
	}

}
