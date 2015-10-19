package com.agilecrm.activities.deferred;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.List;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.SendEventReminder;
import com.agilecrm.activities.util.EventUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TransientFailureException;
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

	catch (TransientFailureException tfe)
	{
	    Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "event-reminder-failure",
		    "jagadeesh@invox.com", null, null, " transiant exception EventReminderDeferredTask " + domain,
		    null, "exception occured in event reminder deferred task", null, null, null, null);
	    EventReminderDeferredTask eventReminderDeferredTask = new EventReminderDeferredTask(domain, starttime - 120);
	    Queue queue = QueueFactory.getQueue("event-notifier");
	    TaskOptions options = TaskOptions.Builder.withPayload(eventReminderDeferredTask);
	    options.countdownMillis(20000);
	    queue.add(options);
	    return;

	}

	catch (Exception e)
	{
	    String subject = "Exception occured at eventreminderdeferredtask   " + domain + " "
		    + System.currentTimeMillis() / 1000;
	    String body = "   e.getmessage " + e.getMessage();
	    try
	    {
		StringWriter errors = new StringWriter();
		e.printStackTrace(new PrintWriter(errors));
		String errorString = errors.toString();

		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "event-reminder-failure",
		        "jagadeesh@invox.com", null, null, subject, null, errorString + body, null, null, null, null);
	    }
	    catch (Exception ex)
	    {
		Mandrill.sendMail("vVC_RtuNFH_5A99TEWXPmA", true, "noreplay@agilecrm.com", "event-reminder-failure",
		        "jagadeesh@invox.com", null, null, "exception occured while sending mail " + domain, null,
		        "exception occured in event reminder deferred task", null, null, null, null);
		ex.printStackTrace();
		System.err.println("Exception occured while sending event notification status mail " + e.getMessage());
	    }

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
