package com.agilecrm.subscription;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.ws.rs.Produces;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jettison.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.subscription.limits.PlanLimits;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.agilecrm.subscription.restrictions.exception.EmailPurchaseLimitCrossedException;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.stripe.StripeImpl;
import com.agilecrm.subscription.stripe.StripeUtil;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookServlet;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.subscription.ui.serialize.Plan.PlanType;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.util.ClickDeskEncryption;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.Gson;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;
import com.stripe.model.Customer;
import com.stripe.model.Invoice;

/**
 * <code>Subscription</code> class represents subscription details of a domain.
 * <p>
 * This class holds information about domain's current plan represented by
 * {@link Plan}, Billing status represent by {@link BillingStatus}, RSA
 * encrypted( using {@link ClickDeskEncryption}) domain user's credit card
 * information, subscription created/updated time and gateway used for payment.
 * </p>
 * Billing operations are done through this class, it calls {@link AgileBilling}
 * implementation class depending on the selected gateway. Whenever changes are
 * made either in card details or plan(change in subscription), It calls methods
 * to update card/plan(on change) details in gateway, then updated customer
 * object from gateway is saved as JSON string in subscription entity.
 * <p>
 * This class is used when a subscription is being created or updated. Calls are
 * made through SubcriptionApi for updating(card/plan), creating subscription.
 * It is also used in {@link StripeWebhookServlet} whenever web hook is raised
 * then billing status of subscription entity is set accordingly, based on the
 * event type of the web hook and event occurrence count of failed billing
 * attempts.
 * </p>
 * 
 * @since November 2012
 * 
 * @author Yaswanth
 * 
 * @see AgileBilling
 * @see StripeImpl
 * @see StripeWebhookServlet
 */
@XmlRootElement
@Cached
public class Subscription implements Serializable{
	@Id
	public Long id;

	/** The plan object represents plan and quantity */
	@Embedded
	@NotSaved(IfDefault.class)
	public Plan plan = null;

	@Embedded
	@NotSaved(IfDefault.class)
	public Plan emailPlan = null;

	/**
	 * The card_details variable is used for serialization of card details from
	 * form this field is not saved only encrypted card details will be saved
	 */
	@NotSaved
	public CreditCard card_details = null;

	/** This {@link Enum} Type represents subscription status of domain */
	public static enum BillingStatus {
		BILLING_FAILED_0, BILLING_FAILED_1, BILLING_FAILED_2, BILLING_FAILED_3, BILLING_SUCCESS, BILLING_PAUSED, SUBSCRIPTION_DELETED
	};
	
	/**
	 *	Emails blocking status
	 */
	public static enum EmailPurchaseStatus {
		BLOCKED, RELEASED
	}
	
	/**
	 * Emails type
	 */
	public static enum BlockedEmailType{
		SUBSCRIPTION, CREDIT, AUTO_RECHARGE
	}

	/**
	 * The status {@link Enum} type variable holds status of Subscription status
	 */
	@NotSaved(IfDefault.class)
	public BillingStatus status;

	/**
	 * The status {@link Enum} type variable holds status of Subscription status
	 */
	@NotSaved(IfDefault.class)
	public BillingStatus emailStatus;
	
	/**
	 * type of email purchase status if BLOCKED emails will not be added.
	 */
	@NotSaved(IfDefault.class)
	private EmailPurchaseStatus  emailpurchaseStatus;
	
	/**
	 * Type of email blocked
	 */
	@NotSaved(IfDefault.class)
	private BlockedEmailType blockedEmailtype;
	
	/**
	 * count of emails blocked while purchasing
	 */
	@NotSaved(IfDefault.class)
	private int pendingEmailsCount;

	/** The created_time variable represents when subscription object is created */
	@NotSaved(IfDefault.class)
	public Long created_time = 0L;

	/** The updated_time variable represents when subscription object is updated */
	@NotSaved(IfDefault.class)
	public Long updated_time = 0L;

	/**
	 * The billing_data_json_string represents {@link String} form of
	 * billing_data(Stripe {@link Customer} info ) saved along with subscription
	 * entity
	 */
	@NotSaved(IfDefault.class)
	public String billing_data_json_string = null;

