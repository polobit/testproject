package com.agilecrm.core.api.calendar;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;

import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.activities.util.GoogleCalendarUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.access.util.UserAccessControlUtil;
import com.agilecrm.user.access.util.UserAccessControlUtil.CRUDOperation;
import com.googlecode.objectify.Key;

/**
 * <code>EventsAPI</code> includes REST calls to interact with {@link Event}
 * class to initiate Event CRUD operations
 * <p>
 * It is called from client side to create, update, fetch and delete the events.
 * It also interacts with {@link EventUtil} class to fetch the data of Event
 * class from database.
 * </p>
 * 
 * @author Rammohan
 * 
 */
@Path("/api/events")
public class EventsAPI
{

    /**
     * Gets List of events matched to a search range
     * 
     * @param req
     *            HttpServletRequest parameter
     * @return List of events matched to a search range
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Event> getEvents(@Context HttpServletRequest req)
    {
	String start = req.getParameter("start");
	String end = req.getParameter("end");
	String ownerId = req.getParameter("owner_id");

	System.out.println("Start: " + start + " End: " + end);
	if (start == null || end == null)
	{
	    System.out.println("Start " + start + " " + end + " - incorrect params. Provide a range");
	    return null;
	}

	try
	{
	    if (ownerId != null)
	    {
		if (ownerId.contains(","))
		{
		    String[] owner_ids = ownerId.split(",");
		    List<Event> all_user_events = new ArrayList<Event>();
		    for (String id : owner_ids)
		    {
			List<Event> events = EventUtil.getEvents(Long.parseLong(start), Long.parseLong(end),
				Long.parseLong(id));
			all_user_events.addAll(events);

		    }
		    return all_user_events;
		}
		else
		    return EventUtil.getEvents(Long.parseLong(start), Long.parseLong(end), Long.parseLong(ownerId));
	    }
	    return EventUtil.getEvents(Long.parseLong(start), Long.parseLong(end), null);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets an event based on id
     * 
     * @param id
     *            unique id of event
     * @return {@link Event}
     */
    @Path("{id}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public Event getEvent(@PathParam("id") Long id)
    {
	Event event = EventUtil.getEvent(id);
	return event;
    }

    /**
     * Gets an event based on id
     * 
     * @param id
     *            unique id of event
     * @return {@link Event}
     */
    @Path("/getEventObject/{id}")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public Event getEventForActivity(@PathParam("id") Long id)
    {
	Event event = EventUtil.getEvent(id);
	return event;
    }

    /**
     * Deletes an event based on id
     * 
     * @param id
     *            unique id of event
     */
    @Path("{id}")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteEvent(@PathParam("id") Long id)
    {
    Event event = EventUtil.getEvent(id);
    UserAccessControlUtil.check(Event.class.getSimpleName(), event, CRUDOperation.DELETE, true);
	try
	{
	    if (event != null)
	    {
		ActivitySave.createEventDeleteActivity(event);
		if (event.type.toString().equalsIgnoreCase("WEB_APPOINTMENT"))
		    GoogleCalendarUtil.deleteGoogleEvent(event);
		event.delete();
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Saves a new event in database
     * 
     * @param event
     *            {@link Event} from form data
     * @return {@link Event}
     */
    @POST
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Event createEvent(Event event)
    {
	event.save();
	try
	{
	    ActivitySave.createEventAddActivity(event);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return event;
    }

    /**
     * Updates an existing event
     * 
     * @param event
     *            {@link Event}
     * @return {@link Event}
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public Event updateEvent(Event event)
    {
    UserAccessControlUtil.check(Event.class.getSimpleName(), event, CRUDOperation.UPDATE, true);
	try
	{
	    ActivitySave.createEventEditActivity(event);
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	event.save();
	return event;
    }

    /**
     * Deletes events bulk
     * 
     * @param model_ids
     *            event ids, read as form parameter from request url
     * @throws JSONException
     */
    @Path("bulk")
    @POST
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public void deleteEvents(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray eventsJSONArray = new JSONArray(model_ids);
	ActivitySave.createLogForBulkDeletes(EntityType.EVENT, eventsJSONArray,
		String.valueOf(eventsJSONArray.length()), "");

	Event.dao.deleteBulkByIds(eventsJSONArray);
    }

    @Path("/future/list")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Event> getAllEvent(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count,
	    @QueryParam("reload") boolean force_reload, @QueryParam("ownerId") String ownerId)
    {
	if (count != null)
	{
	    System.out.println("Fetching page by page");
	    if (!StringUtils.isEmpty(ownerId))
	    {
		if (ownerId.contains(","))
		{
		    String[] owner_ids = ownerId.split(",");
		    List<Event> all_user_events = new ArrayList<Event>();
		    for (String id : owner_ids)
		    {
			List<Event> events = EventUtil
				.getEventList(Integer.parseInt(count), cursor, Long.parseLong(id));
			all_user_events.addAll(events);

		    }
		    return all_user_events;
		}
		else
		    return EventUtil.getEventList(Integer.parseInt(count), cursor, Long.parseLong(ownerId));
	    }
	    else
	    {
		return EventUtil.getEventList((Integer.parseInt(count)), cursor);
	    }
	}

	return EventUtil.getEvents();
    }

    @Path("/list")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Event> getFutureEvent(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count,
	    @QueryParam("reload") boolean force_reload, @QueryParam("ownerId") String ownerId)
    {
	if (count != null)
	{
	    System.out.println("Fetching page by page");

	    if (!StringUtils.isEmpty(ownerId))
	    {
		if (ownerId.contains(","))
		{
		    String[] owner_ids = ownerId.split(",");
		    List<Event> all_user_events = new ArrayList<Event>();
		    for (String id : owner_ids)
		    {
			List<Event> events = EventUtil.getEvents(Integer.parseInt(count), cursor, Long.parseLong(id));
			all_user_events.addAll(events);

		    }
		    return all_user_events;
		}
		else
		    return EventUtil.getEvents(Integer.parseInt(count), cursor, Long.parseLong(ownerId));
	    }
	    else
	    {
		return EventUtil.getAllEvents((Integer.parseInt(count)), cursor);
	    }
	}

	return EventUtil.getEvents();
    }

    /**
     * deletes web event by sending mail with cancle reason to contact
     * 
     * @param id
     */
    @Path("/cancelwebevent")
    @DELETE
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void deleteWebEvent(@QueryParam("eventid") Long id, @QueryParam("cancelreason") String cancel_subject,
	    @QueryParam("action_parameter") String action_parameter)
    {
	try
	{
	    Event event = EventUtil.getEvent(id);

	    if (event != null)
	    {
		if ("updateattendee".equalsIgnoreCase(action_parameter))
		{
		    // send mail to contact with cancel reason
		    EventUtil.sendMailToWebEventAttendee(event, cancel_subject);
		    ActivitySave.createEventDeleteActivity(event);
		    GoogleCalendarUtil.deleteGoogleEvent(event);
		    event.delete();
		}

	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
    }

    /**
     * Get List of newly created event.
     * 
     * @param page_size
     */
    @Path("/list/new")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Event> getNewEvent(@QueryParam("cursor") String cursor, @QueryParam("page_size") String count)
    {
	return EventUtil.getEvents(Integer.parseInt(count));
    }

}