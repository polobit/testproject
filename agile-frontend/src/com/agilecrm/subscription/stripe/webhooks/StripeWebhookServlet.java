package com.agilecrm.subscription.stripe.webhooks;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;

/**
 * The <code>StripeWebhookServlet</code> is to handle the webhooks sent by the
 * stripe and process them to perform necessary actions on it
 * 
 * @author Yaswanth
 * 
 * @since November 2012
 * 
 */

@SuppressWarnings("serial")
public class StripeWebhookServlet extends HttpServlet
{
	static
	{
		Stripe.apiKey = Globals.STRIPE_API_KEY;
		Stripe.apiVersion = "2012-09-24";
	}

	// Stripe events
	public static final String STRIPE_INVOICE_PAYMENT_FAILED = "invoice.payment_failed";
	public static final String STRIPE_SUBSCRIPTION_DELETED = "customer.subscription.deleted";
	public static final String STRIPE_CUSTOMER_DELETED = "customer.deleted";
	public static final String STRIPE_CUSTOMER_SUBSCRIPTION_CREATED = "customer.subscription.created";
	public static final String STRIPE_INVOICE_PAYMENT_SUCCEEDED = "invoice.payment_succeeded";
	public static final String STRIPE_CUSTOMER_SUBSCRIPTION_UPDATED = "customer.subscription.updated";
	public static final String STRIPE_CHARGE_REFUNDED = "charge.refunded";

