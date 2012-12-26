package com.agilecrm.activities.deferred;

import java.util.List;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.core.DomainUser;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.Util;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

/**
 * <code>TaskReminderDeferredTask</code> implements google appengene's
 * DeferredTask interface and overrides it's run method to send daily reminder
 * (an email) about the pending tasks.
 * 
 * @author Rammohan
 * 
 */
@SuppressWarnings("serial")
public class TaskRemainderDeferredTask implements DeferredTask
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
    public TaskRemainderDeferredTask(String domain)
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
	List<DomainUser> domainUsers = DomainUserUtil.getUsers(domain);
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
		    new Key<AgileUser>(AgileUser.class, agileUser.id));

	    if (taskList == null)
		continue;

	    Util.sendMail("test@example.com", "Ram", domainUser.email,
		    "Task Reminder", "test@example.com", "html", null);
	}
    }
}
