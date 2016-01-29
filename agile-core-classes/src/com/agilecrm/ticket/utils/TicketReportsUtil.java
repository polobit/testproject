package com.agilecrm.ticket.utils;

import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.ticket.entitys.Tickets.Status;

/**
 * 
 * @author Mantra
 * 
 */
public class TicketReportsUtil
{
	public static int getNewTicketsCountBetweenDates(Long startTime, Long endTime)
	{
		String queryString = "created_time >=" + startTime + " AND " + " created_time <= " + endTime + " AND status="
				+ Status.NEW;

		System.out.println("Query: " + queryString);

		return new TicketsDocument().countRows(queryString);
	}

	public static int getOpenTicketsCountBetweenDates(Long startTime, Long endTime)
	{
		String queryString = "assigned_time >=" + startTime + " AND " + " assigned_time <= " + endTime + " AND status="
				+ Status.OPEN;

		System.out.println("Query: " + queryString);

		return new TicketsDocument().countRows(queryString);
	}

	public static int getPendingTicketsCountBetweenDates(Long startTime, Long endTime)
	{
		String queryString = "last_updated_time >=" + startTime + " AND " + " last_updated_time <= " + endTime
				+ " AND status=" + Status.PENDING;

		System.out.println("Query: " + queryString);

		return new TicketsDocument().countRows(queryString);
	}

	public static int getClosedTicketsCountBetweenDates(Long startTime, Long endTime)
	{
		String queryString = "closed_time >=" + startTime + " AND " + " closed_time <= " + endTime + " AND status="
				+ Status.CLOSED;

		System.out.println("Query: " + queryString);

		return new TicketsDocument().countRows(queryString);
	}
}
