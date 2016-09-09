package com.agilecrm;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.deferred.DeleteTextSearchContactsDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class DeleteContactsFromTextSearchServlet extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse res)
	{
		doGet(req, res);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response)
	{
		String domain = request.getParameter("domain");
		String type = request.getParameter("type");
		System.out.println("domain is "+ domain + " and type is "+ type);
		System.out.println("given domain is "+domain);
		if(!domain.isEmpty() && !domain.equalsIgnoreCase(null) && !domain.equalsIgnoreCase("null")){
			//set domain to the deferred task
			DeleteTextSearchContactsDeferredTask deleteContacts = new DeleteTextSearchContactsDeferredTask(domain,type);
			 // Create Task and push it into Task Queue
		    TaskOptions taskOptions = TaskOptions.Builder.withPayload(deleteContacts);		
			// Add to queue
			Queue queue = QueueFactory.getQueue(AgileQueues.CONTACTS_SCHEMA_CHANGE_QUEUE);
			queue.addAsync(taskOptions);
			
		}
	}

}
