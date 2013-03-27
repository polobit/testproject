package com.agilecrm.reports.deferred;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;

import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public class ReportsDeferredTaskInstantEmail implements DeferredTask
{

    private Long reportId;

    public ReportsDeferredTaskInstantEmail(Long reportId)
    {
	this.reportId = reportId;
    }

    public void run()
    {
	List<Reports> reports = new ArrayList<Reports>();
	reports.add(Reports.getReport(reportId));

	try
	{
	    ReportsUtil.sendReportsToUsers(reports);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
}
