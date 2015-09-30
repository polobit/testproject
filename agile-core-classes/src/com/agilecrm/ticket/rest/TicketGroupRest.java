package com.agilecrm.ticket.rest;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.utils.TicketGroupUtil;

/**
 * 
 * @author Sasi 30-sep-2015
 *
 */
@Path("/api/tickets/groups")
public class TicketGroupRest
{
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<TicketGroups> getGroups()
	{
		return TicketGroupUtil.getAllGroups();
	}

	/**
	 * Saves new Ticket Group
	 * 
	 * @param ticketGroup
	 * @return ticketGroup
	 */
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public TicketGroups createGroup(TicketGroups ticketGroup)
	{
		try
		{
			String groupName = ticketGroup.group_name.trim().toLowerCase();

			TicketGroups existingGroup = TicketGroupUtil.getTicketGroupByName(groupName);

			if (existingGroup != null)
				throw new Exception("Ticket Group with name" + groupName
						+ " already exists. Please choose a different Group name");

			TicketGroups.ticketGroupsDao.put(ticketGroup);
			
			return ticketGroup;
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
}
