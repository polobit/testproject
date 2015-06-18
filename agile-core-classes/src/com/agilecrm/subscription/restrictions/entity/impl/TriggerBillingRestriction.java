package com.agilecrm.subscription.restrictions.entity.impl;

import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;

public class TriggerBillingRestriction extends DaoBillingRestriction
{

    @Override
    public boolean can_create()
    {

	restriction.triggers_count = TriggerUtil.getCount();
	Integer currentStatus = restriction.triggers_count;

	if (restriction.sendReminder)
	    send_warning_message();

	if (currentStatus < max_allowed)
	    return true;

	return false;
    }

    @Override
    public boolean can_update()
    {
	// TODO Auto-generated method stub
	return true;
    }

    @Override
    public boolean check()
    {
	Trigger trigger = (Trigger) entity;
	if (trigger.id == null)
	    return can_create();

	return can_update();
    }

    @Override
    public void setMax()
    {
	// TODO Auto-generated method stub
	if (restriction == null)
	    restriction = BillingRestrictionUtil.getInstance(sendReminder);

	max_allowed = restriction.planDetails.getTriggersLimit();
    }

    @Override
    public String getTag()
    {
	System.out.println(max_allowed);

	if (restriction == null || restriction.triggers_count == null)
	    return null;

	int count = restriction.triggers_count;

	String tag = setTagsToUpdate(max_allowed, daemonCheck ? restriction.triggers_count
		: (restriction.triggers_count + 1));

	restriction.triggers_count = count;

	return tag;
    }

}
