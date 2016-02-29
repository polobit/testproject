package com.agilecrm.ticket.utils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.agilecrm.ticket.entitys.Tickets;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi on 19-Nov-2015
 * 
 */
public class CSVTicketIdsFetcher extends ITicketIdsFetcher
{
	private static final long serialVersionUID = 1L;

	int fetchedCount = 0, fromIndex = 0, toIndex = maxFetch;

	List<String> ticketsList = null;

	public CSVTicketIdsFetcher(String ticketIDs)
	{
		super();
		ticketsList = Arrays.asList(ticketIDs.split(","));
		count = ticketsList.size();
	}

	@Override
	public boolean hasNext()
	{
		if (fetchedCount < ticketsList.size())
			return true;

		return false;
	}

	@Override
	public Set<Key<Tickets>> next()
	{
		List<String> subList = null;

		try
		{
			subList = ticketsList.subList(fromIndex, toIndex);
		}
		catch (Exception e)
		{
			subList = ticketsList.subList(fromIndex, ticketsList.size());
		}

		if (subList == null || subList.size() == 0)
			return new HashSet<Key<Tickets>>();

		fromIndex += maxFetch;
		toIndex += maxFetch;
		fetchedCount += subList.size();

		Set<Key<Tickets>> ticketIDList = new HashSet<Key<Tickets>>();

		for (String key : subList)
			ticketIDList.add(new Key<Tickets>(Tickets.class, Long.parseLong(key.trim())));
		
		return ticketIDList;
	}

	@Override
	public Integer getCount()
	{
		return count;
	}
}
