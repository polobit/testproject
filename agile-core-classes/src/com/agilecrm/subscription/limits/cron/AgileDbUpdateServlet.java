package com.agilecrm.subscription.limits.cron;

import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.subscription.limits.cron.deferred.AccountLimitsRemainderDeferredTask;
import com.agilecrm.subscription.limits.cron.deferred.TestTask;
import com.agilecrm.subscription.restrictions.db.BillingRestriction;
import com.agilecrm.util.NamespaceUtil;
import com.campaignio.servlets.deferred.EntityDeferredTask;
import com.campaignio.servlets.deferred.DomainUserAddPicDeferredTask;
import com.campaignio.servlets.deferred.WorkflowAddAccessLevelDeferredTask;
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
public class AgileDbUpdateServlet extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse res) {
		doGet(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res) {
		String page = req.getParameter("page");
		String limit = req.getParameter("limit");
		String dbName = req.getParameter("db");

		String domainName = req.getParameter("domain");

		// Fetches all namespaces
		Set<String> namespaces = new HashSet<String>();

		if (StringUtils.isBlank(page) && StringUtils.isBlank(limit)) {
			namespaces = NamespaceUtil.getAllNamespacesNew();
		} else {
			int pageCount = Integer.parseInt(page);
			int limitCount = Integer.parseInt(limit);
			int offsetCount = pageCount * 1000;
			namespaces = NamespaceUtil.getAllNamespacesNew(limitCount, offsetCount);
		}

		if (StringUtils.isNotBlank(domainName)) {
			namespaces = new HashSet();
			namespaces.add(domainName);
		}

		// Iterates through each Namespace and initiates task for each namespace
		// to update usage info
		for (String namespace : namespaces) {

			// Add to queue
			Queue queue = QueueFactory.getDefaultQueue();

			if (StringUtils.isBlank(dbName) || dbName.equals("domainUser")) {
				DomainUserAddPicDeferredTask task = new DomainUserAddPicDeferredTask(namespace);
				queue.add(TaskOptions.Builder.withPayload(task));
			}

			else if (dbName.equals("workflow")) {
				WorkflowAddAccessLevelDeferredTask task = new WorkflowAddAccessLevelDeferredTask(namespace);
				queue.add(TaskOptions.Builder.withPayload(task));
			}

			else if (StringUtils.isNotBlank(dbName)) {
				EntityDeferredTask task = new EntityDeferredTask(namespace, dbName);
				queue.add(TaskOptions.Builder.withPayload(task));
			}
		}
	}
}
