package com.agilecrm.ticket.deferred;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.utils.TicketsUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class CreateTestTickets implements DeferredTask
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public void run()
	{
		for (int i = 0; i < 500; i++)
		{
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
					String oldNamespace = NamespaceManager.get();
					try
					{
						NamespaceManager.set("ticketstest");

						for (int j = 0; j < 100; j++)
						{
							try
							{
								TicketsUtil.createDefaultTicket();
							}
							catch (Exception e)
							{
								System.out.println(ExceptionUtils.getFullStackTrace(e));
							}
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
			}));
		}
	}
}
