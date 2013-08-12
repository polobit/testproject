package com.agilecrm.activities.deferred;

import java.util.HashMap;
import java.util.List;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.search.util.SearchUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.email.SendMail;
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
public class TaskReminderDeferredTask implements DeferredTask
{

    /**
     * Stores name of the domain
     */
    String domain = null;

    /**
     * Default constructor, assigns domain name
     * 
     * @param domain
     *            name as string
     */
    public TaskReminderDeferredTask(String domain)
    {
	this.domain = domain;
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

	try
	{
	    // Get all domain users of that domain.
	    List<DomainUser> domainUsers = DomainUserUtil.getUsers(domain);

	    if (domainUsers == null)
		return;

	    // Iterates over domain users to fetch due tasks of each user.
	    for (DomainUser domainUser : domainUsers)
	    {
		// Gets agileUser with respect to domain-user id to fetch
		// UserPrefs.
		AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);

		if (agileUser == null)
		    continue;

		UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);

		// if user did not set to receive due tasks email, proceed to
		// next user.
		if (!userPrefs.task_reminder)
		    continue;

		// Returns the due tasks of that day.
		List<Task> taskList = TaskUtil.getPendingTasksToRemind(1, domainUser.id);

		if (taskList.isEmpty())
		    continue;

		String date = null;

		// Changes time in milliseconds to Date format.
		for (Task task : taskList)
		{
		    date = SearchUtil.getDateWithoutTimeComponent(task.due * 1000);
		    break;
		}

		// Due tasks map
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("tasks", taskList);

		// Sends mail to the domain user.
		SendMail.sendMail(domainUser.email, SendMail.DUE_TASK_REMINDER_SUBJECT, SendMail.DUE_TASK_REMINDER, map);
	    }

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
