package com.agilecrm.deferred;

import java.util.List;
import java.util.Map;

import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public class ReportsDeferredTask implements DeferredTask
{

    private Map<String, List<Reports>> reportsMap;

    public ReportsDeferredTask(Map<String, List<Reports>> reports)
    {
	this.reportsMap = reports;
    }

    @Override
    public void run()
    {
	for (String domain : reportsMap.keySet())
	{
	    // Call send reports on map of filters to process filters and send
	    // reports to respective domain users
	    ReportsUtil.sendReportsToUsers(reportsMap.get(domain));
	}
    }
}
