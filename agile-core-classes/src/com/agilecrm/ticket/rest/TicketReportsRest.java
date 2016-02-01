package com.agilecrm.ticket.rest;

import java.util.Calendar;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.TimeZone;
import java.util.concurrent.atomic.AtomicInteger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.ticket.utils.TicketReportsUtil;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;
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
	@Path("/tickets")
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public String getDailyReports(@QueryParam("start_time") Long startTime, @QueryParam("end_time") Long endTime,
			@QueryParam("frequency") String frequency)
	{
		try
		{
			LinkedHashMap<String, LinkedHashMap<String, Integer>> map = new LinkedHashMap<String, LinkedHashMap<String, Integer>>();

			String timeZone = "UTC";

			UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();

			if (userPrefs != null && userPrefs.timezone != null)
				timeZone = userPrefs.timezone;

			JSONObject ticketTypes = new JSONObject();
			ticketTypes.put("NEW", 0);
			ticketTypes.put("OPEN", 0);
			ticketTypes.put("PENDING", 0);
			ticketTypes.put("CLOSED", 0);

			net.sf.json.JSONObject dataJSON = ReportsUtil.initializeFrequencyForReports(startTime, endTime, frequency,
					timeZone, ticketTypes);

			Collection<ScoredDocument> documents = TicketReportsUtil.getTicketsBetweenDates(startTime, endTime,
					"created_time", "status");

			for (ScoredDocument document : documents)
			{
				String last = "";
				Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
				calendar.setTimeInMillis(Math.round(document.getOnlyField("created_time").getNumber()) * 1000);

				if (StringUtils.equalsIgnoreCase(frequency, "monthly"))
					calendar.set(Calendar.DAY_OF_MONTH, 1);

				if (StringUtils.equalsIgnoreCase(frequency, "weekly"))
				{
					Iterator iter = dataJSON.keys();

					while (iter.hasNext())
					{
						String key = (String) iter.next();
						if ((calendar.getTimeInMillis() / 1000 + "").compareToIgnoreCase(key.toString()) > -1)
						{
							last = key;
							continue;
						}

						break;
					}
				}

				calendar.set(Calendar.HOUR_OF_DAY, 0);
				calendar.set(Calendar.MINUTE, 0);
				calendar.set(Calendar.SECOND, 0);
				calendar.set(Calendar.MILLISECOND, 0);

				String createdtime = (calendar.getTimeInMillis() / 1000) + "";

				if (StringUtils.equalsIgnoreCase(frequency, "weekly"))
					createdtime = last;

				int count = 0;

				// Read from previous object if present
				if (dataJSON.containsKey(createdtime))
				{
					JSONObject sourcecount1 = dataJSON.getJSONObject(createdtime);
					count = sourcecount1.getInt(document.getOnlyField("status").getText());

					sourcecount1.put(document.getOnlyField("status").getText(), ++count);
					dataJSON.put(createdtime, sourcecount1);
				}
			}

			return dataJSON.toString();
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

				if (closedTime == null || closedTime == 0)
					continue;

				long slaTime = closedTime - createdTime;

				if (slaTime < 7200)
				{
					map.get("<2 hour").getAndIncrement();
				}
				else if (slaTime > 7200 && slaTime < 21600)
				{
					map.get("2-6 hours").getAndIncrement();
				}
				else if (slaTime > 21600 && slaTime < 43200)
				{
					map.get("6-12 hours").getAndIncrement();
				}
				else if (slaTime > 43200 && slaTime < 86400)
				{
					map.get("12-24 hours").getAndIncrement();
				}
				else if (slaTime > 86400 && slaTime < 172800)
				{
					map.get("1-2 days").getAndIncrement();
				}
				else if (slaTime > 172800 && slaTime < 259200)
				{
					map.get("2-3 days").getAndIncrement();
				}
				else if (slaTime > 259200 && slaTime < 345600)
				{
					map.get("3-4 days").getAndIncrement();
				}
				else if (slaTime > 345600 && slaTime < 432000)
				{
					map.get("4-5 days").getAndIncrement();
				}
				else if (slaTime > 432000 && slaTime < 604800)
				{
					map.get("5-7 days").getAndIncrement();
				}
				else if (slaTime > 604800 && slaTime < 864000)
				{
					map.get("7-10 days").getAndIncrement();
				}
				else if (slaTime > 864000 && slaTime < 1209600)
				{
					map.get("10-14 days").getAndIncrement();
				}
				else
				{
					map.get(">14 days").getAndIncrement();
				}
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

	public static void main(String[] args)
	{
		JSONObject ticketTypes = new JSONObject();
		ticketTypes.put("New", 0);
		ticketTypes.put("Open", 0);
		ticketTypes.put("Pending", 0);
		ticketTypes.put("Closed", 0);

		System.out.println(ReportsUtil.initializeFrequencyForReports(1451586600l, 1454264999l, "weekly",
				"Asia/Kolkata", ticketTypes));
	}
}
