package com.thirdparty.stripe;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.ContactField.FieldType;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookHandler;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookHandlerImpl;
import com.agilecrm.subscription.stripe.webhooks.StripeWebhookServlet;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.googlecode.objectify.Key;
import com.stripe.exception.StripeException;

@SuppressWarnings("serial")
public class StripeChargeWebhook extends HttpServlet
{
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	String apiKey = request.getParameter("api-key");
	System.out.println("api key is " + apiKey);

	Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);
	if (owner == null)
	{
	    // response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
	    // "Invalid API Key");
	    return;
	}

	ServletInputStream data = request.getInputStream();
	BufferedReader reader = new BufferedReader(new InputStreamReader(data, StandardCharsets.UTF_8));
	String line = "";
	String stripeData = "";
	while ((line = reader.readLine()) != null)
	{
	    stripeData += line;
	}
	System.out.println("stripe data is " + stripeData);

	try
	{
	    JSONObject stripeJson = new JSONObject(stripeData);
	    System.out.println("stripe json is " + stripeJson);

	    String eventType = stripeJson.getString("type");
	    System.out.println("stripe post event type is " + eventType);
	    
//	    String newNamespace="";
//		try
//		{
//			// Get Namespace from event
//			StripeWebhookServlet stripeWebhookServlet = new StripeWebhookServlet();
//			newNamespace = stripeWebhookServlet.getNamespaceFromEvent(stripeJson);
//			
//		}
//		catch (StripeException e)
//		{
//			// TODO Auto-generated catch block
//			System.out.println("Exception occured in getting name space:"+e.getMessage());
//		}

//		System.out.println("Namespace for event : " + newNamespace);

	    JSONObject stripeEventJson = getStripeEventJson(stripeJson, eventType);
	    if (stripeEventJson == null)
	    {
		// response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		return;
	    }

	    List<Trigger> triggers = TriggerUtil.getAllTriggers();
	    for (Trigger trigger : triggers)
	    {
		System.out.println("trigger is " + trigger.name);
		System.out.println("campaign id is " + trigger.campaign_id);

		if (StringUtils.equals(trigger.trigger_stripe_event, eventType.replace(".", "_").toUpperCase()))
		{
		    String email = getStripeEmail(stripeJson, eventType);
		    StripeWebhookHandlerImpl stripeWebhookHandlerImpl = new StripeWebhookHandlerImpl();
			Contact contact = stripeWebhookHandlerImpl.getContactFromOurDomain();
			email = contact.getContactFieldValue(contact.EMAIL);
				
		    //Contact contact = ContactUtil.searchContactByEmail(email);

		    Boolean newContact = false;
		    List<ContactField> contactProperties = new ArrayList<ContactField>();
		    if (contact == null)
		    {
			newContact = true;
			contact = new Contact();
			if (!(StringUtils.isBlank(email) || StringUtils.equals(email, "null")))
			    contactProperties.add(new ContactField(Contact.EMAIL, email, null));
		    }

		    JSONObject agileJson = getAgileJson(stripeEventJson);
		    Iterator<?> keys = agileJson.keys();
		    while (keys.hasNext())
		    {
			String key = (String) keys.next();
			String value = agileJson.getString(key);
			contactProperties.add(new ContactField(key, value, null));
		    }

		    DomainUser user = APIKey.getDomainUserRelatedToAPIKey(apiKey);
		    if (user != null)
		    {
			System.out.println("user is " + user);
			UserInfo userInfo = new UserInfo("agilecrm.com", user.email, user.name);
			SessionManager.set(userInfo);

			String stripeFieldValue = null;
			Widget widget = WidgetUtil.getWidget("Stripe");
			if (widget != null)
			{
			    try
			    {
				JSONObject stripePrefs = new JSONObject(widget.prefs);
				if (stripePrefs.has("stripe_field_name"))
				{
				    stripeFieldValue = stripePrefs.getString("stripe_field_name");
				    System.out.println("stripe field name is " + stripeFieldValue);
				}
			    }
			    catch (Exception e)
			    {
				e.printStackTrace();
			    }
			}

			if (!(StringUtils.equals(getCustomerId(stripeJson, eventType), "null") || StringUtils
			        .isBlank(getCustomerId(stripeJson, eventType))))
			{
			    ContactField field = new ContactField();
			    field.type = FieldType.CUSTOM;
			    field.value = getCustomerId(stripeJson, eventType);
			    if (stripeFieldValue != null && !stripeFieldValue.isEmpty())
				field.name = stripeFieldValue;
			    else
				field.name = "StripeID";
			    contactProperties.add(field);
			}
		    }

		    if (contact.properties.isEmpty())
			contact.properties = contactProperties;
		    else
			contact.properties = updateAgileContactProperties(contact.properties, contactProperties);

		    contact.setContactOwner(owner);
		    contact.save();

		    if (getTriggerRunResult(newContact, trigger))
		    {
			System.out.println("Assigning campaign to contact ... ");
			WorkflowSubscribeUtil.subscribeDeferred(contact, trigger.campaign_id,
			        new JSONObject().put("stripe", getStripeJSONForTrigger(stripeJson)));
		    }
		}
	    }
	    return;
	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}
    }

    public JSONObject getAgileJson(JSONObject json) throws JSONException
    {
	JSONObject agileJson = new JSONObject();
	JSONObject agileAddress = new JSONObject();
	String address = new String();

	Iterator<?> keys = json.keys();
	while (keys.hasNext())
	{
	    String key = (String) keys.next();
	    String value = json.getString(key);

	    if (!(StringUtils.isBlank(value) || StringUtils.equals(value, "null")))
	    {
		switch (key)
		{
		case "name":
		    if (value.contains(" "))
		    {
			agileJson.put(Contact.FIRST_NAME, value.split(" ")[0].toString());
			agileJson.put(Contact.LAST_NAME, value.split(" ")[1].toString());
		    }
		    else
			agileJson.put(Contact.FIRST_NAME, value);
		    break;
		case "address_line1":
		case "address_line2":
		    address = (StringUtils.isBlank(address)) ? value : address + ", " + value;
		    break;
		case "address_city":
		case "address_state":
		case "address_country":
		case "address_zip":
		    agileAddress.put(key.split("_")[1].toString(), value);
		    break;
		default:
		    break;
		}
	    }
	}
	if (!StringUtils.isBlank(address))
	    agileAddress.put("address", address);

	if (!StringUtils.isBlank(agileAddress.toString()))
	    agileJson.put(Contact.ADDRESS, agileAddress);

	return agileJson;
    }

    public List<ContactField> updateAgileContactProperties(List<ContactField> oldProperties,
	    List<ContactField> newProperties)
    {
	List<ContactField> outDatedProperties = new ArrayList<ContactField>();

	for (ContactField oldProperty : oldProperties)
	    for (ContactField newProperty : newProperties)
		if (StringUtils.equals(oldProperty.name, newProperty.name)
		        && StringUtils.equals(oldProperty.subtype, newProperty.subtype))
		    outDatedProperties.add(oldProperty);

	oldProperties.removeAll(outDatedProperties);
	newProperties.addAll(oldProperties);
	return newProperties;
    }

    public JSONObject getStripeEventJson(JSONObject stripeJson, String stripeEventType)
    {
	try
	{
	    JSONObject cJson = new JSONObject();

	    if (stripeEventType.contains("charge"))
		cJson = stripeJson.getJSONObject("data").getJSONObject("object").getJSONObject("card");
	    else if (stripeEventType.contains("customer"))
		cJson = getDefaultCustomerCard(stripeJson);

	    return cJson;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public String getStripeEmail(JSONObject stripeJson, String stripeEventType)
    {
	try
	{
	    String stripeEmail = new String();

	    if (stripeEventType.contains("charge"))
		stripeEmail = stripeJson.getJSONObject("data").getJSONObject("object").getString("receipt_email");
	    else if (stripeEventType.contains("customer"))
		stripeEmail = stripeJson.getJSONObject("data").getJSONObject("object").getString("email");

	    return stripeEmail;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public JSONObject getDefaultCustomerCard(JSONObject stripeJson)
    {
	try
	{
	    String defaultCardId = stripeJson.getJSONObject("data").getJSONObject("object").getString("default_card");
	    if (!StringUtils.equals(defaultCardId, "null"))
	    {
		JSONArray customerCards = stripeJson.getJSONObject("data").getJSONObject("object")
		        .getJSONObject("cards").getJSONArray("data");
		for (int i = 0; i < customerCards.length(); i++)
		{
		    JSONObject customerCard = customerCards.getJSONObject(i);
		    if (StringUtils.equals(defaultCardId, customerCard.getString("id")))
		    {
			return customerCard;
		    }
		}
	    }
	    return null;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public String getCustomerId(JSONObject stripeJson, String stripeEventType)
    {
	String customerId = null;
	try
	{
	    if (stripeEventType.contains("charge"))
		customerId = stripeJson.getJSONObject("data").getJSONObject("object").getJSONObject("card")
		        .getString("customer");
	    else if (stripeEventType.contains("customer"))
	    {
		JSONObject defaultCard = getDefaultCustomerCard(stripeJson);
		customerId = defaultCard.getString("customer");
	    }
	    return customerId;
	}
	catch (Exception e)
	{
	    return null;
	}
    }

    public JSONObject getStripeJSONForTrigger(JSONObject stripeJSON)
    {
	JSONObject stripeTriggerJSON = null;

	try
	{
	    if (stripeJSON == null)
		return null;

	    if (stripeJSON.has("data"))
	    {
		JSONObject data = stripeJSON.getJSONObject("data");

		if (data.has("object"))
		    stripeTriggerJSON = data.getJSONObject("object");
	    }

	    if (stripeTriggerJSON != null)
		stripeTriggerJSON.put("type", stripeJSON.getString("type"));

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while getting stripe trigger json..." + e.getMessage());
	}

	return stripeTriggerJSON;
    }

    public Boolean getTriggerRunResult(Boolean newContact, Trigger trigger)
    {
	return (newContact || !TriggerUtil.getTriggerRunStatus(trigger));
    }
}