package com.agilecrm.ticket.utils;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.search.document.TicketDocument;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

/**
 * <code>TicketUtil</code> is a utility class to provide CRUD operations on
 * Tickets.
 * 
 * @author Sasi on 28-Sep-2015
 * @See {@link TicketDocument}
 * 
 */
public class TicketsUtil
{
	/**
	 * Returns list of tickets by type
	 * 
	 * @param groupID
	 * @param status
	 * @param cursor
	 * @param pageSize
	 * @param sortKey
	 * @return
	 */
	public static List<Tickets> getTicketsByGroupID(Long groupID, Status status, String cursor, String pageSize,
			String sortKey)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("status", status);
		searchMap.put("group_id", new Key<TicketGroups>(TicketGroups.class, groupID));

		return Tickets.ticketsDao.fetchAllByOrder(20, cursor, searchMap, false, true, sortKey);
	}
	
	/**
	 * 
	 * @param groupID
	 * @param status
	 * @return
	 */
	public static int getTicketsCountByType(Long groupID, Status status)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("status", status);
		searchMap.put("group_id", new Key<TicketGroups>(TicketGroups.class, groupID));

		return Tickets.ticketsDao.getCountByProperty(searchMap);
	}
	
	/**
	 * 
	 * @param groupID
	 * @param status
	 * @return
	 */
	public static List<Tickets> getFavoriteTickets(Long groupID)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("is_favorite", true);
		searchMap.put("group_id", new Key<TicketGroups>(TicketGroups.class, groupID));

		return Tickets.ticketsDao.listByProperty(searchMap);
	}
	
	/**
	 * 
	 * @param groupID
	 * @param status
	 * @return
	 */
	public static int getFavoriteTicketsCount(Long groupID)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("is_favorite", true);
		searchMap.put("group_id", new Key<TicketGroups>(TicketGroups.class, groupID));

		return Tickets.ticketsDao.getCountByProperty(searchMap);
	}

	/**
	 * Returns a Ticket object for given ticket ID
	 * 
	 * @param ticketID
	 * @return Ticket object
	 * @throws EntityNotFoundException
	 */
	public static Tickets getTicketByID(Long ticketID) throws EntityNotFoundException
	{
		return Tickets.ticketsDao.get(ticketID);
	}

	/**
	 * Creates new ticket in {@link Tickets} table and adds to text search
	 * {@link TicketDocument}.
	 * 
	 * @param group_id
	 * @param assigned_to_group
	 * @param requester_name
	 * @param requester_email
	 * @param subject
	 * @param cc_emails
	 * @param plain_text
	 * @param html_text
	 * @param source
	 * @param attachments
	 * @param ipAddress
	 * 
	 * @return {@link Tickets} object
	 */
	public static Tickets createTicket(Long group_id, Boolean assigned_to_group, String requester_name,
			String requester_email, String subject, String cc_emails, String plain_text, Source source,
			Boolean attachments, String ipAddress)
	{
		Tickets ticket = null;

		try
		{
			ticket = new Tickets(group_id, assigned_to_group, requester_name, requester_email, subject, cc_emails,
					plain_text, source, attachments);

			Long createdTime = Calendar.getInstance().getTimeInMillis();

			ticket.created_time = createdTime;
			ticket.last_updated_time = createdTime;
			ticket.last_customer_replied_time = createdTime;
			ticket.last_updated_by = LAST_UPDATED_BY.REQUESTER;
			ticket.last_reply_text = plain_text;
			ticket.status = Status.NEW;
			ticket.type = Type.PROBLEM;
			ticket.priority = Priority.LOW;
			ticket.requester_ip_address = ipAddress;
			// Get country and city from ipaddress
			Key<Tickets> key = Tickets.ticketsDao.put(ticket);

			System.out.println("key: " + key.getId());

			ticket.short_id = getTicketShortID(key.getId()) + "";
			Tickets.ticketsDao.put(ticket);

			// Create search document
			new TicketDocument().add(ticket);
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}

		return ticket;
	}

	/**
	 * Updates existing {@link Tickets} as well as text search document
	 * {@link TicketDocument}
	 * 
	 * @param ticketID
	 * @param cc_emails
	 * @param last_reply_plain_text
	 * @param attachments_exists
	 * @return {@link Tickets} object
	 * @throws EntityNotFoundException
	 */
	public static Tickets updateTicket(Long ticketID, String cc_emails, String last_reply_plain_text,
			LAST_UPDATED_BY last_updated_by, Long updated_time, Long customer_replied_time,
			Long last_agent_replied_time, Boolean attachments_exists) throws EntityNotFoundException
	{
		// Get existing ticket
		Tickets ticket = TicketsUtil.getTicketByID(ticketID);

		ticket.cc_emails = cc_emails;
		ticket.last_updated_time = updated_time;
		ticket.last_updated_by = last_updated_by;
		ticket.last_reply_text = last_reply_plain_text;
		ticket.user_replies_count += 1;

		if (customer_replied_time != null)
			ticket.last_customer_replied_time = customer_replied_time;

		if (last_agent_replied_time != null)
			ticket.last_agent_replied_time = last_agent_replied_time;

		if (!ticket.attachments_exists)
			ticket.attachments_exists = attachments_exists;

		Tickets.ticketsDao.put(ticket);

		// Update search document
		new TicketDocument().edit(ticket);

		return ticket;
	}

	/**
	 * 
	 * @param ticketID
	 * @return
	 */
	public static Long getTicketShortID(Long ticketID)
	{
		return ticketID;
	}
}