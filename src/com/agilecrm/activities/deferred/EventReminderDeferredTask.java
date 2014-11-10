package com.agilecrm.activities.deferred;

import java.io.IOException;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.SendEventReminder;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.user.DomainUser;
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

	event = EventUtil.getLatestEvent(starttime);

	if (event == null)
	{
	    try
	    {
		SendEventReminder.sendEventReminders(domain, "jagadeeshs.agile@gmail.com", "jagadeesh",
		        "noevents in this session and domain name " + domain, "Normal",
		        (System.currentTimeMillis() / 1000) + 1200, System.currentTimeMillis() / 1000);

	    }
	    catch (Exception e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
	    }
	}
	else
	{

	    try
	    {

		DomainUser user = event.getOwner();
		String useremail = user.email;
		String username = user.name;
		String eventname = event.title;
		String priority = event.color;
		Long starttime = event.start;
		Long endtime = event.end;

		SendEventReminder.sendEventReminders(domain, useremail, username, eventname, priority, starttime,
		        endtime);
	    }
	    catch (Exception e)
	    {
		// TODO Auto-generated catch block
		e.printStackTrace();
		try
		{
		    SendEventReminder.sendEventReminders(domain, "jagadeeshs.agile@gmail.com", "jagadeesh",
			    "noevents in this session and domain name " + domain, "Normal",
			    (System.currentTimeMillis() / 1000) + 1200, System.currentTimeMillis() / 1000);
		}
		catch (IOException e1)
		{
		    // TODO Auto-generated catch block
		    e1.printStackTrace();
		}

	    }

	}

    }
}
