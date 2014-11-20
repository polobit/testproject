package com.agilecrm;

import java.io.IOException;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.activities.EventReminder;
import com.agilecrm.util.NamespaceUtil;

/**
 * <code>EventReminderServlet</code> is the servlet for handling cron requests
 * of Event Reminder. It calls {@link EventReminder} to send event reminder
 * emails to the respective users.
 * 
 * @author Jagadeesh
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

	    // Start a task queue for each domain
	    for (String domain : domains)
	    {

		System.out.println("Domain Name in EventReminder Servlet " + domain);

		EventReminder.getEventReminder(domain, null);
	    }
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	}
    }
}
