package com.agilecrm.ticket.rest;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi
 * 
 */
public class CheckTicketSLADeferred implements DeferredTask
{
	private String namespace = "";

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CheckTicketSLADeferred(String namespace)
	{
		super();
		this.namespace = namespace;
	}

	@Override
	public void run()
	{
		String oldNamespace = NamespaceManager.get();

		try
		{
			if (StringUtils.isEmpty(namespace))
				return;

			NamespaceManager.set(namespace);

			List<Key<Tickets>> keys = TicketsUtil.getOverdueTickets();
			
			System.out.println("Namespace: " + namespace);
			System.out.println("CheckTicketSLADeferred keys: " + keys);

			for (final Key<Tickets> key : keys)
			{
				Queue queue = QueueFactory.getQueue("reports-queue");
				queue.add(TaskOptions.Builder.withPayload(new DeferredTask()
				{
					/**
					 * 
					 */
					private static final long serialVersionUID = 1L;

					@Override
					public void run()
					{
						try
						{
							TicketTriggerUtil.executeTriggerForSLAReachedTicket(TicketsUtil.getTicketByID(key.getId()));
						}
						catch (EntityNotFoundException e)
						{
							System.out.println(ExceptionUtils.getFullStackTrace(e));
						}
					}
				}));
			}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}
}
