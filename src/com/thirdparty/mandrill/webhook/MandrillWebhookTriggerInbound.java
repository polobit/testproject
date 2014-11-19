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

		    String fromEmail = message.getString("from_email");
		    String fromName = message.getString("from_name");

		    Contact contact = buildContact(fromName, fromEmail);
		    if (contact == null)
		    {
			// response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return;
		    }

		    System.out.println("saving contact");
		    contact.setContactOwner(owner);
		    contact.save();

		    List<Trigger> triggers = TriggerUtil.getAllTriggers();
		    for (Trigger trigger : triggers)
		    {
			if (StringUtils.equals(trigger.type.toString(), INBOUND_MAIL_EVENT))
			{
			    System.out.println("assigning campaign to contact");
			    WorkflowSubscribeUtil.subscribe(contact, trigger.id);
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

    public JSONObject getSenderNames(String fromName, String fromEmail) throws JSONException
    {
	JSONObject from = new JSONObject();
	if (!(StringUtils.isBlank(fromName) || StringUtils.equals(fromName, "null")))
	{
	    if (StringUtils.contains(fromName, " "))
	    {
		from.put(Contact.FIRST_NAME, fromName.split(" ")[0]);
		from.put(Contact.LAST_NAME, fromName.split(" ")[1]);
	    }
	    else
		from.put(Contact.FIRST_NAME, fromName);
	}
	else
	    from.put(Contact.FIRST_NAME, fromEmail.split("@")[0]);
	return from;
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

    public Contact buildContact(String fromName, String fromEmail)
    {
	if (StringUtils.isBlank(fromEmail) || StringUtils.equals(fromEmail, "null"))
	    return null;

	Contact contact = ContactUtil.searchContactByEmail(fromEmail);
	if (contact == null)
	{
	    contact = new Contact();
	    List<ContactField> properties = new ArrayList<ContactField>();
	    properties.add(new ContactField(Contact.EMAIL, fromEmail, null));
	    try
	    {
		JSONObject from = getSenderNames(fromName, fromEmail);
		if (from.has(Contact.FIRST_NAME))
		    properties.add(new ContactField(Contact.FIRST_NAME, from.getString(Contact.FIRST_NAME), null));
		if (from.has(Contact.LAST_NAME))
		    properties.add(new ContactField(Contact.LAST_NAME, from.getString(Contact.LAST_NAME), null));

		contact.properties = properties;
		return contact;
	    }
	    catch (JSONException e)
	    {
		return null;
	    }
	}
	else
	    return null;

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
	    if (!StringUtils.isBlank(message.getString("email")) && !isNotAgileEmail(message.getString("email")))
		return message.getString("email");

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