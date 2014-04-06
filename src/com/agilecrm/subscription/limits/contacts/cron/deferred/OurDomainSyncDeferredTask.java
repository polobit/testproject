package com.agilecrm.subscription.limits.contacts.cron.deferred;

import java.util.Set;

import com.agilecrm.subscription.restrictions.util.BillingRestrictionUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public class OurDomainSyncDeferredTask implements DeferredTask
{

    private Set<String> tags;

    public OurDomainSyncDeferredTask(Set<String> tags)
    {
	this.tags = tags;
    }

    @Override
    public void run()
    {

	// TODO Auto-generated method stub
	BillingRestrictionUtil.addRestictionTagsInOurDomain(tags);
    }
}
