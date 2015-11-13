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
		webRuleLimit = 10;
		pageViewsLimit = 10000;
		reporting = "ALL";
		whiteLabelEnabled = true;
		campaignNodesLimit = 25;
		emailAccountsLimit = 1;

		/**
		 * New plan limits
		 */
		widgetsLimit = 1;
		reportsLimit = 10;
		TriggersLimit = 10;

		/**
		 * New limits: 2015 Jan
		 */
		socialSuite = true;
		emailGateway = false;
		smsGateway = true;
		ACL = true;
		mobileIntegration = true;
		onlineAppointment = true;
		callingWidget = true;

		/**
		 * Reports
		 */
		cohortReports = true;
		growthReports = true;
		funnelReports = true;
		activityReports = false;

		googleSync = true;
		ecommerceSync = true;
		paymentSync = true;
		accountingSync = true;

		widgets = Integer.MAX_VALUE;
		customWidget = true;
		
		/**
		 * Milestones
		 */
		addTracks = true;
	}
}
