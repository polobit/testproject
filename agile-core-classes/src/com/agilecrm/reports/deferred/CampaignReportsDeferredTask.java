package com.agilecrm.reports.deferred;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;

import com.agilecrm.reports.Reports;
import com.agilecrm.reports.ReportsUtil;
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
public class CampaignReportsDeferredTask implements DeferredTask
{
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	// Report ID
    private Long report_id;
    private Boolean sendNow;

    public CampaignReportsDeferredTask(Long report_id, Boolean sendNow)
    {
		this.report_id = report_id;
		this.sendNow=sendNow;
    }

    @Override
    public void run()
    {
		// Fetches report adds to list. It is added into list as there is
		// utility function in ReportsUtil used for generating list of reports.
		List<Reports> reports = new ArrayList<Reports>();
		reports.add(ReportsUtil.getReport(report_id));
		try
		  {
			// Generates report and sends to user
		    ReportsUtil.sendCampaignReportsToUsers(reports, sendNow);
		  }
		catch (JSONException e)
		  {
		    e.printStackTrace();
		  }
    }
}