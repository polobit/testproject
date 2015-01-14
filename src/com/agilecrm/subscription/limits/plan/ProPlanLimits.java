package com.agilecrm.subscription.limits.plan;

import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.subscription.limits.PlanLimits;

/**
 * Pro plan limitations
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
public class ProPlanLimits extends PlanLimits
{

	{
		contactLimit = Integer.MAX_VALUE;
		emailsLimit = 5000;
		workflowLimit = Integer.MAX_VALUE;
		googleContactsLimit = 1000;
		webRuleLimit = 10;
		pageViewsLimit = 20000;
		reporting = "ALL";
		whiteLabelEnabled = true;
		campaignNodesLimit = 50;
		
		/**
		 * New plan limits
		 */
		widgetsLimit = 1;
		reportsLimit = 25;
		TriggersLimit = 15;
	}

}
