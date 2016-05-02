package com.agilecrm.ticket.deferred;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.common.collect.Iterables;
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

			System.out.println("Namespace: " + namespace);
			NamespaceManager.set(namespace);

			Set<Key<Tickets>> keys = TicketsUtil.getOverdueTickets();

			System.out.println("Ticket keys size: " + keys.size());

			//Splitting total keys in sub lists with each list of size 25
			final Iterable<List<Key<Tickets>>> lists = Iterables.partition(keys, 25);

			System.out.println("lists is null: " + (lists == null));

			for (Iterator<List<Key<Tickets>>> iter = lists.iterator(); iter.hasNext();)
			{
				final List<Key<Tickets>> sublist = iter.next();

				System.out.println("sublist keys size: " + sublist.size());

				Queue queue = QueueFactory.getQueue("ticket-bulk-actions");
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
							for (Key<Tickets> key : sublist)
							{
								TicketTriggerUtil.executeTriggerForSLAReachedTicket(TicketsUtil.getTicketByID(key
										.getId()));
							}
						}
						catch (Exception e)
						{
							System.out.println(ExceptionUtils.getFullStackTrace(e));
						}
					}
				}));
			}

			System.out.println("Successfully trigger initiated for all tickets.");
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
