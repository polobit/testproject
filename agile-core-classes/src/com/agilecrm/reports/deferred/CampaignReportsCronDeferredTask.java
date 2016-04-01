package com.agilecrm.reports.deferred;

import java.io.IOException;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.reports.ActivityReportsUtil;
import com.agilecrm.reports.CampaignReportDeferredTaskCreation;
import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * <code>ReportsInstantEmail</code> fetches report entity based on report id
 * sent, and generates report and sends email.
 * 
 * It is used to generate instant report emails, when send report is selected
 * from app dashboard.
 * 
 * 
 */
public class CampaignReportsCronDeferredTask implements DeferredTask
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

    public CampaignReportsCronDeferredTask(String domain, String duration)
    {
	this.domain = domain;
	this.duration = duration;
    }

    public CampaignReportsCronDeferredTask(Long domain_id, String duration)
    {
	this.domain_id = domain_id;
	this.duration = duration;
    }
    
	// Report ID
    private Long report_id;

    public CampaignReportsCronDeferredTask(Long report_id)
    {
	this.report_id = report_id;
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
	// Fetches report adds to list. It is added into list as there is
	// utility function in ReportsUtil used for generating list of reports.
    List<Reports> reports = ReportsUtil.getAllReportsByDuration(duration);

 // Util function fetches reports based on duration, generates
    // reports and sends report
    for (Reports report : reports)
    {
	Long time = ActivityReportsUtil.getTimeForSettingEtaForReports(report.activity_time,
	        report.activity_weekday, report.activity_day, report.report_timezone, duration);
	try
	{
	    CampaignReportDeferredTaskCreation.createCampaignDeferredTask(domain, report.id, time,
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