package com.agilecrm.subscription.stripe;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.AgileBilling;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookServlet;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Coupon;
import com.stripe.model.Customer;
import com.stripe.model.CustomerSubscriptionCollection;
import com.stripe.model.Invoice;
import com.stripe.model.InvoiceItem;
import com.stripe.net.RequestOptions;
import com.stripe.net.RequestOptions.RequestOptionsBuilder;

/**
 * <code>StringImpl</code> is implementation {@link AgileBilling}, This
 * implementation provides all billing features specified in
 * {@link AgileBilling} interface.
 * <p>
 * This class contains an API key(key provided by stripe for each account) to
 * establish connections to stripe gateway
 * </P>
 * It includes methods for creating, deleting, updating(plan, customer, credit
 * card) of a customer, canceling customer's subscription, these methods allow
 * to make transactions with stripe account related to the API Key(specified in
 * {@link Globals})
 * 
 * 
 * This class is can be used when billing operations are to be done through
 * stripe. Currently used from {@link Subscription} to perform billing
 * operations
 * 
 * @author Yaswanth
 * 
 * @since November 2012
 * @see com.agilecrm.subscription.AgileBilling
 * @see com.agilecrm.subscription.Subscription
 * @see com.agilecrm.subscription.stripe.StripeUtil
 */
public class StripeImpl implements AgileBilling {

	static {
		Stripe.apiKey = Globals.STRIPE_API_KEY;
		Stripe.apiVersion = "2012-09-24";
	}

	/**
	 * Creates customer in Stripe, adds subscription to the customer to
	 * according to plan chosen and processes the payment.
	 * <p>
	 * If {@link Customer} can not be created due to invalid parameters(credit
	 * card number, cvc, card expiry date), then stripe raises an exception
	 * which is propagated to methods down the stack, so user can be notified
	 * about the payment failure
	 * </p>
	 * 
	 * @param cardDetails
	 *            {@link CreditCard}
	 * @param plan
	 *            {@link Plan}
	 * 
	 * @return {@link Customer} as {@link JSONObject}
	 * 
	 * @throws Exception
	 * 
	 * 
	 */
	public JSONObject createCustomer(CreditCard cardDetails, Plan plan)
			throws Exception {

		// Creates customer with card details
		Customer customer = Customer.create(StripeUtil.getCustomerParams(
				cardDetails));

		//plan.subscription_id = customer.getSubscription().getId();
		// Free trial for 7 days for new customers
		Map<String, Object> updateParams = new HashMap<String, Object>();
		updateParams.put("plan", plan.plan_id);
		updateParams.put("quantity", plan.quantity);
		boolean isTrialAllowed = false;
		String namespace = NamespaceManager.get();
		DomainUser user = DomainUserUtil.getCurrentDomainUser();
		NamespaceManager.set("our");
		System.out.println("Changed name space to::: "+NamespaceManager.get());
		try
		{
			System.out.println("OUR domain user Email:: "+user.email);
			// Fetches contact form our domain
			Contact contact = ContactUtil.searchContactByEmail(user.email);
			System.out.println("contact in our domain :::"+contact.name);
			LinkedHashSet<String> tagsList = contact.tags;
			if(tagsList.contains("Trial"))
				isTrialAllowed = true;
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		    System.err.println("Exception occured while retrieving tags..." + e.getMessage());
		}

		finally
		{
		    NamespaceManager.set(namespace);
		}
		if(!plan.plan_id.contains("email")  && !plan.plan_type.name().contains("STARTER") && plan.trialStatus.equals("apply") && isTrialAllowed){
			plan.trialStatus = "applied";
			updateParams.put("trial_end", new DateUtil().addDays(7).getTime().getTime() / 1000);
			//For testing just 2 hours to cancel trial
			//updateParams.put("trial_end", new DateUtil().addMinutes(30).getTime().getTime()/1000);
		}
		customer.createSubscription(updateParams);
		
		System.out.println(customer);
		System.out.println(StripeUtil.getJSONFromCustomer(customer));
		// Return Customer JSON
		return StripeUtil.getJSONFromCustomer(customer);

	}

	@Override
	public JSONObject createCustomer(CreditCard cardDetails) throws Exception {
		// TODO Auto-generated method stub
		// Creates customer and add subscription to it
		Customer customer = Customer.create(StripeUtil
				.getCustomerParams(cardDetails));

		return StripeUtil.getJSONFromCustomer(customer);
	}

