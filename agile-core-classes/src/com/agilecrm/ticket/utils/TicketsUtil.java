package com.agilecrm.ticket.utils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.ticket.entitys.TicketActivity;
import com.agilecrm.ticket.entitys.TicketActivity.TicketActivityType;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.entitys.Tickets.Type;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

/**
 * <code>TicketUtil</code> is a utility class to provide CRUD operations on
 * Tickets.
 * 
 * @author Sasi on 28-Sep-2015
 * @See {@link TicketsDocument}
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
	 * Returns list of tickets by type
	 * 
	 * @param groupID
	 * @param status
	 * @param cursor
	 * @param pageSize
	 * @param sortKey
	 * @return
	 */
	public static Tickets getLastCreatedTicket()
	{
		return null;
	}

	public static List<Tickets> getTicketsBulk(List<Long> idsArray)
	{
		List<Key<Tickets>> ticketKeys = new ArrayList<Key<Tickets>>();

		for (Long id : idsArray)
		{
			ticketKeys.add(new Key<Tickets>(Tickets.class, id));
		}
		List<Tickets> list = Tickets.ticketsDao.fetchAllByKeys(ticketKeys);

		System.out.println("getTicketsBulk size: " + list.size());

		return list;
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
			Source source, Boolean attachments, String ipAddress, List<Key<TicketLabels>> labelsKeysList)
	{
		Tickets ticket = new Tickets();

		try
		{
			ticket.group_id = new Key<TicketGroups>(TicketGroups.class, group_id);
			ticket.labels_keys_list = labelsKeysList;
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
			ticket.last_reply_text = plain_text;
			ticket.attachments_exists = attachments;

			ticket.created_time = epochTime;
			ticket.last_updated_time = epochTime;
			ticket.last_customer_replied_time = epochTime;
			ticket.last_updated_by = LAST_UPDATED_BY.REQUESTER;
			ticket.requester_ip_address = ipAddress;
			ticket.user_replies_count = 1;

			/**
			 * Checking if new ticket requester is exists in Contacts
			 */
			Contact contact = ContactUtil.searchContactByEmail(requester_email);

			if (contact == null)
				contact = ContactUtil.createContact(requester_name, requester_email);

			ticket.contact_key = new Key<Contact>(Contact.class, contact.id);
			ticket.contactID = contact.id;

			// Save ticket
			ticket.saveWithNewID();

			// Create search document
			new TicketsDocument().add(ticket);

			// Logging ticket created activity
			new TicketActivity(TicketActivityType.TICKET_CREATED, ticket.contactID, ticket.id, "", plain_text,
					"last_reply_text").save();

			// Execute triggers
			TicketTriggerUtil.executeTriggerForNewTicket(ticket);
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
	 * {@link TicketsDocument}
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
		new TicketsDocument().edit(ticket);

		return ticket;
	}

	/**
	 * 
	 * @param ticket_id
	 * @param priority
	 * @return updated ticket
	 * @throws EntityNotFoundException
	 */
	public static Tickets changeStatus(Long ticket_id, Status status) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		if (ticket.status == status)
			return ticket;

		Status oldStatus = ticket.status;
		ticket.status = status;

		if (status == Status.CLOSED)
			ticket.closed_time = Calendar.getInstance().getTimeInMillis();

		Tickets.ticketsDao.put(ticket);

		// Updating search document
		new TicketsDocument().edit(ticket);

		// Logging activity
		new TicketActivity(TicketActivityType.TICKET_STATUS_CHANGE, ticket.contactID, ticket.id, oldStatus.toString(),
				status.toString(), "status").save();

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
	public static Tickets changeGroup(Long ticket_id, Long group_id) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		Long oldGroupID = ticket.groupID;

		ticket.group_id = new Key<TicketGroups>(TicketGroups.class, group_id);
		ticket.groupID = group_id;

		Tickets.ticketsDao.put(ticket);

		// Update search document
		new TicketsDocument().edit(ticket);

		// Logging ticket assigned activity
		new TicketActivity(TicketActivityType.TICKET_GROUP_CHANGED, ticket.contactID, ticket.id, oldGroupID + "",
				group_id + "", "groupID").save();

		return ticket;
	}

	/**
	 * 
	 * @param ticket_id
	 * @param assignee_id
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static Tickets assignTicket(Long ticket_id, Long assignee_id) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		boolean isNewTicket = false;

		if (ticket.status == Status.NEW)
		{
			ticket.status = Status.OPEN;
			isNewTicket = true;
		}

		ticket.assignee_id = new Key<DomainUser>(DomainUser.class, assignee_id);
		ticket.assigned_to_group = false;

		ticket.assigned_time = Calendar.getInstance().getTimeInMillis();

		Tickets.ticketsDao.put(ticket);

		// Update search document
		new TicketsDocument().edit(ticket);

		if (isNewTicket)
			// Logging ticket assigned activity
			new TicketActivity(TicketActivityType.TICKET_ASSIGNED, ticket.contactID, ticket.id, null, assignee_id + "",
					"assigneeID").save();
		else
			// Logging ticket transfer activity
			new TicketActivity(TicketActivityType.TICKET_ASSIGNEE_CHANGED, ticket.contactID, ticket.id,
					ticket.assignee_id + "", assignee_id + "", "assigneeID").save();

		return ticket;
	}

	/**
	 * 
	 * @param ticket_id
	 * @param priority
	 * @return updated ticket
	 * @throws EntityNotFoundException
	 */
	public static Tickets changePriority(Long ticket_id, Priority newPriority) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);
		Priority oldPriority = ticket.priority;
		ticket.priority = newPriority;

		Tickets.ticketsDao.put(ticket);

		// Updating search document
		new TicketsDocument().edit(ticket);

		// Logging activity
		new TicketActivity(TicketActivityType.TICKET_PRIORITY_CHANGE, ticket.contactID, ticket.id,
				oldPriority.toString(), newPriority.toString(), "priority").save();

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
	public static Tickets changeTicketType(Long ticket_id, Type newTicketType) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		Type oldTicketType = ticket.type;

		// Updating with new ticket type
		ticket.type = newTicketType;
		Tickets.ticketsDao.put(ticket);

		// Update search document
		new TicketsDocument().edit(ticket);

		// Logging activity
		new TicketActivity(TicketActivityType.TICKET_TYPE_CHANGE, ticket.contactID, ticket.id,
				oldTicketType.toString(), newTicketType.toString(), "type").save();

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
		new TicketsDocument().edit(ticket);

		// Logging activity
		new TicketActivity((is_favorite ? TicketActivityType.TICKET_MARKED_FAVORITE
				: TicketActivityType.TICKET_MARKED_UNFAVORITE), ticket.contactID, ticket.id, "", "", "is_favorite")
				.save();

		return ticket;
	}

	public static Tickets markSpam(Long ticket_id, Boolean is_spam) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);
		ticket.is_spam = is_spam;

		Tickets.ticketsDao.put(ticket);

		// Update search document
		new TicketsDocument().edit(ticket);

		// Logging activity
		new TicketActivity((is_spam ? TicketActivityType.TICKET_MARKED_SPAM : TicketActivityType.TICKET_MARKED_UNSPAM),
				ticket.contactID, ticket.id, "", "", "is_spam").save();

		return ticket;
	}

	public static Tickets forwardTicket(Long ticket_id, String content, String email) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		try
		{
			String agentName = DomainUserUtil.getDomainUser(ticket.assigneeID).name;

			String fromAddress = DomainUserUtil.getDomainUser(ticket.assigneeID).email;

			// Send email
			TicketNotesUtil.sendEmail(ticket.requester_email, ticket.subject, agentName, fromAddress, ticket.cc_emails,
					SendMail.TICKET_REPLY, new JSONObject());
		}
		catch (Exception e)
		{
		}

		// Logging activity
		new TicketActivity(TicketActivityType.TICKET_NOTES_FORWARD, ticket.contactID, ticket.id, "", email, "").save();

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

		if (ticket.status == Status.CLOSED)
			return ticket;

		Status oldStatus = ticket.status;

		ticket.status = Status.CLOSED;
		ticket.closed_time = Calendar.getInstance().getTimeInMillis();

		Tickets.ticketsDao.put(ticket);

		// Update search document
		new TicketsDocument().edit(ticket);

		// Logging activity
		new TicketActivity(TicketActivityType.TICKET_STATUS_CHANGE, ticket.contactID, ticket.id, oldStatus.toString(),
				Status.CLOSED.toString(), "status").save();

		return ticket;
	}

	/**
	 * 
	 * @param ticket_id
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static Tickets updateLabels(Long ticket_id, Key<TicketLabels> label, String command)
			throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		List<Key<TicketLabels>> labels = ticket.labels_keys_list;

		TicketActivityType ticketActivityType = null;

		if ("add".equalsIgnoreCase(command))
		{
			labels.add(label);
			ticketActivityType = TicketActivityType.TICKET_LABEL_ADD;
		}
		else
		{
			labels.remove(label);
			ticketActivityType = TicketActivityType.TICKET_LABEL_REMOVE;
		}

		ticket.labels_keys_list = labels;
		Tickets.ticketsDao.put(ticket);

		new TicketsDocument().edit(ticket);

		// Logging activity
		new TicketActivity(ticketActivityType, ticket.contactID, ticket.id, "", label.getId() + "", "labels").save();

		return ticket;
	}

	/**
	 * To Update cc emails
	 * 
	 * @param ticket_id
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static Tickets updateCCEmails(Long ticket_id, String email, String command) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		List<String> CCEmails = ticket.cc_emails;

		TicketActivityType ticketActivityType = null;

		if ("add".equalsIgnoreCase(command))
		{
			CCEmails.add(email.trim());
			ticketActivityType = TicketActivityType.TICKET_CC_EMAIL_ADD;
		}
		else
		{
			CCEmails.remove(email);
			ticketActivityType = TicketActivityType.TICKET_CC_EMAIL_REMOVE;
		}

		ticket.cc_emails = CCEmails;
		Tickets.ticketsDao.put(ticket);

		new TicketsDocument().edit(ticket);

		// Logging activity
		new TicketActivity(ticketActivityType, ticket.contactID, ticket.id, "", email, "cc_emails").save();

		return ticket;
	}

	public static void updateLabels(Long ticketId, String[] labelsArray, String type) throws Exception
	{
		for (String label : labelsArray)
		{
			TicketLabels ticketLabel = TicketLabelsUtil.getLabelByName(label);

			try
			{
				TicketsUtil.updateLabels(ticketId, new Key<TicketLabels>(TicketLabels.class, ticketLabel.id),
						type.toLowerCase());
			}
			catch (Exception e)
			{
				System.out.println(e.getMessage());
			}
		}

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
				if (map.containsKey(ticket.assigneeID))
					try
					{
						ticket.assignee = map.get(ticket.assigneeID);
					}
					catch (Exception e)
					{
						System.out.println(ExceptionUtils.getFullStackTrace(e));
					}
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
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
		Tickets ticket = getTicketByID(ticket_id);

		// Deleting ticket
		Tickets.ticketsDao.deleteKey(new Key<Tickets>(Tickets.class, ticket_id));

		// Deleting notes
		TicketNotesUtil.deleteNotes(ticket_id);

		// Deleting document from text search
		new TicketsDocument().delete(ticket_id + "");

		// Logging deleting ticket activity
		new TicketActivity(TicketActivityType.TICKET_DELETED, ticket.contactID, ticket.id, "", "", "").save();
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

	/**
	 * Change ticket group and assignee
	 * 
	 * @param ticket_id
	 * @param group_id
	 * @param assignee_id
	 * @return Tickets
	 * @throws EntityNotFoundException
	 */
	public static Tickets changeGroupAndAssignee(Long ticket_id, Long group_id, Long assignee_id)
			throws EntityNotFoundException
	{
		// Fetching ticket object by its id
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		// Verifying if ticket assigned to same Group and Assignee
		if ((ticket.groupID != null && ticket.groupID == group_id)
				&& (ticket.assigneeID != null && ticket.assigneeID == assignee_id))
			return ticket;

		// Copying old data to create ticket activity
		Long oldGroupID = ticket.groupID, oldAssigneeID = ticket.assigneeID;

		// Verifying if ticket is assigned to Group. This happens only if ticket
		// is NEW.
		if (assignee_id == null || assignee_id == 0)
		{
			// Assigning new group to ticket
			ticket.group_id = new Key<TicketGroups>(TicketGroups.class, group_id);
			ticket.groupID = group_id;

			ticket.assigned_to_group = true;

			// Updating ticket entity
			Tickets.ticketsDao.put(ticket);

			// Update search document
			new TicketsDocument().edit(ticket);

			// Logging group change activity
			if (oldGroupID != ticket.groupID)
				new TicketActivity(TicketActivityType.TICKET_GROUP_CHANGED, ticket.contactID, ticket.id, oldGroupID
						+ "", group_id + "", "groupID").save();
		}
		else
		{
			// Fetching ticket group
			TicketGroups group = TicketGroupUtil.getTicketGroupById(group_id);

			// Checking if assignee belongs to given group or not
			if (!group.agents_keys.contains(assignee_id))
				return ticket;

			boolean isNewTicket = false;
			if (ticket.status == Status.NEW)
			{
				ticket.status = Status.OPEN;
				isNewTicket = true;
			}

			// Assigning new agent to ticket
			ticket.assigned_time = Calendar.getInstance().getTimeInMillis();
			ticket.assignee_id = new Key<DomainUser>(DomainUser.class, assignee_id);
			ticket.assigneeID = assignee_id;
			ticket.assigned_to_group = false;

			// Assigning new group to ticket
			ticket.group_id = new Key<TicketGroups>(TicketGroups.class, group_id);
			ticket.groupID = group_id;

			// Updating ticket entity
			Tickets.ticketsDao.put(ticket);

			// Updating search document
			new TicketsDocument().edit(ticket);

			// Logging group change activity
			if (oldGroupID != ticket.groupID)
				new TicketActivity(TicketActivityType.TICKET_GROUP_CHANGED, ticket.contactID, ticket.id, oldGroupID
						+ "", group_id + "", "groupID").save();

			// Logging new ticket assigned activity
			if (isNewTicket)
				new TicketActivity(TicketActivityType.TICKET_ASSIGNED, ticket.contactID, ticket.id, "", assignee_id
						+ "", "assigneeID").save();
			else
				// Logging ticket assignee changed activity
				new TicketActivity(TicketActivityType.TICKET_ASSIGNEE_CHANGED, ticket.contactID, ticket.id,
						oldAssigneeID + "", assignee_id + "", "assigneeID").save();
		}

		return ticket;
	}

	public static Tickets changeDueDate(long ticketID, long dueDate) throws EntityNotFoundException
	{
		// Fetching ticket object by its id
		Tickets ticket = TicketsUtil.getTicketByID(ticketID);

		long oldDueDate = (ticket.due_time != null) ? ticket.due_time : 0l;

		ticket.due_time = dueDate;

		// Updating ticket entity
		Tickets.ticketsDao.put(ticket);

		// Updating search document
		new TicketsDocument().edit(ticket);

		// Logging ticket assignee changed activity
		new TicketActivity(TicketActivityType.DUE_DATE_CHANGED, ticket.contactID, ticket.id, oldDueDate + "", dueDate
				+ "", "due_date").save();

		return ticket;
	}

	/**
	 * Send email to group
	 * 
	 * @param groupId
	 * @param subject
	 * @param body
	 * @throws EntityNotFoundException
	 * @throws JSONException
	 */
	public static void sendEmailToGroup(long group_id, String subject, String body) throws EntityNotFoundException,
			JSONException
	{
		// Fetching ticket group
		TicketGroups group = TicketGroupUtil.getTicketGroupById(group_id);

		List<Long> users_keys = group.agents_keys;
		List<Key<DomainUser>> domainUserKeys = new ArrayList<Key<DomainUser>>();

		for (Long userKey : users_keys)
			domainUserKeys.add(new Key<DomainUser>(DomainUser.class, userKey));

		List<DomainUser> users = DomainUserUtil.dao.fetchAllByKeys(domainUserKeys);

		for (DomainUser user : users)
			sendEmailToUser(user.email, subject, body);
	}

	/**
	 * Send email to user
	 * 
	 * @param groupId
	 * @param subject
	 * @param body
	 * @throws JSONException
	 */
	public static void sendEmailToUser(String email, String subject, String body) throws JSONException
	{
		Map<String, String> data = new HashMap<String, String>();
		data.put("body", body);

		SendMail.sendMail(email, subject, SendMail.TICKET_SEND_EMAIL_TO_USER, data);
	}

	/**
	 * 
	 */
	public static List<Tickets> getTicketsByEmail(String email) throws JSONException
	{
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("requester_email", email);

		return Tickets.ticketsDao.listByProperty(map);
	}
}