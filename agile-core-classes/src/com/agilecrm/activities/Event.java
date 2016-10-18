package com.agilecrm.activities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.deals.util.OpportunityUtil;
import com.agilecrm.projectedpojos.ContactPartial;
import com.agilecrm.projectedpojos.DomainUserPartial;
import com.agilecrm.projectedpojos.OpportunityPartial;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.workflows.triggers.util.EventTriggerUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
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
public class Event extends Cursor
{

    // Key
    @Id
    public Long id;

    /**
     * Start time of event
     */
    @NotSaved(IfDefault.class)
    @Indexed
    public Long start = 0L;

    /**
     * Type of the contact (person or company)
     * 
     */
    public static enum EventType
    {
	WEB_APPOINTMENT, AGILE
    };

    /**
     * Entity type for timeline
     */
    @NotSaved
    public String entity_type = "event";
    /**
     * type of event
     */
    @Indexed
    public EventType type = EventType.AGILE;

    /**
     * End time of event
     */
    @NotSaved(IfDefault.class)
    @Indexed
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
     * Event background color
     * 
     */
    @NotSaved(IfDefault.class)
    public String backgroundColor = "#fff";
    /**
     * Created time of the event
     */
    public Long created_time = 0L;

    /**
     * date field to mustach template of the event
     */
    @NotSaved
    public String date;

    /**
     * date with full format
     */
    @NotSaved
    public String date_with_full_format;

    /**
     * Description of a event.
     */
    @NotSaved(IfDefault.class)
    public String description = null;

    /**
     * Description of a event.
     */
    @NotSaved(IfDefault.class)
    public String meeting_type = null;
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
    @Indexed
    private List<Key<Contact>> related_contacts = new ArrayList<Key<Contact>>();

    /**
     * Deal ids of related deals for a document.
     */
    @NotSaved
    private List<String> deal_ids = new ArrayList<String>();


    /**
     * Define the status of the meeting
     * happened, postponed, cancelled and no-show
     */
    @NotSaved(IfDefault.class)
    public String status = null;
        
    
    /**
     * Related deal objects fetched using deal ids.
     */
    private List<Key<Opportunity>> related_deals = new ArrayList<Key<Opportunity>>();

    /**
     * While saving an event it contains list of contact keys, but while
     * retrieving includes complete contact object.
     * 
     * @return List of contact objects
     */
    @XmlElement
    public List<ContactPartial> getContacts()
    {
	// return Contact.dao.fetchAllByKeys(this.related_contacts);
    return ContactUtil.getPartialContacts(this.related_contacts);
    }
    
    public List<Contact> relatedContacts()
    {
    	return Contact.dao.fetchAllByKeys(this.related_contacts);
    }

    /**
     * Owner key of the event
     */
    @NotSaved(IfDefault.class)
    @Indexed
    private Key<AgileUser> owner = null;

    @NotSaved
    public DomainUser domainUser = null;

    @NotSaved
    public String userPic = null;

    /**
     * Range object for doing two inequality queries
     */
    public List<Long> search_range = null;

    /******************************** New Field ********************/
    /**
     * AgileUser Id who created Filter.
     */
    @NotSaved
    public String owner_id = null;
    /***************************************************************/

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

