package com.agilecrm.activities;

import java.io.IOException;

import com.agilecrm.activities.deferred.EventReminderDeferredTask;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>TaskReminder</code> class sends daily reminder (email) about the
 * pending tasks of that particular day to each "domain-user", if task reminder
 * is activated in user-prefs of the domain-user.
 * 
 * <p>
 * This class implements {@link Util} class to get, set of all the domains and
 * {@link DomainUser} to get list of domain users a particular domain. Also
 * implements {@link AgileUser} and {@link UserPrefs} to get the related
 * information (like task_reminder is activated or not etc..) of the domain
 * user.
 * </p>
 * 
 * @author Rammohan
 * 
 */
public class EventReminder
{
    public static void sendEventReminders(String domain) throws IOException
    {

	// Get Namespaces / domains

	EventReminderDeferredTask eventReminderDeferredTask = new EventReminderDeferredTask(domain);
	Queue queue = QueueFactory.getQueue("event-reminder");
	TaskOptions options = TaskOptions.Builder.withPayload(eventReminderDeferredTask);
	options.countdownMillis(100000l);
	queue.add(TaskOptions.Builder.withPayload(eventReminderDeferredTask));

    }
}