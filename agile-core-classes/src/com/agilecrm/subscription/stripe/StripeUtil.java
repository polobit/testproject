package com.agilecrm.subscription.stripe;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.codehaus.jettison.json.JSONObject;
import org.json.JSONException;

import com.agilecrm.Globals;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.subscription.ui.serialize.CreditCard;
import com.agilecrm.subscription.ui.serialize.Plan;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.APIConnectionException;
import com.stripe.exception.APIException;
import com.stripe.exception.AuthenticationException;
import com.stripe.exception.CardException;
import com.stripe.exception.InvalidRequestException;
import com.stripe.exception.StripeException;
import com.stripe.model.Card;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import com.stripe.model.CustomerCardCollection;
import com.stripe.model.Event;
import com.stripe.model.Invoice;
import com.stripe.model.Refund;
import com.stripe.net.RequestOptions;
import com.stripe.net.RequestOptions.RequestOptionsBuilder;

/**
 * <code>StripeUtil</code> is utility class used to process data, to support
 * Stripe transactions.
 * <p>
 * It includes utility functions needed to process Customer objects of stripe
 * and conversion to or from JSON objects. This class is used by
 * {@link StripeImpl} class which data to be processed as to support Stripe
 * operations, and data returned from stripe is also process by this utility
 * class to save information in {@link Subscription}
 * </p>
 * 
 * @author Yaswanth
 * @see StripeImpl
 * @since November 2012
 */
public class StripeUtil {
	static {
		Stripe.apiKey = Globals.STRIPE_API_KEY;
		Stripe.apiVersion = "2012-09-24";
	}

	/**
	 * Creates a map of customer card details, plan and other details required
	 * to create a customer in stripe
	 * 
	 * @param customerCard
	 *            {@link CreditCard}
	 * @param plan
	 *            {@link Plan}
	 * @return {@link Map}
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public static Map<String, Object> getCustomerParams(
			CreditCard customerCard, Plan plan) throws JsonParseException,
			JsonMappingException, IOException {
		Map<String, Object> customerParams = new HashMap<String, Object>();

		// Gets credit card details map
		customerParams.put("card", getCardParams(customerCard));

		// Gets plan details map
		customerParams.put("plan", plan.plan_id);
		customerParams.put("quantity", plan.quantity);

		if (!StringUtils.isEmpty(plan.coupon))
			customerParams.put("coupon", plan.coupon);

		// Sets Description and Email for subscription
		customerParams.put("description", NamespaceManager.get());
		customerParams
				.put("email", DomainUserUtil.getCurrentDomainUser().email);

		return customerParams;
	}

	/**
	 * Creates map to create customer without any subscription just by adding
	 * credit card
	 */
	public static Map<String, Object> getCustomerParams(CreditCard customerCard)
			throws JsonParseException, JsonMappingException, IOException {
		Map<String, Object> customerParams = new HashMap<String, Object>();

		// Gets credit card details map
		customerParams.put("card", getCardParams(customerCard));

		// Sets Description and Email for subscription
		customerParams.put("description", NamespaceManager.get());
		customerParams
				.put("email", DomainUserUtil.getCurrentDomainUser().email);

		return customerParams;
	}

	/**
	 * This method creates a Map with creditcard details as requirement of
	 * stripe
	 * 
	 * @param cardDetails
	 *            {@link CreditCard}
	 * @return {@link Map}
	 * @throws JsonParseException
	 * @throws JsonMappingException
	 * @throws IOException
	 */
	public static Map<String, Object> getCardParams(CreditCard cardDetails)
			throws JsonParseException, JsonMappingException, IOException {

		// Converts CreditCard object in to JSON string
		String creditCardJSON = new Gson().toJson(cardDetails);

		// Creates HashMap from CreditCard JSON string
		HashMap<String, Object> cardParams = new ObjectMapper().readValue(
				creditCardJSON, new TypeReference<HashMap<String, Object>>() {
				});

		return cardParams;
	}

	/**
	 * Converts JSONObject(converted from {@link Customer}) to Stripe
	 * {@link Customer} object and fetches {@link Customer} from stripe with id
	 * to ensure the {@link Customer} is latest(If any changes made in stripe
	 * manually)
	 * 
	 * @param customerJSON
	 *            {@link JSONObject}
	 * @return {@link Customer}
	 * @throws StripeException
	 */
	public static Customer getCustomerFromJson(JSONObject customerJSON)
			throws StripeException {
		Stripe.apiKey = Globals.STRIPE_API_KEY;
		// Converts Customer JSON to customer object
		Customer customer = new Gson().fromJson(customerJSON.toString(),
				Customer.class);

		if (customer != null && !customer.getLivemode()) {
			RequestOptionsBuilder builder = new RequestOptionsBuilder()
					.setApiKey(Globals.STRIPE_TEST_API_KEY);
			// builder.setApiKey(Globals.STRIPE_API_KEY);
			// builder.setStripeVersion("2014-12-08");
			RequestOptions options = builder.build();

			return Customer.retrieve(customer.getId(), options);
		}

		// Retrieves the customer from stripe based on id
		return Customer.retrieve(customer.getId());
	}

