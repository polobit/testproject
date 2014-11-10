package com.agilecrm.activities.deferred;

import java.io.IOException;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.EventReminder;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.util.IcalendarUtil;
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

    /**
     * Default constructor, assigns domain name
     * 
     * @param domain
     *            name as string
     */
    public SendEventReminderDeferredTask(String domain, String useremail, String username, String eventname,
	    String priority, Long starttime, Long endtime)
    {
	this.domain = domain;
	this.useremail = useremail;
	this.username = username;
	this.eventname = eventname;
	this.priority = priority;
	this.starttime = starttime;
	this.endtime = endtime;

    }

    /**
     * Fetches all the domain users within the domain and send email to those
     * users having due tasks of that day, if that user activates to receive
     * emails.
     * 
     **/
    public void run()
    {

	try
	{

	    String subject = "Event Reminder:" + eventname;

	    JSONObject pubnub_notification = new JSONObject();
	    pubnub_notification.put("title", eventname);
	    pubnub_notification.put("start", starttime);
	    pubnub_notification.put("end", endtime);
	    pubnub_notification.put("priority", priority);
	    pubnub_notification.put("username", username);
	    pubnub_notification.put("useremail", useremail);

	    Event event = EventUtil.getSampleEvent();
	    if (event != null)
	    {
		event.start = starttime;
		event.end = endtime;
		event.title = eventname;
		net.fortuna.ical4j.model.Calendar agileUseiCal = IcalendarUtil.getICalFromEvent(event, null, useremail,
		        username);
		System.out.println("agileUseiCal-- " + agileUseiCal.toString());
		String[] attachments_to_agile_user = { "text/calendar", "mycalendar.ics", agileUseiCal.toString() };
		if (!("jagadeeshs.agile@gmail.com").equals(useremail))
		{
		    EmailGatewayUtil.sendEmail(null, "noreply@agilecrm.com", "Agile CRM", useremail, null, null,
			    subject, null, null, null, null, attachments_to_agile_user);
		    PubNub.pubNubPush(domain, pubnub_notification);
		}
		else
		{
		    EmailGatewayUtil.sendEmail(null, "noreply@agilecrm.com", "Agile CRM", useremail, null, null,
			    subject, null, null, null, null, attachments_to_agile_user);
		}
	    }

	    EventReminder.getEventReminder(domain, starttime);

	}
	catch (JSONException | IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    try
	    {
		EventReminder.getEventReminder(domain, starttime);
	    }
	    catch (IOException e1)
	    {
		// TODO Auto-generated catch block
		e1.printStackTrace();
	    }
	}

    }
}
