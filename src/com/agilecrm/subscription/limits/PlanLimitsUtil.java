package com.agilecrm.subscription.limits;

import com.agilecrm.subscription.ui.serialize.Plan;

public class PlanLimitsUtil
{
    Plan plan;
    PlanLimits limits;

    public PlanLimitsUtil(Plan plan)
    {
	this.plan = plan;
	if (plan.quantity == null)
	    plan.quantity = 1;
	limits = plan.getPlanLimits();
    }

    public String getPlan()
    {
	return limits.toString();
    }

    public String getPlanId()
    {
	return limits.getPlanId();
    }

    public Integer getContactsLimit()
    {
	return limits.getContactsLimit() * plan.quantity;
    }

    public Float getPrice()
    {
	return limits.getPrice() * plan.quantity;
    }

    public Integer getGoogleContactsLimit()
    {
	return limits.getGoogleContactsLimit() * plan.quantity;
    }

    public Integer getEmailsLimit()
    {
	return limits.getEmailsLimit() * plan.quantity;
    }

    public Integer getCampaignsLimit()
    {
	return limits.getCampaignsLimit() * plan.quantity;
    }

    public Integer getwebRulesLimit()
    {
	return limits.getwebRulesLimit() * plan.quantity;
    }

    public Integer getPageViewsLimit()
    {
	return limits.getPageViewsLimit() * plan.quantity;
    }

    public String getReporting()
    {
	return limits.getReporting();
    }

    public boolean isWhiteLabelEnabled()
    {
	return limits.isWhiteLabelEnabled();
    }
}
