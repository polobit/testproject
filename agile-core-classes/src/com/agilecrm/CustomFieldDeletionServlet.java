package com.agilecrm;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.deferred.DeleteCustomField;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>CustomFieldDeletionServlet</code> deletes the custom field from contact.
 * 
 * @author nidhi
 */
@SuppressWarnings("serial")
public class CustomFieldDeletionServlet extends HttpServlet 
{
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	{
		doGet(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res)
	{
		
		String domain = req.getParameter("domain");
		String customField = req.getParameter("field");
		String type = req.getParameter("type");
		DeleteCustomField deleteCustomField = new DeleteCustomField(domain,type,customField);

		// Add to queue
		Queue queue = QueueFactory.getQueue(AgileQueues.NAME_UPDATE_COMPANIES);
		queue.add(TaskOptions.Builder.withPayload(deleteCustomField));
	}

}