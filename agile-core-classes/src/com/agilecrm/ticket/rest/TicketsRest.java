package com.agilecrm.ticket.rest;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONObject;

import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketsUtil;

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

			return TicketsUtil.getTicketsByGroupID(Long.parseLong(groupID), Status.valueOf(status.toUpperCase()), cursor, pageSize,
					"-last_updated_time");
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
}