	/**
	 * Updates the plan of the customer based on the customer(on which customer
	 * update needs to be done) and plan object parameters.
	 * <p>
	 * Plan upgrade in Stripe is pro-rated
	 * </p>
	 * 
	 * @param stripeCustomer
	 *            {@link Customer}, as {@link JSONObject},
	 * 
	 * @return {@link Customer} as {@link JSONObject}
	 * @throws Exception
	 *             if
	 */
	public JSONObject updatePlan(JSONObject stripeCustomer, Plan plan)
			throws Exception { // Gets Customer Object to update its plan
		Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

		// Sets plan changes in a map
		Map<String, Object> updateParams = new HashMap<String, Object>();
		updateParams.put("plan", plan.plan_id);
		updateParams.put("quantity", plan.quantity);

		if (!StringUtils.isEmpty(plan.coupon))
			updateParams.put("coupon", plan.coupon);
		System.out.println(updateParams);

		updateParams.put("prorate", false);

		CustomerSubscriptionCollection subscriptionCollection = customer
				.getSubscriptions();
		List<com.stripe.model.Subscription> subscriptionList = subscriptionCollection
				.getData();

		// Fetches all subscriptions and check if there is an account plan
		Iterator<com.stripe.model.Subscription> iterator = subscriptionList
				.iterator();
		com.stripe.model.Subscription oldSubscription = null;
		boolean is_EmailSubs = false;
		while (iterator.hasNext()) {
			com.stripe.model.Subscription s = iterator.next();
			com.stripe.model.Plan p = s.getPlan();
			if (!StringUtils.containsIgnoreCase(p.getId(), "email")) {
				oldSubscription = s;
				is_EmailSubs = true;
				break;
			}
		}

		com.stripe.model.Plan oldPlan = (oldSubscription == null) ? null
				: oldSubscription.getPlan();
		com.stripe.model.Plan newPlan = com.stripe.model.Plan
				.retrieve(plan.plan_id);

		// Add prorate based on upgrade/downgrade
		if (oldPlan == null
				|| (newPlan.getAmount() * plan.quantity) > (oldPlan.getAmount() * oldSubscription
						.getQuantity())) {
			updateParams.put("prorate", "true");

		}

		Map<String, String> customer_metadata = new HashMap<String, String>();
		// // 3 day trial for all plans
		// if (!StringUtils.containsIgnoreCase(plan.plan_id, "email")) {
		//
		// // Current epoch to compare trial end
		// Long currentDateEpoch = (new java.util.Date().getTime()) / 1000;
		// // Map<String, String> customer_metadata = customer.getMetadata();
		//
		// customer_metadata = customer.getMetadata();
		//
		// Long trialEnd = null;
		// if (customer_metadata.containsKey("trial_end")) {
		//
		// trialEnd = Long.parseLong(customer.getMetadata().get(
		// "trial_end"));
		// updateParams.put("trial_end", trialEnd);
		// }
		// // Setting 3 day trial for new customers
		// if (oldSubscription == null) {
		// // if (trialEnd != null) {
		// // if (trialEnd > currentDateEpoch) {
		// // updateParams.put("trial_end", trialEnd);
		// // System.out.println(trialEnd);
		// // }
		// // } else {
		// Long newTrailEndEpoch = new DateUtil().addDays(3).getTime()
		// .getTime() / 1000;
		// updateParams.put("trial_end", newTrailEndEpoch);
		// // Setting the trial_end in customer metadata
		// // customer_metadata.put("trial_end",
		// // newTrailEndEpoch.toString());
		// customer_metadata.put("trial_end", newTrailEndEpoch.toString());
		// customer.setMetadata(customer_metadata);
		// System.out.println("trialend in cust is:"
		// + customer.getTrialEnd());
		// System.out.println(customer);
		// System.out.println(newTrailEndEpoch);
		// // }
		// }
		//
		// }

		// Updates customer with changed plan
		if (oldSubscription != null) {
			oldSubscription.update(updateParams);
		} else {
			boolean isTrialAllowed = false;
			String namespace = NamespaceManager.get();
			DomainUser user = DomainUserUtil.getCurrentDomainUser();
			NamespaceManager.set("our");
			System.out.println("Changed name space to::: "+NamespaceManager.get());
			try
			{
				System.out.println("OUR domain user Email:: "+user.email);
				// Fetches contact form our domain
				Contact contact = ContactUtil.searchContactByEmail(user.email);
				System.out.println("contact in our domain :::"+contact.name);
				LinkedHashSet<String> tagsList = contact.tags;
				if(!tagsList.contains("Cancellation Request") && !tagsList.contains("Cancelled Trial") && tagsList.contains("Trial"))
					isTrialAllowed = true;
			}
			catch (Exception e)
			{
			    e.printStackTrace();
			    System.err.println("Exception occured while retrieving tags..." + e.getMessage());
			}

			finally
			{
			    NamespaceManager.set(namespace);
			}
			if(!isTrialAllowed && !plan.plan_type.name().contains("STARTER") && plan.trialStatus.equals("apply")){
				plan.trialStatus = "applied";
				updateParams.put("trial_end", new DateUtil().addDays(7).getTime().getTime() / 1000);
				//For testing just 2 hours to cancel trial
				//updateParams.put("trial_end", new DateUtil().addMinutes(30).getTime().getTime()/1000);
			}
			customer.createSubscription(updateParams);

			if (!customer_metadata.isEmpty()) {
				Map<String, Object> newMetadata = new HashMap<String, Object>();
				newMetadata.put("metadata", customer_metadata);
				customer.update(newMetadata);
			}

			// Returns Customer object as JSONObject
			return StripeUtil.getJSONFromCustomer(customer);
		}

		// Create the invoice and pay immediately
		if (updateParams.get("prorate").equals("true")) {
			Map<String, Object> invoiceItemParams = new HashMap<String, Object>();
			Map<String, Object> metaData = new HashMap<String, Object>();
			metaData.put("plan", newPlan.getName());
			metaData.put("quantity", plan.quantity);
			invoiceItemParams.put("metadata", metaData);
			invoiceItemParams.put("customer", customer.getId());
			try {
				Invoice invoice = Invoice.create(invoiceItemParams);
				if (invoice != null)
					invoice.pay();
			} catch (Exception e) {
			}
		}

		// Returns Customer object as JSONObject
		return StripeUtil.getJSONFromCustomer(customer);
	}

