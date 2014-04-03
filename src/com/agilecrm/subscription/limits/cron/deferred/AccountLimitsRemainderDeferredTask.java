package com.agilecrm.subscription.limits.cron.deferred;

import java.util.Set;

import com.agilecrm.account.util.AccountEmailStatsUtil;
import com.agilecrm.subscription.restrictions.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

public class AccountLimitsRemainderDeferredTask implements DeferredTask
{
    private String namespace;

    public AccountLimitsRemainderDeferredTask(String namespace)
    {
	this.namespace = namespace;
    }

    @Override
    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	try
	{
	    NamespaceManager.set(namespace);
	    BillingRestriction restriction = BillingRestrictionUtil.getBillingRestriction(false);
	    restriction.refresh(true);

	    DaoBillingRestriction.getInstace("Contact", restriction).getTag();
	    DaoBillingRestriction.getInstace("WebRule", restriction).getTag();
	    DaoBillingRestriction.getInstace("Workflow", restriction).getTag();
	    AccountEmailStatsUtil.checkLimits();

	    BillingRestrictionReminderUtil.addRestictionTagsInOurDomain(restriction.tagsToAddInOurDomain);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	// TODO Auto-generated method stub

    }

    public void addTag(Set<String> tags)
    {

    }
}
