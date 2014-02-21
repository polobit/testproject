package com.agilecrm.reports;

import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

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

	/*
	 * Based on the duration parameter in the url respective reports are
	 * fetched, on fetching the reports entities they are organized in a map
	 * with its domain as a key, deferred task is created with map of reports
	 * which fetches the reports results and mail them to their respective users
	 */
	public void doGet(HttpServletRequest req, HttpServletResponse res)
	{
		System.out.println("fetching reports");
		// Get duration parameter to fetch filter for that duration
		String duration = req.getParameter("duration");

		String domain = req.getParameter("domain");

		// If duration is null return, since query is done based on the duration
		if (duration == null)
			return;

		if (!org.apache.commons.lang.StringUtils.isEmpty(domain))
		{
			System.out.println("sending report");
			sendReport(domain, duration);
			return;
		}

		String printDomain = req.getParameter("all_domains");

		System.out.println(printDomain);

		if (!StringUtils.isEmpty(printDomain))
		{
			allDomains();
			return;
		}
		for (String namespace : NamespaceUtil.getAllNamespaces())
		{
			// Created a deferred task for report generation
			ReportsDeferredTask reportsDeferredTask = new ReportsDeferredTask(namespace, duration);

			// Add to queue
			Queue queue = QueueFactory.getQueue("reports-queue");
			queue.add(TaskOptions.Builder.withPayload(reportsDeferredTask));

		}
	}

	public void sendReport(String domain, String duration)
	{
		// Created a deferred task for report generation
		ReportsDeferredTask reportsDeferredTask = new ReportsDeferredTask(domain, duration);

		// Add to queue
		Queue queue = QueueFactory.getQueue("reports-queue");
		queue.add(TaskOptions.Builder.withPayload(reportsDeferredTask));
	}

	public void allDomains()
	{
		Set<String> namespaces = NamespaceUtil.getAllNamespaces();
		System.out.println("namespace lengths : " + namespaces.size());
		for (String namespace : NamespaceUtil.getAllNamespaces())
		{
			System.out.print(namespace + ", ");
		}

	}

}