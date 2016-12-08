package com.agilecrm;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.deferred.DeleteDuplicateMilestone;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>DeleteDuplicateMilestoneServlet</code> adds the company name to companies.
 * 
 * @author nidhi
 */
@SuppressWarnings("serial")
public class DeleteDuplicateMilestoneServlet extends HttpServlet 
{
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	{
		doGet(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res)
	{
		
		System.out.println("Name updation in companies ");
		String domain = req.getParameter("domain");
		DeleteDuplicateMilestone deleteduplicate = new DeleteDuplicateMilestone(domain);

		// Add to queue
		Queue queue = QueueFactory.getQueue(AgileQueues.NAME_UPDATE_COMPANIES);
		queue.add(TaskOptions.Builder.withPayload(deleteduplicate));
	}

}
