package com.agilecrm;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.deals.deferred.UpdateDealsDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>OpportunitySchemaChangeServlet</code> process the 
 * migration operation from datastore to textsearch.
 * 
 * @author Subrahmanyam
 */
@SuppressWarnings("serial")
public class OpportunitySchemaChangeServlet extends HttpServlet 
{
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	{
		doGet(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res)
	{
		
		System.out.println("started schema change for deals ");
		String domain = req.getParameter("domain");
		UpdateDealsDeferredTask updateDealsDeferredTask = new UpdateDealsDeferredTask(domain);

		// Add to queue
		Queue queue = QueueFactory.getQueue(AgileQueues.DEALS_SCHEMA_CHANGE_QUEUE);
		queue.add(TaskOptions.Builder.withPayload(updateDealsDeferredTask));
	}

}