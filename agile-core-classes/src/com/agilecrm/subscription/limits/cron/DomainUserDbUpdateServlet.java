package com.agilecrm.subscription.limits.cron;

import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.subscription.limits.cron.deferred.AccountLimitsRemainderDeferredTask;
import com.agilecrm.subscription.limits.cron.deferred.TestTask;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.util.NamespaceUtil;
import com.campaignio.servlets.deferred.DomainUserAddPicDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * Cron Servlets gets called once a day to update user usage in
 * {@link BillingRestriction} entity also trigger action to send reminder to
 * user
 * 
 * @author Yaswanth
 * 
 */
public class DomainUserDbUpdateServlet extends HttpServlet
{
    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {
	doGet(req, res);
    }

    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {

    	//Fetches all namespaces
      	Set<String> namespaces = NamespaceUtil.getAllNamespacesNew();
      	
      	// Iterates through each Namespace and initiates task for each namespace
      	// to update usage info
      	for (String namespace : namespaces) {
      		DomainUserAddPicDeferredTask task = new DomainUserAddPicDeferredTask(namespace);

      		// Add to queue
      		Queue queue = QueueFactory.getDefaultQueue();
      		queue.add(TaskOptions.Builder.withPayload(task));
      	}
		
    }
}
