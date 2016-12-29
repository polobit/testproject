package com.agilecrm;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.deferred.DeleteDuplicateMilestone;
import com.agilecrm.deals.deferred.DeleteDuplicateCompanies;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class DeleteDuplicateCompanyServlet extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void doPost(HttpServletRequest req, HttpServletResponse res)
	{
		doGet(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res)
	{
		
		System.out.println("Name updation in companies ");
		String domain = req.getParameter("domain");
		DeleteDuplicateCompanies deleteduplicate = new DeleteDuplicateCompanies(domain,null);
		 // Create Task and push it into Task Queue
	    TaskOptions taskOptions = TaskOptions.Builder.withPayload(deleteduplicate);		
		// Add to queue
		Queue queue = QueueFactory.getQueue(AgileQueues.NAME_UPDATE_COMPANIES);
		queue.addAsync(taskOptions);
	}

}
