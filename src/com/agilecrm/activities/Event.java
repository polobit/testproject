package com.agilecrm.activities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Event</code> class represents the events for FullCalendar based on the
 * specified time duration. Events are time based such as meetings. They show up
 * in calendar.
 * <p>
 * The Event entity includes start and end time, which is also stored as search
 * range of an event. Based on the search range (start and end dates) we can
 * search all the events of that particular period. For some events the duration
 * could be one full day, such events are also known as 'All day events'.
 * </p>
 * <p>
 * This class implements {@link AgileUser} to create key and to store the key as
 * the event's owner.
 * </p>
 * <p>
 * The <code>Event</code> class provides methods to create, update, delete and
 * get the events.
 * </p>
 * 
 * @author Rammohan
 * 
 */
@XmlRootElement
@Cached
public class Event
{

    // Key
    @Id
    public Long id;

    /**
     * Start time of event
     */
    @NotSaved(IfDefault.class)
    public Long start = 0L;

    /**
     * End time of event
     */
    @NotSaved(IfDefault.class)
    public Long end = 0L;

    @NotSaved(IfDefault.class)
    public boolean is_event_starred = false;

    /**
     * Having no end date means that it is an all day event. Do not change the
     * attribute name. It has to be "allDay", only then fullCalendar recognizes.
     */
    @NotSaved(IfDefault.class)
    public boolean allDay = false;

    /**
     * Name of the event
     */
    @NotSaved(IfDefault.class)
    public String title = null;

    /**
     * Color of the event for FullCalendar based on priority type. For high
     * priority it's shown in red color, low -> green, normal -> blue.
     */
    @NotSaved(IfDefault.class)
    public String color = "blue";

    /**
     * Created time of the event
     */
    public Long created_time = 0L;

    /**
     * Related Contact
     */
    @NotSaved(IfDefault.class)
    public Key<Contact> contact = null;

    /**
     * List of contact ids related to a task
     */
    @NotSaved(IfDefault.class)
    public List<String> contacts = null;

    /**
     * List of contact keys related to a task
     */
    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    /**
     * While saving an event it contains list of contact keys, but while
     * retrieving includes complete contact object.
     * 
     * @return List of contact objects
     */
    @XmlElement
    public List<Contact> getContacts()
    {
	return Contact.dao.fetchAllByKeys(this.related_contacts);
    }

    /**
     * Returns list of contacts related to task.
     * 
     * @param id
     *            - Event Id.
     * @return list of Contacts
     */
    public List<Contact> getContacts(Long id)
    {
	Event event = EventUtil.getEvent(id);
	return event.getContacts();
    }

    /**
     * Owner key of the event
     */
    @NotSaved(IfDefault.class)
    private Key<AgileUser> owner = null;

    /**
     * Range object for doing two inequality queries
     */
    List<Long> search_range = null;

    // Dao
    public static ObjectifyGenericDao<Event> dao = new ObjectifyGenericDao<Event>(Event.class);

    /**
     * Default constructor
     */
    public Event()
    {

    }

    /**
     * Constructs new {@link Event} with the following parameters
     * 
     * @param title
     *            The event name
     * @param start
     *            Start time of event
     * @param end
     *            End time of event
     * @param isEventStarred
     * @param contactId
     *            To create Contact Key, that is the event related to
     * @param agileUserId
     *            To create AgileUser Key, the owner of the event
     */
    public Event(String title, Long start, Long end, boolean isEventStarred, Long contactId, Long agileUserId)
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

    public void addContacts(String id)
    {
	if (contacts == null)
	    contacts = new ArrayList<String>();

	contacts.add(id);
    }

    /**
     * Deletes the event from database
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Saves the event entity in database
     * 
     * Saves the new one or even updates the existing one
     */
    public void save()
    {
	dao.put(this);
	if (!this.title.equals("Gossip at water cooler") && !this.title.equals("Discuss today's Dilbert strip"))
	{
	    EventUtil.sendIcal(this);
	}
	System.out.println("Event object " + this);
    }

    /**
     * Creates a range object for start and end date so that we can search
     * between the two
     */
    @PrePersist
    private void PrePersist()
    {
	// Store Created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;

	if (this.contacts != null)
	{
	    // Create list of Contact keys
	    for (String contact_id : this.contacts)
	    {
		this.related_contacts.add(new Key<Contact>(Contact.class, Long.parseLong(contact_id)));
	    }

	    this.contacts = null;
	}

	search_range = new ArrayList<Long>();
	search_range.add(start);
	search_range.add(end);

	// Create owner key
	if (owner == null)
	{
	    AgileUser agileUser = AgileUser.getCurrentAgileUser();
	    if (agileUser != null)
		this.owner = new Key<AgileUser>(AgileUser.class, agileUser.id);
	}
    }

    public String toString()
    {
	return ("Start " + start + "  End: " + end + " Range: " + search_range);
    }
}
