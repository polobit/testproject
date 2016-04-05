package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
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
	@Path("/{ticket_id}")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<TicketNotes> getNotes(@PathParam("ticket_id") Long ticketID)
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
	@Path("/{ticket_id}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public TicketNotes createNotes(@PathParam("ticket_id") Long ticketID, TicketNotes notes)
	{
		try
		{
			Long currentTime = Calendar.getInstance().getTimeInMillis();

			if (StringUtils.isBlank(notes.html_text))
				throw new Exception("Please provide message body.");

			String plain_text = notes.html_text;

			if (notes.html_text != null)
				notes.html_text = TicketNotesUtil.convertNewLinesToBreakTags(notes.html_text);

			String html_text = notes.html_text;

			Tickets ticket = null;

			try
			{
				ticket = TicketsUtil.getTicketByID(ticketID);
			}
			catch (Exception e)
			{
				throw new Exception("Ticket has been deleted.");
			}

			TicketNotes ticketNotes = null;

			if (notes.note_type == NOTE_TYPE.PRIVATE)
			{
				ticketNotes = new TicketNotes(ticket.id, ticket.groupID, DomainUserUtil.getCurentUserKey().getId(),
						CREATED_BY.AGENT, ticket.requester_name, ticket.requester_email, plain_text, html_text,
						NOTE_TYPE.PRIVATE, new ArrayList<TicketDocuments>(), "");

				ticketNotes.save();

				if (notes.close_ticket)
				{
					// Updating ticket
					ticket = ticket.updateTicketAndSave(ticket.cc_emails, ticket.last_reply_text,
							ticket.last_updated_by, ticket.last_updated_time, ticket.last_customer_replied_time,
							ticket.last_agent_replied_time, ticket.attachments_exists, true);
				}
			}
			else
			{
				Key<DomainUser> domainUserKey = DomainUserUtil.getCurentUserKey();

				TicketGroups group = null;

				try
				{
					group = TicketGroupUtil.getTicketGroupById(ticket.groupID);
				}
				catch (Exception e)
				{
					throw new Exception("Ticket group has been deleted. Please change ticket group to reply.");
				}

				// If domain user doesn't exists in ticket group then
				// throwing exception
				if (!group.agents_keys.contains(domainUserKey.getId()))
					throw new Exception("You must in " + group.group_name + " group in order to reply to this ticket");

				// Checking if contact existing or not
				Contact contact = ticket.getTicketRelatedContact();

				ticket.contact_key = new Key<Contact>(Contact.class, contact.id);
				ticket.contactID = contact.id;
				
				// Updating existing ticket
				ticket = ticket.updateTicketAndSave(ticket.cc_emails, plain_text, LAST_UPDATED_BY.AGENT, currentTime,
						null, currentTime, (notes.attachments_list != null && notes.attachments_list.size() > 0) ? true
								: false, notes.close_ticket);

				// Creating new Notes in TicketNotes table
				ticketNotes = new TicketNotes(ticket.id, ticket.groupID, ticket.assigneeID, CREATED_BY.AGENT,
						ticket.requester_name, ticket.requester_email, plain_text, html_text, notes.note_type,
						new ArrayList<TicketDocuments>(), "");

				ticketNotes.save();
			}

			ticketNotes.domain_user = DomainUserUtil.getPartialDomainUser(ticket.assigneeID);
			ticketNotes.assignee_id = ticket.assigneeID;

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