    @XmlElement(name = "eventOwner")
    public DomainUserPartial getOwner() throws Exception
    {
	if (owner != null)
	{
	    try
	    {
		AgileUser agileuser = AgileUser.getCurrentAgileUser(owner.getId());
		
		// Gets Domain User Object
		return DomainUserUtil.getPartialDomainUser(agileuser.domain_user_id);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }
    
    public DomainUser eventOwner() throws Exception
    {
	if (owner != null)
	{
	    try
	    {
		AgileUser agileuser = AgileUser.getCurrentAgileUser(owner.getId());
		
		// Gets Domain User Object
		return DomainUserUtil.getDomainUser(agileuser.domain_user_id);
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return null;
    }

    /**
     * adds related contact ids
     * 
     * @param id
     */
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
	if (this.contacts != null)
	{
	    // Create list of Contact keys
	    for (String contact_id : this.contacts)
	    {
		this.related_contacts.add(new Key<Contact>(Contact.class, Long.parseLong(contact_id)));
	    }

	    this.contacts = null;
	}

	// Saves domain user key
	if (owner_id != null)
	{
	    AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(Long.parseLong(owner_id));
	    if (agileUser != null)
		this.owner = new Key<AgileUser>(AgileUser.class, agileUser.id);
	}

	// Create owner key
	if (owner == null)
	{
	    AgileUser agileUser = AgileUser.getCurrentAgileUser();
	    if (agileUser != null)
		this.owner = new Key<AgileUser>(AgileUser.class, agileUser.id);
	}

	if (id == null)
	    EventTriggerUtil.executeTriggerForNewEvent(this);

	dao.put(this);

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

	search_range = new ArrayList<Long>();
	search_range.add(start);
	search_range.add(end);

	if (deal_ids != null)
	{
	    for (String deal_id : this.deal_ids)
	    {
		this.related_deals.add(new Key<Opportunity>(Opportunity.class, Long.parseLong(deal_id)));
	    }
	}
	
		String status=this.status;
		if(status != null && status.length() > 0){
		  if(status.equals("Cancelled")){
			this.backgroundColor="#FDAD9E";
		  }else if(status.equals("completed")){
			this.backgroundColor="#D4FFCF";
		  }else if(status.equals("rescheduled")){
			this.backgroundColor="#FFFFB7";
		  }else if(status.equals("no-show")){
			this.backgroundColor="#DDDDDD";
		  }	
		}
    }

    public String toString()
    {
	return ("Start " + start + "  End: " + end + " Range: " + search_range);
    }

    /**
     * gets the owner based along with event entity
     * 
     * @param event1
     * @return
     */
    @XmlElement
    public DomainUser getOwner(Event event1)
    {
	if (event1.owner != null)
	{
	    try
	    {
		for (AgileUser user : AgileUser.getUsers())
		{
		    if (user.id == event1.owner.getId())
		    {
			return DomainUserUtil.getDomainUser(user.domain_user_id);
		    }
		}
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}

	return null;
    }

    /**
     * gets owner pic of along event entity
     * 
     * @param event2
     * @return
     * @throws Exception
     */
    @XmlElement
    public String getOwnerPic(Event event2) throws Exception
    {
	AgileUser agileUser = null;
	UserPrefs userPrefs = null;
	if (event2.owner != null)
	{
	    try
	    {
		for (AgileUser user : AgileUser.getUsers())
		{
		    if (user.id == event2.owner.getId())
			userPrefs = UserPrefsUtil.getUserPrefs(user);
		    if (userPrefs != null)
			return userPrefs.pic;
		}

	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	return "";
    }

    /**
     * While saving a event it contains list of deal keys, but while retrieving
     * includes complete deal object.
     * 
     * @return List of deal objects
     */
    @XmlElement
    public List<OpportunityPartial> getDeals()
    {
    	return OpportunityUtil.getPartialOpportunities(this.related_deals);
    	// return Opportunity.dao.fetchAllByKeys(this.related_deals);
    }

    /**
     * Gets deals related with document.
     * 
     * @return list of deal objects as xml element related with a document.
     */
    @XmlElement(name = "deal_ids")
    public List<String> getDeal_ids()
    {
    if(deal_ids == null || (deal_ids != null && deal_ids.size() == 0))
    {
    	deal_ids = new ArrayList<String>();
    }

	for (Key<Opportunity> dealKey : related_deals)
	    deal_ids.add(String.valueOf(dealKey.getId()));

	return deal_ids;
    }
    
    public List<Opportunity> relatedDeals()
    {
    	return Opportunity.dao.fetchAllByKeys(this.related_deals);
    }

}