package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.triggers.util.TicketTriggerUtil;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi 30-Sep-2015
 * 
 */
@Path("/api/tickets/notes")
public class TicketNotesRest
{
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<TicketNotes> getNotes(@QueryParam("ticket_id") Long ticketID)
	{
		try
		{
			if (ticketID == null)
				throw new Exception("Ticket ID is missing.");

			return TicketNotesUtil.getTicketNotes(ticketID, "-created_time");
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * 
	 * @param notes
	 * @return
	 */
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public TicketNotes createNotes(TicketNotes notes)
	{
		try
		{
			Long currentTime = Calendar.getInstance().getTimeInMillis();

			Long ticketID = notes.ticket_id;

			if (notes.html_text != null)
				notes.html_text = notes.html_text.replaceAll("(\r\n|\n)", "<br />");

			String html_text = notes.html_text;

			if (notes == null || notes.ticket_id == null)
				throw new Exception("Ticket ID is missing.");

			if (StringUtils.isBlank(html_text))
				throw new Exception("Please provide message body.");

			Tickets ticket = TicketsUtil.getTicketByID(ticketID);

			// Converting html text to plain with jsoup
			// Document doc = Jsoup.parse(notes.html_text, "UTF-8");
			// String plain_text = new HtmlToPlainText().getPlainText(doc);
			String plain_text = notes.html_text;

			TicketNotes ticketNotes = new TicketNotes();

			if (notes.note_type == NOTE_TYPE.PRIVATE)
			{
				ticketNotes = TicketNotesUtil.createTicketNotes(ticket.id, null, DomainUserUtil.getCurentUserKey()
						.getId(), CREATED_BY.AGENT, "", "", plain_text, html_text, NOTE_TYPE.PRIVATE,
						new ArrayList<TicketDocuments>(), "");

				// Logging private notes activity
				ActivityUtil.createTicketActivity(ActivityType.TICKET_PRIVATE_NOTES_ADD, ticket.contactID, ticket.id,
						plain_text, html_text, "html_text");
			}
			else
			{
				Key<DomainUser> domainUserKey = DomainUserUtil.getCurentUserKey();
				TicketGroups group = TicketGroupUtil.getTicketGroupById(ticket.group_id.getId());

				// If domain user doesn't exists in ticket group then
				// throwing exception
				if (!group.agents_keys.contains(domainUserKey.getId()))
					throw new Exception("You must in " + group.group_name + " group in order to reply to this ticket");

				int repliesCount = ticket.user_replies_count;
				Status status = ticket.status;

				if (repliesCount == 1)
					ticket.first_replied_time = currentTime;

				// Checking if assignee is replying to new ticket for first time
				if (status == Status.NEW && ticket.assignee_id == null)
				{
					ticket.assignee_id = domainUserKey;
					ticket.assigneeID = domainUserKey.getId();
					ticket.assigned_time = currentTime;

					ticket.status = Status.PENDING;

					// Logging public notes activity
					ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNEE_REPLIED, ticket.contactID,
							ticket.id, html_text, plain_text, "html_text");

					// Logging status changed activity
					ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, ticket.contactID, ticket.id,
							status.toString(), Status.PENDING.toString(), "status");
				}
				else
				{
						// Verifying if ticket assignee is null then assign
						// current logged domain user
						if (ticket.assignee_id == null)
						{
							ticket.assignee_id = domainUserKey;
							ticket.assigneeID = domainUserKey.getId();
							ticket.assigned_time = currentTime;

							// Logging ticket assigned activity
							ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNED, ticket.contactID,
									ticket.id, ticket.assigneeID + "", "", "assigneeID");
						}
						else if (ticket.assignee_id != null && ticket.assignee_id.getId() != domainUserKey.getId())
						{
							ticket.assignee_id = domainUserKey;
							ticket.assigneeID = domainUserKey.getId();
							ticket.assigned_time = currentTime;

							// Log assignee changed activity
							ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNEE_CHANGED, ticket.contactID,
									ticket.id, domainUserKey.getId() + "", ticket.assignee_id.getId() + "",
									"assigneeID");
						}

						if (Status.OPEN == status)
							// Logging status changed activity
							ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, ticket.contactID,
									ticket.id, Status.OPEN.toString(), Status.PENDING.toString(), "status");

						// Logging public notes activity
						ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNEE_REPLIED, ticket.contactID,
								ticket.id, html_text, plain_text, "html_text");
					}

					// If tickcet is already closed then incr. no of re opens
					// attr. and log ticket open activity
					if (status == Status.CLOSED)
					{
						ticket.no_of_reopens += 1;

						// Logging status changed activity
						ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, ticket.contactID,
								ticket.id, Status.CLOSED.toString(), Status.PENDING.toString(), "status");
					}

					// If send reply and close ticket is selected
					if (notes.close_ticket)
					{
						ticket.closed_time = currentTime;

						// Set status to pending as it is replied by assignee
						ticket.status = Status.CLOSED;
					}
					else
						// Set status to pending as it is replied by assignee
						ticket.status = Status.PENDING;

					// Updating ticket entity
					Tickets.ticketsDao.put(ticket);

					// Updating text search data
					new TicketsDocument().edit(ticket);

					// Creating new Notes in TicketNotes table
					ticketNotes = TicketNotesUtil.createTicketNotes(ticket.id, ticket.groupID, ticket.assigneeID,
							CREATED_BY.AGENT, ticket.requester_name, ticket.requester_email, plain_text, html_text,
							notes.note_type, new ArrayList<TicketDocuments>(), "");

					TicketNotesUtil.sendReplyToRequester(ticket);

					if (notes.close_ticket)
					{
						// Execute note closed by user trigger
						TicketTriggerUtil.executeTriggerForClosedTicket(ticket);
					}
				}

			String cleanText = plain_text.replaceAll("(<br />|<br/>|<br/>)", "");

			// Updating existing ticket
			ticket = TicketsUtil.updateTicket(ticketID, ticket.cc_emails, cleanText, LAST_UPDATED_BY.AGENT,
					currentTime, null, currentTime,
					(notes.attachments_list != null && notes.attachments_list.size() > 0) ? true : false);
			
			// Execute note created by user trigger
			TicketTriggerUtil.executeTriggerForNewNoteAddedByUser(ticket);
			
			ticketNotes.domain_user = DomainUserUtil.getDomainUser(ticket.assigneeID);

			System.out.println("Execution time: " + (Calendar.getInstance().getTimeInMillis() - currentTime) + "ms");

			return ticketNotes;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
}