	// used when upgrade subscription from adminpanel
	@NotSaved
	public String domain_name = null;

	/** This {@link Enum} gateway represents the payment gateway */
	public static enum Gateway {
		Stripe, Paypal
	};

	/**
	 * Gateway which is used to make a payment
	 */
	@NotSaved(IfDefault.class)
	public Gateway gateway;

	/**
	 * The encrypted_card_details are encrypted form of card_details, Encrypted
	 * before saving {@link Subscription} Entity
	 */
	@NotSaved(IfDefault.class)
	private String encrypted_card_details = null;

	/**
	 * The billing_data {@link JSONObject} is never saved directly but saved in
	 * the form of string converted in prepersit temporary variable used to keep
	 * {@link Customer} as {@link JSONObject}
	 */
	/*@NotSaved
	@JsonIgnore
	public JSONObject billing_data; */

	@NotSaved
	public PlanLimits planLimits;

	@NotSaved
	public BillingRestriction cachedData;
	

	private static ObjectifyGenericDao<Subscription> dao = new ObjectifyGenericDao<Subscription>(
			Subscription.class);

	public Subscription() {

	}

	void fillDefaultPlans() {

		if (plan == null) {
			plan = new Plan(PlanType.FREE.toString(), Globals.TRIAL_USERS_COUNT);
			gateway = Gateway.Stripe;
			planLimits = PlanLimits.getPlanDetails(plan);
		}

	}

	/**
	 * Returns {@link Subscription} object of particular domain domain
	 * 
	 * @return {@link Subscription}
	 * */
	public static void deleteSubscriptionOfParticularDomain(String namespace) {
		String oldNamespace = NamespaceManager.get();
		try {
			NamespaceManager.set(namespace);
			Subscription subscription = SubscriptionUtil.getSubscription();
			if (subscription != null)
				subscription.cancelSubscription();

		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			NamespaceManager.set(oldNamespace);
		}
	}

	/**
	 * Returns {@link Subscription} object of particular domain domain
	 * 
	 * @return {@link Subscription}
	 * */
	public static Subscription getSubscriptionOfParticularDomain(
			String namespace) {
		String oldNamespace = NamespaceManager.get();
		try {
			NamespaceManager.set(namespace);

			Subscription subscription = SubscriptionUtil.getSubscription(true);

			if (subscription != null) {
				subscription.domain_name = namespace;
				return subscription;
			}

		} catch (Exception e) {
			e.printStackTrace();

		} finally {
			NamespaceManager.set(oldNamespace);
		}
		return null;
	}

	public void save() {
		Subscription subscription = SubscriptionUtil.getSubscription();
		// If Subscription object already exists, update it(Only one
		// subscription object per domain)
		if (subscription != null)
			this.id = subscription.id;

		dao.put(this);
		
		try { CacheUtil.deleteCache(fetchCacheKey()); } catch (Exception e) {}
	}

	/**
	 * @return the emailpurchaseStatus
	 */
	public EmailPurchaseStatus getEmailpurchaseStatus() {
		return emailpurchaseStatus;
	}

	/**
	 * @param emailpurchaseStatus the emailpurchaseStatus to set
	 */
	public void setEmailpurchaseStatus(EmailPurchaseStatus emailpurchaseStatus) {
		this.emailpurchaseStatus = emailpurchaseStatus;
	}

	/**
	 * @return the blockedEmailtype
	 */
	public BlockedEmailType getBlockedEmailtype() {
		return blockedEmailtype;
	}

	/**
	 * @param blockedEmailtype the blockedEmailtype to set
	 */
	public void setBlockedEmailtype(BlockedEmailType blockedEmailtype) {
		this.blockedEmailtype = blockedEmailtype;
	}

	/**
	 * @return the pendingEmailsCount
	 */
	public int getPendingEmailsCount() {
		return pendingEmailsCount;
	}

	/**
	 * @param pendingEmailsCount the pendingEmailsCount to set
	 */
	public void setPendingEmailsCount(int pendingEmailsCount) {
		this.pendingEmailsCount = pendingEmailsCount;
	}

