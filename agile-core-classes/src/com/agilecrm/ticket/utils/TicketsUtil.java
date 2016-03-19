package com.agilecrm.ticket.utils;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.session.SessionManager;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.CreatedBy;
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
	 * @throws Exception
	 */
	public static List<Tickets> getTicketsByGroupID(Long groupID, Status status, String cursor, String pageSize,
			String sortKey) throws Exception
	{
		if (groupID == null || status == null || pageSize == null || sortKey == null)
			throw new Exception("Required parameters missing");

		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("status", status);
		searchMap.put("group_id", new Key<TicketGroups>(TicketGroups.class, groupID));

		return Tickets.ticketsDao.fetchAllByOrder(Integer.parseInt(pageSize), cursor, searchMap, false, true, sortKey);
	}

	/**
	 * Returns list of tickets to given list of ids
	 * 
	 * @param idsArray
	 * @return
	 * @throws Exception
	 */
	public static List<Tickets> getTicketsByIDsList(List<Long> idsArray) throws Exception
	{
		if (idsArray == null || idsArray.size() == 0)
			throw new Exception("Required parameters missing");

		List<Key<Tickets>> ticketKeys = new ArrayList<Key<Tickets>>();

		for (Long id : idsArray)
			ticketKeys.add(new Key<Tickets>(Tickets.class, id));

		List<Tickets> list = Tickets.ticketsDao.fetchAllByKeys(ticketKeys);

		System.out.println("getTicketsBulk size: " + list.size());

		return list;
	}

	/**
	 * Returns Ticket object for given ticket ID
	 * 
	 * @param ticketID
	 * @return Ticket object
	 * @throws EntityNotFoundException
	 */
	public static Tickets getTicketByID(Long ticketID) throws EntityNotFoundException, Exception
	{
		if (ticketID == null)
			throw new Exception("Required parameters missing");

		return Tickets.ticketsDao.get(ticketID);
	}

	/**
	 * Changes ticket status to provided status, updates changes to DB, text
	 * search, add changes status activity and triggers closed ticket trigger if
	 * new status is closed.
	 * 
	 * @param ticket_id
	 * @param status
	 * @return
	 * @throws Exception
	 */
	public static Tickets changeStatus(Long ticket_id, Status status) throws Exception
	{
		if (ticket_id == null || status == null)
			throw new Exception("Required parameters missing");

		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		if (ticket.status == status)
			return ticket;

		Status oldStatus = ticket.status;
		ticket.status = status;
		ticket.last_updated_time = Calendar.getInstance().getTimeInMillis();

		// Set ticket closed time
		if (status == Status.CLOSED)
			ticket.closed_time = Calendar.getInstance().getTimeInMillis();

		// Incr. no of reopens if ticket old status is closed
		if (oldStatus == Status.CLOSED)
		{
			ticket.no_of_reopens += 1;
			ticket.closed_time = null;
		}

		ticket.save();
		
		// Execute closed ticket trigger. Do not execute trigger if updated status and current status is same.
		if (status == Status.CLOSED)
			TicketTriggerUtil.executeTriggerForClosedTicket(ticket);
		
		// Logging activity
		ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, ticket.contactID, ticket.id,
				oldStatus.toString(), status.toString(), "status");

		return ticket;
	}

	/**
	 * Changes ticket group to given group id and logs group change activity
	 * 
	 * @param ticket_id
	 * @param group_id
	 * @param assignee_id
	 * @return
	 * @throws Exception
	 */
	public static Tickets changeGroup(Long ticket_id, Long group_id) throws Exception
	{
		if (ticket_id == null || group_id == null)
			throw new Exception("Required parameters missing");

		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		Long oldGroupID = ticket.groupID;

		ticket.group_id = new Key<TicketGroups>(TicketGroups.class, group_id);
		ticket.groupID = group_id;

		ticket.save();

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
	 * Changes ticket priority to provided priority, updates changes to DB, text
	 * search, add changes status activity.
	 * 
	 * 
	 * @param ticket_id
	 * @param priority
	 * @return updated ticket
	 * @throws Exception
	 */
	public static Tickets changePriority(Long ticket_id, Priority newPriority) throws Exception
	{
		if (ticket_id == null || newPriority == null)
			throw new Exception("Required parameters missing");

		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		// Return if ticket already have same priority
		if (ticket.priority == newPriority)
			return ticket;

		Priority oldPriority = ticket.priority;
		ticket.priority = newPriority;

		ticket.save();

		// Logging activity
		ActivityUtil.createTicketActivity(ActivityType.TICKET_PRIORITY_CHANGE, ticket.contactID, ticket.id,
				oldPriority.toString(), newPriority.toString(), "priority");

		return ticket;
	}

	/**
	 * Changes ticket type to provided type, updates changes to DB, text search,
	 * add changes status activity.
	 * 
	 * @param ticket_id
	 * @param priority
	 * @return updated ticket
	 * 
	 * @throws EntityNotFoundException
	 */
	public static Tickets changeTicketType(Long ticket_id, Type newTicketType) throws Exception
	{
		if (ticket_id == null || newTicketType == null)
			throw new Exception("Required parameters missing");

		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		if (ticket.type == newTicketType)
			return ticket;

		Type oldTicketType = ticket.type;

		// Updating with new ticket type
		ticket.type = newTicketType;

		ticket.save();

		// Logging activity
		ActivityUtil.createTicketActivity(ActivityType.TICKET_TYPE_CHANGE, ticket.contactID, ticket.id,
				oldTicketType.toString(), newTicketType.toString(), "type");

		return ticket;
	}

	/**
	 * Sets/Unsets favorite property to given ticket
	 * 
	 * @param ticket_id
	 * @param is_favorite
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static Tickets markFavorite(Long ticket_id, Boolean is_favorite) throws Exception
	{
		if (ticket_id == null || is_favorite == null)
			throw new Exception("Required parameters missing");

		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		if (ticket.is_favorite.equals(is_favorite))
			return ticket;

		ticket.is_favorite = is_favorite;

		ticket.save();

		// Logging activity
		ActivityUtil.createTicketActivity((is_favorite ? ActivityType.TICKET_MARKED_FAVORITE
				: ActivityType.TICKET_MARKED_UNFAVORITE), ticket.contactID, ticket.id, "", "", "is_favorite");

		return ticket;
	}

	/**
	 * Sets/Unsets spam property to given ticket
	 * 
	 * @param ticket_id
	 * @param is_favorite
	 * @return
	 * @throws EntityNotFoundException
	 */
	public static Tickets markSpam(Long ticket_id, Boolean is_spam) throws Exception
	{
		if (ticket_id == null || is_spam == null)
			throw new Exception("Required parameters missing");

		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		if (ticket.is_spam.equals(is_spam))
			return ticket;

		ticket.is_spam = is_spam;

		ticket.save();

		// Logging activity
		ActivityUtil.createTicketActivity((is_spam ? ActivityType.TICKET_MARKED_SPAM
				: ActivityType.TICKET_MARKED_UNSPAM), ticket.contactID, ticket.id, "", "", "is_spam");

		return ticket;
	}

	/**
	 * Sends whole thread to given emails
	 * 
	 * @param ticket_id
	 * @param content
	 * @param csvEmails
	 * @return
	 * @throws Exception
	 */
	public static Tickets forwardTicket(Long ticket_id, String content, String csvEmails) throws Exception
	{
		if (ticket_id == null || StringUtils.isBlank(content) || StringUtils.isBlank(csvEmails))
			throw new Exception("Required parameters missing");

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
				System.out.println(ExceptionUtils.getFullStackTrace(e));
			}

			// Logging activity
			ActivityUtil.createTicketActivity(ActivityType.TICKET_NOTES_FORWARD, ticket.contactID, ticket.id, "",
					email, "");
		}

		return ticket;
	}

	/**
	 * Sets close status to given ticket, updates changes DB and text search and
	 * triggers closed ticket trigger.
	 * 
	 * @param ticket_id
	 * @return
	 * @throws Exception
	 */
	public static Tickets closeTicket(Long ticket_id) throws Exception
	{
		if (ticket_id == null)
			throw new Exception("Required parameters missing");

		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		if (ticket.status == Status.CLOSED)
			return ticket;

		Status oldStatus = ticket.status;

		ticket.status = Status.CLOSED;
		ticket.closed_time = Calendar.getInstance().getTimeInMillis();

		ticket.save();

		// Logging activity
		ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, ticket.contactID, ticket.id,
				oldStatus.toString(), Status.CLOSED.toString(), "status");

		TicketTriggerUtil.executeTriggerForClosedTicket(ticket);

		return ticket;
	}

	/**
	 * Adds or removes labels to given ticket. Updates changes to DB, text
	 * search, logs activity and triggers label add/remove trigger.
	 * 
	 * @param ticket_id
	 * @return
	 * @throws Exception
	 */
	public static Tickets updateLabels(Long ticket_id, Key<TicketLabels> labelKey, String command) throws Exception
	{
		if (ticket_id == null || labelKey == null || StringUtils.isBlank(command))
			throw new Exception("Required parameters missing");

		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		List<Key<TicketLabels>> labels = ticket.labels_keys_list;

		ActivityType activityType = null;

		if ("add".equalsIgnoreCase(command))
		{
			if (labels.contains(labelKey))
				return ticket;

			labels.add(labelKey);
			activityType = ActivityType.TICKET_LABEL_ADD;
		}
		else
		{
			if (!labels.contains(labelKey))
				return ticket;

			labels.remove(labelKey);
			activityType = ActivityType.TICKET_LABEL_REMOVE;
		}

		ticket.labels_keys_list = labels;
		ticket.save();

		TicketLabels label = TicketLabelsUtil.getLabelById(labelKey.getId());
		
		//Trigger activity
		if ("add".equalsIgnoreCase(command))
			TicketTriggerUtil.executeTriggerForLabelAddedToTicket(ticket);
		else
			TicketTriggerUtil.executeTriggerForLabelDeletedToTicket(ticket);
		
		// Logging activity
		ActivityUtil.createTicketActivity(activityType, ticket.contactID, ticket.id, "", (label != null ? label.label
				: ""), "labels");

		return ticket;
	}

	/**
	 * Adds/remove cc emails to give ticket and updates changes to DB, text
	 * search.
	 * 
	 * @param ticket_id
	 * @return
	 * @throws Exception
	 */
	public static Tickets updateCCEmails(Long ticket_id, String email, String command) throws Exception
	{
		if (ticket_id == null || StringUtils.isBlank(email) || StringUtils.isBlank(command))
			throw new Exception("Required parameters missing");

		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		List<String> CCEmails = ticket.cc_emails;

		ActivityType ActivityType = null;

		if ("add".equalsIgnoreCase(command))
		{
			if (CCEmails.contains(email))
				return ticket;

			CCEmails.add(email.trim());
			ActivityType = ActivityType.TICKET_CC_EMAIL_ADD;
		}
		else
		{
			if (!CCEmails.contains(email))
				return ticket;

			CCEmails.remove(email);
			ActivityType = ActivityType.TICKET_CC_EMAIL_REMOVE;
		}

		ticket.cc_emails = CCEmails;
		ticket.save();

		// Logging activity
		ActivityUtil.createTicketActivity(ActivityType, ticket.contactID, ticket.id, "", email, "cc_emails");

		return ticket;
	}

	/**
	 * Adds or remove labels array to given ticket.
	 * 
	 * @param ticketId
	 * @param labelsArray
	 * @param type
	 * @throws Exception
	 */
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
	 * Deletes ticket from DB, text search and its related notes.
	 * 
	 * @param ticket_id
	 * @throws Exception
	 */
	public static void deleteTicket(Long ticket_id) throws Exception
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
	 * Changes ticket group and assignee to given values. Updates changes to DB,
	 * text search and logs activity. Triggers ticket assignee change trigger as
	 * well.
	 * 
	 * @param ticket_id
	 * @param group_id
	 * @param assignee_id
	 * @return Tickets
	 * @throws Exception
	 */
	public static Tickets changeGroupAndAssignee(Long ticket_id, Long group_id, Long assignee_id) throws Exception
	{
		System.out.println("changeGroupAndAssignee: ");

		if (ticket_id == null || group_id == null)
			throw new Exception("Required parameters missing");

		// Fetching ticket object by its id
		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		// Verifying if ticket assigned to same Group and Assignee
		if ((ticket.groupID != null && ticket.groupID == group_id)
				&& (ticket.assigneeID != null && ticket.assigneeID == assignee_id))
			return ticket;

		// Copying old data to create ticket activity
		Long oldGroupID = ticket.groupID, oldAssigneeID = ticket.assigneeID;

		TicketGroups group = null;

		try
		{
			group = TicketGroupUtil.getTicketGroupById(group_id);
		}
		catch (Exception e)
		{
			throw new Exception("No group found with id " + group_id + " or group has been deleted.");
		}

		DomainUserPartial domainUser = DomainUserUtil.getPartialDomainUser(assignee_id);

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

			ticket.save();

			// Logging group change activity
			if (oldGroupID != ticket.groupID)
			{
				ActivityUtil.createTicketActivity(ActivityType.TICKET_GROUP_CHANGED, ticket.contactID, ticket.id,
						oldGroupID + "", (group != null) ? group.group_name : "", "groupID");
			}
		}
		else
		{
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

			ticket.save();

			// Logging group change activity
			if (oldGroupID.longValue() != ticket.groupID.longValue())
				ActivityUtil.createTicketActivity(ActivityType.TICKET_GROUP_CHANGED, ticket.contactID, ticket.id,
						oldGroupID + "", (group != null) ? group.group_name : "", "groupID");

			// Logging new ticket assigned activity
			if (isNewTicket)
				ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNED, ticket.contactID, ticket.id, "",
						((domainUser != null) ? domainUser.name : ""), "assigneeID");
			else
				// Logging ticket assignee changed activity
				ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNEE_CHANGED, ticket.contactID, ticket.id,
						oldAssigneeID + "", ((domainUser != null) ? domainUser.name : ""), "assigneeID");
		}

		System.out.println("completed changeGroupAndAssignee execution");

		return ticket;
	}

	/**
	 * Sets ticket due date to given epoch time.
	 * 
	 * @param ticketID
	 * @param dueDate
	 * @return
	 * @throws Exception
	 */
	public static Tickets changeDueDate(Long ticketID, Long dueDate) throws Exception
	{
		if (ticketID == null || dueDate == null)
			throw new Exception("Required parameters missing");

		// Fetching ticket object by its id
		Tickets ticket = TicketsUtil.getTicketByID(ticketID);

		boolean isDuedateChanged = false;

		long oldDueDate = 0l;

		if (ticket.due_time != null)
		{
			isDuedateChanged = true;
			oldDueDate = ticket.due_time;
		}

		ticket.due_time = dueDate;

		ticket.save();

		ActivityType activityType = (isDuedateChanged) ? ActivityType.DUE_DATE_CHANGED : ActivityType.SET_DUE_DATE;

		// Logging ticket assignee changed activity
		ActivityUtil.createTicketActivity(activityType, ticket.contactID, ticket.id, oldDueDate + "", dueDate + "",
				"due_date");

		return ticket;
	}

	/**
	 * Removes due date from given ticket
	 * 
	 * @param ticket_id
	 * @return
	 * @throws Exception
	 */
	public static Tickets removeDuedate(Long ticket_id) throws Exception
	{
		if (ticket_id == null)
			throw new Exception("Required parameters missing");

		Tickets ticket = TicketsUtil.getTicketByID(ticket_id);

		if (ticket.due_time == null)
			return ticket;

		ticket.due_time = null;

		ticket.save();

		// Logging ticket assignee changed activity
		ActivityUtil.createTicketActivity(ActivityType.DUE_DATE_REMOVED, ticket.contactID, ticket.id, "", "",
				"due_date");

		// Logging activity
		return ticket;
	}

	/**
	 * Sends email all assignees in given group.
	 * 
	 * @param groupId
	 * @param subject
	 * @param body
	 * @throws EntityNotFoundException
	 * @throws JSONException
	 */
	public static void sendEmailToGroup(Long group_id, String subject, String body) throws Exception
	{
		System.out.println("Send email to ticket group....");

		if (group_id == null || StringUtils.isBlank(subject) || StringUtils.isBlank(body))
			throw new Exception("Required parameters missing");

		// Fetching ticket group
		TicketGroups group = null;

		try
		{
			group = TicketGroupUtil.getTicketGroupById(group_id);
		}
		catch (Exception e)
		{
			throw new Exception("No group found with id " + group.id + " or group has been deleted.");
		}

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
	 * Send email to given email
	 * 
	 * @param groupId
	 * @param subject
	 * @param body
	 * @throws JSONException
	 */
	public static void sendEmailToUser(String email, String subject, String body) throws Exception
	{
		if (StringUtils.isBlank(email) || StringUtils.isBlank(subject) || StringUtils.isBlank(body))
			throw new Exception("Required parameters missing");

		body = body.replaceAll("(\r\n|\n)", "<br />");

		Map<String, String> data = new HashMap<String, String>();
		data.put("body", body);

		SendMail.sendMail(email, subject, SendMail.TICKET_SEND_EMAIL_TO_USER, data);

		System.out.println("Sent email to: " + email);
	}

	/**
	 * Returns list of tickets by requester email address
	 * 
	 * @param email
	 * @return
	 * @throws JSONException
	 */
	public static List<Tickets> getTicketsByEmail(String email) throws Exception
	{
		if (StringUtils.isBlank(email))
			throw new Exception("Required parameters missing");

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("requester_email", email);

		return Tickets.ticketsDao.listByProperty(map);
	}

	/**
	 * Returns tickets count which are raised by same requester
	 * 
	 * @param email
	 * @return
	 * @throws Exception
	 */
	public static int getTicketCountByEmail(String email) throws Exception
	{
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("requester_email", email);

		return Tickets.ticketsDao.getCountByProperty(map);
	}

	/**
	 * Returns list of ticket raised by same contact
	 * 
	 * @param contactID
	 * @return
	 * @throws Exception
	 */
	public static List<Tickets> getTicketsByContactID(Long contactID) throws Exception
	{
		if (contactID == null)
			throw new Exception("Required parameters missing");

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("contact_key", new Key<Contact>(Contact.class, contactID));

		return Tickets.ticketsDao.listByProperty(map);
	}

	/**
	 * Returns set of all ticket keys which are over due
	 * 
	 */
	public static Set<Key<Tickets>> getOverdueTickets()
	{
		String query = "NOT status:" + Status.CLOSED + " AND due_date <="
				+ (Calendar.getInstance().getTimeInMillis() / 1000);

		System.out.println("Overdue tickets query: " + query);

		// Initializing idsfetcher object with query string
		ITicketIdsFetcher idsFetcher = new FilterTicketIdsFetcher(query);

		Set<Key<Tickets>> keys = new HashSet<Key<Tickets>>();

		while (idsFetcher.hasNext())
			keys.addAll(idsFetcher.next());

		System.out.println("Keys set size: " + keys.size());

		return keys;
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

			Tickets ticket = new Tickets(group.id, null, "Customer", "customer@domain.com", subject,
					new ArrayList<String>(), plainText, Status.NEW, Type.PROBLEM, Priority.MEDIUM, Source.EMAIL,
					CreatedBy.CUSTOMER, false, "[142.152.23.23]", new ArrayList<Key<TicketLabels>>());

			String htmlText = plainText.replaceAll("(\r\n|\n\r|\r|\n)", "<br/>");

			// Creating new Notes in TicketNotes table
			TicketNotes notes = new TicketNotes(ticket.id, group.id, null, CREATED_BY.REQUESTER, "Customer",
					"customer@domain.com", plainText, htmlText, NOTE_TYPE.PUBLIC, new ArrayList<TicketDocuments>(), "");
			notes.save();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
	}
}