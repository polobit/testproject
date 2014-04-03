package com.agilecrm.subscription.restrictions.db.util;

import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.limits.PlanLimits;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.subscription.ui.serialize.Plan.PlanType;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

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
	CONTACT("Contacts limit reached"), WebRule("Web Rules limit reached"), Workflow("Campaigns limit reached");

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
	Objectify ofy = ObjectifyService.begin();
	BillingRestriction restriction = ofy.query(BillingRestriction.class).get();

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
	System.out.println(info.getPlan() + ", " + info.getUsersCount());

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
	System.out.println(info.getPlan() + ", " + info.getUsersCount());
	return BillingRestriction.getInstance(info.getPlan(), info.getUsersCount());
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
	    plan = new Plan(planName, users);
	else
	{
	    // Fetches account subscription
	    Subscription subscription = Subscription.getSubscription();

	    // If plan is null then it is considered free plan.
	    plan = subscription == null ? new Plan("FREE", 2) : subscription.plan;

	    // Gets user info and sets plan and sets back in session
	    UserInfo info = SessionManager.get();
	    if (info == null)
		return plan;

	    info.setPlan(plan.plan_type.toString());
	    info.setUsersCount(plan.quantity);
	    SessionManager.set((UserInfo) null);
	    SessionManager.set(info);

	}
	return plan;
    }

    /**
     * Sets plan in user info
     * 
     * @param info
     */
    public static void setPlan(UserInfo info)
    {
	Subscription subscription = Subscription.getSubscription();
	Plan plan = subscription == null ? new Plan(PlanType.FREE.toString(), 2) : subscription.plan;

	info.setPlan(plan.plan_type.toString());
	info.setUsersCount(plan.quantity);
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

}
