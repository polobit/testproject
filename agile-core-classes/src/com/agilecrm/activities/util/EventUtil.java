package com.agilecrm.activities.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Event.EventType;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.IcalendarUtil;
import com.agilecrm.util.VersioningUtil;
import com.amazonaws.services.route53domains.model.ContactType;
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

    /**
     * 
     * @return all events count
     */
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
     * Gets events related to a particular contact
     * 
     * @param contactId
     *            contact id to get the events related to a contact
     * @return List of events related to a contact whose starttime is lessthan
     *         today
     * @throws Exception
     */
    public static List<Event> getContactEventsBeforeToday(Long contactId) throws Exception
    {
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);
	Map<String, Object> conditionsMap = new HashMap<String, Object>();
	conditionsMap.put("end <", System.currentTimeMillis() / 1000);
	conditionsMap.put("related_contacts", contactKey);

	// Get tasks before today's time and which are not completed
	return dao.listByProperty(conditionsMap);
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
	    if (ownerId != null){
	    	Query<Event> q =  dao.ofy().query(Event.class).filter("search_range >=", start).filter("search_range <=", end)
	    			.filter("owner", new Key<AgileUser>(AgileUser.class, ownerId));
	    	return dao.fetchAll(q);
	    }
		
	    Query<Event> q =  dao.ofy().query(Event.class).filter("search_range >=", start).filter("search_range <=", end);
	    return dao.fetchAll(q);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static List<Event> getBlockedEvents(Long start, Long end, Long ownerId)
    {

   	     List<Event> startList = null;
		 List<Event> endList = null;
	try{
		    if (ownerId != null){
		    	startList = dao.ofy().query(Event.class).filter("search_range >=", start).filter("owner", new Key<AgileUser>(AgileUser.class, ownerId)).list();
				endList = dao.ofy().query(Event.class).filter("search_range <=", end).filter("owner", new Key<AgileUser>(AgileUser.class, ownerId)).list();
				 System.out.println(startList.size()+ "  :  "+ endList.size());
				 startList.addAll(endList); 
				 return EventUtil.getDuplicateList(startList); 
		    }else{
		    	  startList = dao.ofy().query(Event.class).filter("search_range <=", start).list();
				  endList = dao.ofy().query(Event.class).filter("search_range >=", end).list();				    
				  System.out.println(startList.size()+ "  :  "+ endList.size());
				  startList.addAll(endList);				
				  return EventUtil.getDuplicateList(startList);
		    }
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
    public static List<Event> getEventsByAgileUser(Long id)
    {

	if (id == null)
	    return null;

	Key<AgileUser> owner = new Key<AgileUser>(AgileUser.class, id);

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

	return dao.fetchAll(query);
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
	List<Contact> contacts = event.relatedContacts();

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
				null, subject, null, null, null, null, null, null, attachments);
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
			null, null, null, null, null, null, attachments_to_agile_user);

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
    public static List<Event> getTodayPendingEvents(Long startTime, Long endTime)
    {
	try

	{
	    // Gets Today's date
	    /*
	     * DateUtil startDateUtil = new DateUtil(); Long startTime =
	     * startDateUtil.toMidnight().getTime().getTime() / 1000;
	     */
	    // Date startDate = new Date();
	    // Long startTime = startDate.getTime() / 1000;

	    // Gets Date after numDays days
	    /*
	     * DateUtil endDateUtil = new DateUtil(); Long endTime =
	     * (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)
	     * - 1;
	     */

	    AgileUser agileUser = AgileUser.getCurrentAgileUser();

	    // Gets list of tasks filtered on given conditions
	    return dao.ofy().query(Event.class).filter("owner", new Key<AgileUser>(AgileUser.class, agileUser.id))
		    .filter("start >=", startTime).filter("start <", endTime).limit(50).order("start").list();
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

	int duration = 3600;
	Long currenttime = System.currentTimeMillis() / 1000;
	if (starttime == null)
	    starttime = currenttime + 900;
	else
	    starttime = starttime + 120;

	Long endtime = starttime + duration;

	List<Event> domain_events = new ArrayList<>();
	List<String> default_events = getDefaultEventNames();

	List<Event> list_events = dao.ofy().query(Event.class).filter("start >=", starttime)
		.filter("start <=", endtime).order("start").list();

	List<Event> events = new ArrayList<>();

	for (Event ts : list_events)
	{
	    if (!default_events.contains(ts.title))
		events.add(ts);
	}

	return events;

    }

    /**
     * fetches the events which are starting at same time
     * 
     * @param starttime
     * @return
     */
    public static List<Event> getLatestWithSameStartTime(Long starttime)
    {

	List<String> default_events = getDefaultEventNames();

	List<Event> domain_events = dao.listByProperty("start", starttime);
	List<Event> events = new ArrayList<>();
	for (Event event : domain_events)
	{
	    if (!default_events.contains(event.title))
		events.add(event);
	}
	return events;

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
     *            in seconds
     * @return
     */
    public static String getHumanTimeFromEppoch(Long epoch, String timezone, String format)
    {
	if (StringUtils.isEmpty(format))
	    format = "h:mm a (z)";
	if (StringUtils.isEmpty(timezone))
	{
	    timezone = AccountPrefsUtil.getAccountPrefs().timezone;
	    if (StringUtils.isEmpty(timezone))
	    {
		timezone = "UTC";
	    }
	}
	Calendar cal = Calendar.getInstance();
	cal.setTimeInMillis(epoch * 1000);

	TimeZone tz = TimeZone.getTimeZone(timezone);
	DateFormat dateFormat = new SimpleDateFormat(format);
	dateFormat.setTimeZone(tz);
	cal.setTimeZone(tz);
	return dateFormat.format(cal.getTime());
    }

    /**
     * Gets list of all the keys which are in a given start and end date with
     * the type of event date
     * 
     * @param owner
     *            Event owner
     * @param status
     *            Upcoming event or completed. Eg: start >, start <, end > or
     *            end <. >= won't work
     * @param eventType
     *            Web appointment or agile
     * @return List of AgileUser owner keys
     * @author Kona
     * @param contactKey
     */
    public static int getEventsKey(Key<AgileUser> owner, String status, EventType eventType, Key<Contact> contactKey)
    {
	System.out.println(owner + " ," + status + " ," + eventType + " ," + contactKey);
	Map<String, Object> searchMap = new HashMap<String, Object>();
	System.out.println("The owner is:" + owner + " ,the status is:" + status + " ,the event type is:" + eventType
		+ " and thte contact key is:" + contactKey);

	if (owner != null)
	    searchMap.put("owner", owner);

	if (status != null)
	{
	    Long currentEpocTime = System.currentTimeMillis() / 1000;
	    searchMap.put(status, currentEpocTime);
	}

	if (eventType != null)
	    searchMap.put("type", eventType);

	if (contactKey != null)
	    searchMap.put("related_contacts", contactKey);

	try
	{
	    return dao.getCountByProperty(searchMap);
	}
	catch (Exception e)
	{
	    System.err.println("Exception in getEventsKey in EventUtil Class" + e.getMessage());
	    return 0;
	}
    }

    /**
     * 
     * @return defaults task names as a list to stop due task mails
     */
    public static List<String> getDefaultEventNames()
    {
	List<String> default_event = new ArrayList<>();
	default_event.add("Gossip at water cooler");
	default_event.add("Discuss today's Dilbert strip");
	return default_event;
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
    public static List<Event> getEvents(int count)
    {
	try
	{
	    if (count == 0)
		count = 10;
	    return dao.ofy().query(Event.class).order("-created_time").limit(count).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * sends a mail to contact when deleting web event
     * 
     * @param event
     * @param cancel_reason
     */
    public static void sendMailToWebEventAttendee(Event event, String cancel_reason)
    {

	Contact contact = event.relatedContacts().get(0);
	String contactEmail = contact.getContactFieldValue("EMAIL");
	String first_name = contact.getContactFieldValue("FIRST_NAME");
	String last_name = contact.getContactFieldValue("LAST_NAME");
	if (StringUtils.isNotEmpty(last_name))
	    first_name = first_name + " " + last_name;
	DomainUser domain_user = DomainUserUtil.getCurrentDomainUser();
	String user_name = domain_user != null ? domain_user.name : "";
	String cancel_mail = "<p> Dear " + first_name + ",</p><p><b>" + user_name
		+ "</b> has cancelled your appointment - &#39;" + event.title + "&#39;</p>";
	if (StringUtils.isNotEmpty(cancel_reason))
	{
	    cancel_mail += "<p> Note from " + user_name + ": " + cancel_reason + "</p>";
	}
	EmailGatewayUtil.sendEmail(null, "noreplay@agilecrm.com", "Agile CRM", contactEmail, null, null,
		"Appointment Cancelled", null, cancel_mail, null, null, null, null);
    }

    /**
     * calls this method when end user want to cancel webevent from his mail
     * 
     * @param event
     * @param cancel_reason
     */
    public static void deleteWebEventFromClinetEnd(Event event, String cancel_reason)
    {

	try
	{
	    DomainUser domain_user = event.eventOwner();

	    String domain_user_name = domain_user.name;
	    String calendar_url = domain_user.getCalendarURL();
	    String timezone = UserPrefsUtil.getUserTimezoneFromUserPrefs(domain_user.id);
	    if (StringUtils.isEmpty(timezone))
	    {
		timezone = domain_user.timezone;

	    }
	    String event_start_time = WebCalendarEventUtil.getGMTDateInMilliSecFromTimeZone(timezone,
		    event.start * 1000, new SimpleDateFormat("EEE, MMMM d yyyy, h:mm a (z)"));
	    String event_title = event.title;
	    Long duration = (event.end - event.start) / 60;
	    List<Contact> contacts = event.relatedContacts();
	    String client_name = contacts.get(0).getContactFieldValue("FIRST_NAME");
	    if (StringUtils.isNotEmpty(contacts.get(0).getContactFieldValue("LAST_NAME")))
	    {
		client_name.concat(contacts.get(0).getContactFieldValue("LAST_NAME"));
	    }
	    String client_email = contacts.get(0).getContactFieldValue("EMAIL");
	    GoogleCalendarUtil.deleteGoogleEvent(event);
	    event.delete();
	    String subject = "<p>" + client_name + " (" + client_email
		    + ") has cancelled the appointment</p><span>Title: " + event_title + " (" + duration
		    + " mins)</span><br/><span>Start time: " + event_start_time + "</span>";
	    if (StringUtils.isNotEmpty(cancel_reason))
		subject += "<br/><span>Reason: " + cancel_reason + "</span>";

	    EmailGatewayUtil.sendEmail(null, client_email, client_name, domain_user.email, null, null,
		    "Appointment Cancelled", null, subject, null, null, null, null);
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }
    
    /**
     * calls this method when end user want to cancel webevent from his mail
     * 
     * @param event
     * @param cancel_reason
     */
    public static void sendEventCancelMail(Event event, Contact contact, String cancel_reason){
		try
		{
		    DomainUser domain_user = event.eventOwner();		   
		    String timezone = UserPrefsUtil.getUserTimezoneFromUserPrefs(domain_user.id);
		    if (StringUtils.isEmpty(timezone)){
		    	timezone = domain_user.timezone;
		    }
		    
		    String event_start_time = WebCalendarEventUtil.getGMTDateInMilliSecFromTimeZone(timezone,
			    event.start * 1000, new SimpleDateFormat("EEE, MMMM d yyyy, h:mm a (z)"));
		    String event_title = event.title;
		    Long duration = (event.end - event.start) / 60;
		    if(contact != null){
		    	String client_name = "";
		    	if(contact.type.equals(Contact.Type.PERSON)){
		    		client_name = contact.getContactFieldValue("FIRST_NAME");
				    if (StringUtils.isNotEmpty(contact.getContactFieldValue("LAST_NAME"))){
				    	client_name.concat(contact.getContactFieldValue("LAST_NAME"));
				    }				    
				    client_name = (client_name.substring(0, 1).toUpperCase() + client_name.substring(1));
		    	}else if(contact.type.equals(Contact.Type.COMPANY)){
		    		client_name = (contact.name.substring(0, 1).toUpperCase() + contact.name.substring(1));		    		
		    	}
			   
			    String client_email = contact.getContactFieldValue("EMAIL");
			    String subject = "<p>" + client_name + " (" + client_email
					    + ") has cancelled the appointment</p><span>Title: " + event_title + " (" + duration
					    + " mins)</span><br/><span>Start time: " + event_start_time + "</span>";
				    if (StringUtils.isNotEmpty(cancel_reason))
					subject += "<br/><span>Reason: " + cancel_reason + "</span>";
			
				    EmailGatewayUtil.sendEmail(null, client_email, client_name, domain_user.email, null, null,
					    "Appointment Cancelled", null, subject, null, null, null, null);
		    }		   	      
		}catch (Exception e){
		    // TODO Auto-generated catch block
		    e.printStackTrace();
		}
    }
    
    /**
     * Gets events related to a particular deal
     * 
     * @param dealId
     *            contact id to get the events related to a deal
     * @return List of events related to a deal
     * @throws Exception
     */
    public static List<Event> getDealEvents(Long dealId) throws Exception
    {
	Key<Opportunity> dealKey = new Key<Opportunity>(Opportunity.class, dealId);
	return dao.listByProperty("related_deals = ", dealKey);
    }
    
    public static List<Event> getDuplicateList(List<Event> eventsList){
    	List<Event> filteredEvents = new ArrayList<Event>();
    	Set<List<Long>> uniqueStart = new HashSet<>();
    	for( Event e : eventsList ) {
    	    if( !uniqueStart.add( e.search_range) ) {
    	    	filteredEvents.add( e );
    	    }
    	}
		return filteredEvents;
    }

    public static List<Contact> getEventsRelatedContacts(Long id){
    	List<Contact> relatedContacts = new ArrayList<Contact>();
    	Event event= getEvent(id);
    	if(event!=null)
    	return event.relatedContacts();
    	return relatedContacts;
    }
    
    public static void sendEmailForEventContacts(List<String> contactIds, Event event){
    	List<Contact> contactsList =  ContactUtil.getContactsByIds(contactIds);
    	AgileUser agileUser = AgileUser.getCurrentAgileUser();
    	DomainUser currentUser = DomainUserUtil.getDomainUser(agileUser.domain_user_id);
    	String currentUserEmail = currentUser.email;
    	
    	long domainUserID = Long.parseLong(event.owner_id);    	
    	DomainUser eventOwner = DomainUserUtil.getDomainUser(domainUserID);
    	String eventOwnerEmail = eventOwner.email;
    	net.fortuna.ical4j.model.Calendar agileUseiCal = IcalendarUtil.getICalFromEvent(event, eventOwner, eventOwnerEmail, eventOwner.name);
    	String[] attachments = { "text/calendar", "mycalendar.ics", agileUseiCal.toString() };
    	
    	String domain_url = VersioningUtil.getHostURLByApp(eventOwner.domain);
    	String cancel_link = domain_url + "appointment/cancel/" + event.id;
    	String link = "https://www.agilecrm.com/?utm_source=powered-by&medium=email&utm_campaign=" + eventOwner.domain;
    	Long startTime = event.start;
		Long endTime = event.end;
    	
   		if(startTime != null && endTime != null){
   			int seconds = (int) (endTime - startTime);
   			int mins = seconds / 60;   			
   			String minsInStr = WebCalendarEventUtil.convertMinstoDateFormat(mins);
   			
   			StringBuilder contactList = new StringBuilder();
   			StringBuilder companiesList = new StringBuilder();
   					
   	    	if(contactsList != null){
   	    		for (int i = 0; i < contactsList.size(); i++) {
   	    			Contact contact = contactsList.get(i);
   	    			ContactField emailField = contact.getContactFieldByName(Contact.EMAIL);
   	    			if(emailField != null){
	   	    			String contactEmail = emailField.value;
	   	    			if(contactEmail != null){ 
	   	    				if(contact.type.equals(Contact.Type.PERSON)){
	   	    					StringBuilder contactName = new StringBuilder();
	   	    					if(contact.first_name != null){	   	    						
	   	    						contactName.append(contact.first_name);
	   	    					}
	   	    					if(contact.last_name != null){
	   	    						contactName.append(" ");
	   	    						contactName.append(contact.last_name);
	   	    					}
	   	    					if(contactName.length() > 0){
	   	    						String modifiedContactName = (contactName.substring(0, 1).toUpperCase() + contactName.substring(1));
	   	    						contactList.append("<a href="+domain_url+"#contact/"+contact.id+">"+ modifiedContactName +"</a>, ");
	   	    					}	   	    					
	   	    				}else if(contact.type.equals(Contact.Type.COMPANY)){
	   	    					if(contact.name != null){
	   	    						String companyName = (contact.name.substring(0, 1).toUpperCase() + contact.name.substring(1));
	   	    						companiesList.append("<a href="+domain_url+"#company/"+contact.id+">"+ companyName +"</a>, ");
	   	    					}
	   	    				}
	   	    				
	   	    				StringBuilder usermail = new StringBuilder("<p>You have a new appointment with <b>" + eventOwner.name + "</b> (" + eventOwnerEmail + ")</p>");
	   	    				usermail.append("<span>Title: " + event.title +"</span><br/>");
	   	   					usermail.append("<span>Duration: " + minsInStr + "</span><br/>");
	   	   					if(event.description != null && event.description.length() > 0){
	   	   						usermail.append("<span>Note: " + event.description + "</span><br/>");
	   	   					}
	   	   					usermail.append("<p><a href=" + cancel_link+"/c"+ contact.id +">Cancel this appointment</a></p>");
	   	   					usermail.append("<p>This event has been scheduled using <a href=" + link +">Agile CRM</a></p>");
	   	   					
	   	    				EmailGatewayUtil.sendEmail(null, eventOwnerEmail, eventOwner.name, contactEmail, null, null, "Appointment Scheduled",
	   	    						null, usermail.toString(), null, null, null, null, attachments);
	   	    			}
   	    			}
   	    		}
   	    	}
   	    	
   	    	if(eventOwnerEmail != null){	
   	    		StringBuilder domainMailTempalte = new StringBuilder();
   	    		int dataLength = companiesList.length();
   	    		String contactDetails;
   	    		if(dataLength > 0){
   	    			contactList.append(companiesList);   	    			
   	    		}
   	    		
   	    		if(contactList.length() > 0){
   	    			domainMailTempalte.append("<p>Event has been scheduled with ");
   	    			contactDetails = contactList.substring(0, contactList.length() - 2);
   	    			domainMailTempalte.append(contactDetails);
   	    			domainMailTempalte.append("</p>");
   	    		}   	    		   	    		
   	    		
   	    		domainMailTempalte.append("<span>Title: " + event.title +"</span><br/>");
   	    		domainMailTempalte.append("<span>Duration: " + minsInStr +"</span><br/>");
   	    		if(event.description != null && event.description.length() > 0){
   	    			domainMailTempalte.append("<span>Description: "+ event.description + "</span><br/>");
   	    		}
   	    		domainMailTempalte.append("<p><a href=https://" + eventOwner.domain + ".agilecrm.com/#calendar>View this new event in Agile Calendar</a></p>");
   	    		
   				EmailGatewayUtil.sendEmail(null, currentUserEmail, eventOwner.name, eventOwnerEmail, null, null, "Appointment Scheduled",
   						null, domainMailTempalte.toString(), null, null, null, null, null);		
   	    	} 
   		}
    	   	
    }
}