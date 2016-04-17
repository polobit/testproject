package com.agilecrm.reports.deferred;

import com.agilecrm.reports.ReportsUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public class SendContactReportDeferredTask implements DeferredTask
{
    String domain = null;
    Long time = null;
    Long reportid = null;
    String timezone = null;

    public SendContactReportDeferredTask(String domain, Long time, Long reportid, String timezone)
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
		System.out.println("Domain in SendContactReportDeferredTask------------"+domain);
		System.out.println("Report id in SendContactReportDeferredTask------------"+reportid);
	    ReportsUtil.sendReport(reportid);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("exception occured while sending contacts report mail " + domain);
	}
    }
}
