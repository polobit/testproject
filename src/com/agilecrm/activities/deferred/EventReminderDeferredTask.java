package com.agilecrm.activities.deferred;

import java.util.List;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.SendEventReminder;
import com.agilecrm.activities.util.EventUtil;
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
    Long starttime = null;

    /**
     * Default constructor, assigns domain name
     * 
     * @param domain
     *            name as string
     */
    public EventReminderDeferredTask(String domain, Long starttime)
    {
	this.domain = domain;
	this.starttime = starttime;
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
		starttime = (System.currentTimeMillis() / 1000) + 6400;
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
	    // TODO Auto-generated catch block
	    e.printStackTrace();

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
