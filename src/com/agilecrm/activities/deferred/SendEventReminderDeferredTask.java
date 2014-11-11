package com.agilecrm.activities.deferred;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.type.TypeReference;
import org.json.JSONObject;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.EventReminder;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.PubNub;

@SuppressWarnings("serial")
public class SendEventReminderDeferredTask implements DeferredTask
{
    /**
     * Stores name of the domain
     */
    String domain = null;
    String useremail = null;
    String username = null;
    String eventname = null;
    String priority = null;
    Long starttime = null;
    Long endtime = null;
    boolean nosampleevent = false;

    /**
     * Default constructor, assigns domain name
     * 
     * @param domain
     *            name as string
     */
    public SendEventReminderDeferredTask(String domain, Long starttime, boolean nosampleevent)
    {
	this.domain = domain;
	this.starttime = starttime;
	this.nosampleevent = nosampleevent;

    }

    /**
     * Fetches all the domain users within the domain and send email to those
     * users having due tasks of that day, if that user activates to receive
     * emails.
     * 
     **/
    public void run()
    {

	List<Event> eventList = EventUtil.getLatestWithSameStartTime(starttime);
	try
	{
	    if (eventList != null && eventList.size() > 0 && nosampleevent)
	    {
		for (int i = 0; i <= eventList.size() - 1; i++)
		{

		    DomainUser domainuser = null;
		    try
		    {
			domainuser = eventList.get(i).getOwner();
		    }
		    catch (Exception e1)
		    {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		    }

		    AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainuser.id);

		    if (agileUser == null)
			continue;
		    List<Event> listobj = new ArrayList<>();
		    listobj.add(eventList.get(i));

		    Event event = eventList.get(i);

		    JSONObject pubnub_notification = new JSONObject();
		    pubnub_notification.put("title", event.title);
		    pubnub_notification.put("start", event.start);
		    pubnub_notification.put("end", event.end);
		    pubnub_notification.put("priority", event.color);
		    pubnub_notification.put("username", domainuser.name);
		    pubnub_notification.put("useremail", domainuser.email);
		    pubnub_notification.put("type", "CALENDER_REMINDER");

		    PubNub.pubNubPush(domain, pubnub_notification);

		    UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);

		    if (!userPrefs.event_reminder)
			continue;

		    List<Map<String, Object>> eventListMap = null;

		    try
		    {
			eventListMap = new ObjectMapper().readValue(new ObjectMapper().writeValueAsString(listobj),
			        new TypeReference<List<HashMap<String, Object>>>()
			        {
			        });
		    }
		    catch (Exception e)
		    {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("events", eventList);

			String subject = "Exception occured afetr event List map at 122 in event notification and domain "
			        + domain;
			String body = "exception occured due to " + e.getMessage();

			ContactEmailUtil.saveContactEmailAndSend("noreply@agilecrm.com", "Agile CRM",
			        "jagadeesh@invox.com", null, null, subject, body, "-", null, false);
			EventReminder.getEventReminder(domain, starttime);
		    }
		    Map<String, Object> currentEvent = eventListMap.get(0);
		    List<Contact> contactList = eventList.get(i).getContacts();
		    List<Map<String, Object>> contactListMap = new ArrayList<Map<String, Object>>();
		    for (Contact contact : contactList)
		    {
			Map<String, Object> mapContact = new HashMap<String, Object>();

			for (ContactField contactField : contact.properties)
			    mapContact.put(contactField.name, contactField);

			mapContact.put("id", String.valueOf(contact.id));
			// save id of this contact for href

			contactListMap.add(mapContact);

		    }
		    currentEvent.put("related_contacts", contactListMap);
		    HashMap<String, Object> map = new HashMap<String, Object>();
		    map.put("events", eventListMap);

		    // Sends mail to the domain user.
		    SendMail.sendMail(domainuser.email, SendMail.START_EVENT_REMINDER_SUBJECT,
			    SendMail.START_EVENT_REMINDER, map);
		}
	    }

	    EventReminder.getEventReminder(domain, starttime);
	}

	catch (Exception e)
	{
	    String subject = "Exception occured in last catch block in send event reminder event notification and domain "
		    + domain;
	    String body = "exception occured due to " + e.getMessage();

	    ContactEmailUtil.saveContactEmailAndSend("noreply@agilecrm.com", "Agile CRM", "jagadeesh@invox.com", null,
		    null, subject, body, "-", null, false);

	}

    }
}
