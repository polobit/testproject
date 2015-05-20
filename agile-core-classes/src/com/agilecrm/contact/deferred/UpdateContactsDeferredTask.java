package com.agilecrm.contact.deferred;

import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.AgileQueues;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;

/**
 * @author kakarlal
 *
 */
@SuppressWarnings("serial")
public class UpdateContactsDeferredTask implements DeferredTask
{
	String domain;

	public UpdateContactsDeferredTask(String domain)
	{
		this.domain = domain;
	}

	@Override
	public void run()
	{
		if (StringUtils.isNotEmpty(domain) && !domain.equals("all"))
		{
			System.out.println("created task for schema change of domain: " + domain);
			// Created a deferred task for report generation
			UpdateContactsOfDomainDeferredTask updateContactDeferredTask = new UpdateContactsOfDomainDeferredTask(
					domain, null, 0);

		    // Create Task and push it into Task Queue
		    TaskOptions taskOptions = TaskOptions.Builder.withPayload(updateContactDeferredTask);
			
			// Add to queue
			Queue queue = QueueFactory.getQueue(AgileQueues.CONTACTS_SCHEMA_CHANGE_QUEUE);
			queue.addAsync(taskOptions);

		}
		else if (StringUtils.isNotEmpty(domain) && domain.equals("all"))
		{
			List<Key<DomainUser>> keys = DomainUserUtil.getAllDomainOwnerKeys();

			System.out.println("domain owners :" + keys);
			Set<String> domains = NamespaceUtil.getAllNamespaces();

			for (String namespace : domains)
			{
				System.out.println("created task for schema change of domain: " + namespace);
				// Created a deferred task for schema update.
				UpdateContactsOfDomainDeferredTask updateContactDeferredTask = new UpdateContactsOfDomainDeferredTask(
						namespace, null, 0);

			    // Create Task and push it into Task Queue
			    TaskOptions taskOptions = TaskOptions.Builder.withPayload(updateContactDeferredTask);
				
				// Add to queue
				Queue queue = QueueFactory.getQueue(AgileQueues.CONTACTS_SCHEMA_CHANGE_QUEUE);
				queue.addAsync(taskOptions);
			}

		}
	}
}