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
    protected boolean emailWhiteLabelEnabled;
    protected Integer emailAccountsLimit;

    /**
     * New plan restrictions
     */
    protected Integer reportsLimit;
    protected Integer widgetsLimit;
    protected boolean defaultWidget = true;
    protected boolean callingWidget = true;

    protected boolean customWidget = false;

    protected Integer TriggersLimit;
    protected Boolean socialSuite = true;
    protected Boolean emailGateway = true;
    protected Boolean smsGateway = true;

    protected Boolean ACL = true;
    
    /**
     * Milestone Limits
     */
    protected Boolean addTracks = false;
    
    protected Boolean mobileIntegration = true;
    protected Boolean googleSync = true;
    protected Boolean ecommerceSync = true;
    protected Boolean paymentSync = true;
    protected Boolean accountingSync = true;

    protected Boolean cohortReports = true;
    protected Boolean growthReports = true;
    protected Boolean funnelReports = true;
    protected Boolean activityReports = true;

    protected Boolean onlineAppointment = true;

    public Boolean getEmailGateway()
    {
	return emailGateway;
    }

    public Boolean getMobileIntegration()
    {
	return mobileIntegration;
    }

    public Boolean getGoogleSync()
    {
	return googleSync;
    }

    public Boolean getEcommerceSync()
    {
	return ecommerceSync;
    }

    public Boolean getPaymentSync()
    {
	return paymentSync;
    }

    public Boolean getAccountingSync()
    {
	return accountingSync;
    }

    public Boolean getCohortReports()
    {
	return cohortReports;
    }

    public Boolean getGrowthReports()
    {
	return growthReports;
    }

    public Boolean getFunnelReports()
    {
	return funnelReports;
    }

    public Boolean getOnlineAppointment()
    {
	return onlineAppointment;
    }

    public Integer getWidgets()
    {
	return widgets;
    }
    
    public Boolean getAddTracks()
    {
	return addTracks;
    }

    public Plan getPlan()
    {
	return plan;
    }

    protected Integer campaignNodesLimit;
    protected Integer widgets;

    /**
     * Plan obect which is used to fetch respective plan limits and also number
     * user to calculate per user limit
     */
    Plan plan;

    // Static plan limits
    private static final FreePlanLimits freePlanLimits = new FreePlanLimits();
    private static final StarterPlanLimits starterPlanLimits = new StarterPlanLimits();
    private static final RegularPlanLimits regularPlanLimits = new RegularPlanLimits();
    private static final ProPlanLimits proPlanLimits = new ProPlanLimits();

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
	FREE(FreePlanLimits.class, 0, freePlanLimits), STARTER(StarterPlanLimits.class, 1, starterPlanLimits), REGULAR(
		RegularPlanLimits.class, 2, regularPlanLimits), PRO(ProPlanLimits.class, 3, proPlanLimits),

	// Legacy plans
	LITE(StarterPlanLimits.class, 0, freePlanLimits), BASIC(StarterPlanLimits.class, 1, starterPlanLimits), PROFESSIONAL(
		RegularPlanLimits.class, 2, regularPlanLimits), ENTERPRISE(ProPlanLimits.class, 3, proPlanLimits);

	Class<? extends PlanLimits> clazz;

	public int rank = 0;

	private PlanLimits instance = null;

	private PlanClasses(Class<? extends PlanLimits> clazz, int rank, PlanLimits instance)
	{
	    this.rank = rank;
	    this.clazz = clazz;
	    this.instance = instance;
	}

	public Class<? extends PlanLimits> getClazz()
	{
	    return clazz;
	}

	public PlanLimits getLimitsInstance()
	{
	    return instance;
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
	    PlanLimits planDetails = PlanClasses.valueOf(planName).getLimitsInstance();

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

    public boolean isEmailWhiteLabelEnabled()
    {
	return emailWhiteLabelEnabled;
    }

    public void setEmailWhiteLabelEnabled(boolean emailWhiteLabelEnabled)
    {
	this.emailWhiteLabelEnabled = emailWhiteLabelEnabled;
    }

    public Integer getReportsLimit()
    {
	return reportsLimit;
    }

    public Integer getWidgetsLimit()
    {
	return widgets;
    }

    public Integer getTriggersLimit()
    {
	return TriggersLimit;
    }

    public Boolean getACL()
    {
	return ACL;
    }

    public Boolean getActivityReports()
    {
	return activityReports;
    }

    public Boolean getSocialSuite()
    {
	return socialSuite;
    }

    public Boolean getCallingWidget()
    {
	return callingWidget;
    }

    public Boolean getSMSGateway()
    {
	return smsGateway;
    }

    public boolean getDefaultWidget()
    {
	return defaultWidget;
    }

    public boolean getCustomWidget()
    {
	return customWidget;
    }
    
    public Integer getEmailAccountLimit()
    {
    	return emailAccountsLimit;
    }

}
