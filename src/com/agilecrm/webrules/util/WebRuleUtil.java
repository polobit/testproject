package com.agilecrm.webrules.util;

import java.util.List;

import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.limits.PlanLimitsEnum;
import com.agilecrm.webrules.WebRule;

public class WebRuleUtil
{
    public static List<WebRule> getAllWebRules()
    {
	return WebRule.dao.fetchAll();
    }

    public static boolean isLimitReached()
    {
	Subscription subscrition = Subscription.getSubscription();
	int count = WebRule.dao.count();
	if (subscrition == null)
	{
	    if (PlanLimitsEnum.FREE.getWebRuleLimit() * 2 <= WebRule.dao.count())
		return true;
	    return false;
	}

	return subscrition.plan.getPlanLimits().getWebRuleLimit() <= count ? true : false;
    }
}
