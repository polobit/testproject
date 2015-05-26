package com.agilecrm;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.deferred.UpdateContactsDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>ReportServlet</code> process reports, based on duration or report
 * (Daily, Weekly, Monthly). It is accessed from cron.
 * 
 * @author kakarlal
 */
@SuppressWarnings("serial")
public class ContactSchemaChangeServlet extends HttpServlet
{
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	{
		doGet(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res)
	{
		
		System.out.println("started schema change for contacts ");
		String domain = req.getParameter("domain");
		UpdateContactsDeferredTask updateContactDeferredTask = new UpdateContactsDeferredTask(domain);

		// Add to queue
		Queue queue = QueueFactory.getQueue(AgileQueues.CONTACTS_SCHEMA_CHANGE_QUEUE);
		queue.add(TaskOptions.Builder.withPayload(updateContactDeferredTask));
	}

}