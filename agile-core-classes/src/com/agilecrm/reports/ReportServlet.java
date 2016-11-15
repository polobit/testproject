package com.agilecrm.reports;

import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.reports.deferred.ActivityReportsDeferredTask;
import com.agilecrm.reports.deferred.CampaignReportsCronDeferredTask;
import com.agilecrm.reports.deferred.ReportsDeferredTask;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.Subscription.BillingStatus;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TransientFailureException;

/**
 * <code>ReportServlet</code> process reports, based on duration or report
 * (Daily, Weekly, Monthly). It is accessed from cron.
 * 
 * @author Yaswanth
 */
@SuppressWarnings("serial")
public class ReportServlet extends HttpServlet
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

	Set<String> domains = NamespaceUtil.getAllNamespaces();

		for (String namespace : domains)
		{
			CheckSubscriptionRestriction deferredTast = new CheckSubscriptionRestriction(namespace, duration);
			Queue queue = QueueFactory.getQueue("reports-queue");
		    addTaskToQueue(queue,deferredTast);
		}
	

    }
    
    public static void addTaskToQueue(Queue queue,DeferredTask dt)
    {
     	try{
     	      queue.add(TaskOptions.Builder.withPayload(dt));
     	}
     	catch (TransientFailureException tfe)
     	{
     		System.out.println("In Transient failure exception");
     		addTaskToQueue(queue,dt);
     	}
     }

}

class CheckSubscriptionRestriction implements DeferredTask{

	/* (non-Javadoc)
	 * @see java.lang.Runnable#run()
	 */
	private String namespace;
	private String duration;
	
	/**
	 * 
	 */
	public CheckSubscriptionRestriction(String namespace, String duration) {
		this.namespace = namespace;
		this.duration = duration;
	}
	@Override
	public void run() {
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set(namespace);
		try{
			if(SubscriptionUtil.isSubscriptionDeleted())
				return;
			ReportsDeferredTask reportsDeferredTask = new ReportsDeferredTask(namespace, duration);
		    System.out.println("In ReportServlet doGet method after ReportsDeferredTask created"+namespace);
		    // Add to queue
		    Queue queue = QueueFactory.getQueue("reports-queue");
		    ReportServlet.addTaskToQueue(queue,reportsDeferredTask);
		    
		    // Created a deferred task for campaign report generation
		 	CampaignReportsCronDeferredTask campaignReportsDeferredTask = new CampaignReportsCronDeferredTask(namespace, duration);

		 	// Add to queue
		 	ReportServlet.addTaskToQueue(queue,campaignReportsDeferredTask);
		 	
		 	// Created a deferred task for activity report generation
		    ActivityReportsDeferredTask activityReportsDeferredTask = new ActivityReportsDeferredTask(namespace, duration);

		    // Add to queue
		    ReportServlet.addTaskToQueue(queue,activityReportsDeferredTask);
		}finally{
			NamespaceManager.set(oldNamespace);
		}
	}
	
}