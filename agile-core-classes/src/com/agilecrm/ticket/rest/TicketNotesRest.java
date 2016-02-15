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
import org.jsoup.Jsoup;
import org.jsoup.examples.HtmlToPlainText;
import org.jsoup.nodes.Document;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.entitys.Tickets.Status;
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
						new ArrayList<TicketDocuments>());

				// Logging private notes activity
				ActivityUtil.createTicketActivity(ActivityType.TICKET_PRIVATE_NOTES_ADD, ticket.contactID, ticket.id,
						plain_text, html_text, "html_text");
			}
			else
			{
				// Updating existing ticket
				ticket = TicketsUtil.updateTicket(ticketID, ticket.cc_emails, plain_text, LAST_UPDATED_BY.AGENT,
						currentTime, null, currentTime,
						(notes.attachments_list != null && notes.attachments_list.size() > 0) ? true : false);

				Key<DomainUser> domainUserKey = DomainUserUtil.getCurentUserKey();

				if (ticket.status == Status.NEW)
				{
					ticket.assignee_id = domainUserKey;
					ticket.assigneeID = domainUserKey.getId();
					ticket.assigned_time = currentTime;
					ticket.first_replied_time = currentTime;

					// Logging status changed activity
					ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, ticket.contactID, ticket.id,
							Status.NEW.toString(), Status.PENDING.toString(), "status");
				}
				else
				{
					// Check if another assignee is replied to ticket
					if (ticket.assignee_id != domainUserKey)
					{
						// Logging ticket assignee changed activity
						ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNEE_CHANGED, ticket.contactID,
								ticket.id, ticket.assigneeID + "", domainUserKey.getId() + "", "assigneeID");

						ticket.assignee_id = domainUserKey;
						ticket.assigneeID = domainUserKey.getId();
					}

					if (Status.OPEN == ticket.status)
						// Logging status changed activity
						ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, ticket.contactID,
								ticket.id, Status.OPEN.toString(), Status.PENDING.toString(), "status");
				}

				Status oldStatus = null;

				// If send reply and close ticket is selected
				if (notes.close_ticket)
				{
					oldStatus = ticket.status;

					ticket.closed_time = currentTime;

					// Set status to pending as it is replied by assignee
					ticket.status = Status.CLOSED;
				}
				else
				{
					// Set status to pending as it is replied by assignee
					ticket.status = Status.PENDING;
				}

				// Updating ticket entity
				Tickets.ticketsDao.put(ticket);

				// updating text search data
				new TicketsDocument().edit(ticket);

				// Creating new Notes in TicketNotes table
				ticketNotes = TicketNotesUtil.createTicketNotes(ticket.id, ticket.groupID, ticket.assigneeID,
						CREATED_BY.AGENT, ticket.requester_name, ticket.requester_email, plain_text, html_text,
						notes.note_type, new ArrayList<TicketDocuments>());

				TicketNotesUtil.sendReplyToRequester(ticket);

				// Logging public notes activity
				ActivityUtil.createTicketActivity(ActivityType.TICKET_ASSIGNEE_REPLIED, ticket.contactID, ticket.id,
						html_text, plain_text, "html_text");

				// Execute note created by user trigger
				TicketTriggerUtil.executeTriggerForNewNoteAddedByUser(ticket);

				if (notes.close_ticket)
				{
					// Logging ticket closed activity
					ActivityUtil.createTicketActivity(ActivityType.TICKET_STATUS_CHANGE, ticket.contactID, ticket.id,
							oldStatus.toString(), Status.CLOSED.toString(), "status");

					// Execute note closed by user trigger
					TicketTriggerUtil.executeTriggerForClosedTicket(ticket);
				}
			}

			ticketNotes.domain_user = DomainUserUtil.getDomainUser(ticket.assigneeID);

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