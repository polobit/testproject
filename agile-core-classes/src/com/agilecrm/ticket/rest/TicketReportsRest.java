package com.agilecrm.ticket.rest;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import net.sf.json.JSONSerializer;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.utils.TicketReportsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.campaignio.reports.DateUtil;
import com.google.appengine.api.search.ScoredDocument;

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
			Long totalSecsPerDay = 86400l;

			LinkedHashMap<String, LinkedHashMap<String, Integer>> map = new LinkedHashMap<String, LinkedHashMap<String, Integer>>();

			while (startTime <= endTime)
			{
				LinkedHashMap<String, Integer> data = new LinkedHashMap<String, Integer>();
				data.put("New",
						TicketReportsUtil.getNewTicketsCountBetweenDates(startTime, (startTime + totalSecsPerDay)));
				data.put("Open",
						TicketReportsUtil.getOpenTicketsCountBetweenDates(startTime, (startTime + totalSecsPerDay)));
				data.put("Pending",
						TicketReportsUtil.getPendingTicketsCountBetweenDates(startTime, (startTime + totalSecsPerDay)));
				data.put("Closed",
						TicketReportsUtil.getClosedTicketsCountBetweenDates(startTime, (startTime + totalSecsPerDay)));

				map.put(DateUtil.getDateInGivenFormat(startTime * 1000, "MMM dd",
						DomainUserUtil.getCurrentDomainUser().timezone), data);

				startTime += totalSecsPerDay;
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

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@GET
	@Path("/hourly-reports")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String getHourlyReports(@QueryParam("start_time") Long startTime)
	{
		try
		{
			Long totalSecsPerDay = 86400L, totalSecsPerHour = 3600L, endTime = (startTime + totalSecsPerDay);

			LinkedHashMap<String, LinkedHashMap<String, Integer>> map = new LinkedHashMap<String, LinkedHashMap<String, Integer>>();

			while (startTime <= endTime)
			{
				LinkedHashMap<String, Integer> data = new LinkedHashMap<String, Integer>();

				data.put("New",
						TicketReportsUtil.getNewTicketsCountBetweenDates(startTime, (startTime + totalSecsPerHour)));
				data.put("Open",
						TicketReportsUtil.getOpenTicketsCountBetweenDates(startTime, (startTime + totalSecsPerHour)));
				data.put("Pending",
						TicketReportsUtil.getPendingTicketsCountBetweenDates(startTime, (startTime + totalSecsPerHour)));
				data.put("Closed",
						TicketReportsUtil.getClosedTicketsCountBetweenDates(startTime, (startTime + totalSecsPerHour)));

				map.put(DateUtil.getDateInGivenFormat(startTime * 1000, "h a",
						DomainUserUtil.getCurrentDomainUser().timezone), data);

				startTime += totalSecsPerHour;
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

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@GET
	@Path("/priority-report")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String getPriorityReport(@QueryParam("start_time") Long startTime, @QueryParam("end_time") Long endTime)
	{
		try
		{
			LinkedHashMap<String, AtomicInteger> map = new LinkedHashMap<String, AtomicInteger>();
			map.put(Priority.LOW.toString(), new AtomicInteger(0));
			map.put(Priority.MEDIUM.toString(), new AtomicInteger(0));
			map.put(Priority.HIGH.toString(), new AtomicInteger(0));

			Collection<ScoredDocument> documents = TicketReportsUtil.getTicketsBetweenDates(startTime, endTime,
					"priority");

			for (ScoredDocument document : documents)
			{
				map.get(document.getOnlyField("priority").getText()).getAndIncrement();
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

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@GET
	@Path("/status-report")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String getStatusReport(@QueryParam("start_time") Long startTime, @QueryParam("end_time") Long endTime)
	{
		try
		{
			LinkedHashMap<String, AtomicInteger> map = new LinkedHashMap<String, AtomicInteger>();
			map.put(Status.NEW.toString(), new AtomicInteger(0));
			map.put(Status.OPEN.toString(), new AtomicInteger(0));
			map.put(Status.PENDING.toString(), new AtomicInteger(0));
			map.put(Status.CLOSED.toString(), new AtomicInteger(0));

			Collection<ScoredDocument> documents = TicketReportsUtil.getTicketsBetweenDates(startTime, endTime,
					"status");

			for (ScoredDocument document : documents)
			{
				map.get(document.getOnlyField("status").getText()).getAndIncrement();
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

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	@GET
	@Path("/sla-report")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String getSLAReport(@QueryParam("start_time") Long startTime, @QueryParam("end_time") Long endTime)
	{
		try
		{
			LinkedHashMap<String, AtomicInteger> map = new LinkedHashMap<String, AtomicInteger>();

			String[] timeDurationToCloseTicket = { "<2 hour", "2-6 hours", "6-12 hours", "12-24 hours", "1-2 days",
					"2-3 days", "3-4 days", "4-5 days", "5-7 days", "7-10 days", "10-14 days", ">14 days" };

			for (String string : timeDurationToCloseTicket)
				map.put(string, new AtomicInteger(0));

			Collection<ScoredDocument> documents = TicketReportsUtil.getTicketSLABetweenDates(startTime, endTime,
					"created_time", "closed_time");

			for (ScoredDocument document : documents)
			{
				Long createdTime = Math.round(document.getOnlyField("created_time").getNumber()), closedTime = Math
						.round(document.getOnlyField("closed_time").getNumber());

				long slaTime = closedTime - createdTime;

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
