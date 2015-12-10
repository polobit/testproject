package com.agilecrm;

import java.io.PrintWriter;
import java.net.URL;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.DateTime;
import net.fortuna.ical4j.model.Property;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.parameter.Value;
import net.fortuna.ical4j.model.property.Created;
import net.fortuna.ical4j.model.property.ProdId;
import net.fortuna.ical4j.model.property.Uid;
import net.fortuna.ical4j.model.property.Version;
import net.fortuna.ical4j.util.SimpleHostInfo;
import net.fortuna.ical4j.util.UidGenerator;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.APIKey;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>ICalendarServlet</code> is the servlet for handling iCalendar data. It
 * converts {@link Event} data into iCal format. iCal4j API is used for getting
 * iCal data from Event object.
 * 
 * @author Naresh
 */
@SuppressWarnings("serial")
public class ICalendarServlet extends HttpServlet
{

    /**
     * Returns iCal data in response. It fetches namespace (domain) and api-key
     * from url. Calendar events are fetched based on agileuser with obtained
     * api-key and convert them into iCal VEvents format.
     * 
     * @param req
     *            - HttpServletRequest object.
     * 
     * @param res
     *            - HttpServletResponse object.
     **/
    public void service(HttpServletRequest req, HttpServletResponse res)
    {
	res.setContentType("text/plain");

	try
	{
	    // iCal URL
	    URL url = new URL(req.getRequestURL().toString());

	    // Get API Key
	    String apiKey = getAPIKeyFromICalURL(url);

	    // Get Namespace
	    String namespace = NamespaceUtil.getNamespaceFromURL(url);

	    if (StringUtils.isEmpty(namespace) && StringUtils.isEmpty(apiKey))
		return;

	    // Get events based on API key and Namespace
	    List<Event> events = getEvents(namespace, apiKey);
	    System.out.println("Events obtained are " + events);

	    if (events == null)
		return;

	    // Returns iCal data
	    Calendar iCal = getICalFromEvents(events);

	    PrintWriter pw = res.getWriter();
	    pw.println(iCal);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Got exception in ICalendarServlet " + e.getMessage());
	}
    }

    /**
     * Gets APIKey from URI path that is appended at the end.
     * 
     * @param uri
     *            - Requested URI
     * @return api key.
     */
    private String getAPIKeyFromICalURL(URL url)
    {
	String urlString = url.toString();

	// Checks whether uripath ends with /
	while (urlString.endsWith("/"))
	{
	    urlString = urlString.substring(0, urlString.length() - 1);
	}

	String tokens[] = urlString.split("/");

	String apiKey = tokens[tokens.length - 1];

	return apiKey;
    }

    /**
     * Returns list of events of agileUser with given apiKey.
     * 
     * @param namespace
     *            - Namespace (or domain)
     * @param apiKey
     *            - API Key
     * @return List
     */
    private List<Event> getEvents(String namespace, String apiKey)
    {
	String oldNamespace = NamespaceManager.get();

	try
	{
	    NamespaceManager.set(namespace);

	    // Gets AgileUser with respect to APIKey.
	    AgileUser agileUser = APIKey.getAgileUserRelatedToAPIKey(apiKey);

	    if (agileUser == null)
		return null;

	    return EventUtil.getEventsByAgileUser(agileUser);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }

    /**
     * Returns ICal from events. It converts each event in VEvent format.
     * 
     * @param events
     *            - List of Events
     * @return iCal4j Calendar
     */
    private Calendar getICalFromEvents(List<Event> events)
    {
	// iCalendar
	Calendar iCal = new Calendar();
	iCal.getProperties().add(new ProdId("-//Agile CRM//iCal 1.0//EN"));
	iCal.getProperties().add(Version.VERSION_2_0);

	// Iterates through each event and constructs VEvents
	for (Event event : events)
	{
	    if (event.start == null || event.end == null)
		continue;

	    // Converts event start and end time into iCal DateTime Objects and
	    // sets into UTC
	    DateTime startTime = new DateTime(event.start * 1000);
	    startTime.setUtc(true);

	    DateTime endTime = new DateTime(event.end * 1000);
	    endTime.setUtc(true);

	    DateTime createdTime = new DateTime(event.created_time * 1000);

	    // Generate UID
	    Uid uid = generateUid();

	    VEvent iCalEvent = createVEvent(startTime, endTime, event.title, event.allDay, uid, createdTime);

	    // Add VEvent Component to iCalendar
	    iCal.getComponents().add(iCalEvent);
	}

	return iCal;
    }

    /**
     * Generates Unique identifier for calendar component.
     * 
     * @return uid
     */
    private Uid generateUid()
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
    private VEvent createVEvent(DateTime startTime, DateTime endTime, String eventName, boolean allDay, Uid uid, DateTime createdTime)
    {
	// Initializes iCal VEvent
	VEvent iCalEvent = new VEvent(startTime, endTime, eventName);

	// Check for allDay event.
	if (allDay)
	{
	    iCalEvent.getProperties().getProperty(Property.DTSTART).getParameters().add(Value.DATE);
	    iCalEvent.getProperties().getProperty(Property.DTEND).getParameters().add(Value.DATE);
	}

	iCalEvent.getProperties().add(uid);
	iCalEvent.getProperties().add(new Created(createdTime));

	return iCalEvent;
    }
}