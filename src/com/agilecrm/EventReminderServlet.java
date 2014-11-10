package com.agilecrm;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.activities.EventReminder;
import com.agilecrm.activities.TaskReminder;
import com.agilecrm.util.NamespaceUtil;

/**
 * <code>TaskReminderServlet</code> is the servlet for handling cron requests of
 * Tasks Reminder. It calls {@link TaskReminder} to send task reminder emails to
 * the respective users.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class EventReminderServlet extends HttpServlet
{

    public void doPost(HttpServletRequest request, HttpServletResponse response)
    {
	doGet(request, response);
    }

    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
	try
	{
	    Set<String> domains = NamespaceUtil.getAllNamespaces();

	    Set<String> domainsset = new HashSet<>();
	    domainsset.add("jagadeesh");
	    domainsset.add("test800");

	    // Start a task queue for each domain
	    for (String domain : domainsset)
	    {

		EventReminder.getEventReminder(domain, null);
	    }
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	}
    }
}
