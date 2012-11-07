package com.agilecrm.reports;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.ContactFilter;
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

	List<ContactFilter> contactFilterList = new ArrayList<ContactFilter>();

	if (duration == null)
	    return;

	// Run query to get all the filter with particular duration in name
	// space = ""
	if (duration.equalsIgnoreCase("DAILY"))
	    contactFilterList = ContactFilter
		    .getAllFiltersByDuration(ContactFilter.Duration.DAILY);

	else if (duration.equalsIgnoreCase("WEEKLY"))
	    contactFilterList = ContactFilter
		    .getAllFiltersByDuration(ContactFilter.Duration.WEEKLY);

	else if (duration.equalsIgnoreCase("MONTHLY"))
	    contactFilterList = ContactFilter
		    .getAllFiltersByDuration(ContactFilter.Duration.MONTHLY);

	// Store contactFilters list with domain name as key(domain name,
	// filters in that domain in particular duration)
	Map<String, List<ContactFilter>> filtersMap = ReportsUtil
		.organizeFiltersByDomain(contactFilterList);

	// Created a deferred task for report generation
	ReportsDeferredTask reportsDeferredTask = new ReportsDeferredTask(
		filtersMap);

	Queue queue = QueueFactory.getDefaultQueue();

	// Add to queue
	queue.add(TaskOptions.Builder.withPayload(reportsDeferredTask));

    }
}