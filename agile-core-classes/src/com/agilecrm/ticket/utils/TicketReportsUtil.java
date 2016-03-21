package com.agilecrm.ticket.utils;

import java.util.Calendar;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.TimeZone;

import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.reports.ReportsUtil;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.Tickets.Priority;
import com.agilecrm.ticket.entitys.Tickets.Status;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.ScoredDocument;

/**
 * 
 * @author Mantra
 * 
 */
public class TicketReportsUtil
{
	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static int getTicketsCountBetweenDates(Long startTime, Long endTime)
	{
		String queryString = "created_time >=" + startTime + " AND " + " created_time <= " + endTime;

		System.out.println("Query: " + queryString);

		return new TicketsDocument().countRows(queryString);
	}

	//
	// /**
	// *
	// * @param startTime
	// * @param endTime
	// * @return
	// */
	// public static int getOpenTicketsCountBetweenDates(Long startTime, Long
	// endTime)
	// {
	// String queryString = "assigned_time >=" + startTime + " AND " +
	// " assigned_time <= " + endTime + " AND status="
	// + Status.OPEN;
	//
	// System.out.println("Query: " + queryString);
	//
	// return new TicketsDocument().countRows(queryString);
	// }
	//
	// /**
	// *
	// * @param startTime
	// * @param endTime
	// * @return
	// */
	// public static int getPendingTicketsCountBetweenDates(Long startTime, Long
	// endTime)
	// {
	// String queryString = "last_updated_time >=" + startTime + " AND " +
	// " last_updated_time <= " + endTime
	// + " AND status=" + Status.PENDING;
	//
	// System.out.println("Query: " + queryString);
	//
	// return new TicketsDocument().countRows(queryString);
	// }
	//
	// /**
	// *
	// * @param startTime
	// * @param endTime
	// * @return
	// */
	// public static int getClosedTicketsCountBetweenDates(Long startTime, Long
	// endTime)
	// {
	// String queryString = "closed_time >=" + startTime + " AND " +
	// " closed_time <= " + endTime + " AND status="
	// + Status.CLOSED;
	//
	// System.out.println("Query: " + queryString);
	//
	// return new TicketsDocument().countRows(queryString);
	// }

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static Collection<ScoredDocument> getTicketsBetweenDates(Long startTime, Long endTime,
			String... fieldsToReturn)
	{
		String queryString = "created_time >=" + startTime + " AND " + " created_time <= " + endTime;

		System.out.println("Query: " + queryString);

		return new TicketsDocument().executeQuery(queryString, fieldsToReturn);
	}

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static Collection<ScoredDocument> getTicketSLABetweenDates(Long startTime, Long endTime,
			String... fieldsToReturn)
	{
		String queryString = "created_time >=" + startTime + " AND " + " created_time <= " + endTime + " AND status="
				+ Status.CLOSED;

		System.out.println("Query: " + queryString);

		return new TicketsDocument().executeQuery(queryString, fieldsToReturn);
	}

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @param frequency
	 * @param status
	 * @return
	 */
	public static String getDailyReports(Long startTime, Long endTime, String frequency, String status)
	{
		String timeZone = "UTC";

		UserPrefs userPrefs = UserPrefsUtil.getCurrentUserPrefs();

		if (userPrefs != null && userPrefs.timezone != null)
			timeZone = userPrefs.timezone;

		JSONObject ticketTypes = new JSONObject();
		ticketTypes.put(status, 0);

		net.sf.json.JSONObject dataJSON = ReportsUtil.initializeFrequencyForReports(startTime, endTime, frequency,
				timeZone, ticketTypes);

		Collection<ScoredDocument> documents = null;

		String fieldToReturn = Tickets.CREATE_TIME;

		String queryString = "(" + fieldToReturn + " >=" + startTime + " AND " + fieldToReturn + " <= " + endTime + ")";

		if (Status.CLOSED.toString().equalsIgnoreCase(status))
		{
			fieldToReturn = Tickets.CLOSED_TIME;

			queryString = "(" + fieldToReturn + " >=" + startTime + " AND " + fieldToReturn + " <= " + endTime
					+ ") AND (status = CLOSED)";
		}

		System.out.println("Query: " + queryString);

		documents = new TicketsDocument().executeQuery(queryString, fieldToReturn);

		for (ScoredDocument document : documents)
		{
			String last = "";

			Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone(timeZone));
			calendar.setTimeInMillis(Math.round(document.getOnlyField(fieldToReturn).getNumber()) * 1000);

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
				count = sourcecount1.getInt(status.toString());

				sourcecount1.put(status, ++count);
				dataJSON.put(createdtime, sourcecount1);
			}
		}

		return dataJSON.toString();
	}

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static String getPriorityReport(Long startTime, Long endTime)
	{
		Collection<ScoredDocument> documents = TicketReportsUtil.getTicketsBetweenDates(startTime, endTime, "priority");

		LinkedHashMap<String, Integer> innerMap = new LinkedHashMap<String, Integer>();
		innerMap.put("count", 0);
		// innerMap.put("total", documents.size());

		LinkedHashMap<String, LinkedHashMap<String, Integer>> map = new LinkedHashMap<String, LinkedHashMap<String, Integer>>();
		map.put(Priority.LOW.toString(), new LinkedHashMap<String, Integer>(innerMap));
		map.put(Priority.MEDIUM.toString(), new LinkedHashMap<String, Integer>(innerMap));
		map.put(Priority.HIGH.toString(), new LinkedHashMap<String, Integer>(innerMap));

		for (ScoredDocument document : documents)
		{
			Integer count = map.get(document.getOnlyField("priority").getText()).get("count");
			map.get(document.getOnlyField("priority").getText()).put("count", ++count);
		}

		return JSONSerializer.toJSON(map).toString();
	}

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static String getStatusReport(Long startTime, Long endTime)
	{
		Collection<ScoredDocument> documents = TicketReportsUtil.getTicketsBetweenDates(startTime, endTime, "status");

		LinkedHashMap<String, Integer> innerMap = new LinkedHashMap<String, Integer>();
		innerMap.put("count", 0);
		// innerMap.put("total", documents.size());

		LinkedHashMap<String, LinkedHashMap<String, Integer>> map = new LinkedHashMap<String, LinkedHashMap<String, Integer>>();
		map.put(Status.NEW.toString(), new LinkedHashMap<String, Integer>(innerMap));
		map.put(Status.OPEN.toString(), new LinkedHashMap<String, Integer>(innerMap));
		map.put(Status.PENDING.toString(), new LinkedHashMap<String, Integer>(innerMap));
		map.put(Status.CLOSED.toString(), new LinkedHashMap<String, Integer>(innerMap));

		for (ScoredDocument document : documents)
		{
			Integer count = map.get(document.getOnlyField("status").getText()).get("count");
			map.get(document.getOnlyField("status").getText()).put("count", ++count);
		}

		return JSONSerializer.toJSON(map).toString();
	}

	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static String getFirstReponseReport(Long startTime, Long endTime)
	{
		Collection<ScoredDocument> documents = TicketReportsUtil.getTicketsBetweenDates(startTime, endTime,
				"created_time", "first_replied_time");

		LinkedHashMap<String, Long> innerMap = new LinkedHashMap<String, Long>();
		innerMap.put("count", 0l);

		LinkedHashMap<String, LinkedHashMap<String, Long>> countMap = new LinkedHashMap<String, LinkedHashMap<String, Long>>();
		countMap.put("0-1 hr", new LinkedHashMap<String, Long>(innerMap));
		countMap.put("1-8 hrs", new LinkedHashMap<String, Long>(innerMap));
		countMap.put("8-24 hrs", new LinkedHashMap<String, Long>(innerMap));
		countMap.put(">24 hrs", new LinkedHashMap<String, Long>(innerMap));

		for (ScoredDocument document : documents)
		{
			Field field = null;

			try
			{
				field = document.getOnlyField("first_replied_time");
			}
			catch (Exception e)
			{
				continue;
			}

			Long firstRepliedTime = Math.round(field.getNumber()), createdTime = Math.round(document.getOnlyField(
					"created_time").getNumber());

			Long firstResponseTime = firstRepliedTime - createdTime;

			String key = "";

			if (firstResponseTime <= 3600)
			{
				key = "0-1 hr";
			}
			else if (firstResponseTime > 3600 && firstResponseTime <= 28800)
			{
				key = "1-8 hrs";
			}
			else if (firstResponseTime > 28800 && firstResponseTime <= 86400)
			{
				key = "8-24 hrs";
			}
			else
			{
				key = ">24 hrs";
			}

			// Add first responsetime
			LinkedHashMap<String, Long> tempMap = countMap.get(key);
			tempMap.put("count", tempMap.get("count") + 1);

			// Increase count
			countMap.put(key, tempMap);
		}

		return JSONSerializer.toJSON(countMap).toString();
	}
	
	/**
	 * 
	 * @param startTime
	 * @param endTime
	 * @return
	 */
	public static String getSLAReport(Long startTime, Long endTime)
	{
		try
		{
			Collection<ScoredDocument> documents = TicketReportsUtil.getTicketSLABetweenDates(startTime, endTime,
					"created_time", "closed_time");

			String[] timeDurationToCloseTicket = { "<2 hour", "2-6 hours", "6-12 hours", "12-24 hours", "1-2 days",
					"2-3 days", "3-4 days", "4-5 days", "5-7 days", "7-10 days", "10-14 days", ">14 days" };

			LinkedHashMap<String, Integer> innerMap = new LinkedHashMap<String, Integer>();
			innerMap.put("count", 0);
			// innerMap.put("total", timeDurationToCloseTicket.length);

			LinkedHashMap<String, LinkedHashMap<String, Integer>> map = new LinkedHashMap<String, LinkedHashMap<String, Integer>>();

			for (String string : timeDurationToCloseTicket)
				map.put(string, new LinkedHashMap<String, Integer>(innerMap));

			Integer total = 0;

			for (ScoredDocument document : documents)
			{
				Long createdTime = Math.round(document.getOnlyField("created_time").getNumber()), closedTime = Math
						.round(document.getOnlyField("closed_time").getNumber());

				if (closedTime == null || closedTime == 0)
					continue;

				total++;

				long slaTime = closedTime - createdTime;

				if (slaTime < 7200)
				{
					Integer count = map.get("<2 hour").get("count");
					map.get("<2 hour").put("count", ++count);
				}
				else if (slaTime > 7200 && slaTime < 21600)
				{
					Integer count = map.get("2-6 hours").get("count");
					map.get("2-6 hours").put("count", ++count);
				}
				else if (slaTime > 21600 && slaTime < 43200)
				{
					Integer count = map.get("6-12 hours").get("count");
					map.get("6-12 hours").put("count", ++count);
				}
				else if (slaTime > 43200 && slaTime < 86400)
				{
					Integer count = map.get("12-24 hours").get("count");
					map.get("12-24 hours").put("count", ++count);
				}
				else if (slaTime > 86400 && slaTime < 172800)
				{
					Integer count = map.get("1-2 days").get("count");
					map.get("1-2 days").put("count", ++count);
				}
				else if (slaTime > 172800 && slaTime < 259200)
				{
					Integer count = map.get("2-3 days").get("count");
					map.get("2-3 days").put("count", ++count);
				}
				else if (slaTime > 259200 && slaTime < 345600)
				{
					Integer count = map.get("3-4 days").get("count");
					map.get("3-4 days").put("count", ++count);
				}
				else if (slaTime > 345600 && slaTime < 432000)
				{
					Integer count = map.get("4-5 days").get("count");
					map.get("4-5 days").put("count", ++count);
				}
				else if (slaTime > 432000 && slaTime < 604800)
				{
					Integer count = map.get("5-7 days").get("count");
					map.get("5-7 days").put("count", ++count);
				}
				else if (slaTime > 604800 && slaTime < 864000)
				{
					Integer count = map.get("7-10 days").get("count");
					map.get("7-10 days").put("count", ++count);
				}
				else if (slaTime > 864000 && slaTime < 1209600)
				{
					Integer count = map.get("10-14 days").get("count");
					map.get("10-14 days").put("count", ++count);
				}
				else
				{
					Integer count = map.get(">14 days").get("count");
					map.get(">14 days").put("count", ++count);
				}
			}

			return JSONSerializer.toJSON(map).toString();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		
		return "";
	}
}
