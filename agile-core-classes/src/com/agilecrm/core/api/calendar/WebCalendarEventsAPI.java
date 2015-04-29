package com.agilecrm.core.api.calendar;

import java.text.ParseException;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONException;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.WebCalendarEvent;
import com.agilecrm.activities.util.WebCalendarEventUtil;
import com.agilecrm.contact.Contact;

/**
 * <code>WebCalendarEventsAPI</code> includes REST calls to interact with
 * {@link WebCalendarEvent} class to initiate Event CRUD operations
 * <p>
 * It is called from client side to create, update, fetch and delete the web
 * events. It also interacts with {@link WebCalendarEvent} class to fetch the
 * data of Event class from database.
 * </p>
 * 
 */
@Path("/api/webevents/calendar")
public class WebCalendarEventsAPI
{

	/**
	 * Get slot duration and description for that.
	 */
	@Path("/getslotdetails")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<String> getSlotDetails(@QueryParam("userid") Long id)
	{
		return WebCalendarEventUtil.getSlotDetails(id, null);
	}

	/**
	 * Gets an event based on id
	 * 
	 * @param id
	 *            unique id of event
	 * @return {@link Event}
	 * @throws ParseException
	 */
	@Path("/getslots")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<List<Long>> getSlots(@QueryParam("slot_time") int slot_time, @QueryParam("date") String date,
			@QueryParam("timezone_name") String timezoneName, @QueryParam("epoch_time") Long epochTime,
			@QueryParam("selected_time_epoch") Long startTime, @QueryParam("user_id") Long userid,
			@QueryParam("agile_user_id") Long agileuserid, @QueryParam("timezone") int timezone) throws ParseException
	{
		try
		{
			return WebCalendarEventUtil.getSlots(userid, slot_time, date, timezoneName, epochTime, startTime,
					agileuserid, timezone);
		}
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	@Path("/save")
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public String saveWebEvent(WebCalendarEvent wce)
	{
		System.out.println(wce);

		Contact contact = new Contact();
		String result;
		try
		{
			result = WebCalendarEventUtil.createEvents(wce, contact);
			return result;
		}
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println(e.getMessage());
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

	}
}