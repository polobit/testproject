package com.agilecrm.ticket.rest;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.exception.ExceptionUtils;

/**
 * 
 * @author Mantra
 * 
 */
@Path("/api/tickets/reports")
public class TicketReportsRest
{
	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@GET
	@Path("/daily-reports")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String getDailyReports(@QueryParam("start_time") Long startTime, @QueryParam("end_time") Long endTime)
	{
		try
		{

		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

		return null;
	}
}
