package com.agilecrm.workflows.triggers;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
		// Get period parameter to fetch filter for that period
		String period = req.getParameter("period");

		// If period is null return, since query is done based on the duration
		if (period == null)
			return;

		System.out.println("Period : " + period);
		try
		{
			for (String namespace : NamespaceUtil.getAllNamespaces())
			{
				String oldNamespace = NamespaceManager.get();
				NamespaceManager.set(namespace);
				int triggersSize = TriggerUtil.getTriggerCountByPeriod(period);
				System.out.println(period + " " + "Trigger count for namespace" + " " + namespace + "is "
						+ triggersSize);
				NamespaceManager.set(oldNamespace);
				if (triggersSize > 0)
				{
					// Created a deferred task for automations
					TriggerDeferredTask triggerDeferredTask = new TriggerDeferredTask(namespace, period);
					// Add to queue
					Queue queue = QueueFactory.getQueue("periodic-triggers-queue");
					queue.add(TaskOptions.Builder.withPayload(triggerDeferredTask));
					System.out.println("task added to queue");
				}
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
	}
}