package com.campaignio.servlets.deferred;

import java.util.List;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.campaignio.cron.util.CronUtil;
import com.campaignio.tasklets.util.CampaignConstants;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>EmailRepliedDeferredTask</code> is the deferred task that handles
 * campaign email Replied tasklet cron jobs.
 *
 * @author Govind
 * 
 */
@SuppressWarnings("serial")
public class DomainUserAddPicDeferredTask implements DeferredTask {

	public String domain;
	public DomainUserAddPicDeferredTask(String domain){
	  this.domain = domain;	
	}
	
	public void run() {
		String oldNamespace = NamespaceManager.get();
		
		try {
			NamespaceManager.set(domain);
			
			// Get all users and update domain user db with user pic
			List<AgileUser> agileUsers = AgileUser.getUsers();
			System.out.println(agileUsers.size());
			
			for (AgileUser user : agileUsers) {

				
				DomainUser domainUser = user.getDomainUser();
				System.out.println("domainUser = " + domainUser);
				
				if (domainUser == null)
					continue;

				UserPrefs prefs = UserPrefsUtil.getUserPrefs(user);
				System.out.println("prefs = " + prefs);
				
				if (prefs == null)
					continue;

				domainUser.pic = prefs.pic;
				try {
					domainUser.save();
				} catch (Exception e) {
					System.out.println(ExceptionUtils.getFullStackTrace(e));
				}
			}
		} finally {
			NamespaceManager.set(oldNamespace);
		}
		
	}
}
