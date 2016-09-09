package com.campaignio.servlets.deferred;

import java.util.HashSet;
import java.util.Set;

import com.agilecrm.AgileQueues;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class NamespaceIteratorDeferredTask implements DeferredTask
{
    
    /**
     * 
     */
    private static final long serialVersionUID = -4989088927135186441L;
    
    @Override
    public void run()
    {
	try
	{
	    Set<String> namespaces = new HashSet<String>();
	    namespaces = NamespaceUtil.getAllNamespacesNew();
	    Queue queue = QueueFactory.getQueue(AgileQueues.IP_FILTERS_TRANSFER_QUEUE);
	    for (String namespace : namespaces)
	    {
		IpFilterTransferDeferredTask ipFilterTransferDeferredTask = new IpFilterTransferDeferredTask(namespace);
		// Add to queue
		queue.add(TaskOptions.Builder.withPayload(ipFilterTransferDeferredTask));
	    }
	}
	catch (Exception e)
	{
	    System.err.println(e.getMessage());
	}
	finally
	{
	    
	}
    }
    
}