	/**
	 * Updates customer credit card details in Stripe. If an exception raised
	 * while updating a customer then it is propagated back the show failure
	 * message to user
	 * 
	 * @param stripeCustomer
	 *            , {@link Customer} , cardDetails {@link CreditCard}
	 * 
	 * @return {@link Customer} as {@link JSONObject}
	 * 
	 * @throws Exception
	 * */
	public JSONObject updateCreditCard(JSONObject stripeCustomer,
			CreditCard cardDetails) throws Exception {

		/*
		 * Gets Customer retrieves from stripe based on customer id, to update
		 * credit card
		 */
		Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

		Map<String, Object> updateParams = new HashMap<String, Object>();

		/*
		 * Gets Map of card parameters to be sent to stripe, to update customer
		 * card details in stripe
		 */
		Map<String, Object> cardParams = StripeUtil.getCardParams(cardDetails);

		/*
		 * Adds changed credit card details to map, which is sent to Stripe as
		 * to update card details
		 */
		updateParams.put("card", cardParams);

		// Updates customer with changed card details
		customer = customer.update(updateParams);

		return StripeUtil.getJSONFromCustomer(customer);
	}

	/**
	 * Gets List of invoices of particular customer(passed as parameter)
	 * 
	 * @param stripeCustomer
	 *            {@link Customer} as JSONObject {@link JSONObject}
	 * 
	 * @return {@link List} of {@link Invoice}
	 * 
	 * @throws StripeException
	 * */
	public List<Invoice> getInvoices(JSONObject stripeCustomer)
			throws StripeException {

		RequestOptionsBuilder builder = new RequestOptionsBuilder();
		builder.setStripeVersion("2015-08-07");
		RequestOptions options = builder.build();

		Map<String, Object> invoiceParams = new HashMap<String, Object>();

		// Sets invoice parameters (Stripe customer id is required to get
		// invoices of a customer form stripe)
		invoiceParams.put("customer",
				StripeUtil.getCustomerFromJson(stripeCustomer).getId());
		invoiceParams.put("limit",100);
		/*
		 * Fetches all invoices for given stripe customer id and returns
		 * invoices
		 */
		return Invoice.all(invoiceParams, options).getData();
	}

	/**
	 * Pay pending invoices immediately
	 * 
	 * @param oldCustomer
	 * @param userId
	 */
	private void payPendingInvoices(JSONObject stripeCustomer) {
		try {
			/*
			 * Gets Customer retrieves from stripe based on customer id, to
			 * update credit card
			 */
			Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

			// Bill any invoices pending
			List<Invoice> invoices = getInvoices(stripeCustomer);

			Iterator iterator = invoices.iterator();

			while (iterator.hasNext()) {
				Invoice invoice = (Invoice) iterator.next();
				if (!invoice.getPaid())
					invoice.pay();
			}
		} catch (Exception e) {
		}

	}

