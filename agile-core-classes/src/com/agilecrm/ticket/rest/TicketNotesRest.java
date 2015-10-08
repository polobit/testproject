package com.agilecrm.ticket.rest;

import java.util.Calendar;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
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
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.examples.HtmlToPlainText;
import org.jsoup.nodes.Document;

import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets.LAST_UPDATED_BY;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.Status;
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

	@POST
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	@Produces(MediaType.APPLICATION_JSON)
	public String createNotes(@FormParam("ticket_id") Long ticketID, @FormParam("html_text") String html_text,
			@FormParam("cc_emails") String cc_emails, @FormParam("note_type") NOTE_TYPE note_type,
			@FormParam("attachment_urls") String attachment_urls)
	{
		try
		{
			if (ticketID == null)
				throw new Exception("Ticket ID is missing.");

			Tickets ticket = TicketsUtil.getTicketByID(ticketID);

			Long ticketUpdatedTime = Calendar.getInstance().getTimeInMillis();

			// Converting html text to plain with jsoup
			Document doc = Jsoup.parse(html_text, "UTF-8");
			String plain_text = new HtmlToPlainText().getPlainText(doc);

			// Updating existing ticket
			ticket = TicketsUtil.updateTicket(ticketID, cc_emails.trim(), plain_text, LAST_UPDATED_BY.AGENT,
					ticketUpdatedTime, null, ticketUpdatedTime, StringUtils.isNotBlank(attachment_urls));

			if (ticket.status == Status.NEW)
			{
				ticket.status = Status.OPEN;

				Key<DomainUser> domainUserKey = DomainUserUtil.getCurentUserKey();

				ticket.assignee_id = domainUserKey;
				ticket.assigneeID = domainUserKey.getId();

				Tickets.ticketsDao.put(ticket);
			}

			// Creating new Notes in TicketNotes table
			TicketNotes ticketNotes = TicketNotesUtil.createTicketNotes(ticket.id, ticket.groupID, ticket.assigneeID,
					CREATED_BY.AGENT, ticket.requester_name, ticket.requester_email, plain_text, html_text, note_type,
					java.util.Arrays.asList(attachment_urls.split(",")));

			TicketNotesUtil.sendReplyToRequester(ticket);

			return new JSONObject().put("status", "success").toString();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
}