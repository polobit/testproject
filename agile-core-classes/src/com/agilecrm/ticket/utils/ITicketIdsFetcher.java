package com.agilecrm.ticket.utils;

import java.io.Serializable;
import java.util.Set;

import com.agilecrm.ticket.entitys.Tickets;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi on 19-Nov-2015
 * 
 */
public abstract class ITicketIdsFetcher implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	Integer maxFetch = 200;

	public ITicketIdsFetcher()
	{

	}

	public abstract boolean hasNext();

	public abstract Set<Key<Tickets>> next();
}
