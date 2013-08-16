package com.agilecrm.reports.deferred;

import org.json.JSONException;

import com.agilecrm.reports.ReportServlet;
import com.agilecrm.reports.ReportsUtil;
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

    /**
     * Duration of report
     */
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
	    // Util function fetches reports based on duration, generates
	    // reports and sends report
	    ReportsUtil.sendReportsToUsers(ReportsUtil.getAllReportsByDuration(duration));
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
