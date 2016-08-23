package com.agilecrm.reports;

import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.reports.deferred.ActivityReportsDeferredTask;
import com.agilecrm.reports.deferred.CampaignReportsCronDeferredTask;
import com.agilecrm.reports.deferred.ReportsDeferredTask;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

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
	    ReportsDeferredTask reportsDeferredTask = new ReportsDeferredTask(namespace, duration);
	    System.out.println("In ReportServlet doGet method after ReportsDeferredTask created");
	    // Add to queue
	    Queue queue = QueueFactory.getQueue("reports-queue");
	    queue.add(TaskOptions.Builder.withPayload(reportsDeferredTask));
	    
	    // Created a deferred task for campaign report generation
	 	CampaignReportsCronDeferredTask campaignReportsDeferredTask = new CampaignReportsCronDeferredTask(namespace, duration);

	 	// Add to queue
	 	queue.add(TaskOptions.Builder.withPayload(campaignReportsDeferredTask));
	 	
	 	// Created a deferred task for activity report generation
	    ActivityReportsDeferredTask activityReportsDeferredTask = new ActivityReportsDeferredTask(namespace, duration);

	    // Add to queue
	    queue.add(TaskOptions.Builder.withPayload(activityReportsDeferredTask));
		}
	

    }

}