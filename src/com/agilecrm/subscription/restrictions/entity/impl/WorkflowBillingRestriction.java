package com.agilecrm.subscription.restrictions.entity.impl;

import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
import com.agilecrm.workflows.Workflow;

public class WorkflowBillingRestriction extends DaoBillingRestriction
{
    boolean hardUpdateTags = true;

    /**
     * Checks if new workflow does not exceed limits in current plan
     */
    @Override
    public boolean can_create()
    {
	restriction.campaigns_count = Workflow.dao.count();

	if (restriction.sendReminder)
	    send_warning_message();

	if (restriction.campaigns_count < max_allowed)
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

	max_allowed = restriction.planDetails.getWorkflowLimit();

    }

    @Override
    public String getTag()
    {
	System.out.println(max_allowed);
	System.out.println(restriction.campaigns_count);
	String tag = BillingRestrictionReminderUtil.getTag(restriction.campaigns_count, max_allowed, "Workflow",
		hardUpdateTags);

	System.out.println(restriction.campaigns_count + ", " + max_allowed);
	System.out.println("system tag");
	System.out.println(tag);
	if (tag != null)
	    restriction.tagsToAddInOurDomain.add(tag);

	return tag;
    }

    @Override
    public boolean check()
    {
	Workflow workflow = (Workflow) entity;
	if (workflow.id == null)
	    return can_create();

	return can_update();
    }
}
