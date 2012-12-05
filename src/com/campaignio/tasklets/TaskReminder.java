package com.campaignio.tasklets;

import java.io.IOException;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.core.DomainUser;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.util.Util;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

public class TaskReminder extends HttpServlet
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
