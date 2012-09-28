package com.agilecrm.activities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class Event
{

    // Key
    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public Long start = 0L;

    // Having no end date means that it is all day event
    @NotSaved(IfDefault.class)
    public Long end = 0L;

    @NotSaved(IfDefault.class)
    public boolean is_event_starred = false;

    @NotSaved(IfDefault.class)
    public boolean allDay = false;

    @NotSaved(IfDefault.class)
    public String title = null;

    @NotSaved(IfDefault.class)
    public String color = "blue";

    public Long created_time = 0L;

    // Related Contact
    @NotSaved(IfDefault.class)
    public Key<Contact> contact = null;

    // Owner
    private Key<AgileUser> owner = null;

    // Range object for doing two inequality queries
    List<Long> search_range = null;

    // Dao
    private static ObjectifyGenericDao<Event> dao = new ObjectifyGenericDao<Event>(
	    Event.class);

    Event()
    {

    }

    public Event(String title, Long start, Long end, boolean isEventStarred,
	    Long contactId, Long agileUserId)
    {
	this.title = title;
	this.start = start;
	this.end = end;
	this.is_event_starred = isEventStarred;

	if (contactId != null && contactId != 0L)
	    this.contact = new Key<Contact>(Contact.class, contactId);

	if (agileUserId != null && agileUserId != 0L)
	    this.owner = new Key<AgileUser>(AgileUser.class, agileUserId);
    }

    // Get Event
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

    // Get Event from start to end for FullCalendar
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

    // Get Event from start to end for FullCalendar
    public static List<Event> getEvents(Long start, Long end)
    {
	try
	{
	    return dao.ofy().query(Event.class)
		    .filter("search_range >=", start)
		    .filter("search_range <=", end).list();
	    // return dao.ofy().query(Event.class).filter("search_range >=",
	    // start).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Delete Contact
    public void delete()
    {
	dao.delete(this);
    }

    // Save Contact
    public void save()
    {
	dao.put(this);
    }

    public String toString()
    {
	return ("Start " + start + "  End: " + end + " Range: " + search_range);
    }

    // For search - create a range object for start and end date so that we can
    // search between the two
    @PrePersist
    private void PrePersist()
    {
	// Store Created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;

	search_range = new ArrayList<Long>();
	search_range.add(start);
	search_range.add(end);
    }

}
