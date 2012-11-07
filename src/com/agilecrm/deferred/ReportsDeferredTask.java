package com.agilecrm.deferred;

import java.util.List;
import java.util.Map;

import com.agilecrm.contact.ContactFilter;
import com.agilecrm.core.DomainUser;
import com.agilecrm.reports.ReportsUtil;
import com.google.appengine.api.taskqueue.DeferredTask;

public class ReportsDeferredTask implements DeferredTask
{

    private Map<String, List<ContactFilter>> contactFilterMap;

    public ReportsDeferredTask(
	    Map<String, List<ContactFilter>> contactFilterList)
    {
	this.contactFilterMap = contactFilterList;
    }

    @Override
    public void run()
    {
	for (String domain : contactFilterMap.keySet())
	{

	    List<DomainUser> user = DomainUser.getUsers(domain);
	    List<ContactFilter> contactFilter = contactFilterMap.get(domain);

	    ReportsUtil.sendReportsToUsers(DomainUser.getUsers(domain),
		    contactFilterMap.get(domain));

	}
    }
}
