package com.agilecrm.subscription.limits.plan;

import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.subscription.limits.PlanLimits;

/**
 * Free plan limits. It is child class of {@link PlanLimits} and limits are set
 * in instance block.
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
public class FreePlanLimits extends PlanLimits
{
	/**
	 * As there fields are already defined in PlanLimits class these fields can
	 * be initialized in instance block
	 */
	{
		contactLimit = 1000;
		emailsLimit = 500;
		workflowLimit = 1;
		googleContactsLimit = 1000;
		webRuleLimit = 1;
		pageViewsLimit = 1000;
		reporting = "EMAIL_REPORTING";
		whiteLabelEnabled = false;
		campaignNodesLimit = 5;
		
		/**
		 * New plan limits
		 */
		widgetsLimit = 1;
		reportsLimit = 1;
		TriggersLimit = 0;

	}
}
