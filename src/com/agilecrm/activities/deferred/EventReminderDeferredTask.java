package com.agilecrm.activities.deferred;

import java.util.List;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.SendEventReminder;
import com.agilecrm.activities.util.EventUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.thirdparty.mandrill.Mandrill;

/**
 * <code>EventReminderDeferredTask</code> implements google appengene's
 * DeferredTask interface and overrides it's run method to send event reminder
 * (an email) and pubnub notification before 10mins to event start time.
 * 
 * @author Jagadeesh
 * 
 */
@SuppressWarnings("serial")
public class EventReminderDeferredTask implements DeferredTask
{

    /**
     * Stores name of the domain
     */
    String domain = null;
    Long starttime = null;

    /**
     * 
     * @param domain
     * @param starttime
     *            fetches the evnets based on start time
     */
    public EventReminderDeferredTask(String domain, Long starttime)
    {
	this.domain = domain;
	this.starttime = starttime;
    }

    /**
     * fetches the events based on start time and send start time to
     * <SendEventReminderDeferredTask> to set ETA
     */
    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(domain);
	Event event = null;
	try
	{
	    List<Event> eventList = EventUtil.getLatestEvents(starttime);
	    if (eventList != null && eventList.size() > 0)
	    {
		event = eventList.get(0);
	    }

	    if (event == null)
	    {
		starttime = (System.currentTimeMillis() / 1000) + 3600;
		SendEventReminder.sendEventReminders(domain, starttime, false);
	    }
	    else
	    {

		Long starttime = event.start;

		SendEventReminder.sendEventReminders(domain, starttime, true);

	    }

	}
	catch (Exception e)
	{
	    String subject = "Exception occured in event reminder deferred task domain " + domain + " "
		    + System.currentTimeMillis();
	    String body = "exception occured due to " + e.getMessage();

	    Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "event-reminder-failure",
		    "jagadeesh@invox.com", null, null, subject, null, body, null, null);
	    // TODO Auto-generated catch block
	    e.printStackTrace();

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
