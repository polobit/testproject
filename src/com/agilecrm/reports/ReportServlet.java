package com.agilecrm.reports;

import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.deferred.ReportsDeferredTask;
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

    /*
     * Based on the duration parameter in the url respective reports are
     * fetched, on fetching the reports entities they are organized in a map
     * with its domain as a key, deferred task is created with map of reports
     * which fetches the reports results and mail them to their respective users
     */
    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {

	// Get duration parameter to fetch filter for that duration
	String duration = req.getParameter("duration");

	// If duration is null return, since query is done based on the duration
	if (duration == null)
	    return;

	System.out.println("duration : " + duration);

	Set<String> domains = NamespaceUtil.getAllNamespaces();

	for (String domain : domains)
	{
	    // Created a deferred task for report generation
	    ReportsDeferredTask reportsDeferredTask = new ReportsDeferredTask(
		    domain, duration);

	    Queue queue = QueueFactory.getDefaultQueue();

	    // Add to queue
	    queue.add(TaskOptions.Builder.withPayload(reportsDeferredTask));
	}

    }
}