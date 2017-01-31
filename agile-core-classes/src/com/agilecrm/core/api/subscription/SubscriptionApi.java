package com.agilecrm.core.api.subscription;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.Subscription.BlockedEmailType;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.limits.cron.deferred.AccountLimitsRemainderDeferredTask;
import com.agilecrm.subscription.limits.plan.FreePlanLimits;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.exception.EmailPurchaseLimitCrossedException;
import com.agilecrm.subscription.restrictions.exception.EmailPurchaseLimitCrossedException.Type;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.stripe.StripeImpl;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.subscription.ui.serialize.Plan.PlanType;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.webrules.util.WebRuleUtil;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.gson.Gson;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Invoice;
import com.thirdparty.sendgrid.SendGrid;

/**
 * <code>SubscriptionApi</code> class includes REST calls to interact with
 * subscription class to initiate billing operations.
 * <p>
 * It is called from client side for new subscription, plan update, credit card
 * details update and even for cancellation of subscription
 * </p>
 * 
 * @author Yaswanth
 * 
 * @since November 2012
 */
@Path("/api/subscription")
public class SubscriptionApi {
	/**
	 * Gets subscription entity of current domain
	 * 
	 * @return {@link Subscription}
	 * @throws StripeException
	 */
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Subscription getsubscription(@QueryParam("reload") boolean reload)
			throws StripeException {

		Subscription subscription = null;

		// If reload is set customer object is fetched from stripe
		if (reload)
			subscription = SubscriptionUtil.getSubscription(true);
		else
			subscription = SubscriptionUtil.getSubscription();

		subscription.cachedData = BillingRestrictionUtil.getBillingRestriction(
				subscription.plan.plan_type.toString(),
				subscription.plan.quantity);
		return subscription;
	}

	/**
	 * Called from client either for new Subscription or updating user credit
	 * card or plan , Based on the type of request(create, update(credit card or
	 * plan) respective methods are called)
	 * 
	 * @param subscribe
	 *            {@link Subscription}
	 * @return
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Subscription subscribe(@Context HttpServletRequest request,
			Subscription subscribe) throws PlanRestrictedException,
			WebApplicationException {

		try {

			/*
			 * If plan variable in subscription is not null and card details are
			 * null then updateCreditcard is called
			 */

			if (subscribe.card_details != null) {
				if (subscribe.plan != null || subscribe.emailPlan != null){
					String countryName = request.getHeader("X-AppEngine-Country");
					System.out.println("countryName:::: "+countryName);
					if(StringUtils.equalsIgnoreCase(countryName, "TN"))
						throw new Exception(ExceptionUtil.COUNTRY_BLOCKED);
					subscribe.createNewCustomer();
				}
				else
					subscribe = updateCreditcard(subscribe.card_details);

				return subscribe;
			}
			
			//If uesr is not admin throw exception
			DomainUser user = DomainUserUtil.getCurrentDomainUser();
			if (!user.is_admin)
			{
				throw new Exception("Sorry. Only users with admin privileges can change the plan. Please contact your administrator for further assistance.");
			}

			/*
			 * If card_details are null and plan in not null then update plan
			 * for current domain subscription object
			 */
			if (subscribe.plan != null)
				subscribe = changePlan(subscribe.plan, request);

			else if (subscribe.emailPlan != null) {
				String countryName = request.getHeader("X-AppEngine-Country");
				System.out.println("countryName:::: "+countryName);
				if(StringUtils.equalsIgnoreCase(countryName, "TN"))
					throw new Exception(ExceptionUtil.COUNTRY_BLOCKED);
				subscribe = addEmailPlan(subscribe.emailPlan);
				return subscribe;

			}

			// Initializes task to clear tags
			AccountLimitsRemainderDeferredTask task = new AccountLimitsRemainderDeferredTask(
					NamespaceManager.get());

			// Add to queue
			Queue queue = QueueFactory.getDefaultQueue();
			queue.add(TaskOptions.Builder.withPayload(task));

