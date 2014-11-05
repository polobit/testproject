package com.agilecrm.activities.deferred;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.EventReminder;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>TaskReminderDeferredTask</code> implements google appengene's
 * DeferredTask interface and overrides it's run method to send daily reminder
 * (an email) about the pending tasks.
 * 
 * @author Rammohan
 * 
 */
@SuppressWarnings("serial")
public class EventReminderDeferredTask implements DeferredTask
{

    /**
     * Stores name of the domain
     */
    String domain = null;

    /**
     * Default constructor, assigns domain name
     * 
     * @param domain
     *            name as string
     */
    public EventReminderDeferredTask(String domain)
    {
	this.domain = domain;
    }

    /**
     * Fetches all the domain users within the domain and send email to those
     * users having due tasks of that day, if that user activates to receive
     * emails.
     * 
     **/
    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(domain);

	try
	{
	    // Get all domain users of that domain.
	    List<DomainUser> domainUsers = DomainUserUtil.getUsers(domain);

	    if (domainUsers == null)
		return;

	    // Iterates over domain users to fetch due tasks of each user.
	    for (DomainUser domainUser : domainUsers)
	    {
		// Gets agileUser with respect to domain-user id to fetch
		// UserPrefs.
		AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);

		if (agileUser == null)
		    continue;

		// Returns the due tasks of that day.

		List<Event> eventList = EventUtil.getEventsStartingInNextFifteenMinutes(agileUser.id);

		if (eventList.isEmpty())
		    continue;

		// Task stored as map like
		// map{"property":"value","property2":"value2",...}
		List<Map<String, Object>> eventListMap = null;

		try
		{
		    eventListMap = new ObjectMapper().readValue(new ObjectMapper().writeValueAsString(eventList),
			    new TypeReference<List<HashMap<String, Object>>>()
			    {
			    });
		}
		catch (Exception e)
		{
		    HashMap<String, Object> map = new HashMap<String, Object>();
		    map.put("events", eventList);

		    // Sends mail to the domain user.
		    SendMail.sendMail(domainUser.email, SendMail.DUE_TASK_REMINDER_SUBJECT, SendMail.DUE_TASK_REMINDER,
			    map);
		}

		for (int i = 0; i < eventList.size(); ++i)
		{
		    Map<String, Object> currentEvent = eventListMap.get(i);
		    List<Contact> contactList = eventList.get(i).getContacts();
		    List<Map<String, Object>> contactListMap = new ArrayList<Map<String, Object>>();

		    // for each Contact add ContactField in ContactField.name
		    // property.So like
		    // {'FIRST_NAME':contactField1,'LAST_NAME':contactField2...}
		    for (Contact contact : contactList)
		    {
			Map<String, Object> mapContact = new HashMap<String, Object>();

			for (ContactField contactField : contact.properties)
			    mapContact.put(contactField.name, contactField);

			mapContact.put("id", String.valueOf(contact.id));
			// save id of this contact for href

			contactListMap.add(mapContact);
		    }

		    // each task has related_contacts as
		    // [<contact1-map:<contact1.contactField.name:contact1.contactField>,<contact2-map>...]
		    currentEvent.put("related_contacts", contactListMap);
		}

		// Due tasks map
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("events", eventListMap);

		// Sends mail to the domain user.
		SendMail.sendMail(domainUser.email, SendMail.DUE_TASK_REMINDER_SUBJECT, SendMail.DUE_TASK_REMINDER, map);
	    }
	    // need tosend pubnub notification

	    try
	    {
		EventReminder.sendEventReminders(domain);
	    }
	    catch (IOException e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }
}
