package com.agilecrm;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.MalformedURLException;
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
import com.google.appengine.api.NamespaceManager;

/**
 * <code>ICalendarServlet</code> is the servlet for handling iCalendar data. It
 * converts {@link Event} data into iCal format. iCal4j API is used for getting
 * iCal data from Event object.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class ICalendarServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
	doPost(req, res);
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {
	res.setContentType("text/plain");

	URL url = null;

	try
	{
	    url = new URL(req.getRequestURL().toString());
	}
	catch (MalformedURLException e1)
	{
	    e1.printStackTrace();
	}

	String apiKey = getAPIKeyFromICalURL(url);
	String namespace = getNamespaceFromURL(url);

	if (StringUtils.isEmpty(namespace) && StringUtils.isEmpty(apiKey))
	    return;

	System.out.println("APIKey in ICalendarServlet " + apiKey);
	System.out.println("Namespace in ICalendarServlet " + namespace);

	AgileUser agileUser = null;
	List<Event> events = null;

	String oldNamespace = NamespaceManager.get();

	try
	{
	    NamespaceManager.set(namespace);

	    // Gets AgileUser with respect to APIKey.
	    agileUser = APIKey.getAgileUserRelatedToAPIKey(apiKey);

	    if (agileUser == null)
		return;

	    events = EventUtil.getEventsByAgileUser(agileUser);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	if (events == null)
	    return;

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

	    VEvent iCalEvent = createVEvent(startTime, endTime, event.title,
		    event.allDay, uid, createdTime);

	    // Add VEvent Component to iCalendar
	    iCal.getComponents().add(iCalEvent);
	}

	PrintWriter pw = null;
	try
	{
	    pw = res.getWriter();
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	}

	pw.println(iCal);

	// System.out.println(iCal);
    }

    /**
     * Gets APIKey from URI path that is appended at the end.
     * 
     * @param uri
     *            - Requested URI
     * @return api key.
     */
    static String getAPIKeyFromICalURL(URL url)
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
     * Gets domain user's domain from url.
     * 
     * @param url
     *            - Requested Url.
     * @return domain name.
     */
    static String getNamespaceFromURL(URL url)
    {
	String host = url.getHost().toString();

	// Eg., return 'admin' from 'admin.agilecrm.com'
	return host.split("\\.")[0];
    }

    /**
     * Generates Unique identifier for calendar component.
     * 
     * @return uid
     */
    static Uid generateUid()
    {
	// Generates unique id for each VEvent.
	UidGenerator uidGenerator = new UidGenerator(new SimpleHostInfo(
		"agilecrm.com"), "1");
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
    static VEvent createVEvent(DateTime startTime, DateTime endTime,
	    String eventName, boolean allDay, Uid uid, DateTime createdTime)
    {
	// Initializes iCal VEvent
	VEvent iCalEvent = new VEvent(startTime, endTime, eventName);

	// Check for allDay event.
	if (allDay)
	{
	    iCalEvent.getProperties().getProperty(Property.DTSTART)
		    .getParameters().add(Value.DATE);
	    iCalEvent.getProperties().getProperty(Property.DTEND)
		    .getParameters().add(Value.DATE);
	}

	iCalEvent.getProperties().add(uid);
	iCalEvent.getProperties().add(new Created(createdTime));

	return iCalEvent;
    }
}
