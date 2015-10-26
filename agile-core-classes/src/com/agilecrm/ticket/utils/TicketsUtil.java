package com.agilecrm.ticket.utils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Tag;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.document.TicketDocument;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
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

		return Tickets.ticketsDao.fetchAllByOrder(Integer.parseInt(pageSize), cursor, searchMap, false, true, sortKey);
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
	public static List<Tickets> getFavoriteTickets(Long groupID, String cursor, String pageSize)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("is_favorite", true);
		searchMap.put("group_id", new Key<TicketGroups>(TicketGroups.class, groupID));

		return Tickets.ticketsDao.fetchAllByOrder(Integer.parseInt(pageSize), cursor, searchMap, false, true, "");
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
	 * 
	 * @param group_id
	 * @param assignee_id
	 * @param requester_name
	 * @param requester_email
	 * @param subject
	 * @param cc_emails
	 * @param plain_text
	 * @param status
	 * @param type
	 * @param priority
	 * @param source
	 * @param attachments
	 * @param ipAddress
	 * @param tags
	 * @return
	 */
	public static Tickets createTicket(Long group_id, Long assignee_id, String requester_name, String requester_email,
			String subject, List<String> cc_emails, String plain_text, Status status, Type type, Priority priority,
			Source source, Boolean attachments, String ipAddress, List<Tag> tags)
	{
		Tickets ticket = new Tickets();

		try
		{
			ticket.group_id = new Key<TicketGroups>(TicketGroups.class, group_id);
			ticket.tags = tags;
			ticket.status = status;
			ticket.type = type;
			ticket.priority = priority;
			ticket.source = source;

			Long epochTime = Calendar.getInstance().getTimeInMillis();

			/**
			 * Verifying for ticket status. If Open then ticket should be
			 * assigned to someone.
			 */
			if (status == Status.OPEN)
			{
				ticket.assignee_id = new Key<DomainUser>(DomainUser.class, assignee_id);
				ticket.assigned_time = epochTime;
			}
			else
				ticket.assigned_to_group = true;

			ticket.requester_name = requester_name;
			ticket.requester_email = requester_email;
			ticket.subject = subject;
			ticket.cc_emails = cc_emails;
			ticket.first_notes_text = plain_text;
			ticket.attachments_exists = attachments;

			ticket.created_time = epochTime;
			ticket.last_updated_time = epochTime;
			ticket.last_customer_replied_time = epochTime;
			ticket.last_updated_by = LAST_UPDATED_BY.REQUESTER;
			ticket.requester_ip_address = ipAddress;
			ticket.user_replies_count = 1;

			Key<Tickets> key = Tickets.ticketsDao.put(ticket);

			ticket.short_id = getTicketShortID(key.getId()) + "";

			/**
			 * Checking if new ticket requester is exists in Contacts
			 */
			Contact contact = ContactUtil.searchContactByEmail(requester_email);

			if (contact == null)
				contact = ContactUtil.createContact(requester_name, requester_email);

			ticket.contact_key = new Key<Contact>(Contact.class, contact.id);

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
	public static Tickets updateTicket(Long ticketID, List<String> cc_emails, String last_reply_plain_text,
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
	 * @param ticket_id
	 * @param group_id
	 * @param assignee_id
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static Tickets assignTicket(Long ticket_id, Long group_id, Long assignee_id) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		if (ticket.status == Status.NEW)
			ticket.status = Status.OPEN;

		if (group_id != null)
			ticket.group_id = new Key<TicketGroups>(TicketGroups.class, group_id);

		if (assignee_id != null)
		{
			ticket.assignee_id = new Key<DomainUser>(DomainUser.class, assignee_id);
			ticket.assigned_to_group = false;
		}
		else
			ticket.assigned_to_group = true;

		ticket.assigned_time = Calendar.getInstance().getTimeInMillis();

		Tickets.ticketsDao.put(ticket);

		// Update search document
		new TicketDocument().edit(ticket);

		return ticket;
	}

	/**
	 * 
	 * @param ticket_id
	 * @param priority
	 * @return updated ticket
	 * @throws EntityNotFoundException
	 */
	public static Tickets changePriority(Long ticket_id, Priority priority) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);
		ticket.priority = priority;

		Tickets.ticketsDao.put(ticket);

		// Update search document
		new TicketDocument().edit(ticket);

		return ticket;
	}

	/**
	 * 
	 * @param ticket_id
	 * @param priority
	 * @return updated ticket
	 * 
	 * @throws EntityNotFoundException
	 */
	public static Tickets changeTicketType(Long ticket_id, Type type) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);
		ticket.type = type;

		Tickets.ticketsDao.put(ticket);

		// Update search document
		new TicketDocument().edit(ticket);

		return ticket;
	}

	/**
	 * 
	 * @param ticket_id
	 * @param is_favorite
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static Tickets markFavorite(Long ticket_id, Boolean is_favorite) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);
		ticket.is_favorite = is_favorite;

		Tickets.ticketsDao.put(ticket);

		// Update search document
		new TicketDocument().edit(ticket);

		return ticket;
	}

	/**
	 * 
	 * @param ticket_id
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static Tickets closeTicket(Long ticket_id) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);
		ticket.status = Status.CLOSED;
		ticket.closed_time = Calendar.getInstance().getTimeInMillis();

		Tickets.ticketsDao.put(ticket);

		// Update search document
		new TicketDocument().edit(ticket);

		return ticket;
	}

	/**
	 * 
	 * @param ticket_id
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static Tickets updateTags(Long ticket_id, Tag tag, String command) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		List<Tag> tags = ticket.tags;

		if ("add".equalsIgnoreCase(command))
			tags.add(tag);
		else
			tags.remove(tag);

		ticket.tags = tags;
		Tickets.ticketsDao.put(ticket);

		new TicketDocument().edit(ticket);

		return ticket;
	}

	/**
	 * 
	 * @param tickets
	 * @return
	 */
	public static List<Tickets> inclGroupDetails(List<Tickets> tickets)
	{
		try
		{
			Map<Long, TicketGroups> groupsList = new HashMap<Long, TicketGroups>();

			for (Tickets ticket : tickets)
			{
				Long groupID = ticket.groupID;

				if (!groupsList.containsKey(groupID))
					groupsList.put(groupID, TicketGroups.ticketGroupsDao.get(groupID));

				ticket.group = groupsList.get(groupID);
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

		return tickets;
	}

	/**
	 * 
	 * @param notes
	 * @return
	 */
	public static List<Tickets> inclDomainUsers(List<Tickets> tickets)
	{
		String oldnamespace = NamespaceManager.get();

		try
		{
			Set<Key<DomainUser>> domainUserKeys = new HashSet<Key<DomainUser>>();

			Map<Long, DomainUser> map = new HashMap<Long, DomainUser>();

			NamespaceManager.set("");

			for (Tickets ticket : tickets)
				if (ticket.assigneeID != null)
					domainUserKeys.add(new Key<DomainUser>(DomainUser.class, ticket.assigneeID));

			System.out.println("domainUserKeys: " + domainUserKeys);

			if (domainUserKeys.size() == 0)
				return tickets;

			List<DomainUser> domainUsers = DomainUserUtil.dao.fetchAllByKeys(new ArrayList<Key<DomainUser>>(
					domainUserKeys));

			System.out.println("domainUsers: " + domainUsers);

			for (DomainUser domainUser : domainUsers)
				map.put(domainUser.id, domainUser);

			for (Tickets ticket : tickets)
				ticket.assignee = map.get(ticket.assigneeID);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldnamespace);
		}

		return tickets;
	}

	/**
	 * 
	 * @param ticket_id
	 * @throws EntityNotFoundException
	 */
	public static void deleteTicket(Long ticket_id) throws EntityNotFoundException
	{
		Tickets.ticketsDao.deleteKey(new Key<Tickets>(Tickets.class, ticket_id));

		new TicketDocument().delete(ticket_id + "");
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