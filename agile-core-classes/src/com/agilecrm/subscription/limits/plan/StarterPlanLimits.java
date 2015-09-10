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
		workflowLimit = 5;
		googleContactsLimit = 1000;
		webRuleLimit = 5;
		pageViewsLimit = 1000;
		reporting = "ALL";
		whiteLabelEnabled = true;
		campaignNodesLimit = 10;
		emailAccountsLimit = 1;

		/**
		 * New plan limits
		 */
		widgetsLimit = 1;
		reportsLimit = 3;
		TriggersLimit = 5;
		activityReports = false;

		/**
		 * New limits: 2015 Jan
		 */
		socialSuite = false;
		emailGateway = false;
		smsGateway = false;
		ACL = false;
		mobileIntegration = false;
		onlineAppointment = false;
		callingWidget = false;

		/**
		 * Reports
		 */
		cohortReports = false;
		growthReports = false;
		funnelReports = false;

		googleSync = true;
		ecommerceSync = false;
		paymentSync = false;
		accountingSync = false;

		widgets = 5;
		defaultWidget = false;
	}
}
