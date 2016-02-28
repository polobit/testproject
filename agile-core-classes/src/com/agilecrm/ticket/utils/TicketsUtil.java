package com.agilecrm.ticket.utils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.session.SessionManager;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.CreatedBy;
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
			Source source, CreatedBy createdBy, Boolean attachments, String ipAddress,
			List<Key<TicketLabels>> labelsKeysList)
	{
		Tickets ticket = new Tickets();

		try
		{
			ticket.group_id = new Key<TicketGroups>(TicketGroups.class, group_id);
			ticket.groupID = group_id;
			ticket.labels_keys_list = labelsKeysList;
			ticket.status = status;
			ticket.type = type;
			ticket.priority = priority;
			ticket.source = source;
			ticket.created_by = createdBy;

			Long epochTime = Calendar.getInstance().getTimeInMillis();

			if (assignee_id != null)
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
			ActivityUtil.createTicketActivity(ActivityType.TICKET_CREATED, ticket.contactID, ticket.id, "", plain_text,
					"last_reply_text");

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

		// Set ticket closed time
		if (status == Status.CLOSED)
			ticket.closed_time = Calendar.getInstance().getTimeInMillis();

		// Incr. no of reopens if ticket old status is closed
		if (oldStatus == Status.CLOSED)
			ticket.no_of_reopens += 1;

		Tickets.ticketsDao.put(ticket);

		// Updating search document
		new TicketsDocument().edit(ticket);

		// Logging activity
		ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, ticket.contactID, ticket.id,
				oldStatus.toString(), status.toString(), "status");

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
		ActivityUtil.createTicketActivity(ActivityType.TICKET_GROUP_CHANGED, ticket.contactID, ticket.id, oldGroupID
				+ "", group_id + "", "groupID");

		return ticket;
	}

	// /**
	// *
	// * @param ticket_id
	// * @param assignee_id
	// * @return
	// * @throws EntityNotFoundException
	// */
	// public static Tickets assignTicket(Long ticket_id, Long assignee_id)
	// throws EntityNotFoundException
	// {
	// Tickets ticket = TicketsUtil.getTicketByID(ticket_id);
	//
	// boolean isNewTicket = false;
	//
	// if (ticket.status == Status.NEW)
	// {
	// ticket.status = Status.OPEN;
	// isNewTicket = true;
	// }
	//
	// ticket.assignee_id = new Key<DomainUser>(DomainUser.class, assignee_id);
	// ticket.assigned_to_group = false;
	//
	// ticket.assigned_time = Calendar.getInstance().getTimeInMillis();
	//
	// Tickets.ticketsDao.put(ticket);
	//
	// // Update search document
	// new TicketsDocument().edit(ticket);
	//
	// if (isNewTicket)
	// // Logging ticket assigned activity
	// ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNED,
	// ticket.contactID, ticket.id, null,
	// assignee_id + "", "assigneeID");
	// else
	// // Logging ticket transfer activity
	// ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNEE_CHANGED,
	// ticket.contactID, ticket.id,
	// ticket.assignee_id + "", assignee_id + "", "assigneeID");
	//
	// return ticket;
	// }

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
		ActivityUtil.createTicketActivity(ActivityType.TICKET_PRIORITY_CHANGE, ticket.contactID, ticket.id,
				oldPriority.toString(), newPriority.toString(), "priority");

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
		ActivityUtil.createTicketActivity(ActivityType.TICKET_TYPE_CHANGE, ticket.contactID, ticket.id,
				oldTicketType.toString(), newTicketType.toString(), "type");

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
		ActivityUtil.createTicketActivity((is_favorite ? ActivityType.TICKET_MARKED_FAVORITE
				: ActivityType.TICKET_MARKED_UNFAVORITE), ticket.contactID, ticket.id, "", "", "is_favorite");

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
		ActivityUtil.createTicketActivity((is_spam ? ActivityType.TICKET_MARKED_SPAM
				: ActivityType.TICKET_MARKED_UNSPAM), ticket.contactID, ticket.id, "", "", "is_spam");

		return ticket;
	}

	public static Tickets forwardTicket(Long ticket_id, String content, String csvEmails)
			throws EntityNotFoundException
	{
		String[] emails = csvEmails.split(",");
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		String agentName = SessionManager.get().getName();
		String fromAddress = SessionManager.get().getEmail();

		for (String email : emails)
		{
			try
			{
				TicketNotesUtil.sendEmail(email, ticket.subject, agentName, fromAddress, ticket.cc_emails,
						SendMail.TICKET_FORWARD, new JSONObject().put("content", content));

			}
			catch (Exception e)
			{
				e.printStackTrace();
				System.out.println(ExceptionUtils.getFullStackTrace(e));
			}

			// Logging activity
			ActivityUtil.createTicketActivity(ActivityType.TICKET_NOTES_FORWARD, ticket.contactID, ticket.id, "",
					email, "");
		}

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
		ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, ticket.contactID, ticket.id,
				oldStatus.toString(), Status.CLOSED.toString(), "status");

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

		ActivityType ActivityType = null;

		if ("add".equalsIgnoreCase(command))
		{
			labels.add(label);
			ActivityType = ActivityType.TICKET_LABEL_ADD;
		}
		else
		{
			labels.remove(label);
			ActivityType = ActivityType.TICKET_LABEL_REMOVE;
		}

		ticket.labels_keys_list = labels;
		Tickets.ticketsDao.put(ticket);

		new TicketsDocument().edit(ticket);

		// Logging activity
		ActivityUtil.createTicketActivity(ActivityType, ticket.contactID, ticket.id, "", label.getId() + "", "labels");

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

		ActivityType ActivityType = null;

		if ("add".equalsIgnoreCase(command))
		{
			CCEmails.add(email.trim());
			ActivityType = ActivityType.TICKET_CC_EMAIL_ADD;
		}
		else
		{
			CCEmails.remove(email);
			ActivityType = ActivityType.TICKET_CC_EMAIL_REMOVE;
		}

		ticket.cc_emails = CCEmails;
		Tickets.ticketsDao.put(ticket);

		new TicketsDocument().edit(ticket);

		// Logging activity
		ActivityUtil.createTicketActivity(ActivityType, ticket.contactID, ticket.id, "", email, "cc_emails");

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
				{
					try
					{
						groupsList.put(groupID, TicketGroups.ticketGroupsDao.get(groupID));
					}
					catch (Exception e)
					{
						System.out.println(ExceptionUtils.getFullStackTrace(e));
					}
				}

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
		ActivityUtil.createTicketActivity(ActivityType.TICKET_DELETED, ticket.contactID, ticket.id, "", "", "");
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
		System.out.println("changeGroupAndAssignee: ");

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

			ticket.assignee_id = null;
			ticket.assigneeID = null;

			ticket.assigned_to_group = true;

			// Updating ticket entity
			Tickets.ticketsDao.put(ticket);

			// Update search document
			new TicketsDocument().edit(ticket);

			// Logging group change activity
			if (oldGroupID != ticket.groupID)
				ActivityUtil.createTicketActivity(ActivityType.TICKET_GROUP_CHANGED, ticket.contactID, ticket.id,
						oldGroupID + "", group_id + "", "groupID");
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
				ActivityUtil.createTicketActivity(ActivityType.TICKET_GROUP_CHANGED, ticket.contactID, ticket.id,
						oldGroupID + "", group_id + "", "groupID");

			// Logging new ticket assigned activity
			if (isNewTicket)
				ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNED, ticket.contactID, ticket.id, "",
						assignee_id + "", "assigneeID");
			else
				// Logging ticket assignee changed activity
				ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNEE_CHANGED, ticket.contactID, ticket.id,
						oldAssigneeID + "", assignee_id + "", "assigneeID");
		}

		System.out.println("completed changeGroupAndAssignee execution");
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
		ActivityUtil.createTicketActivity(ActivityType.DUE_DATE_CHANGED, ticket.contactID, ticket.id, oldDueDate + "",
				dueDate + "", "due_date");

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
		System.out.println("Send email to ticket group....");

		// Fetching ticket group
		TicketGroups group = TicketGroupUtil.getTicketGroupById(group_id);

		List<Long> users_keys = group.agents_keys;
		Set<Key<DomainUser>> domainUserKeys = new HashSet<Key<DomainUser>>();

		String oldnamespace = NamespaceManager.get();
		List<DomainUser> users = null;

		try
		{
			NamespaceManager.set("");
			
			for (Long userKey : users_keys)
				domainUserKeys.add(new Key<DomainUser>(DomainUser.class, userKey));
			
			System.out.println("domainUserKeys: " + domainUserKeys);
			
			users = DomainUserUtil.dao.fetchAllByKeys(new ArrayList<Key<DomainUser>>(domainUserKeys));
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		finally
		{
			NamespaceManager.set(oldnamespace);
		}

		System.out.println("users found...." + users.size());

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
		body = body.replaceAll("(\r\n|\n)", "<br />");

		Map<String, String> data = new HashMap<String, String>();
		data.put("body", body);

		SendMail.sendMail(email, subject, SendMail.TICKET_SEND_EMAIL_TO_USER, data);

		System.out.println("Sent email to: " + email);
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

	public static int getTicketCountByEmail(String email) throws JSONException
	{
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("requester_email", email);

		return Tickets.ticketsDao.getCountByProperty(map);
	}

	/**
	 * 
	 */
	public static List<Tickets> getTicketsByContactID(Long contactID) throws JSONException
	{
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("contact_key", new Key<Contact>(Contact.class, contactID));

		return Tickets.ticketsDao.listByProperty(map);
	}

	/**
	 * @throws Exception
	 * 
	 */
	public static List<Key<Tickets>> getOverdueTickets() throws Exception
	{
		String query = "NOT status:" + Status.CLOSED + " AND due_time <=" + Calendar.getInstance().getTimeInMillis()
				/ 1000;

		JSONObject resultJSON = new TicketsDocument().searchDocuments(query, "", "", 1000);

		JSONArray keysArray = resultJSON.getJSONArray("keys");

		List<Key<Tickets>> keys = new ArrayList<Key<Tickets>>();

		for (int i = 0; i < keysArray.length(); i++)
			keys.add((Key<Tickets>) keysArray.get(i));

		return keys;
	}

	public static List<Activity> includeData(List<Activity> activitys) throws Exception
	{
		if (activitys == null || activitys.size() == 0)
			return new ArrayList<Activity>();

		Map<Long, TicketGroups> groupsList = new HashMap<Long, TicketGroups>();
		Map<Long, DomainUser> assigneeList = new HashMap<Long, DomainUser>();

		for (Activity activity : activitys)
		{
			if (!assigneeList.containsKey(activity.domainUserID))
			{
				DomainUser temp = DomainUserUtil.getDomainUser(activity.domainUserID);

				if (temp != null)
					assigneeList.put(activity.domainUserID, temp);
			}

			activity.domainUser = assigneeList.get(activity.domainUserID);

			switch (activity.activity_type)
			{
			case TICKET_LABEL_ADD:
			case TICKET_LABEL_REMOVE:
			{
				Long labelID = Long.parseLong(activity.custom2);

				try
				{
					activity.ticket_label = TicketLabels.dao.get(labelID);
				}
				catch (Exception e)
				{
					System.out.println(ExceptionUtils.getFullStackTrace(e));
				}

				break;
			}
			case TICKET_ASSIGNED:
			{
				Long assigneeID = Long.parseLong(activity.custom2);

				if (!assigneeList.containsKey(assigneeID))
				{

					DomainUser temp = DomainUserUtil.getDomainUser(assigneeID);

					if (temp != null)
						assigneeList.put(assigneeID, temp);
				}

				activity.new_assignee = assigneeList.get(assigneeID);
				break;
			}
			case TICKET_ASSIGNEE_CHANGED:
			{
				Long newAssigneeID = Long.parseLong(activity.custom2);

				Long oldAssigneeID = null;

				try
				{
					oldAssigneeID = Long.parseLong(activity.custom1);
				}
				catch (Exception e)
				{
					System.out.println(ExceptionUtils.getFullStackTrace(e));
				}

				if (!assigneeList.containsKey(newAssigneeID))
				{
					DomainUser temp = DomainUserUtil.getDomainUser(newAssigneeID);

					if (temp != null)
						assigneeList.put(newAssigneeID, temp);
				}

				if (oldAssigneeID != null && !assigneeList.containsKey(oldAssigneeID))
				{
					DomainUser temp = DomainUserUtil.getDomainUser(oldAssigneeID);

					if (temp != null)
						assigneeList.put(oldAssigneeID, temp);
				}

				activity.new_assignee = assigneeList.get(newAssigneeID);
				activity.old_assignee = assigneeList.get(oldAssigneeID);
				break;
			}
			case TICKET_GROUP_CHANGED:
			{
				Long newGroupID = Long.parseLong(activity.custom2);
				Long oldGroupID = Long.parseLong(activity.custom1);

				if (activity.custom1 != null)
					if (!groupsList.containsKey(newGroupID))
					{
						try
						{
							TicketGroups group = TicketGroupUtil.getTicketGroupById(newGroupID);

							if (group != null)
								groupsList.put(newGroupID, group);
						}
						catch (Exception e)
						{
							System.out.println(ExceptionUtils.getFullStackTrace(e));
						}
					}

				if (!groupsList.containsKey(oldGroupID))
				{
					try
					{
						TicketGroups group = TicketGroupUtil.getTicketGroupById(oldGroupID);

						if (group != null)
							groupsList.put(oldGroupID, group);
					}
					catch (Exception e)
					{
						System.out.println(ExceptionUtils.getFullStackTrace(e));
					}
				}

				activity.new_group = groupsList.get(newGroupID);
				activity.old_group = groupsList.get(oldGroupID);
				break;
			}
			}
		}

		return activitys;
	}

	public static void createDefaultTicket()
	{
		try
		{
			TicketGroups group = TicketGroupUtil.getDefaultTicketGroup();

			String plainText = "Hi!..\r\n\r\nWelcome to Help Desk\r\n\r\nNow you can receive all your support tickets directly to Agile Help Desk. "
					+ "Every email will be created as ticket in Help Desk. You can start using Help Desk just by setting up forward email.\r\n\r\n"
					+ "1. Getting started with Help Desk \r\nhttps://www.agilecrm.com/helpdesk \r\n\r\n"
					+ "2. Setup email forwarding \r\nhttps://www.agilecrm.com/helpdesk/setup-forwarding \r\n\r\nThank you\r\nAgile CRM Team";

			String subject = "Getting started with Help Desk";

			Tickets ticket = TicketsUtil.createTicket(group.id, null, "Customer", "customer@domain.com", subject,
					new ArrayList<String>(), plainText, Status.NEW, Type.PROBLEM, Priority.MEDIUM, Source.EMAIL,
					CreatedBy.CUSTOMER, false, "[142.152.23.23]", new ArrayList<Key<TicketLabels>>());

			String htmlText = plainText.replaceAll("(\r\n|\n\r|\r|\n)", "<br/>");

			// Creating new Notes in TicketNotes table
			TicketNotesUtil.createTicketNotes(ticket.id, group.id, null, CREATED_BY.REQUESTER, "Customer",
					"customer@domain.com", plainText, htmlText, NOTE_TYPE.PUBLIC, new ArrayList<TicketDocuments>(), "");
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}

	public static Tickets removeDuedate(Long ticket_id) throws EntityNotFoundException
	{
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		if (ticket.due_time == null)
			return ticket;

		ticket.due_time = null;

		Tickets.ticketsDao.put(ticket);

		// Updating search document
		new TicketsDocument().edit(ticket);

		// Logging activity
		return ticket;
	}

}