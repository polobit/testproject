package com.agilecrm;

import java.io.IOException;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.activities.EventReminder;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

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
			EventReminderCreateDeferredTask eventReminderTaskDeferredTask = new EventReminderCreateDeferredTask();
			Queue queue = QueueFactory.getQueue("automations-queue");
			TaskOptions options = TaskOptions.Builder.withPayload(eventReminderTaskDeferredTask);
			queue.add(options);
			System.out.println("Automations queue is used");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}

class EventReminderCreateDeferredTask implements DeferredTask
{

	@Override
	public void run()
	{
		Set<String> domains = NamespaceUtil.getAllNamespaces();

		System.out.println("number of domains in event reminder servlet " + domains.size());

		// Start a task queue for each domain
		for (String domain : domains)
		{

			try
			{
				EventReminder.getEventReminder(domain, null);
			}
			catch (Exception e)
			{
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

	}

}