			return subscribe;
		}catch (EmailPurchaseLimitCrossedException e){
			org.json.JSONObject json = new org.json.JSONObject();
			try {
				json.put("type", Type.BULK_EMAIL_PURCHASE_EXCEPTION);
			} catch (JSONException e1) {
				e1.printStackTrace();
			}
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(json.toString())
					.build());
		} catch (PlanRestrictedException e) {
			throw e;
		} catch (WebApplicationException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(ExceptionUtils.getFullStackTrace(e));

			/*
			 * If Exception is raised during subscription send the exception
			 * message to client
			 */
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Updates the plan of current domain subscription object
	 * 
	 * @param plan
	 *            {@link Plan}
	 * @return
	 */
	@Path("/change-plan")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Subscription changePlan(Plan plan, HttpServletRequest request) {
		try {
			DomainUser user = DomainUserUtil.getCurrentDomainUser();
			if (!user.is_admin)
			{
				throw new Exception("Sorry. Only users with admin privileges can change the plan. Please contact your administrator for further assistance.");
			}
			Subscription subscribe = Subscription.updatePlan(plan);

			BillingRestriction restriction = BillingRestrictionUtil
					.getBillingRestritionAndSetInCookie(request);

			subscribe.cachedData = restriction;

			// Return updated subscription object
			return subscribe;
		} catch (PlanRestrictedException e) {
			System.out.println("excpetion plan exception");
			throw e;
		} catch (WebApplicationException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

	}

	/**
	 * Updates the plan of current domain subscription object
	 * 
	 * @param plan
	 *            {@link Plan}
	 * @return
	 * @throws Exception 
	 */
	@Path("/change-email-plan")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Subscription addEmailPlan(Plan plan) throws Exception{
		DomainUser user = DomainUserUtil.getCurrentDomainUser();
		if (!user.is_admin)
		{
			throw new Exception("Sorry. Only users with admin privileges can change the plan. Please contact your administrator for further assistance.");
		}
		// Return updated subscription object
		return SubscriptionUtil.createEmailSubscription(plan);

	}

	/**
	 * Updates credit card details of customer and updates subscription object
	 * 
	 * @param card_details
	 * @return {@link Subscription}
	 * @throws Exception
	 */
	@Path("/update-card")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Subscription updateCreditcard(CreditCard card_details)
			throws Exception {

		return Subscription.updateCreditCard(card_details);
	}

	@Path("coupon/{coupon}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public String checkCoupon(@PathParam("coupon") String coupon)
			throws Exception {
		return StripeImpl.getCoupon(coupon).toString();
	}

	/**
	 * Fetches invoices of subscription details
	 * 
	 * @return {@link List}
	 */
	@Path("/invoices")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Invoice> getInvoices() {
		try {
			return Subscription.getInvoices();
		} catch (Exception e) {
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	// get perticular invoice
	@Path("/getinvoice")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Invoice getInvoice(@QueryParam("d") String invoice_id) {
		try {
			return StripeUtil.getInvoice(invoice_id);
		} catch (WebApplicationException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());

		}
	}

	/**
	 * Fetches invoices of subscription details
	 * 
	 * @return {@link List}
	 */
	@Path("/charges/{customer_id}")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public String getCharges(@PathParam("customer_id") String customerId,
			@QueryParam("page_size") String page_size) {
		try {
			String customerJSONString = null;
			try {
				List<Charge> list = StripeUtil.getCharges(customerId,
						Integer.parseInt(page_size));

				// Gets customer JSON string from customer object
				customerJSONString = new Gson().toJson(list);
				return customerJSONString;
			} catch (NumberFormatException e) {
				e.printStackTrace();
				// return StripeUtil.getCharges(customerId);
			}
			return customerJSONString;
		} catch (Exception e) {
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Deletes subscription object of the domain and deletes related customer
	 */
	@Path("delete/account")
	@DELETE
	public void deleteSubscription() {
		try {
			// Get current domain subscription entity
			Subscription subscription = SubscriptionUtil.getSubscription();

			if (subscription == null)
				return;

			subscription.cancelSubscription();

			subscription.refreshCustomer();

			subscription.plan = null;
			subscription.emailPlan = null;

			subscription.save();

		} catch (Exception e) {
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Cancels subscription from gateway but never delete {@link Subscription}
	 * entity
	 */
	@Path("/cancel/subscription")
	@GET
	public void cancelSubscription() {
		try {
			SubscriptionUtil.getSubscription().cancelSubscription();
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Cancels subscription from gateway but never delete {@link Subscription}
	 * entity
	 */
	@Path("/cancel/email")
	@GET
	public void cancelEmailSubscription() {
		try {
			Subscription subscription = SubscriptionUtil.getSubscription();
			subscription.cancelEmailSubscription();
			System.out.println("Cancelled Email Subscription");
			SubscriptionUtil.deleteEmailSubscription();
		} catch (Exception e) {
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Cancels trial from gateway
	 */
	@Path("/cancel/trial")
	@GET
	public String cancelTrial() {
		try {
			JSONObject json = new JSONObject();
			int webrulecount = WebRuleUtil.getCount();
			int contactcount = ContactUtil.getCount();
			int compaigncount = WorkflowUtil.getCount();
			int triggerscount = TriggerUtil.getCount();
			int userscount = DomainUserUtil.count();
			FreePlanLimits limits = new FreePlanLimits();
			if(webrulecount > limits.getWebRuleLimit() || contactcount > limits.getContactLimit() || compaigncount > limits.getWorkflowLimit() || triggerscount > limits.getTriggersLimit() || userscount > 2)
			{
				json.put("is_success", false);
				json.put("webrulecount", webrulecount);
				json.put("contactcount", contactcount);
				json.put("compaigncount", compaigncount);
				json.put("triggerscount", triggerscount);
				json.put("userscount", userscount);
				json.put("webrulelimit", limits.getWebRuleLimit());
				json.put("contactlimit", limits.getContactLimit());
				json.put("compaignlimit", limits.getWorkflowLimit());
				json.put("triggerslimit", limits.getTriggersLimit());
				json.put("userslimit", 2);
				System.out.println("Cancelling free trial failed::"+json.toString());
			}else{
				json.put("is_success", true);
				cancelSubscription();
				System.out.println("Cancelling free trial success::");
			}
			return json.toString();	
		} catch (Exception e) {
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * get the plan restrictions
	 */
	@Path("/planRestrictions")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public String planRestrictions(Plan plan) {
		try {
			Subscription subscription = SubscriptionUtil.getSubscription();
			String restrictionsJSONString = null;
			JSONObject json =  new JSONObject();
			if (subscription.plan != null && subscription.plan.plan_type == PlanType.FREE) {
				int count = DomainUserUtil.count();
				System.out.println("existing users cout in free plan " + count);
				if (plan.quantity < count) {
					json.put("is_more_users", true);
					json.put("count", count);
					return json.toString();
				}else{
					json.put("is_allowed_plan", true);
					return json.toString();
				}
			}else if (BillingRestrictionUtil.isLowerPlan(subscription.plan, plan)) {
				System.out.println("plan upgrade not possible");
				Map<String, Map<String, Object>> restrictions = BillingRestrictionUtil.getInstanceTemporary(plan).getRestrictions();
				restrictionsJSONString = new Gson().toJson(restrictions);
			}
			Invoice invoice = subscription.getUpcomingInvoice(plan);
			if(restrictionsJSONString != null){
				json.put("restrictions", restrictionsJSONString);
				json.put("nextPaymentAttempt", invoice.getNextPaymentAttempt());
				return json.toString();
			}
			String invoiceJSONString = new Gson().toJson(invoice);
			return invoiceJSONString;
		} catch (Exception e) {
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * get the plan restrictions
	 */
	@Path("/agileTags")
	@GET
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public String getAgileTags(@QueryParam("email") String email) {
		String oldNameSpace = NamespaceManager.get();
		try {
			NamespaceManager.set("our");
			Contact contact = ContactUtil.searchContactByEmail(email);
			JSONObject json =  new JSONObject();
			if(contact != null)
			{
				LinkedHashSet<String> tagsList = contact.tags;
				System.out.println("Tags in our domain::: "+tagsList.toArray());
				json.put("tags", tagsList.toArray());
			}
			return json.toString();
		}finally{
			NamespaceManager.set(oldNameSpace);
		}
	}
	
	// Life time emails purchase 
	@Path("/purchaseEmailCredits")
	@POST
	public void purchaseEmailCredits(@Context HttpServletRequest request, @QueryParam("quantity") Integer quantity)
	{
		Subscription subscription = SubscriptionUtil.getSubscription();
		try {
			String countryName = request.getHeader("X-AppEngine-Country");
			System.out.println("countryName:::: "+countryName);
			if(StringUtils.equalsIgnoreCase(countryName, "TN"))
				throw new Exception(ExceptionUtil.COUNTRY_BLOCKED);
			if(SubscriptionUtil.isEmailsPurchaseStatusBlocked(subscription))
				throw new Exception(ExceptionUtil.EMAILS_PURCHASE_BLOCKED);
			subscription.purchaseEmailCredits(quantity);
		}catch (EmailPurchaseLimitCrossedException e){
			org.json.JSONObject json = new org.json.JSONObject();
			try {
				json.put("type", Type.BULK_EMAIL_PURCHASE_EXCEPTION);
			} catch (JSONException e1) {
				e1.printStackTrace();
			}
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(json.toString())
					.build());
		} catch (Exception e) {
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	// Auto Renewal Credits 
	@Path("/auto_recharge")
	@POST
	public void autoRecharge(@Context HttpServletRequest request, @FormParam("isAutoRenewalEnabled") Boolean isAutoRenewalEnabled, @FormParam("nextRechargeCount") Integer nextRechargeCount, @FormParam("autoRenewalPoint") Integer autoRenewalPoint)
	{
		try {
			String countryName = request.getHeader("X-AppEngine-Country");
			System.out.println("countryName:::: "+countryName);
			if(StringUtils.equalsIgnoreCase(countryName, "TN"))
				throw new Exception(ExceptionUtil.COUNTRY_BLOCKED);
			BillingRestriction restriction = BillingRestrictionUtil.getBillingRestrictionFromDB();
			if(!restriction.isAutoRenewalEnabled){
				Subscription subscription = SubscriptionUtil.getSubscription();
				if(subscription.getEmailpurchaseStatus() == null){
					SubscriptionUtil.blockEmailPurchasing(BlockedEmailType.AUTO_RECHARGE, 0);
				}
			}
			restriction.isAutoRenewalEnabled = isAutoRenewalEnabled;
			restriction.nextRechargeCount = nextRechargeCount;
			restriction.autoRenewalPoint = autoRenewalPoint;
			restriction.save();
		} catch (Exception e) {
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
	
	/**
	 * Pause or resume subscriptions by adding trial
	 * @param period in months
	 * as {@link Integer} 
	 */
	@Path("/pauseOrResumeSubscriptions")
	@POST
	public void pauseOrResumeSubscription(@QueryParam("period") Integer period)
	{
		try{
			Subscription subscription = SubscriptionUtil.getSubscription();
			Long trialEnd = 0L;
			if(period == 0){
				subscription.addTrial(trialEnd);
				System.out.println("Added trial to::"+trialEnd);
			}
			else{
				trialEnd = System.currentTimeMillis() / 1000 + period * 2592000;
				subscription.addTrial(trialEnd);
				subscription.status = Subscription.BillingStatus.BILLING_PAUSED;
				System.out.println("Added trial to::"+trialEnd+" and set subscription status to ACCOUNT_PAUSED");
				subscription.save();
			}
		}catch(Exception e){
			e.printStackTrace();
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
				    .build());
		}
	}
	
	@GET
	@Path("/downgradeRestrictions")
	public String downgradeFreePlanRestrictions(){
		try{
			Map<String, Map<String, Object>> restrictions = SubscriptionUtil.downgradeFreePlanRestrictions();
			if(restrictions.size() == 0){
				Subscription subscription = SubscriptionUtil.getSubscription();
				DomainUser user = DomainUserUtil.getCurrentDomainUser();
				try{
					String mailSubject = "Downgraded to free plan";
					String html = "Domain: "+user.domain+"<br>Username: "+user.email+"<br>Plan: "+subscription.plan.plan_type.toString();
			    	SendGrid.sendMail(user.email, user.domain, "venkat@agilecrm.com,mogulla@invox.com", null, null, mailSubject, null, html, null);
				}catch(Exception e){
					e.printStackTrace();
				}
				cancelSubscription();
			}
			return new Gson().toJson(restrictions);
		}catch(Exception e){
			e.printStackTrace();
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
				    .build());
		}
	}
}
