package com.thirdparty.mandrill.webhook;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

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
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class MandrillWebhookTriggerInbound extends HttpServlet
{
    public enum AgileDetail
    {
	API_KEY, DOMAIN;
    }

    public static final String INBOUND_MAIL_EVENT = "INBOUND_MAIL_EVENT";

    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	String oldNamespace = NamespaceManager.get();
	try
	{
	    String mandrillEvents = request.getParameter("mandrill_events");
	    System.out.println("mandrill events parameter is " + mandrillEvents);
	    if (StringUtils.isBlank(mandrillEvents))
	    {
		// response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
		return;
	    }

	    JSONArray events = new JSONArray(mandrillEvents);
	    for (int i = 0; i < events.length(); i++)
	    {
		JSONObject event = events.getJSONObject(i);
		System.out.println("event json is " + event);

		if (event.has("event") && StringUtils.equals(event.getString("event"), "inbound"))
		{
		    JSONObject message = event.getJSONObject("msg");
		    System.out.println("email message is " + message);
		    if (message == null)
		    {
			// response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			continue;
		    }
		    String agileEmail = getAgileEmail(message);
		    String apiKey = getAgileDetail(agileEmail, AgileDetail.API_KEY);
		    String agileDomain = getAgileDetail(agileEmail, AgileDetail.DOMAIN);

		    System.out.println("agile api key is " + apiKey);
		    System.out.println("agile special email is " + agileEmail);
		    System.out.println("agile domain is " + agileDomain);
		    if (agileEmail == null || agileDomain == null || apiKey == null)
		    {
			// response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			continue;
		    }

		    Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);
		    if (owner == null)
		    {
			// response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			continue;
		    }

		    NamespaceManager.set(agileDomain);
		    for (int j = 0; j < message.getJSONArray("to").length(); j++)
		    {
			JSONArray toRecepient = message.getJSONArray("to").getJSONArray(j);
			String recepientEmail = toRecepient.getString(0);
			String recepientName = toRecepient.getString(1);

			if (isNotAgileEmail(recepientEmail))
			{
			    Contact contact = buildContact(recepientName, recepientEmail);
			    if (contact != null)
			    {
				List<Trigger> triggers = TriggerUtil.getAllTriggers();
				for (Trigger trigger : triggers)
				{
				    if (StringUtils.equals(trigger.type.toString(), INBOUND_MAIL_EVENT)
					    && triggerConditionResult(message, trigger, recepientEmail))
				    {
					System.out.println("assigning campaign to contact");
					WorkflowSubscribeUtil.subscribe(contact, trigger.id);
				    }
				}
				System.out.println("saving contact");
				contact.setContactOwner(owner);
				contact.save();
			    }
			}
		    }
		}
	    }
	}
	catch (JSONException e)
	{
	    System.out.println("exception occured parsing mandrill events JSON " + e.getMessage());
	    // response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	    return;
	}

	NamespaceManager.set(oldNamespace);
	// response.setStatus(HttpServletResponse.SC_OK);
	return;
    }

    public List<ContactField> updateContactPropList(List<ContactField> oldProperties, List<ContactField> newProperties)
    {
	List<ContactField> outDatedProperties = new ArrayList<ContactField>();
	for (ContactField oldProperty : oldProperties)
	    for (ContactField newProperty : newProperties)
		if (StringUtils.equals(oldProperty.name, newProperty.name) && StringUtils.equals(oldProperty.subtype, newProperty.subtype))
		    outDatedProperties.add(oldProperty);
	oldProperties.removeAll(outDatedProperties);
	newProperties.addAll(oldProperties);
	return newProperties;
    }

    public JSONObject getRecepientNames(String recepientName, String recepientEmail) throws JSONException
    {
	JSONObject recepient = new JSONObject();
	if (!(StringUtils.isBlank(recepientName) || StringUtils.equals(recepientName, "null")))
	{
	    if (StringUtils.contains(recepientName, "+"))
	    {
		recepient.put(Contact.FIRST_NAME, recepientName.split("\\+")[0]);
		recepient.put(Contact.LAST_NAME, recepientName.split("\\+")[1]);
	    }
	    else
		recepient.put(Contact.FIRST_NAME, recepientName);
	}
	else
	    recepient.put(Contact.FIRST_NAME, recepientEmail.split("@")[0]);
	return recepient;
    }

    public Boolean isNotAgileEmail(String recepientEmail)
    {
	if (!StringUtils.contains(recepientEmail, "@agle.cc"))
	{
	    return true;
	}
	else
	    return false;
    }

    public Contact buildContact(String recepientName, String recepientEmail)
    {
	List<ContactField> properties = new ArrayList<ContactField>();
	properties.add(new ContactField(Contact.EMAIL, recepientEmail, null));

	try
	{
	    JSONObject recepient;
	    recepient = getRecepientNames(recepientName, recepientEmail);
	    if (recepient.has(Contact.FIRST_NAME))
		properties.add(new ContactField(Contact.FIRST_NAME, recepient.getString("first_name"), null));
	    if (recepient.has(Contact.LAST_NAME))
		properties.add(new ContactField(Contact.LAST_NAME, recepient.getString("last_name"), null));

	    Contact contact = ContactUtil.searchContactByEmail(recepientEmail);
	    if (contact == null)
		contact = new Contact();
	    contact.properties = updateContactPropList(contact.properties, properties);
	    return contact;

	}
	catch (JSONException e)
	{
	    return null;
	}
    }

    public Boolean triggerConditionResult(JSONObject message, Trigger trigger, String recepientEmail)
    {
	try
	{
	    String mailSubject = message.getString("subject");
	    System.out.println("mail subject is " + mailSubject);

	    String mailFrom = message.getString("from_email");
	    System.out.println("mail from is " + mailFrom);
	    System.out.println("mail to is " + recepientEmail);

	    if (triggerCondition(mailSubject, trigger.trigger_inbound_mail_event_subject)
		    && triggerCondition(mailFrom, trigger.trigger_inbound_mail_event_from)
		    && triggerCondition(recepientEmail, trigger.trigger_inbound_mail_event_to))
		return true;
	    else
		return false;
	}
	catch (JSONException e)
	{
	    return false;
	}
    }

    public Boolean triggerCondition(String messageData, String triggerCondition)
    {
	if (StringUtils.isBlank(triggerCondition))
	    return true;
	else if (StringUtils.equals(messageData, triggerCondition))
	    return true;
	return false;
    }

    public String getAgileEmail(JSONObject message)
    {
	try
	{
	    JSONArray allRecepients = new JSONArray();
	    if (message.has("to"))
		allRecepients.put(message.getJSONArray("to"));
	    if (message.has("cc"))
		allRecepients.put(message.getJSONArray("cc"));
	    if (message.has("bcc"))
		allRecepients.put(message.getJSONArray("bcc"));

	    for (int i = 0; i < allRecepients.length(); i++)
	    {
		System.out.println(allRecepients.getJSONArray(i));
		JSONArray recepients = allRecepients.getJSONArray(i);
		for (int j = 0; j < recepients.length(); j++)
		{
		    System.out.println(recepients.getJSONArray(j));
		    JSONArray recepient = recepients.getJSONArray(j);
		    if (!isNotAgileEmail(recepient.getString(0)))
			return recepient.getString(0);
		}
	    }
	    return null;
	}
	catch (JSONException e)
	{
	    return null;
	}
    }

    public String getAgileDetail(String agileEmail, AgileDetail detail)
    {
	try
	{
	    if (detail == AgileDetail.API_KEY)
		return agileEmail.split("@")[0].split("-")[1];
	    else if (detail == AgileDetail.DOMAIN)
		return agileEmail.split("@")[0].split("-")[0];
	    return null;
	}
	catch (Exception e)
	{
	    return null;
	}
    }
}