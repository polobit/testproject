package com.agilecrm.reports;

import java.io.IOException;

import com.agilecrm.reports.deferred.SendActivityReportDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class ActivityReportDeferredTaskCreation
{
    public static void createDeferredTask(String domain, Long reportid, Long time, String timezone) throws IOException
    {
	System.out.println("Time in create createActivityreportDeferredTask ============ " + time);
	// Start a task queue for each domain
	SendActivityReportDeferredTask sendreport_deferred_task = new SendActivityReportDeferredTask(domain, time,
	        reportid, timezone);
	Queue queue = QueueFactory.getQueue("reports-queue");
	TaskOptions options = TaskOptions.Builder.withPayload(sendreport_deferred_task);
	options.etaMillis(time * 1000);
	queue.add(options);
    }
}
