package com.agilecrm.subscription.restrictions.db.util;

import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.limits.PlanLimits;
import com.agilecrm.subscription.limits.PlanLimits.PlanClasses;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.google.appengine.api.NamespaceManager;

@XmlRootElement
public class BillingRestrictionUtil
{

    /**
     * Error messages according to type of entity
     * 
     * @author yaswanth
     * 
     */
    public static enum ErrorMessages
    {
	Contact("Contacts limit reached"), WebRule("Web Rules limit reached"), Workflow("Campaigns limit reached"), REPORT(
		"For reports in excess of 7 days, please <a href=\"#subscribe\">upgrade</a> to Regular or Pro plan."), NOT_DOWNGRADABLE(
		"Plan cannot be dowgraded"), Trigger("Triggers limit reached"), Reports("Email Reports limit reached");
	private String message;

	ErrorMessages(String message)
	{
	    this.message = message;
	}

	public String getMessage()
	{
	    return message;
	}
    }

    /**
     * Percentages where tag has to be added
     */
    public static final Set<String> percentages = new HashSet<String>();
    static
    {
	percentages.add("75");
	percentages.add("85");
	percentages.add("90");
	percentages.add("100");
    }

    /**
     * Fetches billing restriction object from DB. If object is not created then
     * it will create new and return
     * 
     * @param planName
     * @param users
     * @return
     */
    public static BillingRestriction getBillingRestriction(String planName, Integer users)
    {
	System.out.println(NamespaceManager.get());
	BillingRestriction restriction = BillingRestriction.dao.ofy().query(BillingRestriction.class).get();

	if (restriction == null)
	    restriction = BillingRestriction.getInstance(planName, users);

	// Gets respective PlanLimits class based on plan.
	restriction.planDetails = PlanLimits.getPlanDetails(BillingRestrictionUtil.getPlan(planName, users));

	return restriction;
    }

    /**
     * Creates/fetches billing restriction by setting plan and users. Reads plan
     * and users count from user info, it if is not defined then subscription
     * object is fetched
     * 
     * @param sendReminder
     * @return
     */
    public static BillingRestriction getBillingRestriction(boolean sendReminder)
    {
	// Fetches user info to check if plan and users count is set in it, to
	// avoid fetching subscription object every time
	UserInfo info = SessionManager.get();

	// If user info is null then Billing restriction object is created using
	// plan details in subscription object
	if (info == null)
	{
	    BillingRestriction restriction = getBillingRestriction(null, null);

	    // Sets reminder
	    restriction.sendReminder = sendReminder;
	    return restriction;
	}

	// Fetches billing instance
	BillingRestriction restriction = getBillingRestriction(info.getPlan(), info.getUsersCount());
	restriction.sendReminder = sendReminder;
	return restriction;
    }

    /**
     * Creates new Billing restriction object without fetching form DB
     * 
     * @param sendReminder
     * @return
     */
    public static BillingRestriction getInstance(boolean sendReminder)
    {
	BillingRestriction restriction = getInstance();
	restriction.sendReminder = sendReminder;
	return restriction;

    }

    /**
     * Creates and returns new Billing Restriction instance
     * 
     * @return
     */
    public static BillingRestriction getInstance()
    {
	UserInfo info = SessionManager.get();

	if (info == null)
	{
	    System.out.println("UserInfo is null...");
	    return BillingRestriction.getInstance(null, null);
	}

	System.out.println("Plan in UserInfo is " + info.getPlan() + " and users count is " + info.getUsersCount());

	return BillingRestriction.getInstance(info.getPlan(), info.getUsersCount());
    }

    /**
     * Creates and returns new Billing Restriction instance
     * 
     * @return
     */
    public static BillingRestriction getInstanceTemporary(Plan plan)
    {
	return BillingRestriction.getInstance(plan.plan_type.toString(), plan.quantity);
    }

