package com.agilecrm.ticket.utils;

import java.io.Serializable;
import java.util.Set;

import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.rest.TicketBulkActionsBackendsRest;
import com.googlecode.objectify.Key;

/**
 * ITicketIdsFetcher is a root interface for fetching tickets ids based on
 * iterator pattern.
 * 
 * @author Sasi on 19-Nov-2015
 * 
 * {@link TicketBulkActionsBackendsRest}
 */
public abstract class ITicketIdsFetcher implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	Integer maxFetch = 200;
	Integer count = 0;

	public ITicketIdsFetcher()
	{

	}

	/**
	 * Returns true if their exists an other set of ticket keys to return
	 * 
	 * @return
	 */
	public abstract boolean hasNext();

	/**
	 * Returns set of keys
	 * 
	 * @return
	 */
	public abstract Set<Key<Tickets>> next();

	/**
	 * Returns total number of tickets found
	 * 
	 * @return
	 */
	public abstract Integer getCount();
}
