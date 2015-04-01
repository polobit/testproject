package com.agilecrm.subscription.limits.cron.deferred;

import java.util.Set;

import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.mandrill.subaccounts.MandrillSubAccounts;

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

	// Subaccount paused tag should be added to all Admins of subaccount in
	// Our domain
	if (tags.contains(MandrillSubAccounts.MANDRILL_SUBACCOUNT_PAUSED_TAG))
	{
	    BillingRestrictionReminderUtil.addTagsToAdminsInOurDomain(tags);
	    return;
	}

	// Adds tags in out domain
	BillingRestrictionReminderUtil.addRestictionTagsInOurDomain(tags);

    }
}
