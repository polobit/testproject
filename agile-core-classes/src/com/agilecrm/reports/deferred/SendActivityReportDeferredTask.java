package com.agilecrm.reports.deferred;

import com.agilecrm.reports.ActivityReportsUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public class SendActivityReportDeferredTask implements DeferredTask
{
    String domain = null;
    Long time = null;
    Long reportid = null;
    String timezone = null;

    public SendActivityReportDeferredTask(String domain, Long time, Long reportid, String timezone)
    {
	this.domain = domain;
	this.time = time;
	this.reportid = reportid;
	this.timezone = timezone;
    }

    public void run()
    {
	try
	{
	    ActivityReportsUtil.sendActivityReport(reportid, null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("exception occured while sending deferred report mail " + domain);
	}
    }
}
