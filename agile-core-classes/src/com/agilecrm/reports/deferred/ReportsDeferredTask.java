package com.agilecrm.reports.deferred;

import java.io.IOException;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.reports.ActivityReportsUtil;
import com.agilecrm.reports.ContactReportDeferredTaskCreation;
import com.agilecrm.reports.ReportServlet;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>ReportsDeferredTask</code> generates reports for the domain and sends
 * generated reports. It fetches reports based on the duration(Daily, Weekly,
 * Montly) set in reports.
 * 
 * Task is initialized from {@link ReportServlet}, which is called by cron with
 * duration query parameter in URL
 * 
 * @author Yaswanth
 * 
 */
@SuppressWarnings("serial")
public class ReportsDeferredTask implements DeferredTask
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

    public ReportsDeferredTask(String domain, String duration)
    {
	this.domain = domain;
	this.duration = duration;
    }

    public ReportsDeferredTask(Long domain_id, String duration)
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

	NamespaceManager.set(domain);
	try
	{
	    List<Reports> reports = ReportsUtil.getAllReportsByDuration(duration);
	    // Util function fetches reports based on duration, generates
	    // reports and sends report
	    for (Reports report : reports)
	    {
		Long time = ActivityReportsUtil.getTimeForSettingEtaForReports(report.activity_time,
		        report.activity_weekday, report.activity_day, report.report_timezone, duration);
		try
		{
		    ContactReportDeferredTaskCreation.createContactDeferredTask(domain, report.id, time,
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
