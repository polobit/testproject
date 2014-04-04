package com.agilecrm.subscription.restrictions;

import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
import com.agilecrm.workflows.Workflow;

public class WorkflowBillingRestriction extends DaoBillingRestriction
{
    /**
     * Checks if new workflow does not exceed limits in current plan
     */
    @Override
    public boolean can_create()
    {
	restriction.webrules_count = Workflow.dao.count();

	if (restriction.sendReminder)
	    send_warning_message();

	if (restriction.webrules_count < MAX)
	    return true;

	return false;
    }

    /**
     * Always returns as there are no limits on updation
     */
    @Override
    public boolean can_update()
    {
	// TODO Auto-generated method stub
	return true;
    }

    @Override
    public void send_warning_message()
    {
	getTag();
	if (restriction.tagsToAddInOurDomain.isEmpty())
	    return;

	restriction.sendReminder();
    }

    /**
     * Creates restriction object and gets Max allowed workflows count
     */
    @Override
    public void setMax()
    {
	if (restriction == null)
	    restriction = BillingRestrictionUtil.getInstance(sendReminder);

	MAX = restriction.planDetails.getWorkflowLimit();

    }

    @Override
    public String getTag()
    {
	String tag = BillingRestrictionReminderUtil.getTag(restriction.campaigns_count, MAX, "Workflow");

	System.out.println(restriction.campaigns_count + ", " + MAX);
	System.out.println("system tag");
	System.out.println(tag);
	if (tag != null)
	    restriction.tagsToAddInOurDomain.add(tag);

	return tag;
    }
}
