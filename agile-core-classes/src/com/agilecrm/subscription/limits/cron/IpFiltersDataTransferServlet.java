package com.agilecrm.subscription.limits.cron;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.AgileQueues;
import com.campaignio.servlets.deferred.NamespaceIteratorDeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class IpFiltersDataTransferServlet extends HttpServlet
{
    
    /**
     * 
     */
    private static final long serialVersionUID = -4967591402771001405L;
    
    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {
	doGet(req, res);
    }
    
    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
	// Add to queue
	try
	{
	    Queue queue = QueueFactory.getQueue(AgileQueues.IP_FILTERS_TRANSFER_QUEUE);
	    NamespaceIteratorDeferredTask task = new NamespaceIteratorDeferredTask();
	    queue.add(TaskOptions.Builder.withPayload(task));
	}
	catch (Exception e)
	{
	    System.err.println(e.getMessage());
	}
	// String page = req.getParameter("page");
	// String limit = req.getParameter("limit");
	// String dbName = req.getParameter("db");
	
	// String domainName = req.getParameter("domain");
	
	// Fetches all namespaces
	// Set<String> namespaces = new HashSet<String>();
	
	// Add to queue
	// Queue queue =
	// QueueFactory.getQueue(AgileQueues.IP_FILTERS_TRANSFER_QUEUE);
	//
	// IpFilterTransferDeferredTask task = new
	// IpFilterTransferDeferredTask(namespace);
	// queue.add(TaskOptions.Builder.withPayload(task));
	
	// if (StringUtils.isBlank(page) && StringUtils.isBlank(limit))
	// {
	// namespaces = NamespaceUtil.getAllNamespacesNew();
	// }
	// else
	// {
	// int pageCount = Integer.parseInt(page);
	// int limitCount = Integer.parseInt(limit);
	// int offsetCount = pageCount * 1000;
	// namespaces = NamespaceUtil.getAllNamespacesNew(limitCount,
	// offsetCount);
	// }
	//
	// if (StringUtils.isNotBlank(domainName))
	// {
	// namespaces = new HashSet();
	// namespaces.add(domainName);
	// }
	
	// Iterates through each Namespace and initiates task for each namespace
	// to update usage info
	// for (String namespace : namespaces)
	// {
	//
	// // Add to queue
	// Queue queue =
	// QueueFactory.getQueue(AgileQueues.IP_FILTERS_TRANSFER_QUEUE);
	//
	// IpFilterTransferDeferredTask task = new
	// IpFilterTransferDeferredTask(namespace);
	// queue.add(TaskOptions.Builder.withPayload(task));
	// }
	
    }
    
}
