package com.agilecrm.subscription.limits.cron.deferred;

import com.agilecrm.account.util.AccountEmailStatsUtil;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
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
	    BillingRestriction restriction = BillingRestrictionUtil.getBillingRestrictionAndSubscriptionFromDB();

	    System.out.println(restriction.tags_in_our_domain);
	    restriction.refresh(true);

	    // Get tag for each type. If usage exceeds 75 of allowed limit then
	    // tag is added
	    // This is required for contacts as we have to hard update even if
	    // limits are less than 75%
	    DaoBillingRestriction contactRestriction = DaoBillingRestriction.getInstaceDeamon("Contact", restriction);

	    // Set it true so tags are updated. It removes previous tags
	    contactRestriction.hardUpdateTags = true;
	    contactRestriction.getTag();
	    DaoBillingRestriction.getInstaceDeamon("WebRule", restriction).getTag();
	    DaoBillingRestriction.getInstaceDeamon("Workflow", restriction).getTag();
	    DaoBillingRestriction.getInstaceDeamon("Email", restriction).getTag();
	    DaoBillingRestriction.getInstaceDeamon("Trigger", restriction).getTag();

	    AccountEmailStatsUtil.checkLimits();

	    System.out.println("namespace : " + namespace);
	    System.out.println("Contacts = " + restriction.contacts_count + ", webrules = "
		    + restriction.webrules_count + ", workflow = " + restriction.campaigns_count);

	    if (restriction.id == null)
		restriction.save();

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
