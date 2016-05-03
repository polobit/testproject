package com.campaignio.servlets.deferred;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
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
public class WorkflowAddAccessLevelDeferredTask implements DeferredTask {

	public String domain;
	public WorkflowAddAccessLevelDeferredTask(String domain){
	  this.domain = domain;	
	}
	
	public void run() {
		
		try {
			
			if(StringUtils.isBlank(domain))
				return;
			
			NamespaceManager.set(domain);
			
			List<Workflow> workflows = WorkflowUtil.getAllWorkflows();
			System.out.println("workflows = " + workflows.size());
			
			for (Workflow workflow : workflows) {
				workflow.save(true);
			}
		} finally {
		}
		
	}
}