	/**
	 * Wraps event JSON to Stripe {@link Event} object
	 * 
	 * @param customerid
	 * @return
	 * @throws APIException
	 * @throws CardException
	 * @throws APIConnectionException
	 * @throws InvalidRequestException
	 * @throws AuthenticationException
	 * @throws StripeException
	 */
	public static Event getEventFromJSON(String event_json_string)
			throws AuthenticationException, InvalidRequestException,
			APIConnectionException, CardException, APIException {
		System.out.println();

		try {
			org.json.JSONObject ob = new org.json.JSONObject(event_json_string);
			System.out.println("event id" + ob.getString("id"));
			// Converts Customer JSON to1 customer object
			Event event = Event.retrieve(ob.getString("id"));
			// Retrieves the customer from stripe based on id
			return event;
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;

	}

	public static List<Charge> getCharges(String customerid)
			throws StripeException {
		return getCharges(customerid, null);
	}

	public static List<Charge> getCharges(String customerid, Integer limit)
			throws StripeException {

		Stripe.apiKey = Globals.STRIPE_API_KEY;

		Map<String, Object> chargeParams = new HashMap<String, Object>();

		// Sets charge parameters (Stripe customer id is required to get
		// charges of a customer form stripe)
		chargeParams.put("customer", customerid);

		if (limit != null && limit > 0)
			// Sets charge parameters (Stripe customer id is required to get
			// charges of a customer form stripe)
			chargeParams.put("limit", limit);

		/*
		 * Fetches all charges for given stripe customer id and returns invoices
		 */
		return Charge.all(chargeParams).getData();
	}

	// based on charge id, that charge will be refunded
	public static Charge createRefund(String chargeid) throws StripeException {

		Stripe.apiKey = Globals.STRIPE_API_KEY;

		Charge ch = Charge.retrieve(chargeid);

		return ch.refund();
	}

	// based on charge id, that charge will be refunded
	public static Refund createPartialRefund(String chargeId, Integer amount)
			throws StripeException {
		RequestOptionsBuilder builder = new RequestOptionsBuilder();
		builder.setApiKey(Globals.STRIPE_API_KEY);
		builder.setStripeVersion("2014-12-08");
		RequestOptions options = builder.build();
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("amount", amount);
		Charge ch = Charge.retrieve(chargeId, options);
		System.out.println(ch);
		Refund refund = ch.getRefunds().create(params);
		return refund;
	}

	/**
	 * Converts {@link Customer} of stripe to a {@link JSONObject}
	 * 
	 * @param customer
	 *            {@link Customer}
	 * @return {@link JSONObject}
	 * @throws Exception
	 */
	public static JSONObject getJSONFromCustomer(Customer customer)
			throws Exception {
		// Gets customer JSON string from customer object
		String customerJSONString = new Gson().toJson(customer);

		// Creates customer JSONObject from customer JSON string
		JSONObject customerJSON = new JSONObject(customerJSONString);
		return customerJSON;
	}

	public static Card getDefaultCard(Customer customer) {
		String cardId = customer.getDefaultCard();

		if (StringUtils.isEmpty(cardId))
			return (Card) null;

		CustomerCardCollection cardCollection = customer.getCards();

		for (Card card : cardCollection.getData()) {
			if (cardId.equals(card.getId()))
				return card;
		}
		return (Card) null;
	}

	public static com.stripe.model.Subscription getEmailSubscription(
			Customer customer, String domain) {
		String oldNamespace = null;
		NamespaceManager.set(domain);
		try {

			Subscription subscription = SubscriptionUtil.getSubscription();
			if (subscription.emailPlan == null)
				return null;

			String subscription_id = subscription.emailPlan.subscription_id;

			if (customer.getSubscriptions() == null)
				return null;

			for (com.stripe.model.Subscription stripeSubscription : customer
					.getSubscriptions().getData()) {
				if (stripeSubscription.getId().equals(subscription_id))
					return stripeSubscription;
			}
		} finally {
			NamespaceManager.set(oldNamespace);
		}

		return null;
	}

	public static void deleteSubscription(String sub_id, String cus_id) {
		Stripe.apiKey = Globals.STRIPE_API_KEY;
		Customer cu;

		try {
			cu = Customer.retrieve(cus_id);

			com.stripe.model.Subscription subscription = cu.getSubscriptions().retrieve(sub_id);
			subscription.cancel(null);
			if(subscription.getPlan().getId().contains("email"))
				SubscriptionUtil.deleteEmailSubscription();
			System.out.println("subscription successfully deleted");
		} catch (AuthenticationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InvalidRequestException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (APIConnectionException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (CardException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (APIException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public static Invoice getInvoice(String invoice_id) {
		Stripe.apiKey = Globals.STRIPE_API_KEY;
		try {
			RequestOptionsBuilder builder = new RequestOptionsBuilder();
			builder.setApiKey(Globals.STRIPE_API_KEY);
			builder.setStripeVersion("2014-12-08");
			RequestOptions options = builder.build();

			Invoice invoice = Invoice.retrieve(invoice_id, options);
			System.out.println("aaaaaaaaaaaaa");
			System.out.println(invoice);
			return invoice;
		} catch (AuthenticationException | InvalidRequestException
				| APIConnectionException | CardException | APIException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

}
