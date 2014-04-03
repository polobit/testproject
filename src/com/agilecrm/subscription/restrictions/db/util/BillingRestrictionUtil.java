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

	restriction.planDetails = PlanLimits.getPlanDetails(BillingRestrictionUtil.getPlan(planName, users));

	return restriction;
    }

    /**
     * Creates/fetches billing restriction by setting plan and users. Reads plan
     * and users count from user info, it if is not defined then subscription
     * object is fetched
     * 
     * @param sendRemainder
     * @return
     */
    public static BillingRestriction getBillingRestriction(boolean sendRemainder)
    {
	UserInfo info = SessionManager.get();
	if (info == null)
	{
	    BillingRestriction restriction = getBillingRestriction(null, null);
	    restriction.sendReminder = sendRemainder;
	    return restriction;
	}
	System.out.println(info.getPlan() + ", " + info.getUsersCount());
	BillingRestriction restriction = getBillingRestriction(info.getPlan(), info.getUsersCount());
	restriction.sendReminder = sendRemainder;
	return restriction;
    }

    public static BillingRestriction getInstance(boolean sendRemainder)
    {
	BillingRestriction restriction = getInstance();
	restriction.sendReminder = sendRemainder;
	return restriction;

    }

    public static BillingRestriction getInstance()
    {
	UserInfo info = SessionManager.get();
	System.out.println(info.getPlan() + ", " + info.getUsersCount());
	return BillingRestriction.getInstance(info.getPlan(), info.getUsersCount());
    }

    public static Plan getPlan(String planName, Integer users)
    {
	Plan plan = null;
	if (!StringUtils.isEmpty(planName))
	    plan = new Plan(planName, users);
	else
	{
	    Subscription subscription = Subscription.getSubscription();
	    plan = subscription == null ? new Plan("FREE", 2) : subscription.plan;
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
