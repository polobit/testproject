package com.agilecrm.core.api.calendar;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import com.agilecrm.activities.Event;

@Path("/api/events")
public class EventsAPI {

	// Events
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<Event> getEvents(@Context HttpServletRequest req) {
		String start = req.getParameter("start");
		String end = req.getParameter("end");

		System.out.println("Start: " + start + " End: " + end);
		if (start == null || end == null) {
			System.out.println("Start " + start + " " + end
					+ " - incorrect params. Provide a range");
			return null;
		}

		try {
			return Event.getEvents(Long.parseLong(start), Long.parseLong(end));
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// Get Event
	@Path("{id}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Event getEvent(@PathParam("id") String id) {
		Event event = Event.getEvent(Long.parseLong(id));
		return event;
	}

	// Delete Event
	@Path("{id}")
	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteEvent(@PathParam("id") String id) {
		try {
			Event event = Event.getEvent(Long.parseLong(id));
			if (event != null)
				event.delete();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	// New Event
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Event createEvent(Event event) {
		event.save();
		return event;
	}

	// Update Event
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Event updateEvent(Event event) {
		event.save();
		return event;
	}

}