package com.agilecrm.ticket.rest;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.utils.TicketsUtil;

/**
 * 
 * @author Sasi 30-sep-2015
 * 
 */
@Path("/api/tickets")
public class TicketsRest
{
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Tickets> getTicketsByGroup(@QueryParam("group_id") Long groupID, @QueryParam("cursor") String cursor,
			@QueryParam("page_size") String pageSize, @QueryParam("status") String status)
	{
		try
		{
			return TicketsUtil.getTicketsByGroupID(groupID, Status.valueOf(status), cursor, pageSize,
					"last_updated_time");
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
}
