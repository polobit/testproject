package com.agilecrm.workflows.triggers;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.contact.filter.util.ContactFilterUtil;
import com.agilecrm.reports.ReportServlet;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

/**
 * <code>TriggerDeferredTask</code> runs campaigns on contacts
 * periodically(Daily, Weekly, Montly) based on contactFilter
 * 
 * Task is initialized from {@link TriggerServlet}, which is called by cron with
 * duration query parameter in URL
 * 
 * @author Ramesh
 * 
 */
@SuppressWarnings("serial")
public class TriggerDeferredTask implements DeferredTask
{

	/**
	 * Period of trigger
	 */
	private String period;

	/**
	 * Domain of the account
	 */
	private String domain;

	public TriggerDeferredTask(String domain, String period)
	{
		this.domain = domain;
		this.period = period;
	}

	@Override
	public void run()
	{
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set(domain);
		try
		{
			List<Trigger> triggers = TriggerUtil.getTriggersByPeriod(period);
			for (Trigger trigger : triggers)
			{
				long filter = trigger.contact_filter_id;
				ContactFilter filterObject = ContactFilter.getContactFilter(filter);

				if (filterObject == null)
					continue;

				ContactFilterResultFetcher resultFetcher = new ContactFilterResultFetcher(filterObject, 200);

				// Search rule to specify type is person
				SearchRule rule = new SearchRule();
				rule.RHS = "PERSON";
				rule.CONDITION = RuleCondition.EQUALS;
				rule.LHS = "type";

				filterObject.rules.add(rule);

				while (resultFetcher.hasNextSet())
					WorkflowSubscribeUtil.subscribeDeferred(resultFetcher.nextSet(), trigger.campaign_id);
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}
}
