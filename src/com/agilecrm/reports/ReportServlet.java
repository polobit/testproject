package com.agilecrm.reports;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.deferred.ReportsDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

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

	if (duration == null)
	    return;

	System.out.println("duration : " + duration);

	List<Reports> reportsList = null;

	// Run query to get all the filter with particular duration in name
	// space = ""
	if (duration.equalsIgnoreCase("DAILY"))
	    reportsList = Reports
		    .getAllReportsByDuration(Reports.Duration.DAILY);

	else if (duration.equalsIgnoreCase("WEEKLY"))
	    reportsList = Reports
		    .getAllReportsByDuration(Reports.Duration.WEEKLY);

	else if (duration.equalsIgnoreCase("MONTHLY"))
	    reportsList = Reports
		    .getAllReportsByDuration(Reports.Duration.MONTHLY);

	if (reportsList == null || reportsList.isEmpty())
	    return;

	// Store contactFilters list with domain name as key(domain name,
	// reports in that domain in particular duration)
	Map<String, List<Reports>> reportsMap = ReportsUtil
		.organizeFiltersByDomain(reportsList);

	System.out.println("Reports map : " + reportsMap);

	// Created a deferred task for report generation
	ReportsDeferredTask reportsDeferredTask = new ReportsDeferredTask(
		reportsMap);

	Queue queue = QueueFactory.getDefaultQueue();

	// Add to queue
	queue.add(TaskOptions.Builder.withPayload(reportsDeferredTask));

    }
}