	/**
	 * Creates a Customer in respective {@link Gateway} and store customer
	 * details in {@link Subscription} object
	 * 
	 * @return {@link Subscription}
	 * 
	 * @throws Exception
	 *             as Customer creation can be failed due to various
	 *             reasons(incorrect creditcard details)
	 */

	private Subscription createNewSubscription() throws Exception {
		return createNewSubscription(plan);
	}

	private Subscription createNewEmailSubscription() throws Exception {
		emailPlan.plan_id = SubscriptionUtil.getEmailPlan(emailPlan.quantity);
		Subscription subscription = createNewSubscription(emailPlan);
		if(emailPlan.quantity > 10 && !SubscriptionUtil.isCostlyUser()){
			SubscriptionUtil.blockEmailPurchasing(BlockedEmailType.SUBSCRIPTION, emailPlan.quantity * 1000);
			throw new EmailPurchaseLimitCrossedException(ExceptionUtil.EMAILS_PURCHASE_BLOCKING);
		}
		return subscription;
	}

	private Subscription createNewSubscription(Plan plan) throws Exception {
		// Creates customer and adds subscription
		setBillingData(getAgileBilling().createCustomer(card_details, plan));

		// Saves new subscription information
		save();

		return this;
	}

	public Subscription createNewCustomer() throws Exception {

		if (plan != null)
			createNewSubscription();

		else if (emailPlan != null)
			createNewEmailSubscription();
		return this;
	}

	/**
	 * Returns number of users in account along with subscription details
	 */
	@XmlElement(name = "user_count")
	public Integer getUserCount() {
		return DomainUserUtil.count();
	}

	/**
	 * Updates the {@link Subscription} of existing user, if user is already in
	 * same plan(plan_id and quantity both are considered) the method performs
	 * no action, to avoid unnecessary payments
	 * 
	 * @param plan
	 *            {@link Plan}
	 * @return {@link Subscription}
	 * @throws Exception
	 */
	public static Subscription updatePlan(Plan plan)
			throws PlanRestrictedException, Exception {
		// Gets subscription object of current domain
		Subscription subscription = SubscriptionUtil.getSubscription();

		/*if (subscription.plan != null
				&& subscription.plan.plan_type == PlanType.FREE) {
			int count = DomainUserUtil.count();
			System.out.println("existing users cout in free plan " + count);
			if (plan.quantity < count) {
				BillingRestrictionUtil
						.throwLimitExceededException(ErrorMessages.NOT_DOWNGRADABLE);
				return null;
			}

		} else if (BillingRestrictionUtil.isLowerPlan(subscription.plan, plan)
				&& !BillingRestrictionUtil.getInstanceTemporary(plan)
						.isDowngradable()) {
			System.out.println("plan upgrade not possible");
			BillingRestrictionUtil
					.throwLimitExceededException(ErrorMessages.NOT_DOWNGRADABLE);
			return null;
		}*/

		// If customer is already on same plan do not update(checks both
		// on
		// plan_id and quantity)
		if (plan.plan_id.equals(subscription.plan.plan_id)
				&& plan.quantity.equals(subscription.plan.quantity))
			return subscription;

		// Updates the plan in related gateway
		subscription.setBillingData(subscription.getAgileBilling().updatePlan(
				subscription.fetchBillingDataJSONObject(), plan));
		// Updates plan of current domain subscription object
		subscription.plan = plan;
		// Saves updated subcription object
		subscription.save();

		return subscription;
	}

	/**
	 * Updates credit card details of customer in its respective gateway and
	 * saves the new customer object(returned from Stripe), new card detials
	 * (encrypted before saving).
	 * 
	 * @param cardDetails
	 *            {@link CreditCard}
	 * @return {@link Subscription}
	 * @throws Exception
	 */
	public static Subscription updateCreditCard(CreditCard cardDetails)
			throws Exception {

		// Gets subscription of current domain
		Subscription subscription = SubscriptionUtil.getSubscription();

		AgileBilling billing = subscription.getAgileBilling();

		if (subscription.fetchBillingDataJSONObject() != null)
			// Updates credit card details in related gateway
			subscription.setBillingData(billing.updateCreditCard(
					subscription.fetchBillingDataJSONObject(), cardDetails));
		else
			subscription.setBillingData(billing.addCreditCard(cardDetails));

		// Assigns details which will be encrypted before saving
		// subscription entity
		subscription.card_details = cardDetails;

		// Saves updated details
		subscription.save();

		return subscription;
	}

