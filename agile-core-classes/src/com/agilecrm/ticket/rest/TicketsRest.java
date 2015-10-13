package com.agilecrm.ticket.rest;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * 
 * @author Sasi 30-Sep-2015
 * 
 */
@Path("/api/tickets")
public class TicketsRest
{
	/**
	 * 
	 * @param groupID
	 * @param cursor
	 * @param pageSize
	 * @param status
	 * @return list of tickets
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Tickets> getTicketsByGroup(@QueryParam("group_id") String groupID, @QueryParam("cursor") String cursor,
			@QueryParam("page_size") String pageSize, @QueryParam("status") String status)
	{
		try
		{
			if (StringUtils.isBlank(status))
				throw new Exception("Required paramaters missing.");

			// Set default group id if Group ID is null
			if (StringUtils.isBlank(groupID))
				groupID = TicketGroupUtil.getDefaultTicketGroup().id + "";

			if (StringUtils.equalsIgnoreCase(status, "starred"))
				return TicketsUtil.getFavoriteTickets(Long.parseLong(groupID));

			return TicketsUtil.getTicketsByGroupID(Long.parseLong(groupID), Status.valueOf(status.toUpperCase()),
					cursor, pageSize, "-last_updated_time");
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
	 * @param groupID
	 * @param cursor
	 * @param pageSize
	 * @param status
	 * @return list of tickets
	 */
	@GET
	@Path("/count")
	@Produces(MediaType.APPLICATION_JSON)
	public String getTicketsCountByType(@QueryParam("group_id") String groupID, @QueryParam("status") String status)
	{
		try
		{
			// Set default group id if Group ID is null
			if (groupID == null)
			{
				groupID = TicketGroupUtil.getDefaultTicketGroup().id + "";
			}

			int count = StringUtils.equalsIgnoreCase(status, "starred") ? TicketsUtil.getFavoriteTicketsCount(Long
					.parseLong(groupID)) : TicketsUtil.getTicketsCountByType(Long.parseLong(groupID),
					Status.valueOf(status));

			return new JSONObject().put("count", count).toString();
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
	 * @return JSONArray of Groups and Assignee to show in modal for selection.
	 */
	@GET
	@Path("/assign-ticket")
	@Produces(MediaType.APPLICATION_JSON)
	public List<TicketGroups> assignTicket()
	{
		try
		{
			List<TicketGroups> groups = TicketGroupUtil.getAllGroups();

			List<DomainUser> domainUsers = DomainUserUtil.getAllAdminUsers(NamespaceManager.get());

			for (TicketGroups group : groups)
			{
				List<DomainUser> groupUsers = new ArrayList<DomainUser>();

				for (DomainUser domainUser : domainUsers)
				{
					if (group.agents_keys.contains(domainUser.id))
						groupUsers.add(domainUser);
				}

				group.group_users = groupUsers;
			}

			return groups;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Assigns Ticket to given domain user and ticket group
	 * 
	 * @param ticket_id
	 * @param group_id
	 * @param assignee_id
	 * @return returns success json
	 */
	@PUT
	@Path("/assign-ticket")
	@Produces(MediaType.APPLICATION_JSON)
	public String assignTicket(Tickets ticket)
	{
		try
		{
			if (ticket == null || ticket.id == null || ticket.groupID == null)
				throw new Exception("Required parameters missing.");

			TicketsUtil.assignTicket(ticket.id, ticket.groupID, ticket.assigneeID);

			return new JSONObject().put("status", "success").toString();
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
	 * @param ticket_id
	 * @param priority
	 * @return
	 */
	@PUT
	@Path("/change-priority")
	@Produces(MediaType.APPLICATION_JSON)
	public String changePriority(Tickets ticket)
	{
		try
		{
			if (ticket == null || ticket.priority == null)
				throw new Exception("Required parameters missing.");

			TicketsUtil.changePriority(ticket.id, ticket.priority);

			return new JSONObject().put("status", "success").toString();
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
	 * @param ticket_id
	 * @param is_starred
	 * @return
	 */
	@PUT
	@Path("/make-favorite")
	@Produces(MediaType.APPLICATION_JSON)
	public String makeFavorite(Tickets ticket)
	{
		try
		{
			if (ticket == null || ticket.is_favorite == null)
				throw new Exception("Required parameters missing.");

			TicketsUtil.markFavorite(ticket.id, ticket.is_favorite);

			return new JSONObject().put("status", "success").toString();
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
	 * @param ticket_id
	 * @return
	 */
	@PUT
	@Path("/mark-solved")
	@Produces(MediaType.APPLICATION_JSON)
	public String closeTicket(Tickets ticket)
	{
		try
		{
			if (ticket == null || ticket.id == null)
				throw new Exception("Required parameter missing.");

			TicketsUtil.closeTicket(ticket.id);

			return new JSONObject().put("status", "success").toString();
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
	 * @param ticket_id
	 * @return
	 */
	@PUT
	@Path("/delete-ticket")
	@Produces(MediaType.APPLICATION_JSON)
	public String deleteTicket(Tickets ticket)
	{
		try
		{
			if (ticket == null || ticket.id == null)
				throw new Exception("Required parameter missing.");

			TicketsUtil.deleteTicket(ticket.id);

			return new JSONObject().put("status", "success").toString();
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
	 * @return
	 * @throws JSONException
	 */
	@GET
	@Path("/create-test-ticket")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String createTicket() throws JSONException
	{
		try
		{
			TicketGroups group = TicketGroupUtil.getDefaultTicketGroup();

			String message = "Hi!..\r\nThis is test message. Please ignore.\r\n\r\nThank you\r\nSasi Krishna";

			// Creating new Ticket in Ticket table
			Tickets ticket = TicketsUtil.createTicket(group.id, true, "Sasi", "sasi@clickdesk.com",
					"Test ticket created from rest method", "", message, Source.EMAIL, true, "[142.152.23.23]");

			// Creating new Notes in TicketNotes table
			TicketNotesUtil.createTicketNotes(ticket.id, group.id, ticket.assigneeID, CREATED_BY.REQUESTER, "Sasi",
					"sasi@clickdesk.com", message, message, NOTE_TYPE.PUBLIC, new ArrayList<String>());
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return new JSONObject().put("status", "success").toString();
	}
}