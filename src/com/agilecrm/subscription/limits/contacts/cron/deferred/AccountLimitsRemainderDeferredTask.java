package com.agilecrm.subscription.limits.contacts.cron.deferred;

import com.agilecrm.subscription.restrictions.BillingRestriction1;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionUtil;
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
	    BillingRestriction1 restriction = BillingRestrictionUtil.getBillingRestriction(false);
	    restriction.getTags = true;
	    restriction.refresh(true);
	    BillingRestrictionUtil.addRestictionTagsInOurDomain(restriction.tagsToAddInOurDomain);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	// TODO Auto-generated method stub

    }
}
