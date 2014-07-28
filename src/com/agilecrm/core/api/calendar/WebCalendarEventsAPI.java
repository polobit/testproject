package com.agilecrm.core.api.calendar;

import java.text.ParseException;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONException;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.WebCalendarEvent;
import com.agilecrm.activities.util.WebCalendarEventUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;

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
@Path("/api/webevents")
public class WebCalendarEventsAPI
{

    /**
     * Get slot duration and description for that.
     */
    @Path("/getslotdetails")
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public List<String> getSlotDetails()
    {
	return WebCalendarEventUtil.getSlotDetails();
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
	    @QueryParam("timezone") int timezone, @QueryParam("timezone_name") String timezoneName,
	    @QueryParam("epoch_time") Long epochTime) throws ParseException
    {
	WebCalendarEvent wce = new WebCalendarEvent();

	// Get current user prefs
	UserPrefs currentUserPrefs = UserPrefsUtil.getCurrentUserPrefs();
	System.out.println(currentUserPrefs.name);

	return WebCalendarEventUtil.getSlots(currentUserPrefs.name, slot_time, date, timezone, timezoneName, epochTime);
    }

    @Path("/save")
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public String saveWebEvent(WebCalendarEvent wce) throws JSONException
    {
	// WebCalendarEvent wce = new WebCalendarEvent();

	// System.out.println(obj);
	System.out.println(wce);

	Contact contact = new Contact();
	String result = WebCalendarEventUtil.createEvents(wce, contact);
	return result;
    }
}
