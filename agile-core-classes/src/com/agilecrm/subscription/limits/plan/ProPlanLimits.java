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
		webRuleLimit = Integer.MAX_VALUE;
		pageViewsLimit = 20000;
		reporting = "ALL";
		whiteLabelEnabled = true;
		campaignNodesLimit = 50;
		emailAccountsLimit = 3;
		

		/**
		 * New plan limits
		 */
		widgetsLimit = Integer.MAX_VALUE;
		reportsLimit = 25;
		TriggersLimit = Integer.MAX_VALUE;

		/**
		 * New limits: 2015 Jan
		 */
		socialSuite = true;
		emailGateway = true;
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
		activityReports = true;

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
