package com.agilecrm.subscription.limits.cron.deferred;

import com.agilecrm.account.util.AccountEmailStatsUtil;
import com.agilecrm.subscription.restrictions.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * Updates usages details in particular Namespace and send reminder
 * 
 * @author Yaswanth
 * 
 */
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
	    // Namespace is set to ensure exact namespace usage is recored and
	    // saved
	    NamespaceManager.set(namespace);

	    // Fetches existing restriction object and refreshes usage details
	    // and saves back
	    BillingRestriction restriction = BillingRestrictionUtil.getBillingRestriction(false);
	    restriction.refresh(true);

	    // Get tag for each type. If usage exceeds 75 of allowed limit then
	    // tag is added
	    DaoBillingRestriction.getInstace("Contact", restriction).getTag();
	    DaoBillingRestriction.getInstace("WebRule", restriction).getTag();
	    DaoBillingRestriction.getInstace("Workflow", restriction).getTag();
	    AccountEmailStatsUtil.checkLimits();

	    // Adds tags in out domain
	    BillingRestrictionReminderUtil.addRestictionTagsInOurDomain(restriction.tagsToAddInOurDomain);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	// TODO Auto-generated method stub

    }
}
