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

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Runnable#run()
     */
    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(domain);

	try
	{
	    List<DomainUser> domainUsers = DomainUserUtil.getUsers(domain);

	    System.out
		    .println("List of Domain Users in DeferredTask of TaskReminder "
			    + domainUsers);

	    System.out.println("Namespace in deferred task "
		    + NamespaceManager.get());

	    if (domainUsers == null)
		return;

	    for (DomainUser domainUser : domainUsers)
	    {
		AgileUser agileUser = AgileUser
			.getCurrentAgileUserFromDomainUser(domainUser.id);

		if (agileUser == null)
		    continue;

		UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);

		if (!userPrefs.task_reminder)
		    continue;

		List<Task> taskList = TaskUtil.getPendingTasksToRemind(1,
			domainUser.id);

		if (taskList.isEmpty())
		    continue;

		String date = null;

		// Changes time in milliseconds to Date format.
		for (Task task : taskList)
		{
		    date = SearchUtil
			    .getDateWithoutTimeComponent(task.due * 1000);
		    break;
		}

		HashMap map = new HashMap();
		map.put("tasks", taskList);
		map.put("due_date", date);

		SendMail.sendMail(domainUser.email,
			SendMail.DUE_TASK_REMINDER_SUBJECT,
			SendMail.DUE_TASK_REMINDER, map);
	    }

	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
