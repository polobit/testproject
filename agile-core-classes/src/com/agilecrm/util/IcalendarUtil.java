package com.agilecrm.util;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.DateTime;
import net.fortuna.ical4j.model.Property;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.parameter.Cn;
import net.fortuna.ical4j.model.parameter.CuType;
import net.fortuna.ical4j.model.parameter.PartStat;
import net.fortuna.ical4j.model.parameter.Role;
import net.fortuna.ical4j.model.parameter.Rsvp;
import net.fortuna.ical4j.model.parameter.Value;
import net.fortuna.ical4j.model.property.Attendee;
import net.fortuna.ical4j.model.property.Created;
import net.fortuna.ical4j.model.property.Description;
import net.fortuna.ical4j.model.property.LastModified;
import net.fortuna.ical4j.model.property.Organizer;
import net.fortuna.ical4j.model.property.ProdId;
import net.fortuna.ical4j.model.property.Sequence;
import net.fortuna.ical4j.model.property.Uid;
import net.fortuna.ical4j.model.property.Version;
import net.fortuna.ical4j.util.SimpleHostInfo;
import net.fortuna.ical4j.util.UidGenerator;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Event;
import com.agilecrm.user.DomainUser;

public class IcalendarUtil
{

    /**
     * Returns ICal from events. It converts each event in VEvent format.
     * 
     * @param events
     *            - List of Events
     * @return iCal4j Calendar
     */
    public static Calendar getICalFromEvent(Event event, DomainUser user, String email, String name)
    {
	// iCalendar
	Calendar iCal = new Calendar();
	iCal.getProperties().add(new ProdId("-//Agile CRM//iCal 1.0//EN"));
	iCal.getProperties().add(Version.VERSION_2_0);
	if (StringUtils.isNotEmpty(name))
	    iCal.getProperties().add(net.fortuna.ical4j.model.property.Method.REQUEST);
	else{
	    if(StringUtils.isNotBlank(email)){
		    String emailDomainSubstring = email.split("@")[1];
		    String emailDomain = emailDomainSubstring.split("\\.")[0];
		    if(StringUtils.isNotBlank(emailDomain)){
		    	emailDomain=emailDomain.toLowerCase();
		    	if("yahoo".equals(emailDomain)){
		    		 iCal.getProperties().add(net.fortuna.ical4j.model.property.Method.REQUEST);
		    	}
		    	else
		    		iCal.getProperties().add(net.fortuna.ical4j.model.property.Method.PUBLISH);
		    }
		   }
	}
	// Iterates through each event and constructs VEvents

	if (event.start == null || event.end == null)
	    return null;

	// Converts event start and end time into iCal DateTime Objects and
	// sets into UTC

	VEvent iCalEvent = createVEvent(event, user, email, name);

	// Add VEvent Component to iCalendar
	iCal.getComponents().add(iCalEvent);

	return iCal;
    }

    /**
     * Generates Unique identifier for calendar component.
     * 
     * @return uid
     */
    public static Uid generateUid()
    {
	// Generates unique id for each VEvent.
	UidGenerator uidGenerator = new UidGenerator(new SimpleHostInfo("agilecrm.com"), "1");
	return uidGenerator.generateUid();
    }

    /**
     * Creates iCal VEvent.
     * 
     * @param startTime
     *            - start time of event.
     * @param endTime
     *            - end time of event.
     * @param eventName
     *            - event summary.
     * @param allDay
     *            - is event 'allDay' or not
     * @param uid
     *            - unique identifier.
     * @param createdTime
     *            - event creation time.
     * @return VEvent.
     */
    public static VEvent createVEvent(Event event, DomainUser user, String email, String name)
    {
	String _organizerEmail = user.email;
	String _organizerName = user.name;

	List<String> existingAttendeeList = new ArrayList<>();
	existingAttendeeList.add(email);

	String eventName = event.title;
	DateTime startTime = new DateTime(event.start * 1000);
	startTime.setUtc(true);

	DateTime endTime = new DateTime(event.end * 1000);
	endTime.setUtc(true);

	DateTime createdTime = new DateTime(event.created_time * 1000);

	// Generate UID
	Uid uid = generateUid();
	// Initializes iCal VEvent
	VEvent iCalEvent = new VEvent(startTime, endTime, eventName);

	// Check for allDay event.
	if (event.allDay)
	{
	    iCalEvent.getProperties().getProperty(Property.DTSTART).getParameters().add(Value.DATE);
	    iCalEvent.getProperties().getProperty(Property.DTEND).getParameters().add(Value.DATE);
	}

	iCalEvent.getProperties().add(uid);
	iCalEvent.getProperties().add(new Created(createdTime));
	iCalEvent.getProperties().add(new LastModified(createdTime));

	iCalEvent.getProperties().add(new Description(event.title));

	Organizer $organizer = new Organizer(URI.create("mailto:" + _organizerEmail));
	$organizer.getParameters().add(new Cn(_organizerName));
	iCalEvent.getProperties().add($organizer);

	if (existingAttendeeList != null && existingAttendeeList.size() != 0)
	{
	    for (String index : existingAttendeeList)
	    {
		Attendee existingAttendee = null;
		existingAttendee = new Attendee(URI.create("mailto:" + index));
		existingAttendee.getParameters().add(CuType.INDIVIDUAL);
		existingAttendee.getParameters().add(Role.REQ_PARTICIPANT);
		existingAttendee.getParameters().add(PartStat.NEEDS_ACTION);
		existingAttendee.getParameters().add(Rsvp.TRUE);
		existingAttendee.getParameters().add(new Cn(name));

		iCalEvent.getProperties().add(existingAttendee);

	    }
	}
	iCalEvent.getProperties().add(new Sequence());

	return iCalEvent;
    }

}
