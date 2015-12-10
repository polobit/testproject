package com.agilecrm.workflows.triggers;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.contact.filter.ContactFilterResultFetcher;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

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

		// Search rule to specify type is person
		SearchRule rule = new SearchRule();
		rule.RHS = "PERSON";
		rule.CONDITION = RuleCondition.EQUALS;
		rule.LHS = "type";

		filterObject.rules.add(rule);

		ContactFilterResultFetcher resultFetcher = new ContactFilterResultFetcher(filterObject, 200);
		resultFetcher.setLimits();
		System.out.println("available : " + resultFetcher.getAvailableContacts());
		while (resultFetcher.hasNextSet())
		{
		    List<Contact> contacts = resultFetcher.nextSet();
		    System.out.println("Total contacts count : " + contacts.size());
		    WorkflowSubscribeUtil.subscribeDeferred(contacts, trigger.campaign_id);
		}

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
