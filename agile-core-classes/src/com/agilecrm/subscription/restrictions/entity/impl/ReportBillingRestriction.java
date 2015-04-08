package com.agilecrm.subscription.restrictions.entity.impl;

import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.entity.DaoBillingRestriction;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionReminderUtil;
import com.agilecrm.workflows.Workflow;

public class ReportBillingRestriction extends DaoBillingRestriction
{

    /**
     * Checks if new workflow does not exceed limits in current plan
     */
    @Override
    public boolean can_create()
    {
	restriction.reports_count = ReportsUtil.count();

	if (restriction.sendReminder)
	    send_warning_message();

	if (restriction.reports_count < max_allowed)
	    return true;

	return false;
    }

    @Override
    public boolean can_update()
    {
	return true;
    }

    @Override
    public boolean check()
    {

	Reports report = (Reports) entity;
	if (report.id == null)
	    return can_create();

	return can_update();
    }

    @Override
    public void setMax()
    {
	if (restriction == null)
	    restriction = BillingRestrictionUtil.getInstance(sendReminder);

	max_allowed = restriction.planDetails.getReportsLimit();
    }

    @Override
    public String getTag()
    {
	System.out.println(max_allowed);
	System.out.println();
	Integer percentage = BillingRestrictionReminderUtil.calculatePercentage(max_allowed, restriction.reports_count);
	
	if(percentage < 75)
	    return null;
	
	String tag = BillingRestrictionReminderUtil.getTag(restriction.reports_count, max_allowed, "Report",
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
