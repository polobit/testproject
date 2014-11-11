package com.agilecrm.reports.deferred;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.reports.ActivityReports;
import com.agilecrm.reports.ActivityReportsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

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

	NamespaceManager.set(domain);
	try
	{
	    // Util function fetches reports based on duration, generates
	    // reports and sends report
	    for (Key<ActivityReports> reportKey : ActivityReportsUtil.getAllReportKeysByDuration(duration))
	    {
		ActivityReportsUtil.sendActivityReport(reportKey.getId(), null);
	    }
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

}