	/**
	 * Deletes customer from Stripe, which raises an webhook to
	 * {@link StripeWebhookServlet}, on processing webhook it deletes
	 * {@link Subscription} object
	 * 
	 * @param stripeCustomer
	 *            {@link Customer} as {@link JSONObject}
	 * 
	 * @throws Exception
	 */
	public void deleteCustomer(JSONObject stripeCustomer) throws Exception {
		Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

		/*
		 * Deletes customer from stripe, this operation in stripe raises a
		 * webhook gets handled and deletes subscription object of the domain
		 */
		customer.delete();
	}

	/**
	 * Cancels customer subscription in Stripe
	 * 
	 * @param stripeCustomer
	 *            {@link Customer} as {@link JSONObject}
	 * 
	 * @throws Exception
	 */
	public void cancelSubscription(JSONObject stripeCustomer) throws Exception {
		Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

		// Returns if customer is null
		if (customer == null)
			return;

		// Fetches all subscriptions
		CustomerSubscriptionCollection subscriptions = customer
				.getSubscriptions();

		// If There are not subscriptions it returns
		if (subscriptions.getTotalCount() == 0)
			return;

		SubscriptionUtil.deleteEmailSubscription();
		SubscriptionUtil.deleteUserSubscription();

		// Fetches all subscriptions and cancels from stripe
		for (com.stripe.model.Subscription s : subscriptions.getData()) {
			s.cancel(null);
		}
	}

	public void cancelSubsFromTrial(JSONObject stripeCustomer) throws Exception {
		Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);

		if (customer == null)
			return;

		CustomerSubscriptionCollection subscriptions = customer
				.getSubscriptions();

		if (subscriptions.getTotalCount() == 0)
			return;

