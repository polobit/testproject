package com.agilecrm.ticket.rest;

import java.util.List;

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

import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

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
	 * Assigns Ticket to given domain user and ticket group
	 * 
	 * @param ticket_id
	 * @param group_id
	 * @param assignee_id
	 * @return returns success json
	 */
	@POST
	@Path("/assign-ticket")
	@Produces(MediaType.APPLICATION_JSON)
	public String assignTicket(@QueryParam("ticket_id") Long ticket_id, @QueryParam("group_id") Long group_id,
			@QueryParam("assignee_id") Long assignee_id)
	{
		try
		{
			if (ticket_id == null || group_id == null || assignee_id == null)
				throw new Exception("Required parameters missing.");

			Tickets ticket = TicketsUtil.getTicketByID(ticket_id);
			ticket.group_id = new Key<TicketGroups>(TicketGroups.class, group_id);
			ticket.assignee_id = new Key<DomainUser>(DomainUser.class, assignee_id);

			if (ticket.status == Status.NEW)
				ticket.status = Status.OPEN;

			Tickets.ticketsDao.put(ticket);

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
	@POST
	@Path("/change-priority")
	@Produces(MediaType.APPLICATION_JSON)
	public String changePriority(@QueryParam("ticket_id") Long ticket_id, @QueryParam("priority") String priority)
	{
		try
		{
			if (ticket_id == null || StringUtils.isBlank(priority))
				throw new Exception("Required parameters missing.");

			Tickets ticket = TicketsUtil.getTicketByID(ticket_id);
			ticket.priority = Priority.valueOf(priority.toUpperCase());

			Tickets.ticketsDao.put(ticket);

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
	@POST
	@Path("/make-favorite")
	@Produces(MediaType.APPLICATION_JSON)
	public String  makeFavorite(@QueryParam("ticket_id") Long ticket_id, @QueryParam("is_starred") Boolean is_starred)
	{
		try
		{
			if (ticket_id == null || is_starred == null)
				throw new Exception("Required parameters missing.");

			Tickets ticket = TicketsUtil.getTicketByID(ticket_id);
			ticket.is_favorite = is_starred;

			Tickets.ticketsDao.put(ticket);

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
	@POST
	@Path("/close-ticket")
	@Produces(MediaType.APPLICATION_JSON)
	public String  closeTicket(@QueryParam("ticket_id") Long ticket_id)
	{
		try
		{
			if (ticket_id == null)
				throw new Exception("Required parameter missing.");

			Tickets ticket = TicketsUtil.getTicketByID(ticket_id);
			ticket.status = Status.CLOSED;

			Tickets.ticketsDao.put(ticket);

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