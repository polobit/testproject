package com.agilecrm.ticket.utils;

import java.util.Collection;

import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.google.appengine.api.search.ScoredDocument;

/**
 * 
 * @author Mantra
 * 
 */
public class TicketReportsUtil
{
	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static int getTicketsCountBetweenDates(Long startTime, Long endTime)
	{
		String queryString = "created_time >=" + startTime + " AND " + " created_time <= " + endTime;

		System.out.println("Query: " + queryString);

		return new TicketsDocument().countRows(queryString);
	}

	//
	// /**
	// *
	// * @param startTime
	// * @param endTime
	// * @return
	// */
	// public static int getOpenTicketsCountBetweenDates(Long startTime, Long
	// endTime)
	// {
	// String queryString = "assigned_time >=" + startTime + " AND " +
	// " assigned_time <= " + endTime + " AND status="
	// + Status.OPEN;
	//
	// System.out.println("Query: " + queryString);
	//
	// return new TicketsDocument().countRows(queryString);
	// }
	//
	// /**
	// *
	// * @param startTime
	// * @param endTime
	// * @return
	// */
	// public static int getPendingTicketsCountBetweenDates(Long startTime, Long
	// endTime)
	// {
	// String queryString = "last_updated_time >=" + startTime + " AND " +
	// " last_updated_time <= " + endTime
	// + " AND status=" + Status.PENDING;
	//
	// System.out.println("Query: " + queryString);
	//
	// return new TicketsDocument().countRows(queryString);
	// }
	//
	// /**
	// *
	// * @param startTime
	// * @param endTime
	// * @return
	// */
	// public static int getClosedTicketsCountBetweenDates(Long startTime, Long
	// endTime)
	// {
	// String queryString = "closed_time >=" + startTime + " AND " +
	// " closed_time <= " + endTime + " AND status="
	// + Status.CLOSED;
	//
	// System.out.println("Query: " + queryString);
	//
	// return new TicketsDocument().countRows(queryString);
	// }

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static Collection<ScoredDocument> getTicketsBetweenDates(Long startTime, Long endTime,
			String... fieldsToReturn)
	{
		String queryString = "created_time >=" + startTime + " AND " + " created_time <= " + endTime;

		System.out.println("Query: " + queryString);

		return new TicketsDocument().executeQuery(queryString, fieldsToReturn);
	}

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static Collection<ScoredDocument> getTicketSLABetweenDates(Long startTime, Long endTime,
			String... fieldsToReturn)
	{
		String queryString = "created_time >=" + startTime + " AND " + " created_time <= " + endTime + " AND status="
				+ Status.CLOSED;

		System.out.println("Query: " + queryString);

		return new TicketsDocument().executeQuery(queryString, fieldsToReturn);
	}
}
