package com.agilecrm.subscription.restrictions.db.util;

import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.limits.PlanLimits;
import com.agilecrm.subscription.limits.PlanLimits.PlanClasses;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.NamespaceManager;

@XmlRootElement
public class BillingRestrictionUtil {

	/**
	 * Error messages according to type of entity
	 * 
	 * @author yaswanth
	 * 
	 */
	public static enum ErrorMessages {
		Contact("Contacts limit reached"), WebRule("Web Rules limit reached"), Workflow(
				"Campaigns limit reached"), REPORT(
				"For reports in excess of 7 days, please <a href=\"#subscribe\">upgrade</a> to Regular or Enterprise plan."), NOT_DOWNGRADABLE(
				"Sorry, you cannot downgrade your plan. Please contact our <a class='text-info' href='https://our.agilecrm.com/calendar/Raja_Shekar,Natesh,Abhishek_Pandey' target='_blank'>Support</a> team."), Trigger(
				"Triggers limit reached"), Reports(
				"Email Reports limit reached");
		private String message;

		ErrorMessages(String message) {
			this.message = message;
		}

		public String getMessage() {
			return message;
		}
	}

	/**
	 * Percentages where tag has to be added
	 */
	public static final Set<String> percentages = new HashSet<String>();
	static {
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
	public static BillingRestriction getBillingRestriction(String planName,
			Integer users) {
		System.out.println(NamespaceManager.get());
		BillingRestriction restriction = BillingRestriction.dao.ofy()
				.query(BillingRestriction.class).get();

		if (restriction == null)
			restriction = BillingRestriction.getInstance(planName, users);

		// Gets respective PlanLimits class based on plan.
		restriction.planDetails = PlanLimits
				.getPlanDetails(BillingRestrictionUtil.getPlan(planName, users));

		return restriction;
	}

	public static BillingRestriction getBillingRestrictionFromDB() {
		System.out.println(NamespaceManager.get());
		BillingRestriction restriction = getRestrictionFromDB();

		// Gets respective PlanLimits class based on plan.
		restriction.planDetails = PlanLimits
				.getPlanDetails(BillingRestrictionUtil.getPlan(null, null));

		System.out.println("plan details : "
				+ restriction.planDetails.getPlanName() + ", "
				+ restriction.planDetails.getAllowedUsers());
		return restriction;
	}

	public static BillingRestriction getBillingRestrictionFromDbWithoutSubscription() {
		BillingRestriction restriction = getRestrictionFromDB();

		return restriction;
	}
	
	
	public static BillingRestriction getRestrictionFromDB(){
		BillingRestriction restriction = BillingRestriction.dao.ofy().query(BillingRestriction.class).get();
		if (restriction == null) {
			restriction = BillingRestriction.getInstance(null, null);
			restriction.refresh(true);
			restriction.save();
			return restriction;
		}
		// Set one_time_emails_count to '0' per every 30 days for free users(Free 5000 emails)
		if(restriction.max_emails_count == null || restriction.max_emails_count == 0){
			if(restriction.last_renewal_time == null){
				if(restriction.created_time == null){
					restriction.save();
				}
				restriction.last_renewal_time = restriction.created_time/1000;
			}
			Long currentDate = new DateUtil().getTime().getTime()/1000;
			if(currentDate - restriction.last_renewal_time >= 2592000){
				System.out.println("Updating free 5000 emails");
				System.out.println("last renewal time is:: "+restriction.last_renewal_time);
				restriction.one_time_emails_count = 0;
				restriction.last_renewal_time = System.currentTimeMillis()/1000;
				restriction.save();
			}
		}
			
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
	public static BillingRestriction getBillingRestriction(boolean sendReminder) {
		// Fetches user info to check if plan and users count is set in it, to
		// avoid fetching subscription object every time
		UserInfo info = SessionManager.get();

		// If user info is null then Billing restriction object is created using
		// plan details in subscription object
		if (info == null) {
			BillingRestriction restriction = getBillingRestriction(null, null);

			// Sets reminder
			restriction.sendReminder = sendReminder;
			return restriction;
		}

		System.out
				.println("Info is not null in getBillingRestriction. Plan is "
						+ info.getPlan() + " and users count "
						+ info.getUsersCount());

		// Fetches billing instance
		BillingRestriction restriction = getBillingRestriction(info.getPlan(),
				info.getUsersCount());
		restriction.sendReminder = sendReminder;
		return restriction;
	}

	/**
	 * Creates new Billing restriction object without fetching form DB
	 * 
	 * @param sendReminder
	 * @return
	 */
	public static BillingRestriction getInstance(boolean sendReminder) {
		BillingRestriction restriction = getInstance();
		restriction.sendReminder = sendReminder;
		return restriction;

	}

	/**
	 * Creates and returns new Billing Restriction instance
	 * 
	 * @return
	 */
	public static BillingRestriction getInstance() {
		UserInfo info = SessionManager.get();

		if (info == null) {
			System.out.println("UserInfo is null...");
			return BillingRestriction.getInstance(null, null);
		}

		System.out.println("Plan in UserInfo is " + info.getPlan()
				+ " and users count is " + info.getUsersCount());

		return BillingRestriction.getInstance(info.getPlan(),
				info.getUsersCount());
	}

	/**
	 * Creates and returns new Billing Restriction instance
	 * 
	 * @return
	 */
	public static BillingRestriction getInstanceTemporary(Plan plan) {
		return BillingRestriction.getInstance(plan.plan_type.toString(),
				plan.quantity);
	}

	/**
	 * Returns plan object based on plan name and users count. If plan is not
	 * defined then it fetches from Subscription object and sets in user info
	 * 
	 * @param planName
	 * @param users
	 * @return
	 */
	public static Plan getPlan(String planName, Integer users) {
		Plan plan = null;

		if (!StringUtils.isEmpty(planName))
			return new Plan(planName, users);

		// Fetches account subscription
		Subscription subscription = SubscriptionUtil.getSubscription();

		// If plan is null then it is considered free plan.
		plan = subscription.plan;

		// Namespace and subscription
		System.out.println("" + NamespaceManager.get()
				+ " domain is having plan - " + plan);

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
	public static void setPlan(UserInfo info) {
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
	public static void setPlan(UserInfo info, String domain) {
		if (StringUtils.isEmpty(domain))
			return;

		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set(domain);
		try {
			Subscription subscription = SubscriptionUtil.getSubscription();

			Plan plan = subscription.plan;

			info.setPlan(plan.plan_type.toString());
			info.setUsersCount(plan.quantity);
		} finally {
			NamespaceManager.set(oldNamespace);
		}
	}

	/**
	 * Throws exception based on class name. Reads error messages from
	 * {@link ErrorMessages} enum.
	 */

	public static void throwLimitExceededException(String className)
			throws PlanRestrictedException {
		ErrorMessages errorMessage = ErrorMessages.valueOf(className);
		String reason = errorMessage == null ? "Limit Reached" : errorMessage
				.getMessage();

		throw new PlanRestrictedException(reason);
	}

	public static void throwLimitExceededException(ErrorMessages errorMessage) {
		String reason = errorMessage == null ? "Limit Reached" : errorMessage
				.getMessage();
		throw new PlanRestrictedException(reason);
	}

	public static void throwLimitExceededException(ErrorMessages errorMessage,
			boolean attachUpgradeButton) {
		String reason = errorMessage == null ? "Limit Reached" : errorMessage
				.getMessage();
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
	public static boolean isLowerPlan(Plan oldPlan, Plan newPlan) {
		// Gets respective plan classes
		PlanClasses oldPlanClass = PlanClasses.valueOf(oldPlan.getPlanName());
		PlanClasses newPlanClass = PlanClasses.valueOf(newPlan.getPlanName());

		if (oldPlanClass != null && newPlanClass != null) {
			// checks rank if plan is downgraded
			if ((oldPlanClass.rank > newPlanClass.rank)
					|| oldPlan.quantity > newPlan.quantity)
				return true;
			// If plans are same it checks for number of users in plan
			else if (oldPlanClass.rank == newPlanClass.rank
					&& oldPlan.quantity > newPlan.quantity)
				return true;
		}
		return false;
	}

	/**
	 * Checks if plan is upgraded and updates in user info
	 */
	public static void setPlanInSession(Plan plan) {
		UserInfo info = SessionManager.get();
		if (info == null)
			return;

		info.setPlan(plan.plan_type.toString());
		info.setUsersCount(plan.quantity);

	}

	public static void addEmails(Integer emails, Plan plan) {
		BillingRestriction cachedData = getBillingRestriction(
				plan.plan_type.toString(), plan.quantity);
		if (cachedData.one_time_emails_count == null)
			cachedData.one_time_emails_count = 5000;
		cachedData.one_time_emails_count += emails;

		cachedData.email_pack_start_time = System.currentTimeMillis() / 1000;

		cachedData.save();
	}

	public static BillingRestriction getBillingRestritionAndSetInCookie(
			HttpServletRequest request) {

		Subscription subscription = SubscriptionUtil.getSubscription();

		Plan plan = subscription.plan;

		BillingRestriction billingRestriction = getBillingRestrictionAndSubscriptionFromDB();

		return getBillingRestritionAndSetInCookie(billingRestriction, request);

	}

	private static BillingRestriction getBillingRestritionAndSetInCookie(
			BillingRestriction restriction, HttpServletRequest request) {
		UserInfo info = (UserInfo) request.getSession().getAttribute(
				SessionManager.AUTH_SESSION_COOKIE_NAME);

		Plan plan = restriction.getCurrentLimits().getPlan();

		info.setPlan(plan.plan_type.toString());
		info.setUsersCount(plan.quantity);
		System.out.println(info.getPlan());
		System.out.println(info.getUsersCount());

		// Check if UserInfo is already there
		request.getSession().setAttribute(
				SessionManager.AUTH_SESSION_COOKIE_NAME, info);

		// Sets new Session
		SessionManager.set(info);

		System.out.println(SessionManager.get());

		return restriction;
	}

	public static BillingRestriction getBillingRestrictionAndSubscriptionFromDB() {
		BillingRestriction billingRestriction = null;

		try {
			billingRestriction = getBillingRestrictionFromDbWithoutSubscription();
			Subscription subscription = SubscriptionUtil.getSubscription();

			Plan plan = subscription.plan;
			billingRestriction.planDetails = plan.getPlanDetails();

			return billingRestriction;
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			return null;
		}
	}
}
