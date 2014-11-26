package com.agilecrm.subscription.limits;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.subscription.limits.plan.FreePlanLimits;
import com.agilecrm.subscription.limits.plan.ProPlanLimits;
import com.agilecrm.subscription.limits.plan.RegularPlanLimits;
import com.agilecrm.subscription.limits.plan.StarterPlanLimits;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.subscription.ui.serialize.Plan.PlanType;

/**
 * <code>PlanDetails</code> class is base class for plan limitations for each
 * plan. It is extended by respective plan classes, where actual limits are set.
 * 
 * @see {@link FreePlanLimits}
 * @see {@link RegularPlanLimits}
 * @see {@link ProPlanLimits}
 * @see {@link StarterPlanLimits}
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
public class PlanLimits
{
	/**
	 * Limits
	 */
	protected String planId;
	protected String planName;
	protected Float price;
	protected Integer contactLimit;
	protected Integer emailsLimit;
	protected Integer workflowLimit;
	protected Integer googleContactsLimit;
	protected Integer webRuleLimit;
	protected Integer pageViewsLimit;
	protected String reporting;
	protected boolean whiteLabelEnabled;
	protected Integer campaignNodesLimit;
	/**
	 * Plan obect which is used to fetch respective plan limits and also number
	 * user to calculate per user limit
	 */
	Plan plan;

	/**
	 * Child classes of {@link PlanLimits} class used to create instance based
	 * on plan. It make retrieving respective limits class object easy and
	 * flexible than hardcoding class pacakges and creating instance using
	 * forName method
	 */
	public static enum PlanClasses
	{
		/**
		 * Constructor takes respective class, rank (order of plan which is used
		 * to determine whether plan is being downgraded)
		 */
		FREE(FreePlanLimits.class, 0), STARTER(StarterPlanLimits.class, 1), REGULAR(RegularPlanLimits.class, 2), PRO(
				ProPlanLimits.class, 3),

		// Legacy plans
		LITE(StarterPlanLimits.class, 0), BASIC(StarterPlanLimits.class, 1), PROFESSIONAL(RegularPlanLimits.class, 2), ENTERPRISE(
				ProPlanLimits.class, 3);

		Class<? extends PlanLimits> clazz;

		public int rank = 0;

		private PlanClasses(Class<? extends PlanLimits> clazz, int rank)
		{
			this.rank = rank;
			this.clazz = clazz;
		}

		public Class<? extends PlanLimits> getClazz()
		{
			return clazz;
		}
	}

	/**
	 * Made protected to narrow access and restrict constructors being used
	 * directly
	 */
	protected PlanLimits()
	{

	}

	protected PlanLimits(Plan plan)
	{
		this.plan = plan;
	}

	/**
	 * Creates respective limits class object based on plan name.
	 * 
	 * @param plan
	 * @return
	 */
	@JsonIgnore
	public static PlanLimits getPlanDetails(Plan plan)
	{
		// Gets plan name from plan object
		String planName = plan.getPlanName();
		try
		{
			// Gets respective child class according to plan name
			PlanLimits planDetails = PlanClasses.valueOf(planName).clazz.newInstance();

			// Assigns plan to current object, as it can be used for calculate
			// limits based on user quantity
			planDetails.plan = plan;
			return planDetails;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}

	}

	/**
	 * Numer user that can be added in current domain. It is returned based on
	 * plan object used to initialize current PlanLimits object
	 * 
	 * @return
	 */
	public Integer getAllowedUsers()
	{
		return plan.quantity;
	}

	/**
	 * Returns plan ID
	 * 
	 * @return
	 */
	public String getPlanId()
	{
		planId = plan.plan_id == null ? PlanType.FREE.toString() : plan.plan_id.toString();

		return planId;
	}

	public String getPlanName()
	{
		return plan.getPlanName();
	}

	/**
	 * Returns price
	 * 
	 * @return
	 */
	public Float getPrice()
	{
		return price;
	}

	public Integer getContactLimit()
	{
		return contactLimit;
	}

	public Integer getEmailsLimit()
	{
		return emailsLimit * plan.quantity;
	}

	public Integer getWorkflowLimit()
	{
		if (workflowLimit == Integer.MAX_VALUE)
			return workflowLimit;

		return workflowLimit;
	}

	public Integer getGoogleContactsLimit()
	{
		return googleContactsLimit * plan.quantity;
	}

	public Integer getWebRuleLimit()
	{
		return webRuleLimit;
	}

	public Integer getPageViewsLimit()
	{
		return pageViewsLimit;
	}

	public String getReporting()
	{
		return reporting;
	}

	public boolean isWhiteLabelEnabled()
	{
		return whiteLabelEnabled;
	}

	public boolean isFreePlan()
	{
		if (plan.plan_type == null)
			return false;

		return (plan.plan_type == PlanType.FREE) ? true : false;
	}

	public Integer getCampaignNodesLimit()
	{
		return campaignNodesLimit;
	}
}
