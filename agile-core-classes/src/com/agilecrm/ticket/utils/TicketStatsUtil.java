package com.agilecrm.ticket.utils;

import javax.print.attribute.standard.Fidelity;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.AllDomainStats;
import com.agilecrm.alldomainstats.util.AllDomainStatsUtil;
import com.agilecrm.ticket.entitys.TicketStats;
import com.agilecrm.util.DateUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * 
 * @author Sasi
 * 
 */
public class TicketStatsUtil
{
	/**
	 * Get the all Domain Stats present in Database..
	 * 
	 * @param created_time
	 * @return current created date
	 */
	public static TicketStats getTicketStats(long created_time)
	{
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");

		try
		{
			return TicketStats.ticketStatsdao.getByProperty("created_time", created_time);
		}
		catch (Exception e)
		{
			System.out.println("No record found. Returning empty object.");
			return new TicketStats(created_time);
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}

	public static void updateEntity(final String fieldName)
	{
		Queue queue = QueueFactory.getDefaultQueue();
		
		queue.add(TaskOptions.Builder.withPayload(new DeferredTask()
		{
			private static final long serialVersionUID = 1L;

			@Override
			public void run()
			{
				try
				{
					DateUtil dateUtil = new DateUtil();

					long created_time = dateUtil.toMidnight().getCalendar().getTimeInMillis();
					created_time = created_time / 1000L;

					// Getting current day stats count details
					TicketStats ticketStats = getTicketStats(created_time);

					ticketStats.incrementField(fieldName);

					ticketStats.save();
				}
				catch (Exception e)
				{
					System.out.println(ExceptionUtils.getFullStackTrace(e));
				}
			}
		}));
	}
}
