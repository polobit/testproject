package com.agilecrm.subscription.limits.plan;

import com.agilecrm.subscription.limits.PlanLimits;

/**
 * Plan limits of regular plan
 * 
 * @author yaswanth
 * 
 */
public class RegularPlanLimits extends PlanLimits
{
	{
		contactLimit = 50000;
		emailsLimit = 2500;
		workflowLimit = 10;
		googleContactsLimit = 1000;
		webRuleLimit = 5;
		pageViewsLimit = 10000;
		reporting = "ALL";
		whiteLabelEnabled = true;
		campaignNodesLimit = 25;
	}
}
