package com.agilecrm.reports.deferred;

import java.util.List;
import java.util.Map;

import org.json.JSONException;

import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

@SuppressWarnings("serial")
public class ReportsDeferredTask implements DeferredTask
{

    private Map<String, List<Reports>> reportsMap;
    private String domain;
    private String duration;

    public ReportsDeferredTask(String domain, String duration)
    {
	this.domain = domain;
	this.duration = duration;
    }

    @Override
    public void run()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set(domain);
	try
	{
	    ReportsUtil.sendReportsToUsers(Reports
		    .getAllReportsByDuration(duration));
	}
	catch (JSONException e1)
	{
	    // TODO Auto-generated catch block
	    e1.printStackTrace();
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
