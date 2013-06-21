package com.agilecrm.contact.util;

import com.agilecrm.contact.filter.ContactFilter;
import com.google.appengine.api.backends.BackendServiceFactory;
import com.google.appengine.api.taskqueue.DeferredTask;

public class BulkActionsDeferredTask implements DeferredTask
{

    private ContactFilter filter;
    private String actionType;
    private String id;

    String postURL = BackendServiceFactory.getBackendService()
	    .getBackendAddress("BulkActions");

    public BulkActionsDeferredTask(ContactFilter filter, String actionType,
	    String id)
    {
	this.filter = filter;
	this.actionType = actionType;
	this.id = id;
    }

    @Override
    public void run()
    {
	System.out.println(postURL);
	// HTTPUtil.accessURLUsingPost("/postURL", data)
	// ReportsUtil.sendReportsToUsers(Reports
	// .getAllReportsByDuration(duration));

    }
}