	public void service(HttpServletRequest req, HttpServletResponse res) throws IOException
	{
		Contact contact = null;
		res.setContentType("text/plain;charset=UTF-8");

		ServletInputStream in = req.getInputStream();

		BufferedReader reader = new BufferedReader(new InputStreamReader(in));

		String stripe_event_message = "";
		String line = "";

		// Read the event object from request
		while ((line = reader.readLine()) != null)
		{
			stripe_event_message += (line);
		}

		// If event message is empty return
		if (stripe_event_message.isEmpty())
			return;

		// Get current Namespace and store it can be set back finally after
		// required processing
		String oldNamespace = NamespaceManager.get();

		try
		{
			// Convert event jsonstring to JSONObject
			JSONObject eventJSON = new JSONObject(stripe_event_message);

			String newNamespace;
			try
			{
				// Get Namespace from event
				newNamespace = getNamespaceFromEvent(eventJSON);
			}
			catch (StripeException e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
				return;
			}

			System.out.println("Namespace for event : " + newNamespace);

			System.out.println("Type of event : " + eventJSON.getString("type"));

			System.out.println("event json  :" + eventJSON);

			if (StringUtils.isEmpty(newNamespace))
				return;

			// Set namespace to do queries on subscription object
			NamespaceManager.set(newNamespace);

			// Get event id from event json
			String eventId = eventJSON.getString("id");

			Event event;

			Stripe.apiKey = Globals.STRIPE_API_KEY;
			Stripe.apiVersion = "2012-09-24";

			// Get event from stripe based on stripe event id
			event = Event.retrieve(eventId);
			System.out.println("even : " + event);
			/**
			 * PAYMENT SUCCEEDED
			 * 
			 * If payment is done set subscription flag to success
			 */
			if (eventJSON.getString("type").equals(StripeWebhookServlet.STRIPE_INVOICE_PAYMENT_SUCCEEDED))
			{
				Subscription subscription = setSubscriptionFlag(Subscription.BillingStatus.BILLING_SUCCESS);

				// Get domain owner
				DomainUser user = DomainUserUtil.getDomainOwner(newNamespace);

				// Checks whether owner of the domain is not null, if not null
				// payment received mail to the domain user
				if (user == null)
					return;

				// Set Extra fields to attributes to be used in the template
				customizeEventAttributes(event, user);

				SendMail.sendMail(user.email, SendMail.FIRST_PAYMENT_RECEIVED_SUBJECT, SendMail.FIRST_PAYMENT_RECEIVED,
						getcustomDataForMail(event));

				updateContactInOurDomain(contact, user.email, subscription, null);
			}

			/**
			 * PAYMENT FAILED
			 * 
			 * If payment failed set subscription flag is set to failed and
			 * mails sent to respective domain users
			 */
			else if (eventJSON.getString("type").equals(StripeWebhookServlet.STRIPE_INVOICE_PAYMENT_FAILED))
			{
				// Get number of attempts
				String attempCount = eventJSON.getJSONObject("data").getJSONObject("object").getString("attempt_count");

				Integer number_of_attempts = Integer.parseInt(attempCount);

				// Process webhook
				ProcessPaymentFailedWebhooks(number_of_attempts, event);

			}

			/**
			 * CUSTOMER DELETED
			 * 
			 * If Customer is deleted from stripe then delete subscription
			 * Entity and send an email to domain owner
			 */
			else if (eventJSON.getString("type").equals(StripeWebhookServlet.STRIPE_CUSTOMER_DELETED))
			{
				// Get domain owner
				DomainUser user = DomainUserUtil.getDomainOwner(newNamespace);

				event = customizeEventAttributes(event, user);

				// Delete account
				SubscriptionUtil.getSubscription().delete();

				// Send mail to domain user
				SendMail.sendMail(user.email, SendMail.SUBSCRIPTION_DELETED_SUBJECT, SendMail.SUBSCRIPTION_DELETED,
						event);

			}

			/**
			 * SUBSCRIPTION DELETED
			 * 
			 * If subscription is deleted from stripe then set the status the
			 * set subscription status flag to subscription deleted
			 */
			else if (eventJSON.getString("type").equals(StripeWebhookServlet.STRIPE_SUBSCRIPTION_DELETED))
			{

				// Get domain owner
				DomainUser user = DomainUserUtil.getDomainOwner(newNamespace);

				// If user is null return
				if (user == null)
					return;

				event = customizeEventAttributes(event, user);

				// Send mail to domain user
				SendMail.sendMail(user.email, SendMail.FAILED_BILLINGS_FINAL_TIME_SUBJECT,
						SendMail.FAILED_BILLINGS_FINAL_TIME, getcustomDataForMail(event));

				Subscription subscription = SubscriptionUtil.getSubscription();
				subscription.delete();

				// Set flag to SUBSCRIPTION_DELETED
				setSubscriptionFlag(Subscription.BillingStatus.SUBSCRIPTION_DELETED);
			}

			/**
			 * CHARGE REFUNDED
			 * 
			 * Sends mail to domain owner regarding charge refund
			 */
			else if (eventJSON.getString("type").equals(StripeWebhookServlet.STRIPE_CHARGE_REFUNDED))
			{
				DomainUser user = DomainUserUtil.getDomainOwner(newNamespace);

				if (user == null)
					return;

				// Send mail to domain user
				SendMail.sendMail(user.email, SendMail.REFUND_SUBJECT, SendMail.REFUND, getcustomDataForMail(event));
			}

			/**
			 * SUBSCRIPTION UPDATED (PLAN CHANGED)
			 * 
			 * Sends mail to domain owner, when subscription is updated
			 */
			else if (eventJSON.getString("type").equals(StripeWebhookServlet.STRIPE_CUSTOMER_SUBSCRIPTION_UPDATED))
			{

				if (!isPlanChanged(event))
				{
					return;
				}

				DomainUser user = DomainUserUtil.getDomainOwner(newNamespace);

				System.out.println(user);
				if (user == null)
					return;

				customizeEventAttributes(event, user);

				// Send mail to domain user
				SendMail.sendMail(user.email, SendMail.PLAN_CHANGED_SUBJECT, SendMail.PLAN_CHANGED,
						getcustomDataForMail(event));

				updateContactInOurDomain(contact, user.email, null, getPlanFromSubscriptionEvent(event));
			}
		}

		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		finally
		{
			// Set back the old namespace
			NamespaceManager.set(oldNamespace);
		}
	}

	/**
	 * This method process event based on type of event and return namespace
	 * (domain) to which the webhook addresses
	 * 
	 * @param eventJSON
	 *            {@link JSONObject}
	 * @return {@link String}
	 * @throws JSONException
	 * @throws StripeException
	 */
	public String getNamespaceFromEvent(JSONObject eventJSON) throws JSONException, StripeException
	{
		// Get event type from event json
		String eventType = eventJSON.getString("type");

		// If type is customer deletion stripe return customer object which
		// contains description(which is set to namespace)
		if (eventType.equals(StripeWebhookServlet.STRIPE_CUSTOMER_DELETED))
		{
			// Read description from event json
			String namespace = eventJSON.getJSONObject("data").getJSONObject("object").getString("description");

			return namespace;
		}

		// If event type is not customer deleted the we get the customer id and
		// retieve the customer object from stripe and get
		// description(namespace/domain)
		String customerId = eventJSON.getJSONObject("data").getJSONObject("object").getString("customer");

		Customer customer = Customer.retrieve(customerId);

		// Description is set to namespace while saving
		String namespace = customer.getDescription();

		return namespace;
	}

