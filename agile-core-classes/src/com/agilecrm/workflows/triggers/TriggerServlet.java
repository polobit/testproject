package com.agilecrm.workflows.triggers;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>TriggerServlet</code> invokes campaigns on contacts, based on duration
 * (Daily, Weekly, Monthly). It is accessed from cron.
 * 
 * @author Ramesh
 */
@SuppressWarnings("serial")
public class TriggerServlet extends HttpServlet
{
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	{
		doGet(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res)
	{
	    try
	    {
		String period = req.getParameter("period");
		// Created a deferred task to create deferred tasks for running 
		TriggerCronDeferredTask triggerCronDeferredTask = new TriggerCronDeferredTask(period);
		// Add to queue
		Queue queue = QueueFactory.getQueue("periodic-triggers-cron-queue");
		queue.add(TaskOptions.Builder.withPayload(triggerCronDeferredTask));
		System.out.println("period trigger cron deferred task added to queue");
	    }
	    catch(Exception e)
	    {
		System.err.println(e.getMessage());
	    }
	}
}