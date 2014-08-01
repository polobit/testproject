package com.agilecrm.subscription.limits.plan;

import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.subscription.limits.PlanLimits;

/**
 * Plan limits of starter plan
 * 
 * @author yaswanth
 * 
 */
@XmlRootElement
public class StarterPlanLimits extends PlanLimits
{
    {
	contactLimit = 10000;
	emailsLimit = 1500;
	workflowLimit = 3;
	googleContactsLimit = 1000;
	webRuleLimit = 3;
	pageViewsLimit = 1000;
	reporting = "ALL";
	whiteLabelEnabled = true;
    }
}
