package com.agilecrm.activities.deferred;

import java.io.PrintWriter;
import java.io.StringWriter;
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
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TransientFailureException;
import com.thirdparty.PubNub;
import com.thirdparty.mandrill.Mandrill;

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

	System.out.println("in sendEVentReminderDeferredTask Namespace " + NamespaceManager.get());

	System.out.println("in sendEVentReminderDeferredTask Domain " + domain);

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

		    catch (TransientFailureException tfe)
		    {
			Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com",
			        "event-reminder-failure", "jagadeesh@invox.com", null, null, "exception occured "
			                + domain, null,
			        "exception occured transient failure exception send event reminder deferred task",
			        null, null);

			EventReminderDeferredTask eventReminderDeferredTask = new EventReminderDeferredTask(domain,
			        starttime);
			Queue queue = QueueFactory.getQueue("event-notifier");
			TaskOptions options = TaskOptions.Builder.withPayload(eventReminderDeferredTask);
			options.countdownMillis(40000);
			queue.add(options);
		    }

		    catch (Exception e1)
		    {
			// TODO Auto-generated catch block
			String subject = "Exception occured at after fetching domain user " + domain + " "
			        + System.currentTimeMillis() / 1000;
			String body = "  e.getmessage " + e1.getMessage();

			try
			{
			    StringWriter errors = new StringWriter();
			    e1.printStackTrace(new PrintWriter(errors));
			    String errorString = errors.toString();

			    Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com",
				    "event-reminder-failure", "jagadeesh@invox.com", null, null, subject, null,
				    errorString + body, null, null);
			}
			catch (Exception ex)
			{
			    Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com",
				    "event-reminder-failure", "jagadeesh@invox.com", null, null,
				    "exception occured while sending mail " + domain, null,
				    "exception occured in send event reminder deferred task", null, null);

			    ex.printStackTrace();
			    System.err.println("Exception occured while sending campaign status mail "
				    + e1.getMessage());
			}
			finally
			{
			    EventReminder.getEventReminder(domain, starttime);
			    return;
			}
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
		    System.out.println("domain name before pubnubnotification " + domain);
		    System.out.println("namespace manager name before sending pubnub " + NamespaceManager.get());

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

		    catch (TransientFailureException tfe)
		    {
			Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com",
			        "event-reminder-failure", "jagadeesh@invox.com", null, null, "exception occured "
			                + domain, null,
			        "exception occured transient failure exception send event reminder deferred task",
			        null, null);

			EventReminderDeferredTask eventReminderDeferredTask = new EventReminderDeferredTask(domain,
			        starttime);
			Queue queue = QueueFactory.getQueue("event-notifier");
			TaskOptions options = TaskOptions.Builder.withPayload(eventReminderDeferredTask);
			options.countdownMillis(20000);
			queue.add(options);
		    }

		    catch (Exception e)
		    {

			String subject = "Exception occured at EventListMap  domain  " + domain + " "
			        + System.currentTimeMillis() / 1000;
			String body = "  e.getmessage" + e.getMessage();

			try
			{
			    StringWriter errors = new StringWriter();
			    e.printStackTrace(new PrintWriter(errors));
			    String errorString = errors.toString();

			    Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com",
				    "event-reminder-failure", "jagadeesh@invox.com", null, null, subject, null,
				    errorString + body, null, null);
			}
			catch (Exception ex)
			{
			    Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com",
				    "event-reminder-failure", "jagadeesh@invox.com", null, null,
				    "exception occured while sending mail " + domain, null,
				    "exception occured in send event reminder deferred task", null, null);
			    ex.printStackTrace();
			    System.err.println("Exception occured while sending event notification mail "
				    + e.getMessage());
			}
			finally
			{
			    EventReminder.getEventReminder(domain, starttime);
			    return;
			}
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
		    if (contactList != null && contactList.size() > 0)
		    {
			currentEvent.put("related", true);
		    }

		    HashMap<String, Object> map = new HashMap<String, Object>();
		    map.put("events", eventListMap);

		    // Sends mail to the domain user.
		    SendMail.sendMail("maildummy800@gmail.com", "Event Reminder: " + event.title + "@" + event.date
			    + " domain name " + domain, SendMail.START_EVENT_REMINDER, map);
		}
	    }

	    EventReminder.getEventReminder(domain, starttime);
	}

	catch (TransientFailureException tfe)
	{
	    Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "event-reminder-failure",
		    "jagadeesh@invox.com", null, null, "exception occured " + domain, null,
		    "exception occured transient failure exception send event reminder deferred task", null, null);

	    EventReminderDeferredTask eventReminderDeferredTask = new EventReminderDeferredTask(domain, starttime);
	    Queue queue = QueueFactory.getQueue("event-notifier");
	    TaskOptions options = TaskOptions.Builder.withPayload(eventReminderDeferredTask);
	    options.countdownMillis(20000);
	    queue.add(options);
	}

	catch (Exception e)
	{
	    String subject = "Exception occured at last domain " + domain + " " + System.currentTimeMillis() / 1000;
	    String body = "  e.getMessage " + e.getMessage();

	    try
	    {
		StringWriter errors = new StringWriter();
		e.printStackTrace(new PrintWriter(errors));
		String errorString = errors.toString();

		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "event-reminder-failure",
		        "jagadeesh@invox.com", null, null, subject, null, errorString + body, null, null);
	    }
	    catch (Exception ex)
	    {
		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "event-reminder-failure",
		        "jagadeesh@invox.com", null, null, "exception occured while sending mail " + domain, null,
		        "exception occured in send event reminder deferred task", null, null);
		ex.printStackTrace();
		System.err.println("Exception occured while sending event notification mail " + e.getMessage());
	    }

	}

    }
}
