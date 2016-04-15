package com.agilecrm.reminder.test;

import java.io.IOException;
import java.io.Writer;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.deferred.TaskReminderDeferredTask;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;

public class TaskReminderUnitTestServlet extends HttpServlet
{

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
    {
	// TODO Auto-generated method stub

	String domain = req.getParameter("d");
	String timezone = req.getParameter("tz");

	if (StringUtils.isEmpty(domain))
	    return;

	if (StringUtils.isEmpty(timezone))
	{
	    timezone = "UTC";
	}

	List<DomainUser> domainUsers = DomainUserUtil.getUsers(domain);

	if (domainUsers == null)
	    return;

	Writer writer = resp.getWriter();
	for (DomainUser user : domainUsers)
	{

	    TaskReminderDeferredTask task = new TaskReminderDeferredTask(domain, System.currentTimeMillis(), user.id,
		    timezone, user.email);
	    task.run();

	    writer.write("Task reminder is sent to : " + user.email + "\n");
	}

	writer.close();
    }

}
