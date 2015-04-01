package com.agilecrm.reports.deferred;

import java.io.IOException;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.reports.ActivityReportDeferredTaskCreation;
import com.agilecrm.reports.ActivityReports;
import com.agilecrm.reports.ActivityReportsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

@SuppressWarnings("serial")
public class ActivityReportsDeferredTask implements DeferredTask
{
    /**
     * Domain of the account
     */
    private String domain;

    private Long domain_id;

    /**
     * Duration of report
     */
    private String duration;

    public ActivityReportsDeferredTask(String domain, String duration)
    {
	this.domain = domain;
	this.duration = duration;
    }

    public ActivityReportsDeferredTask(Long domain_id, String duration)
    {
	this.domain_id = domain_id;
	this.duration = duration;
    }

    @Override
    public void run()
    {
	if (domain == null && domain_id != null)
	{
	    DomainUser user = DomainUserUtil.getDomainUser(domain_id);

	    domain = user != null ? user.domain : null;

	    if (StringUtils.isEmpty(domain))
		return;
	}

	String oldNamespace = NamespaceManager.get();
	System.out.println("Domain name is - " + domain);
	NamespaceManager.set(domain);
	try
	{
	    // Util function fetches reports based on duration, generates
	    // reports and sends report
	    List<ActivityReports> reports = ActivityReportsUtil.getAllReportsByDuration(duration);
	    for (ActivityReports report : reports)
	    {
		Long time = ActivityReportsUtil.getTimeForSettingEtaForReports(report.activity_time,
		        report.activity_weekday, report.activity_day, report.report_timezone, duration);
		try
		{
		    ActivityReportDeferredTaskCreation.createDeferredTask(domain, report.id, time,
			    report.report_timezone);
		}
		catch (IOException e)
		{
		    // TODO Auto-generated catch block
		    e.printStackTrace();
		}
	    }
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
