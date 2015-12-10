package com.agilecrm.reports;

import java.io.IOException;

import com.agilecrm.reports.deferred.SendContactReportDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class ContactReportDeferredTaskCreation
{
    public static void createContactDeferredTask(String domain, Long reportid, Long time, String timezone)
	    throws IOException
    {
	System.out.println("Time in create createDeferredTask ============ " + time);
	// Start a task queue for each domain
	SendContactReportDeferredTask send_contact_report_deferred_task = new SendContactReportDeferredTask(domain,
	        time, reportid, timezone);
	Queue queue = QueueFactory.getQueue("reports-queue");
	TaskOptions options = TaskOptions.Builder.withPayload(send_contact_report_deferred_task);
	options.etaMillis(time * 1000);
	queue.add(options);
    }
}
