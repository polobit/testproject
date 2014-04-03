package com.agilecrm.subscription.limits.cron.deferred;

import java.util.Set;

import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * Task to add tags to our domain. It is called if tag is being added from
 * front-end instead of tasks.
 * 
 * @author Yaswanth
 * 
 */
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

	// Adds tags in out domain
	BillingRestrictionReminderUtil.addRestictionTagsInOurDomain(tags);
    }
}
