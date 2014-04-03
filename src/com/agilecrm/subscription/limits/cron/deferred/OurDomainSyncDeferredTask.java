package com.agilecrm.subscription.limits.cron.deferred;

import java.util.Set;

import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
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
	BillingRestrictionReminderUtil.addRestictionTagsInOurDomain(tags);
    }
}
