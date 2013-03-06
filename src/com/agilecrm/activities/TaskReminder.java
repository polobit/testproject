package com.agilecrm.activities;

import java.io.IOException;
import java.util.Set;

import com.agilecrm.activities.deferred.TaskReminderDeferredTask;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.util.Util;
import com.google.appengine.api.NamespaceManager;
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
public class TaskReminder
{
    public static void dailyTaskReminder() throws IOException
    {
	Set<String> domains = NamespaceUtil.getAllNamespaces();

	for (String domain : domains)
	{
	    NamespaceManager.set(domain);

	    TaskReminderDeferredTask taskReminderDeferredTask = new TaskReminderDeferredTask(
		    domain);
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.add(TaskOptions.Builder.withPayload(taskReminderDeferredTask));
	}
    }
}
