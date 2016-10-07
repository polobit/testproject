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

import com.agilecrm.UpdateRelatedEntitiesUtil;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.activities.util.ActivitySave;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.activities.util.GoogleCalendarUtil;
import com.agilecrm.activities.util.TaskUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.projectedpojos.ContactPartial;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.access.exception.AccessDeniedException;
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
    if(event != null)
    {
    	List<ContactPartial> contList = event.getContacts();
    	List<String> conIds = new ArrayList<String>();
    	for(ContactPartial con : contList)
    	{
    		conIds.add(String.valueOf(con.id));
    	}
    	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
    	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
    	{
    		throw new AccessDeniedException("Event cannot be deleted because you do not have permission to update associated contact.");
    	}
    	
    	List<String> dealIds = event.getDeal_ids();
    	List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
    	if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
    	{
    		throw new AccessDeniedException("Event cannot be deleted because you do not have permission to update associated deal.");
    	}
    	
    	try
    	{
    	    ActivitySave.createEventDeleteActivity(event);
    		if (event.type.toString().equalsIgnoreCase("WEB_APPOINTMENT"))
    		    GoogleCalendarUtil.deleteGoogleEvent(event);
    		
    		List<Opportunity> relatedDealsList = event.relatedDeals();
    		
    		UpdateRelatedEntitiesUtil.updateRelatedDeals(relatedDealsList, dealIds);
    		
    		event.delete();
    	}
    	catch (Exception e)
    	{
    	    e.printStackTrace();
    	}
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
    List<String> conIds = event.contacts;
    List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
    if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
    {
    	throw new AccessDeniedException("Event cannot be created because you do not have permission to update associated contact(s).");
    }
    
    List<String> dealIds = event.getDeal_ids();
    List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
    if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
    {
    	throw new AccessDeniedException("Event cannot be created because you do not have permission to update associated deal(s).");
    }
    
	event.save();
	try
	{
	    ActivitySave.createEventAddActivity(event);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	
	List<Contact> relatedContactsList = event.relatedContacts();
	List<Opportunity> relatedDealsList = event.relatedDeals();
	
	UpdateRelatedEntitiesUtil.updateRelatedContacts(relatedContactsList, conIds);
	
	UpdateRelatedEntitiesUtil.updateRelatedDeals(relatedDealsList, dealIds);
	
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
    Event oldEvent =EventUtil.getEvent(event.id);
    List<String> oldConIds = new ArrayList<String>();
    List<String> oldDealIds = new ArrayList<String>();
    if(oldEvent != null)
    {
    	List<ContactPartial> contactsList = oldEvent.getContacts();
		List<String> conIds = new ArrayList<String>();
		for(ContactPartial cont : contactsList)
		{
			conIds.add(String.valueOf(cont.id));
		}
    	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
    	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
    	{
    		throw new AccessDeniedException("Event cannot be updated because you do not have permission to update associated contact(s).");
    	}
    	
    	List<String> dealIds = oldEvent.getDeal_ids();
        List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
        if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
        {
        	throw new AccessDeniedException("Event cannot be updated because you do not have permission to update associated deal(s).");
        }
        oldConIds.addAll(conIds);
        oldDealIds.addAll(dealIds);
    }
	List<String> conIds = event.contacts;
	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
	{
		throw new AccessDeniedException("Event cannot be updated because you do not have permission to update associated contact(s).");
	}
	List<String> dealIds = event.getDeal_ids();
    List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
    if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
    {
    	throw new AccessDeniedException("Event cannot be updated because you do not have permission to update associated deal(s).");
    }
    
    UserAccessControlUtil.check(Event.class.getSimpleName(), event, CRUDOperation.UPDATE, true);
    
    List<Contact> relatedContactsOldList = oldEvent.relatedContacts();
    List<Contact> relatedContactsList = event.relatedContacts();
    
    List<Opportunity> relatedDealsOldList = event.relatedDeals();
    List<Opportunity> relatedDealsList = event.relatedDeals();
    
    if(relatedContactsOldList != null && relatedContactsOldList.size() > 0)
    {
    	relatedContactsList.addAll(relatedContactsOldList);
    }
    
    if(relatedDealsOldList != null && relatedDealsOldList.size() > 0)
    {
    	relatedDealsList.addAll(relatedDealsOldList);
    }
    
    List<String> conIdList = new ArrayList<String>();
    if(oldConIds != null && oldConIds.size() > 0)
    {
    	conIdList.addAll(oldConIds);
    }
    if(conIds != null && conIds.size() > 0)
    {
    	conIdList.addAll(conIds);
    }
    List<String> dealIdList = new ArrayList<String>();
    if(oldDealIds != null && oldDealIds.size() > 0)
    {
    	dealIdList.addAll(oldDealIds);
    }
    if(dealIds != null && dealIds.size() > 0)
    {
    	dealIdList.addAll(dealIds);
    }
    
    UpdateRelatedEntitiesUtil.updateRelatedContacts(relatedContactsList, conIdList);
    
    UpdateRelatedEntitiesUtil.updateRelatedDeals(relatedDealsList, dealIdList);
    
    
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
    @Produces({ MediaType.APPLICATION_JSON })
    public List<String> deleteEvents(@FormParam("ids") String model_ids) throws JSONException
    {
	JSONArray eventsJSONArray = new JSONArray(model_ids);
	JSONArray eventsArray = new JSONArray();
	List<String> contactIdsList = new ArrayList<String>();
	if(eventsJSONArray!=null && eventsJSONArray.length()>0){
    	try {    		
    		for(int i = 0; i < eventsJSONArray.length(); i++) {
    			
    			String eventId = eventsJSONArray.getString(i);
				Event event = EventUtil.getEvent(Long.parseLong(eventId));
				
				List<ContactPartial> contactsList = event.getContacts();
				List<String> conIds = new ArrayList<String>();
				for(ContactPartial cont : contactsList)
				{
					conIds.add(String.valueOf(cont.id));
				}
				List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
				
				if(conIds == null || modifiedConIds == null || conIds.size() == modifiedConIds.size())
				{
					eventsArray.put(eventsJSONArray.getString(i));
					contactIdsList.addAll(modifiedConIds);
				}
				
				List<Contact> relatedContactsList = event.relatedContacts();
				List<Opportunity> relatedDealsList = event.relatedDeals();
				
				UpdateRelatedEntitiesUtil.updateRelatedContacts(relatedContactsList, conIds);
				
				UpdateRelatedEntitiesUtil.updateRelatedDeals(relatedDealsList, event.getDeal_ids());
							
    			}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
		}
     }
	ActivitySave.createLogForBulkDeletes(EntityType.EVENT, eventsArray,
		String.valueOf(eventsArray.length()), "");

	Event.dao.deleteBulkByIds(eventsArray);
	return contactIdsList;
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

     @Path("/contacts-related")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public List<Contact> getRelatedContactsToEvents(@QueryParam("id") Long id)
    {
	return EventUtil.getEventsRelatedContacts(id);
    }
     
	 @Path("delete")
	 @POST
	 @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	 @Produces({ MediaType.APPLICATION_JSON })
	 public void deleteEvent(@FormParam("ids") String model_ids) throws JSONException
	 {
	 	JSONArray eventsJSONArray = new JSONArray(model_ids);
	 	if(eventsJSONArray != null)
	 	{
	 		Long id = eventsJSONArray.getLong(0);
	 		Event event = EventUtil.getEvent(id);
	 	    UserAccessControlUtil.check(Event.class.getSimpleName(), event, CRUDOperation.DELETE, true);
	 	    if(event != null)
	 	    {
	 	    	List<ContactPartial> contList = event.getContacts();
	 	    	List<String> conIds = new ArrayList<String>();
	 	    	for(ContactPartial con : contList)
	 	    	{
	 	    		conIds.add(String.valueOf(con.id));
	 	    	}
	 	    	List<String> modifiedConIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedContacts(conIds);
	 	    	if(conIds != null && modifiedConIds != null && conIds.size() != modifiedConIds.size())
	 	    	{
	 	    		throw new AccessDeniedException("Event cannot be deleted because you do not have permission to update associated contact.");
	 	    	}
	 	    	
	 	    	List<String> dealIds = event.getDeal_ids();
	 	    	List<String> modifiedDealIds = UserAccessControlUtil.checkUpdateAndmodifyRelatedDeals(dealIds);
	 	    	if(dealIds != null && modifiedDealIds != null && dealIds.size() != modifiedDealIds.size())
	 	    	{
	 	    		throw new AccessDeniedException("Event cannot be deleted because you do not have permission to update associated deal.");
	 	    	}
	 	    	
	 	    	try
	 	    	{
	 	    	    ActivitySave.createEventDeleteActivity(event);
	 	    		if (event.type.toString().equalsIgnoreCase("WEB_APPOINTMENT"))
	 	    		    GoogleCalendarUtil.deleteGoogleEvent(event);
	 	    		
	 	    		List<Opportunity> relatedDealsList = event.relatedDeals();
	 	    		
	 	    		UpdateRelatedEntitiesUtil.updateRelatedDeals(relatedDealsList, dealIds);
	 	    		
	 	    		event.delete();
	 	    	}
	 	    	catch (Exception e)
	 	    	{
	 	    	    e.printStackTrace();
	 	    	}
	 	    }
	 	}
	 }

}