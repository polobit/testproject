package com.agilecrm.activities;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.core.DomainUser;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.util.Util;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

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
@SuppressWarnings("serial")
public class TaskReminderServlet extends HttpServlet
{
    public void service(HttpServletRequest req, HttpServletResponse res)
	    throws IOException
    {
	res.setContentType("text/plain;charset=UTF-8");

	Set<String> domainsSet = Util.getAllNamespaces();

	for (String domain : domainsSet)
	{

	    NamespaceManager.set(domain);

	    List<DomainUser> domainList = DomainUser.getUsers(domain);
	    for (DomainUser domainUser : domainList)
	    {
		AgileUser agileUser = AgileUser
			.getCurrentAgileUserFromDomainUser(domainUser.id);

		if (agileUser != null)
		{
		    UserPrefs userPrefs = UserPrefs.getUserPrefs(agileUser);

		    if (userPrefs.task_reminder)
		    {
			List<Task> taskList = TaskUtil.getPendingTasksToRemind(
				1, new Key<AgileUser>(AgileUser.class,
					agileUser.id));

			if (taskList != null)
			    Util.sendMail("test@example.com", "Ram",
				    domainUser.email, "Task Reminder",
				    "test@example.com", "html", null);
		    }
		}
	    }
	}
    }
}
