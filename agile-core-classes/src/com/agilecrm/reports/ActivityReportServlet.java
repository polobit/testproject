package com.agilecrm.reports;

import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.reports.deferred.ActivityReportsDeferredTask;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class ActivityReportServlet extends HttpServlet
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

	List<Key<DomainUser>> keys = DomainUserUtil.getAllDomainOwnerKeys();

	System.out.println("domain owners :" + keys);
	Set<String> domains = NamespaceUtil.getAllNamespaces();
	for (String namespace : domains)
	{
	    // Created a deferred task for report generation
	    ActivityReportsDeferredTask reportsDeferredTask = new ActivityReportsDeferredTask(namespace, duration);

	    // Add to queue
	    Queue queue = QueueFactory.getQueue("reports-queue");
	    queue.add(TaskOptions.Builder.withPayload(reportsDeferredTask));
	}
    }

}