		SubscriptionUtil.deleteUserSubscription();

	}

	public static JSONObject getCoupon(String couponId) throws Exception {

		try {
			// Retrieve coupon from Stripe
			Coupon coupon = Coupon.retrieve(couponId);

			// Convert to JSON
			return new JSONObject(new Gson().toJson(coupon));

		} catch (Exception e) {
			e.printStackTrace();
		}

		return new JSONObject();
	}

	@Override
	public JSONObject addSubscriptionAddon(Plan newPlan) throws Exception {
		// Fetches current subscription of domain to check if add on
		// subscription already exists and it is update request
		Subscription subscription = SubscriptionUtil.getSubscription();

		// New email plan to subscribe user to
		String plan_id = SubscriptionUtil.getEmailPlan(newPlan.quantity);

		newPlan.plan_id = plan_id;

		// Existing email plan in agile subscription object
		Plan emailPlanInAgile = subscription.emailPlan;

		// Fetches subscription from customer object in stripe
		Customer customer = StripeUtil.getCustomerFromJson(new JSONObject(
				subscription.billing_data_json_string));

		// If there exists email plan, then it is updated instead of creating
		// new subscription
		

			/**
			 * Retrieves all subscriptions from customer object. It is used to
			 * find out the existing subscription object based on the
			 * subscription id that is saved in embedded Plan object (which is
			 * saved when ever a new subscription is created) <a>
			 */
			CustomerSubscriptionCollection subscriptionCollection = customer
					.getSubscriptions();
			List<com.stripe.model.Subscription> subscriptionList = subscriptionCollection
					.getData();

			// To hold current email package plan object from stripe
			com.stripe.model.Plan existingAddonPlan = null;
			com.stripe.model.Subscription existingSubscription = null;

			Iterator<com.stripe.model.Subscription> subscriptionIterator = subscriptionList
					.iterator();

			if (emailPlanInAgile != null)
				// Iterates through all plans and get existing email plan
				while (subscriptionIterator.hasNext()) {
					com.stripe.model.Subscription s = subscriptionIterator
							.next();
					com.stripe.model.Plan stripePlan = s.getPlan();

					// If plan contains email, it holds exiting plan to update
					if (StringUtils.equals(s.getId(),
							emailPlanInAgile.subscription_id)) {
						existingSubscription = s;
						existingAddonPlan = stripePlan;
						break;
					}
				}

			Map<String, Object> newSubscriptionParams = new HashMap<String, Object>();
			newSubscriptionParams.put("plan", newPlan.plan_id);
			newSubscriptionParams.put("quantity", newPlan.quantity);
			newSubscriptionParams.put("prorate", true);
			newPlan.count = null;

			com.stripe.model.Subscription newSubscription = null;
			// If there is no existing subscription that falls under current
			// Category it is considered as new plan subscription
			if (existingAddonPlan == null) {
				newSubscription = customer
						.createSubscription(newSubscriptionParams);
			} else {
				newSubscription = customer
						.createSubscription(newSubscriptionParams);
			}

			newPlan.subscription_id = newSubscription.getId();

			Map<String, Object> invoiceItemParams = new HashMap<String, Object>();
			invoiceItemParams.put("customer", customer.getId());
			invoiceItemParams.put("subscription", newSubscription.getId());

			try {
				// Creates invoice for plan upgrade and charges customer
				// immediately
				Invoice invoice = Invoice.create(invoiceItemParams);
				if (invoice != null) {
					if (invoice.getSubscription().equals(
							newSubscription.getId()))
						invoice.pay();
				}
			} catch (Exception e) {
			}

			subscription.emailPlan = newPlan;
			if (existingSubscription != null) {
				subscription.save();
				existingSubscription.cancel(null);
			}
			Customer customer_new = Customer.retrieve(customer.getId());
			// BillingRestrictionUtil.addEmails(newPlan.quantity * 1000,
			// subscription.plan);
			return StripeUtil.getJSONFromCustomer(customer_new);

		

	}

	@Override
	public JSONObject addCreditCard(CreditCard card) throws Exception {
		Customer customer = null;
		try {
			customer = Customer.create(StripeUtil.getCustomerParams(card));
		} catch (Exception e) {
			e.getMessage();
		}

		// Returns Customer object as JSONObject
		return StripeUtil.getJSONFromCustomer(customer);
	}
	
	@Override
	public void cancelEmailSubscription(JSONObject cust){
		try {
			Customer customer = StripeUtil.getCustomerFromJson(cust);
			List<com.stripe.model.Subscription> subscriptions = customer.getSubscriptions().getData();
			for(com.stripe.model.Subscription subscription : subscriptions){
				if(subscription != null && subscription.getPlan().getId().contains("email")){
					subscription.cancel(null);
					return;
				}
			}
		} catch (StripeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	public Invoice getUpcomingInvoice(JSONObject stripeCustomer, Plan plan) throws StripeException{
		Customer customer = StripeUtil.getCustomerFromJson(stripeCustomer);
		Map<String, Object> invoiceParams = new HashMap<String, Object>();
		System.out.println("cust id:: "+customer.getId());
		List<com.stripe.model.Subscription> subs = customer.getSubscriptions().getData();
		for(com.stripe.model.Subscription sub : subs){
			if(!sub.getPlan().getId().contains("email")){
				invoiceParams.put("subscription", sub.getId());
				System.out.println("sub id:: "+sub.getId());
			}
		}
		invoiceParams.put("customer", customer.getId());
		invoiceParams.put("subscription_quantity", plan.quantity);
		invoiceParams.put("subscription_prorate", true);
		invoiceParams.put("subscription_plan", plan.plan_id);
		RequestOptionsBuilder builder = new RequestOptionsBuilder();
		builder.setApiKey(Globals.STRIPE_API_KEY);
		builder.setStripeVersion("2015-10-16");
		RequestOptions options = builder.build();
		Invoice invoice = Invoice.upcoming(invoiceParams, options);
		System.out.println("Invoice===  "+invoice);
		return invoice;
	}
	
	// Create InvoiceIterm and pay to purchase life time emails
	public void purchaseEmailCredits(JSONObject customerJSON, Integer quantity) throws Exception {
		Customer customer = StripeUtil.getCustomerFromJson(customerJSON);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("customer", customer.getId());
		params.put("amount", quantity*4*100);
		params.put("currency", "usd");
		params.put("description", quantity*1000+" Email Credits");
		InvoiceItem invoiceItem = InvoiceItem.create(params);
		System.out.println("invoiceItem for email credits "+invoiceItem);
		params.remove("amount");
		params.remove("currency");
		try{
			Invoice invoice = Invoice.create(params).pay();
			System.out.println("invoice for email credits "+invoice);
		}catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			params.remove("description");
			params.put("limit", 1);
			List<InvoiceItem> invoiceItems = InvoiceItem.all(params).getData();
			invoiceItems.get(0).delete();
			throw new Exception(e.getMessage());
		}
		
		
	}
}
