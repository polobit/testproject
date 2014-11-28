package com.agilecrm.subscription.restrictions.entity.impl;

import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;

public class TriggerBillingRestriction extends DaoBillingRestriction
{

    @Override
    public boolean can_create()
    {
	
	restriction.triggers_count = TriggerUtil.getCount();
	Integer currentStatus =  restriction.triggers_count;
	
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
	System.out.println();
	Integer percentage = BillingRestrictionReminderUtil.calculatePercentage(max_allowed, restriction.triggers_count);
	
	if(percentage < 75)
	    return null;
	
	String tag = BillingRestrictionReminderUtil.getTag(restriction.triggers_count, max_allowed, "Trigger",
		hardUpdateTags);
	
	if(!canAddTag(percentage, tag))
	    return null;

	System.out.println("system tag");
	System.out.println(tag);
	if (tag != null)
	    restriction.tagsToAddInOurDomain.add(tag);

	return tag;
    }

}
