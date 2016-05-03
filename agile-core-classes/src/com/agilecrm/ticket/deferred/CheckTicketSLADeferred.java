package com.agilecrm.ticket.deferred;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

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
				List<Key<Tickets>> sublist = iter.next();
				
				System.out.println("sublist keys size: " + sublist.size());
				
				List<Long> ticketIDList = new ArrayList<>();
				
				//Converting ticket Keys to ticket IDs as Key is not serializable to create new task with Keys list.
				for(Key<Tickets> key : sublist)
					ticketIDList.add(key.getId());
				
				//Using normal variable in annonymous class is not permitted to copying to final variable.
				final List<Long> TICKET_ID_LIST = ticketIDList;
				
				System.out.println("TICKET_ID_LIST id size: " + TICKET_ID_LIST.size());
				
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
							for (Long ticketID : TICKET_ID_LIST)
							{
								TicketTriggerUtil.executeTriggerForSLAReachedTicket(TicketsUtil.getTicketByID(ticketID));
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