    /**
     * Returns plan object based on plan name and users count. If plan is not
     * defined then it fetches from Subscription object and sets in user info
     * 
     * @param planName
     * @param users
     * @return
     */
    public static Plan getPlan(String planName, Integer users)
    {
	Plan plan = null;

	if (!StringUtils.isEmpty(planName))
	    return new Plan(planName, users);

	// Fetches account subscription
	Subscription subscription = SubscriptionUtil.getSubscription();

	// If plan is null then it is considered free plan.
	plan = subscription.plan;

	// Namespace and subscription
	// System.out.println("" + NamespaceManager.get() +
	// " domain is having plan - " + plan);

	// Gets user info and sets plan and sets back in session
	UserInfo info = SessionManager.get();
	if (info == null)
	    return plan;

	info.setPlan(plan.plan_type.toString());
	info.setUsersCount(plan.quantity);
	SessionManager.set((UserInfo) null);
	SessionManager.set(info);

	return plan;
    }

    /**
     * Sets plan in user info
     * 
     * @param info
     */
    public static void setPlan(UserInfo info)
    {
	Subscription subscription = SubscriptionUtil.getSubscription();
	Plan plan = subscription.plan;

	info.setPlan(plan.plan_type.toString());
	info.setUsersCount(plan.quantity);
    }

    /**
     * Sets plan in user info
     * 
     * @param info
     */
    public static void setPlan(UserInfo info, String domain)
    {
	if (StringUtils.isEmpty(domain))
	    return;

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(domain);
	try
	{
	    Subscription subscription = SubscriptionUtil.getSubscription();

	    Plan plan = subscription.plan;

	    info.setPlan(plan.plan_type.toString());
	    info.setUsersCount(plan.quantity);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Throws exception based on class name. Reads error messages from
     * {@link ErrorMessages} enum.
     */

    public static void throwLimitExceededException(String className) throws PlanRestrictedException
    {
	ErrorMessages errorMessage = ErrorMessages.valueOf(className);
	String reason = errorMessage == null ? "Limit Reached" : errorMessage.getMessage();

	throw new PlanRestrictedException(reason);
    }

    public static void throwLimitExceededException(ErrorMessages errorMessage)
    {
	String reason = errorMessage == null ? "Limit Reached" : errorMessage.getMessage();
	throw new PlanRestrictedException(reason);
    }

    public static void throwLimitExceededException(ErrorMessages errorMessage, boolean attachUpgradeButton)
    {
	String reason = errorMessage == null ? "Limit Reached" : errorMessage.getMessage();
	throw new PlanRestrictedException(reason, attachUpgradeButton);
    }

    /**
     * Checks if new plan is lower than old plan. It checks on plan type, and
     * quantity of users if it is same plan in both old and new
     * 
     * @param oldPlan
     * @param newPlan
     * @return
     */
    public static boolean isLowerPlan(Plan oldPlan, Plan newPlan)
    {
	// Gets respective plan classes
	PlanClasses oldPlanClass = PlanClasses.valueOf(oldPlan.getPlanName());
	PlanClasses newPlanClass = PlanClasses.valueOf(newPlan.getPlanName());

	if (oldPlanClass != null && newPlanClass != null)
	{
	    // checks rank if plan is downgraded
	    if ((oldPlanClass.rank > newPlanClass.rank) || oldPlan.quantity > newPlan.quantity)
		return true;
	    // If plans are same it checks for number of users in plan
	    else if (oldPlanClass.rank == newPlanClass.rank && oldPlan.quantity > newPlan.quantity)
		return true;
	}
	return false;
    }

    /**
     * Checks if plan is upgraded and updates in user info
     */
    public static void setPlanInSession(Plan plan)
    {
	UserInfo info = SessionManager.get();
	if (info == null)
	    return;

	info.setPlan(plan.getPlanName());
	info.setUsersCount(plan.quantity);

    }

    public static void addEmails(Integer emails, Plan plan)
    {
	BillingRestriction cachedData = getBillingRestriction(plan.plan_type.toString(), plan.quantity);
	if (cachedData.one_time_emails_count == null)
	    cachedData.one_time_emails_count = 5000;
	cachedData.one_time_emails_count += emails;

	cachedData.email_pack_start_time = System.currentTimeMillis() / 1000;

	cachedData.save();
    }
}
