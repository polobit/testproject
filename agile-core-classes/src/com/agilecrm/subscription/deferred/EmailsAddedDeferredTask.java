package com.agilecrm.subscription.deferred;

import java.util.HashMap;
import java.util.Map;

import com.agilecrm.user.DomainUser;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>EmailsAddedDeferredTask</code> is the class which sends 
 * an email to the customer when he got the free 5000 emails.
 * 
 * @author Mogulla
 *
 */
public class EmailsAddedDeferredTask implements DeferredTask {

	/**
	 * Serial ID
	 */
	private static final long serialVersionUID = 1L;
	
	DomainUser domainUser;
	
	

	@Override
	public void run() {
		System.out.println("Domain is "+domainUser.domain+" and email is "+domainUser.email);
		Map<String, String> data = new HashMap<String, String>();
		data.put("user_name",domainUser.name);
		SendMail.sendMail(domainUser.email, SendMail.FREE_EMAILS_UPDATED_SUBJECT, SendMail.FREE_EMAILS_UPDATED, data);
		
		
	}
	
	/**
	 * Sets domain name which can be used for a task to work
	 * @param domain_user - domain user
	 */
	public EmailsAddedDeferredTask(DomainUser domain_user){
		this.domainUser = domain_user;
	}

}