	/**
	 * Fetches {@link List} of {@link Invoice} from respective gateway
	 * 
	 * @return {@link List} of {@link Invoice}
	 * @throws Exception
	 */
	public static List<Invoice> getInvoices() throws Exception {
		Subscription subscription = SubscriptionUtil.getSubscription();

		// If current domain has subscription object get invoices for that
		// domain
		if (subscription == null)
			return null;

		return subscription.getAgileBilling().getInvoices(
				subscription.fetchBillingDataJSONObject());
	}

	/**
	 * Fetchs {@link List} of {@link Invoice} from respective Domain
	 * 
	 * @return {@link List} of {@link Invoice}
	 * @throws Exception
	 */
	public static List<Invoice> getInvoicesOfParticularDomain(String domainname)
			throws Exception {
		Subscription subscription = getSubscriptionOfParticularDomain(domainname);

		// If current domain has subscription object get invoices for that
		// domain
		if (subscription == null)
			return null;
		return subscription.getAgileBilling().getInvoices(
				subscription.fetchBillingDataJSONObject());
	}
	
	/**
	 * Fetch the key for saving this subscription in the cache
	 * @return
	 */
	public static String fetchCacheKey()
	{
		if( NamespaceManager.get() != null )	return "__agile_subscription_cache_key_" + NamespaceManager.get();
		return "__agile_subscription_cache_key_[default]";
	}
	
	public Invoice getUpcomingInvoice(Plan plan)
			throws Exception {
		Subscription subscription = SubscriptionUtil.getSubscription(true);

		// If current domain has subscription object get invoices for that
		// domain
		if (subscription == null)
			return null;
		return subscription.getAgileBilling().getUpcomingInvoice(subscription.fetchBillingDataJSONObject(), plan);
	}

	/**
	 * Cancels the subscription in its respective gateway
	 * 
	 * @throws Exception
	 */
	public void cancelSubscription() throws Exception {
		getAgileBilling().cancelSubscription(fetchBillingDataJSONObject());
	}
	
	/**
	 * Cancels the email subscription in its respective gateway
	 * 
	 * @throws Exception
	 */
	public void cancelEmailSubscription() throws Exception {
		getAgileBilling().cancelEmailSubscription(fetchBillingDataJSONObject());
	}

	/**
	 * Delete customer from its gateway
	 * 
	 * @throws Exception
	 */
	public void deleteCustomer() throws Exception {
		getAgileBilling().deleteCustomer(fetchBillingDataJSONObject());
	}
	
	/**
	 * Purchase email credits
	 * 
	 * @throws Exception
	 */
	public void purchaseEmailCredits(int quantity) throws Exception {
		purchaseEmailCredits(quantity, 0);
	}
	public void purchaseEmailCredits(int quantity, int decrementCount) throws Exception {
		boolean isPaid = getAgileBilling().purchaseEmailCredits(fetchBillingDataJSONObject(), quantity);
		if(!isPaid)
			throw new Exception("Payment failed. Please try again.");
		if(quantity > 10 && !SubscriptionUtil.isCostlyUser()){
			SubscriptionUtil.blockEmailPurchasing(BlockedEmailType.CREDIT, quantity * 1000);
			throw new EmailPurchaseLimitCrossedException(ExceptionUtil.EMAILS_PURCHASE_BLOCKING);
		}
		BillingRestriction restriction = BillingRestrictionUtil.getBillingRestrictionFromDB();
		restriction.incrementEmailCreditsCount((quantity*1000) - decrementCount);
		restriction.save();
		System.out.println("Credits purchased successfully ::"+System.currentTimeMillis());
	}
	
