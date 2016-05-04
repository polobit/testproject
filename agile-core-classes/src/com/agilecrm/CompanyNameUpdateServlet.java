package com.agilecrm;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.deferred.UpdateCompanyName;
import com.agilecrm.deals.deferred.UpdateDealsDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>OpportunitySchemaChangeServlet</code> process the 
 * migration operation from datastore to textsearch.
 * 
 * @author nidhi
 */
@SuppressWarnings("serial")
public class CompanyNameUpdateServlet extends HttpServlet 
{
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	{
		doGet(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res)
	{
		
		System.out.println("Name updation in comapnies ");
		String domain = req.getParameter("domain");
		UpdateCompanyName updateCompanyName = new UpdateCompanyName(domain);

		// Add to queue
		Queue queue = QueueFactory.getQueue(AgileQueues.NAME_UPDATE_COMPANIES);
		queue.add(TaskOptions.Builder.withPayload(updateCompanyName));
	}

}