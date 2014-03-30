package com.agilecrm.subscription.limits.contacts.cron;

import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.subscription.limits.contacts.cron.deferred.AccountLimitsRemainderDeferredTask;
import com.agilecrm.util.NamespaceUtil;

public class ContactLimitCheckServlet extends HttpServlet
{
    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {
	doGet(req, res);
    }

    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
	Set<String> namespaces = NamespaceUtil.getAllNamespaces();

	for (String namespace : namespaces)
	{
	    AccountLimitsRemainderDeferredTask task = new AccountLimitsRemainderDeferredTask(namespace);

	}
    }
}
