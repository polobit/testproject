package com.agilecrm.activities.util;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.activities.Event;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.IcalendarUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

/**
 * <code>EventUtil</code> is utility class used to process data of {@link Event}
 * class, It processes only when fetching the data from <code>Event<code> class
 * <p>
 * This utility class includes methods needed to return the events based on search range. 
 * Event utility methods return all events, event tracked by an id and
 * events by their search range.
 * </p>
 * 
 * @author Rammohan
 * 
 */
public class EventUtil
{
    // Dao
    private static ObjectifyGenericDao<Event> dao = new ObjectifyGenericDao<Event>(Event.class);

    /**
     * Returns Event based on Id. If no event is present with that id, returns
     * null.
     * 
     * @param id
     *            Id of an Event
     * @return {@link Event} related to the id
     */
    public static Event getEvent(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Fetches all the events with out any filtering
     * 
     * @return all the existing events list
     */
    public static List<Event> getEvents()
    {
	try
	{
	    return dao.fetchAll();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // returns all events count
    public static int getCount()
    {

	return Event.dao.count();
    }

    /**
     * Gets events related to a particular contact
     * 
     * @param contactId
     *            contact id to get the events related to a contact
     * @return List of events related to a contact
     * @throws Exception
     */
    public static List<Event> getContactEvents(Long contactId) throws Exception
    {
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);
	return dao.listByProperty("related_contacts = ", contactKey);
    }

    /**
     * Fetches all the events, which are in the given search range
     * 
     * @param start
     *            Start time of the search range
     * @param end
     *            End time of the search range
     * @return List of events matched to the search range
     */
    public static List<Event> getEvents(Long start, Long end)
    {
	try
	{
	    return dao.ofy().query(Event.class).filter("search_range >=", start).filter("search_range <=", end).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Fetches all the events, which are in the given search range
     * 
     * @param start
     *            Start time of the search range
     * @param end
     *            End time of the search range
     * @return List of events matched to the search range
     */
    public static List<Event> getEvents(Long start, Long end, Long ownerId)
    {
	try
	{
	    if (ownerId != null)
		return dao.ofy().query(Event.class).filter("search_range >=", start).filter("search_range <=", end)
		        .filter("owner", new Key<AgileUser>(AgileUser.class, ownerId)).list();
	    return dao.ofy().query(Event.class).filter("search_range >=", start).filter("search_range <=", end).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets Events with respect to AgileUser.
     * 
     * @param agileUser
     * @link AgileUser
     * @return events list with respect to agileuser.
     */
    public static List<Event> getEventsByAgileUser(AgileUser agileUser)
    {

	if (agileUser == null)
	    return null;

	Key<AgileUser> owner = new Key<AgileUser>(AgileUser.class, agileUser.id);

	List<Event> events = dao.ofy().query(Event.class).filter("owner = ", owner).list();

	return events;
    }

    /**
     * Gets events count related to a particular contact
     * 
     * @param contactId
     *            contact id to get the events related to a contact
     * @return Count of events related to a contact
     * @throws Exception
     */
    public static int getContactEventsCount(Long contactId) throws Exception
    {
	Query<Event> query = dao.ofy().query(Event.class)
	        .filter("related_contacts =", new Key<Contact>(Contact.class, contactId));

	return query.count();
    }

    /**
     * Gets events related to a particular contact odered by the start time.
     * 
     * @param contactId
     *            contact id to get the events related to a contact
     * @return List of events related to a contact
     * @throws Exception
     */
    public static List<Event> getContactSortedEvents(Long contactId) throws Exception

    {
	Query<Event> query = dao.ofy().query(Event.class)
	        .filter("related_contacts =", new Key<Contact>(Contact.class, contactId)).order("start");

	return query.list();
    }

    /**
     * 
     * @param event
     *            method used to send ical event for to contacts added in
     *            related_to filed in event
     */
    @Deprecated
    public static void sendIcal(Event event)
    {
	List<Contact> contacts = event.getContacts();

	String subject = "Invitation:" + event.title;

	DomainUser user = null;
	if (contacts.size() > 0)
	{
	    for (Contact con : contacts)
	    {
		user = DomainUserUtil.getCurrentDomainUser();
		if (user != null)
		{
		    ContactField toemail = con.getContactFieldByName("email");

		    if (toemail != null)

		    {
			net.fortuna.ical4j.model.Calendar iCal = IcalendarUtil.getICalFromEvent(event, user,
			        toemail.value, null);
			String[] attachments = { "text/calendar", "mycalendar.ics", iCal.toString() };
			EmailGatewayUtil.sendEmail(null, "noreply@agilecrm.com", "Agile CRM", toemail.value, null,
			        null, subject, null, null, null, null, null, attachments);
		    }
		}
	    }
	    if (user != null)
	    {
		net.fortuna.ical4j.model.Calendar agileUseiCal = IcalendarUtil.getICalFromEvent(event, null,
		        user.email, user.name);
		System.out.println("agileUseiCal-- " + agileUseiCal.toString());
		String[] attachments_to_agile_user = { "text/calendar", "mycalendar.ics", agileUseiCal.toString() };

		EmailGatewayUtil.sendEmail(null, "noreply@agilecrm.com", "Agile CRM", user.email, null, null, subject,
		        null, null, null, null, null, attachments_to_agile_user);

	    }
	}

    }

    /**
     * get All events base on cursor value
     * 
     * @param max
     * @param cursor
     * @return List of Events
     */
    public static List<Event> getAllEvents(int max, String cursor)
    {
	Query<Event> query = dao.ofy().query(Event.class).order("start");
	return dao.fetchAllWithCursor(max, cursor, query, false, false);
    }

    /**
     * get All events base on cursor value and start date
     * 
     * @param max
     * @param cursor
     * @return List of Events
     */
    public static List<Event> getEventList(int max, String cursor)
    {
	Date d = new Date();
	Long startDate = (d.getTime()) / 1000;
	Query<Event> query = dao.ofy().query(Event.class).filter("start >=", startDate);
	return dao.fetchAllWithCursor(max, cursor, query, false, false);
    }

    /**
     * get All events base on cursor value and start date
     * 
     * @param max
     * @param cursor
     * @return List of Events
     */
    public static List<Event> getEventList(int max, String cursor, Long ownerId)
    {
	Date d = new Date();
	Long startDate = d.getTime();
	Query<Event> query = dao.ofy().query(Event.class).filter("start >=", startDate / 1000)
	        .filter("owner", new Key<AgileUser>(AgileUser.class, ownerId));
	return dao.fetchAllWithCursor(max, cursor, query, false, false);
    }

    /**
     * @return List of events that have been pending for Today
     */
    public static List<Event> getTodayPendingEvents()
    {
	try

	{
	    // Gets Today's date
	    DateUtil startDateUtil = new DateUtil();
	    Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;
	    // Date startDate = new Date();
	    // Long startTime = startDate.getTime() / 1000;

	    // Gets Date after numDays days
	    DateUtil endDateUtil = new DateUtil();
	    Long endTime = (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000) - 1;

	    // Gets list of tasks filtered on given conditions
	    return dao.ofy().query(Event.class).filter("search_range >=", startTime).filter("search_range <=", endTime)
		    .order("search_range").list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * fetches the latest events to send event reminders
     * 
     * @param starttime
     * @return
     */
    public static List<Event> getLatestEvents(Long starttime)
    {
	System.out.println("in getLatest Events Domain name " + NamespaceManager.get());

	int duration = 3600;
	Long currenttime = System.currentTimeMillis() / 1000;
	if (starttime == null)
	    starttime = currenttime + 900;
	else
	    starttime = starttime + 120;

	Long endtime = starttime + duration;

	System.out.println(starttime + "----------------------------" + endtime);

	List<Event> domain_events = new ArrayList<>();

	List<Event> events = dao.ofy().query(Event.class).filter("start >=", starttime).filter("start <=", endtime)
	        .order("start").list();
	if (events != null && events.size() > 0)
	{
	    Event event = events.get(0);
	    domain_events = getLatestWithSameStartTime(event.start);
	    return domain_events;

	}

	return null;
    }

    /**
     * fetches the events which are starting at same time
     * 
     * @param starttime
     * @return
     */
    public static List<Event> getLatestWithSameStartTime(Long starttime)
    {

	System.out.println("in getLatest EventsWithSameStartTime " + NamespaceManager.get());

	List<Event> domain_events = new ArrayList<>();

	domain_events = dao.listByProperty("start", starttime);
	System.out.println(domain_events.size() + " domainevents size in getlatesteventswithSameStarttime");
	System.out.println(starttime + " StartTime in getLatestWithStartTime");
	if (domain_events != null && domain_events.size() > 0)
	{
	    for (Event event : domain_events)
	    {
		event.date = getHumanTimeFromEppoch(event.start);
	    }
	}
	return domain_events;

    }

    /**
     * return list of events based on event owner id
     */

    public static List<Event> getEvents(int count, String cursor, Long ownerId)
    {
	return dao.ofy().query(Event.class).order("start")
	        .filter("owner", new Key<AgileUser>(AgileUser.class, ownerId)).list();
    }

    /**
     * converts eppoch to server timezone
     * 
     * @param epoch
     * @return
     */
    public static String getHumanTimeFromEppoch(Long epoch)
    {
	String date = new java.text.SimpleDateFormat("MMMM d yyyy, h:mm a (z)")
	        .format(new java.util.Date(epoch * 1000));

	return date;
    }
}
