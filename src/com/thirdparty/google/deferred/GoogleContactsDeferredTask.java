package com.thirdparty.google.deferred;

import org.apache.commons.lang.StringUtils;

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
	Long contactPrefsId = null;

	public GoogleContactsDeferredTask(String namespace, String duration)
	{
		this.namespace = namespace;
		this.duration = duration;
	}

	public GoogleContactsDeferredTask(String namespace, Long id)
	{
		this.namespace = namespace;
		this.contactPrefsId = id;
	}

	@Override
	public void run()
	{
		// TODO Auto-generated method stub
		/*
		 * if (StringUtils.isEmpty(namespace)) return;
		 */

		syncGooglecontacts(namespace, duration);
	}

	public void syncGooglecontacts(String namespace, String duration)

	{
		String oldNamespace = NamespaceManager.get();
		try
		{
			System.out.println("yyyyyyyyyyyyyyyyyyy");

			String url = BackendServiceFactory.getBackendService().getBackendAddress(Globals.BULK_ACTION_BACKENDS_URL);

			NamespaceManager.set(namespace);

			String uri = "/core/api/bulk-actions/contact-sync/google/";

			System.out.println(duration);
			TaskOptions taskOptions = null;
			if (!StringUtils.isEmpty(duration))
				uri = uri + duration;
			if (contactPrefsId != null)
			{
				taskOptions = TaskOptions.Builder.withUrl(uri + "duration/" + String.valueOf(contactPrefsId))
						.header("Host", url).method(Method.POST);
			}
			else
			{
				taskOptions = TaskOptions.Builder.withUrl(uri).header("Host", url).method(Method.POST);
			}

			System.out.println(taskOptions.getUrl());

			// Create Task and push it into Task Queue
			Queue queue = QueueFactory.getQueue("contact-sync-queue");

			queue.addAsync(taskOptions);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}

	}
}
