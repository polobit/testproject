package com.agilecrm.activities;

import java.io.IOException;

import com.agilecrm.activities.deferred.TaskReminderDeferredTask;
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
 * @author Jagadeesh
 * 
 */
public class TaskReminder
{
    public static void sendDailyTaskReminders(String domain, Long time, Long domainuserid, String timezone,
	    String user_email) throws IOException
    {
	System.out.println(time + " time in task reminder deferred task ----------------");
	// Start a task queue for each domain
	TaskReminderDeferredTask taskReminderDeferredTask = new TaskReminderDeferredTask(domain, time, domainuserid,
	        timezone, user_email);
	Queue queue = QueueFactory.getQueue("due-task-reminder");

	TaskOptions options = TaskOptions.Builder.withPayload(taskReminderDeferredTask);
	options.etaMillis(time * 1000);
	queue.add(options);
    }

}