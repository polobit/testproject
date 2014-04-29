package com.agilecrm.subscription.limits.cron.deferred;

import java.util.Set;

import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class TestTask implements DeferredTask
{

    @Override
    public void run()
    {
	// TODO Auto-generated method stub
	// Fetches all namespaces
	Set<String> namespaces = NamespaceUtil.getAllNamespaces();

	// Iterates through each Namespace and initiates task for each namespace
	// to update usage info
	for (String namespace : namespaces)
	{
	    AccountLimitsRemainderDeferredTask task = new AccountLimitsRemainderDeferredTask(namespace);

	    // Add to queue
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.add(TaskOptions.Builder.withPayload(task));
	}
    }

}