	/**
	 * Adds trial for all subscriptions
	 * 
	 * @throws Exception
	 */
	public void addTrial(Long trialEnd) throws Exception {
		getAgileBilling().addTrial(trialEnd);
	}

	/**
	 * Deletes subscription and deletes customer from its related gateway
	 * 
	 * @throws Exception
	 */
	public void delete() throws Exception {
		// Deletes the customer before deleting agile subscription object
		try {
			// deleteCustomer();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			// If customer object is not found in stripe still subscription
			// needs to be deleted
			dao.delete(this);
			
			try { CacheUtil.deleteCache(fetchCacheKey()); } catch (Exception e) {}
		}
	}

	/**
	 * Returns billing data along with subscription
	 * 
	 * @return {@link String}
	 * @throws Exception
	 */
	@XmlElement
	@Produces("application/json")
	public String getBillingData() {
		if (StringUtils.isEmpty(billing_data_json_string) )
			return null;		
		return billing_data_json_string;
	}

	@PostLoad
	void PostLoad() {
		try {
			if (this.plan == null) {
				plan = new Plan(PlanType.FREE.toString(), Globals.TRIAL_USERS_COUNT);
			}

			planLimits = PlanLimits.getPlanDetails(plan);

			// sets domain name in subscription obj before returning
			this.domain_name = NamespaceManager.get();

			/*if (billing_data_json_string != null)
				billing_data = new JSONObject(billing_data_json_string); */
			

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void refreshCustomer() throws Exception {
		Customer customer = SubscriptionUtil.getCustomer(fetchBillingDataJSONObject());
		setBillingData(StripeUtil.getJSONFromCustomer(customer));
	}

	/**
	 * Returns AgileBilling interface implemented object based on gateway
	 * 
	 * @return {@link AgileBilling}
	 * @throws Exception
	 */
	@JsonIgnore
	public AgileBilling getAgileBilling() throws Exception {
		/*
		 * Respective gateway implementation is expected to be in sub package of
		 * subscription, name of package should be name of gateway and
		 * Implementations class should be named "gateway"+Impl
		 */
		return (AgileBilling) Class.forName(
				"com.agilecrm.subscription."
						+ this.gateway.toString().toLowerCase() + "."
						+ this.gateway + "Impl").newInstance();

	}

	@PrePersist
	private void PrePersist() {
		// billing_data_json_string = billing_data.toString();
		
		// Store Created Time
		if (created_time == 0L)
			created_time = System.currentTimeMillis() / 1000;
		else
			updated_time = System.currentTimeMillis() / 1000;

		try {
			// Encrypt creditcard details before saving
			this.encrypted_card_details = ClickDeskEncryption
					.RSAEncrypt(new Gson().toJson(this.encrypted_card_details)
							.getBytes());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public boolean isFreePlan() {
		if (plan == null || plan.plan_type == null
				|| plan.plan_type == PlanType.FREE)
			return true;
		return false;
	}

	public boolean isFreeEmailPack() {
		if (emailPlan == null)
			return true;
		return false;
	}

	/**
	 * Fetch the Billing Data as a JSON Object
	 * @return
	 */
	public JSONObject fetchBillingDataJSONObject()
	{
		if( billing_data_json_string == null )	return null;
		
		try {
			return new JSONObject(billing_data_json_string);
		} catch (org.codehaus.jettison.json.JSONException e) {
			e.printStackTrace();
			return null;
		}
	}
	
	/**
	 * Set the Billing Data from a JSON Object
	 * @param billing_data
	 */
	public void setBillingData(JSONObject billing_data)
	{
		if( billing_data == null )	this.billing_data_json_string = null;
		this.billing_data_json_string = billing_data.toString();
	}
	
	@Override
	public String toString() {
		return "Subscription: {id: " + id + ", plan: " + plan
				+ ", card_details: " + card_details
				+ ", enripted_card_details: " + encrypted_card_details
				+ ", status: " + status + ", created_time: " + created_time
				+ ", updated_time: " + updated_time + ", billing_data: "
				+ fetchBillingDataJSONObject() + ", billing_data_json_string: "
				+ billing_data_json_string + ", gateway: " + gateway + "}";
	}
}
