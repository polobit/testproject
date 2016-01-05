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

import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.ticket.entitys.TicketActivity;
import com.agilecrm.ticket.entitys.TicketActivity.TicketActivityType;
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
			Long ticketID = notes.ticket_id;

			String html_text = notes.html_text;

			if (html_text != null)
				html_text = html_text.replaceAll("(\r\n|\n)", "<br />");

			if (notes == null || notes.ticket_id == null)
				throw new Exception("Ticket ID is missing.");

			if (StringUtils.isBlank(html_text))
				throw new Exception("Please provide message body.");

			Tickets ticket = TicketsUtil.getTicketByID(ticketID);

			// Converting html text to plain with jsoup
			Document doc = Jsoup.parse(notes.html_text, "UTF-8");
			String plain_text = new HtmlToPlainText().getPlainText(doc);

			TicketNotes ticketNotes = new TicketNotes();

			if (notes.note_type == NOTE_TYPE.PRIVATE)
			{
				ticketNotes = TicketNotesUtil.createTicketNotes(ticket.id, null, DomainUserUtil.getCurentUserKey()
						.getId(), CREATED_BY.AGENT, "", "", plain_text, html_text, NOTE_TYPE.PRIVATE,
						new ArrayList<TicketDocuments>());

				// Logging private notes activity
				new TicketActivity(TicketActivityType.TICKET_PRIVATE_NOTES_ADD, ticket.contactID, ticket.id,
						plain_text, html_text, "html_text").save();
			}
			else
			{
				Long ticketUpdatedTime = Calendar.getInstance().getTimeInMillis();

				// Updating existing ticket
				ticket = TicketsUtil.updateTicket(ticketID, notes.cc_emails, plain_text, LAST_UPDATED_BY.AGENT,
						ticketUpdatedTime, null, ticketUpdatedTime,
						(notes.attachments_list != null && notes.attachments_list.size() > 0) ? true : false);

				Key<DomainUser> domainUserKey = DomainUserUtil.getCurentUserKey();

				if (ticket.status == Status.NEW)
				{
					ticket.status = Status.OPEN;

					ticket.assignee_id = domainUserKey;
					ticket.assigneeID = domainUserKey.getId();

					// Logging status changed activity
					new TicketActivity(TicketActivityType.TICKET_STATUS_CHANGE, ticket.contactID, ticket.id,
							Status.NEW.toString(), Status.OPEN.toString(), "status").save();
				}
				else
				{
					// Check if another assignee is replied to ticket
					if (ticket.assignee_id != domainUserKey)
					{
						// Logging ticket assignee changed activity
						new TicketActivity(TicketActivityType.TICKET_ASSIGNEE_CHANGED, ticket.contactID, ticket.id,
								ticket.assigneeID + "", domainUserKey.getId() + "", "assigneeID").save();

						ticket.assignee_id = domainUserKey;
						ticket.assigneeID = domainUserKey.getId();
					}
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

				// Logging status changed activity
				new TicketActivity(TicketActivityType.TICKET_STATUS_CHANGE, ticket.contactID, ticket.id,
						Status.OPEN.toString(), Status.PENDING.toString(), "status").save();

				// Logging private notes activity
				new TicketActivity(TicketActivityType.TICKET_ASSIGNEE_REPLIED, ticket.contactID, ticket.id, html_text,
						plain_text, "html_text").save();

				// Execute note created by user trigger
				TicketTriggerUtil.executeTriggerForNewNoteAddedByUser(ticket);
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