	/**
	 * Process the payment failed webhookss calls to set subscription flags,
	 * sends email
	 * 
	 * @param attemptCount
	 *            Number of payment attempts
	 * @param event
	 *            {@link Event}
	 * 
	 */
	public void ProcessPaymentFailedWebhooks(int attemptCount, Event event)
	{
		String namespace = NamespaceManager.get();

		// If number of attemps to payment is 0 or 1 the send email to domain
		// owner
		if (attemptCount == 0 || attemptCount == 1)
		{
			// Set subscription flag billing failed
			Subscription.BillingStatus flag = (attemptCount == 0) ? Subscription.BillingStatus.BILLING_FAILED_0
					: Subscription.BillingStatus.BILLING_FAILED_1;

			setSubscriptionFlag(flag);

			// Get owner of the domain
			DomainUser user = DomainUserUtil.getDomainOwner(namespace);

			// If user is not found send email to AgileCrm help about the stripe
			// event
			if (user == null)
			{

			}

			// Call customize attributes based on namespace and user
			event = customizeEventAttributes(event, user);

			SendMail.sendMail(user.email, SendMail.FAILED_BILLINGS_FIRST_TIME_SUBJECT,
					SendMail.FAILED_BILLINGS_FIRST_TIME, getcustomDataForMail(event));

		}

		// If number of attempts for payment are more than 1 then send email to
		// all the domain users in domain
		if (attemptCount == 2)
		{
			setSubscriptionFlag(Subscription.BillingStatus.BILLING_FAILED_2);

			// Get all domain users in the namespace
			List<DomainUser> users = DomainUserUtil.getUsers(namespace);

			// Send email to AgileCrm help
			if (users.size() == 0)
			{

			}

			// Send mail to all domain users
			for (DomainUser user : users)
			{
				event = customizeEventAttributes(event, user);

				SendMail.sendMail(user.email, SendMail.FAILED_BILLINGS_SECOND_TIME_SUBJECT,
						SendMail.FAILED_BILLINGS_SECOND_TIME, getcustomDataForMail(event));
			}
		}

	}

	/**
	 * Sets status of subscription whether billing failed of succeeded
	 * 
	 * @param status
	 *            {@link Subscription.Type}
	 */
	public Subscription setSubscriptionFlag(Subscription.BillingStatus status)
	{
		try
		{
			// Set status and save subscription
			Subscription subscription = SubscriptionUtil.getSubscription();
			System.out.println(subscription);
			subscription.status = status;
			subscription.save();
			return subscription;
		}
		catch (Exception e)

		{

		}
		return null;
	}

	/**
	 * Customize the event attributes set namespace and domain user name to use
	 * in email template
	 * 
	 * @param event
	 *            {@link Event}
	 * @param user
	 *            {@link DomainUser}
	 * @return {@link Event}
	 */
	public Event customizeEventAttributes(Event event, DomainUser user)
	{
		String namespace = NamespaceManager.get();

		// Get the attibutes from event object
		Map<String, Object> attributes = event.getData().getPreviousAttributes();

		// if (STRIPE_INVOICE_PAYMENT_SUCCEEDED.equals(event.getType()))
		// return event;

		if (attributes == null)
			attributes = new HashMap<String, Object>();

		// Set custom attributes "namespace", "user_name"

		if (StringUtils.isEmpty(namespace))
			return event;

		attributes.put("domain", namespace);
		attributes.put("user_name", user.name);
		attributes.put("email", user.email);

		// set back to event object
		event.getData().setPreviousAttributes(attributes);

		// Return customized event
		return event;
	}

