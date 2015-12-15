package com.agilecrm.core.api.subscription;

import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
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

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.limits.cron.deferred.AccountLimitsRemainderDeferredTask;
import com.agilecrm.subscription.limits.plan.FreePlanLimits;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.stripe.StripeImpl;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.subscription.ui.serialize.Plan.PlanType;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.webrules.util.WebRuleUtil;
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
				if (subscribe.plan != null || subscribe.emailPlan != null)
					subscribe.createNewCustomer();
				else
					subscribe = updateCreditcard(subscribe.card_details);

				return subscribe;
			}

			/*
			 * If card_details are null and plan in not null then update plan
			 * for current domain subscription object
			 */
			if (subscribe.plan != null)
				subscribe = changePlan(subscribe.plan, request);

			else if (subscribe.emailPlan != null) {
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
		} catch (PlanRestrictedException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();

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

			Subscription subscribe = Subscription.updatePlan(plan);

			BillingRestriction restriction = BillingRestrictionUtil
					.getBillingRestritionAndSetInCookie(request);

			subscribe.cachedData = restriction;

			// Return updated subscription object
			return subscribe;
		} catch (PlanRestrictedException e) {
			System.out.println("excpetion plan exception");
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
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
	@Path("/change-email-plan")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Subscription addEmailPlan(Plan plan) {
		try {
			// Return updated subscription object
			return SubscriptionUtil.createEmailSubscription(plan);
		} catch (PlanRestrictedException e) {
			System.out.println("excpetion plan exception");
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

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
			if (subscription.plan != null && subscription.plan.plan_type == PlanType.FREE) {
				int count = DomainUserUtil.count();
				System.out.println("existing users cout in free plan " + count);
				if (plan.quantity < count) {
					JSONObject json =  new JSONObject();
					json.put("is_more_users", true);
					json.put("count", count);
					return json.toString();
				}
			}else if (BillingRestrictionUtil.isLowerPlan(subscription.plan, plan)) {
				System.out.println("plan upgrade not possible");
				Map<String, Map<String, Integer>> restrictions = BillingRestrictionUtil.getInstanceTemporary(plan).getRestrictions();
				String restrictionsJSONString = new Gson().toJson(restrictions);
				return restrictionsJSONString;
			}
			Map<String, Boolean> restrictions = new HashMap<String, Boolean>();
			restrictions.put("is_allowed_plan", true);
			String restrictionsJSONString = new Gson().toJson(restrictions);
			return restrictionsJSONString;
		} catch (Exception e) {
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

}
