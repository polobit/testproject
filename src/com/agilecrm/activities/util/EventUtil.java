package com.agilecrm.activities.util;

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
			        null, subject, null, null, null, null, attachments);
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
		        null, null, null, null, attachments_to_agile_user);

	    }
	}

    }

    /**
     * Gets the list of events which have been pending for Today
     * 
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
}
