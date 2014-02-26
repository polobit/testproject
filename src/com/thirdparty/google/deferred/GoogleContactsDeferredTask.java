package com.thirdparty.google.deferred;

import com.agilecrm.Globals;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.backends.BackendServiceFactory;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TaskOptions.Method;

public class GoogleContactsDeferredTask implements DeferredTask
{

	String namespace = null;
	String duration = null;

	public GoogleContactsDeferredTask(String namespace, String duration)
	{
		this.namespace = namespace;
		this.duration = duration;
	}

	@Override
	public void run()
	{
		// TODO Auto-generated method stub
		// if (StringUtils.isEmpty(namespace))
		// return;

		syncGooglecontacts(namespace, duration);
	}

	public void syncGooglecontacts(String namespace, String duration)

	{
		String oldNamespace = NamespaceManager.get();
		try
		{

			String url = BackendServiceFactory.getBackendService().getBackendAddress(Globals.BULK_ACTION_BACKENDS_URL);

			NamespaceManager.set(namespace);

			// Create Task and push it into Task Queue
			Queue queue = QueueFactory.getQueue("contact-sync-queue");
			TaskOptions taskOptions = TaskOptions.Builder
					.withUrl("/core/api/bulk-actions/contact-sync/google/" + duration).header("Host", url)
					.method(Method.POST);

			queue.addAsync(taskOptions);
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}

	}
}
