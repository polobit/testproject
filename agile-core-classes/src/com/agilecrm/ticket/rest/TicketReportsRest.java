package com.agilecrm.ticket.rest;

import java.util.LinkedHashMap;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import net.sf.json.JSONSerializer;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.utils.TicketReportsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.campaignio.reports.DateUtil;

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
			Long totalMilliSecsPerDay = 86400l;

			LinkedHashMap<String, LinkedHashMap<String, Integer>> map = new LinkedHashMap<String, LinkedHashMap<String, Integer>>();

			while (startTime <= endTime)
			{
				LinkedHashMap<String, Integer> data = new LinkedHashMap<String, Integer>();
				data.put("New",
						TicketReportsUtil.getNewTicketsCountBetweenDates(startTime, (startTime + totalMilliSecsPerDay)));
				data.put("Open", TicketReportsUtil.getOpenTicketsCountBetweenDates(startTime,
						(startTime + totalMilliSecsPerDay)));
				data.put("Pending", TicketReportsUtil.getPendingTicketsCountBetweenDates(startTime,
						(startTime + totalMilliSecsPerDay)));
				data.put("Closed", TicketReportsUtil.getClosedTicketsCountBetweenDates(startTime,
						(startTime + totalMilliSecsPerDay)));

				map.put(DateUtil.getDateInGivenFormat(startTime * 1000, "MMM dd",
						DomainUserUtil.getCurrentDomainUser().timezone), data);

				startTime += totalMilliSecsPerDay;
			}

			return JSONSerializer.toJSON(map).toString();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
}