	/**
	 * Customizes the the content for email templates add customer details
	 * related to the event and returns object array, with event object and
	 * customer object
	 * 
	 * @param event
	 * @return Object[]
	 */
	public Object[] getcustomDataForMail(Event event)
	{
		Customer customer = null;

		// Gets StripeObject from the Event
		StripeObject stripeObject = event.getData().getObject();

		// Gets customer JSON string from customer object
		String stripeJSONString = new Gson().toJson(stripeObject);

		Map<String, Object> plan = new HashMap<String, Object>();

		try
		{

			// Gets customerId from StripeObject json
			String customerId = new JSONObject(stripeJSONString).getString("customer");

			// Retrieves Object customer object from stripe, based on customerId
			customer = Customer.retrieve(customerId);
			com.stripe.model.Subscription subscription = customer.getSubscription();

			if (STRIPE_INVOICE_PAYMENT_SUCCEEDED.equals(event.getType()))
			{
				JSONObject stripeJSONJSON = new JSONObject(stripeJSONString);

				plan.put("price", Float.valueOf(stripeJSONJSON.getString("total")) / 100);
				plan.put("start_date", new Date(subscription.getCurrentPeriodStart() * 1000).toString());
				plan.put("end_date", new Date(subscription.getCurrentPeriodEnd() * 1000).toString());
				System.out.println(plan);
			}
		}
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Object object[] = { event, customer, plan };
		return object;
	}

	public String getPlanFromInvoiceEvent(Event e)
	{
		// Gets StripeObject from the Event
		StripeObject stripeObject = e.getData().getObject();

		// Gets customer JSON string from customer object
		String stripeJSONString = new Gson().toJson(stripeObject);
		try
		{
			JSONObject obj = new JSONObject(stripeJSONString);
			JSONObject lines = obj.getJSONObject("lines");
			JSONObject data = lines.getJSONArray("data").getJSONObject(0);
			return getPlanFromObject(data);
		}
		catch (JSONException e1)
		{
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		return null;

	}

	public String getPlanFromSubscriptionEvent(Event e)
	{
		// Gets StripeObject from the Event
		StripeObject stripeObject = e.getData().getObject();

		// Gets customer JSON string from customer object
		String stripeJSONString = new Gson().toJson(stripeObject);

		try
		{
			return getPlanFromObject(new JSONObject(stripeJSONString));
		}
		catch (JSONException e1)
		{
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		return null;
	}

	public String getPlanFromObject(JSONObject object)
	{
		JSONObject plan;
		try
		{
			plan = object.getJSONObject("plan");
			return plan.getString("name");
		}
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public boolean isPlanChanged(Event event)
	{
		Map<String, Object> attributes = event.getData().getPreviousAttributes();

		if (attributes == null)
			return false;

		if (attributes.containsKey("plan"))
			return true;

		else if (attributes.containsKey("quantity"))
			return true;

		return false;
	}

	private void updateContactInOurDomain(Contact contact, String email, Subscription subscription, String planString)
			throws JSONException
	{
		System.out.println("subsription object" + subscription + ", plan " + planString);
		String plan = null;

		if (subscription == null)
			plan = planString;
		else
			plan = subscription.plan.plan_type.toString();

		String oldNamespace = NamespaceManager.get();
		try
		{
			NamespaceManager.set("our");

			if (contact == null)
			{
				contact = ContactUtil.searchContactByEmail(email);
			}

			if (contact == null)
				return;
			boolean isUpdateRequired = false;

			if (!contact.tags.contains("Paid"))
			{
				contact.tags.add("Paid");
				isUpdateRequired = true;
			}

			ContactField field = contact.getContactField("Plan");
			if (field == null)
			{
				field = new ContactField("Plan", plan, null);
				contact.addProperty(field);
				isUpdateRequired = true;
			}
			else if (!StringUtils.equals(plan, field.value))
			{
				field.value = plan;
				isUpdateRequired = true;
			}

			ContactField stripeCustomField = contact.getContactField("Stripe Id");
			if (stripeCustomField == null)
			{
				// Converts Customer JSON to customer object
				Customer customer = new Gson().fromJson(subscription.billing_data_json_string, Customer.class);

				field = new ContactField("Stripe Id", customer.getId(), null);
				field.type = ContactField.FieldType.CUSTOM;
				contact.addProperty(field);
				isUpdateRequired = true;
			}

			if (isUpdateRequired)
				contact.save();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}
	
	
}