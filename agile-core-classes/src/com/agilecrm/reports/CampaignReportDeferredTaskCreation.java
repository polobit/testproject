package com.agilecrm.reports;

import java.io.IOException;

import com.agilecrm.reports.deferred.SendCampaignReportDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
/**
 * 
 * @author Dharmateja
 *
 */

public class CampaignReportDeferredTaskCreation {

	public static void createCampaignDeferredTask(String domain, Long reportid, Long time, String timezone)
		    throws IOException
	    {
			System.out.println("Time in create create Campaign Report DeferredTask ============ " + time);
			SendCampaignReportDeferredTask send_campaign_report_deferred_task = new SendCampaignReportDeferredTask(domain, time, reportid, timezone);
			
			Queue queue = QueueFactory.getQueue("reports-queue");
			TaskOptions options = TaskOptions.Builder.withPayload(send_campaign_report_deferred_task);
			options.etaMillis(time * 1000);
			queue.add(options);
	    }
}
