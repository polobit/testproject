package com.agilecrm.workflows.automation;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.util.NamespaceUtil;
import com.agilecrm.workflows.automation.util.AutomationUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>AutomationServlet</code> invokes campaigns on contacts, based on duration
 * (Daily, Weekly, Monthly). It is accessed from cron.
 * 
 * @author Ramesh
 */
@SuppressWarnings("serial")
public class AutomationServlet extends HttpServlet
{
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	{
		doGet(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res)
	{
		// Get duration parameter to fetch filter for that duration
		String duration = req.getParameter("duration");

		// If duration is null return, since query is done based on the duration
		if (duration == null)
			return;

		System.out.println("Duration : " + duration);
		
		try{
		for (String namespace : NamespaceUtil.getAllNamespaces())
		{	
			String oldNamespace = NamespaceManager.get();
			NamespaceManager.set(namespace);
			int automationsSize = AutomationUtil.getAutomationCountByDuration(duration);
			NamespaceManager.set(oldNamespace);
			if(automationsSize>0){
				// Created a deferred task for automations
				AutomationDeferredTask automationDeferredTask = new AutomationDeferredTask(namespace,duration);
				// Add to queue
				Queue queue = QueueFactory.getQueue("automations-queue");
				queue.add(TaskOptions.Builder.withPayload(automationDeferredTask));
			}
		}
		}
		catch(Exception e){
			e.printStackTrace();
		}
	}
}