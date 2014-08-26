package com.agilecrm.workflows.automation;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.reports.ReportServlet;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.automation.util.AutomationUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

/**
 * <code>AutomationDeferredTask</code> runs campaigns on contacts periodically(Daily, Weekly,
 * Montly) based on contactFilter
 *  
 * Task is initialized from {@link AutomationServlet}, which is called by cron with
 * duration query parameter in URL
 * 
 * @author Ramesh
 * 
 */
@SuppressWarnings("serial")
public class AutomationDeferredTask implements DeferredTask
{
	
	/**
	 * Duration of automation
	 */
	private String duration;
	
	/**
	 * Domain of the account
	 */
	private String domain;

	public AutomationDeferredTask(String domain,String duration)
	{
		this.domain = domain;
		this.duration = duration;
	}

	@Override
	public void run()
	{
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set(domain);
		try
		{
			List<Automation> automations = AutomationUtil.getAutomationsByDuration(duration);
			for(Automation automation : automations){
				long filter = automation.contactFilter_id;
				String filter_id = Long.toString(filter);
				ContactFilterResultFetcher resultFetcher = new ContactFilterResultFetcher(filter_id,200,null,null);
				while(resultFetcher.hasNextSet()){
					WorkflowSubscribeUtil.subscribeDeferred(resultFetcher.nextSet(),automation.campaign_id);
				}
			}
		}
		catch(Exception e){
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}
}
