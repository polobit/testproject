package com.agilecrm.activities.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.TimeZone;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.activities.Event;
import com.agilecrm.activities.WebCalendarEvent;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.email.util.ContactEmailUtil;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.googlecode.objectify.Key;

public class WebCalendarEventUtil
{
    /**
     * Returns list of free/available slots on selected date. Checks available
     * slots with Agile calendar as well as google calendar.
     * 
     * @param username
     *            Client's name
     * @param slotTime
     *            Selected duration (time slot)
     * @param date
     *            Selected date
     * @param timezone
     *            Client's time zone
     * @param timezoneName
     *            Client's time zone name
     * @param epochTime
     *            Client's epoch time
     * @param endTime
     * @param startTime
     * @return List of available slots on selected date
     * @throws ParseException
     */
    public static List<List<Long>> getSlots(String username, Long userid, int slotTime, String date, int timezone,
	    String timezoneName, Long epochTime, Long startTime, Long endTime) throws ParseException
    {
	System.out.println("In getSlots");
	System.out.println(username + " " + slotTime + " " + date + " " + timezone + " " + timezoneName + " "
	        + epochTime + " " + startTime + " " + endTime);

	// Get all permutations possible based on selected slottime(duration) in
	// 24 Hr.
	List<List<Long>> possibleSlots = getAllPossibleSlots(slotTime, date, startTime, timezone, timezoneName);

	// Get all filled slots from Agile calendar.
	List<List<Long>> filledAgileSlots = getFilledAgileSlots(username, slotTime, startTime, endTime);

	// Remove all filled slots from available/possible slots.
	possibleSlots.removeAll(filledAgileSlots);

	/*
	 * Remove all filled odd timing slots from available/possible slots,
	 * like selected duration(slot time) is 60min but filled slot is of
	 * 15min or 30min.
	 */
	possibleSlots = removeAllOddSlots(possibleSlots, filledAgileSlots);

	// Get all filled slots from Google calendar.
	List<List<Long>> filledGoogleSlots = GoogleCalendarUtil.getFilledGoogleSlots(userid, slotTime, timezone,
	        timezoneName, startTime, endTime);

	if (filledGoogleSlots != null)
	{
	    // Remove all filled slots from available/possible slots.
	    possibleSlots.removeAll(filledGoogleSlots);

	    // Remove all filled odd timing slots from available/possible slots.
	    possibleSlots = removeAllOddSlots(possibleSlots, filledGoogleSlots);
	}

	// print list of slot
	// System.out.println("possibleSlots:");
	// printList(possibleSlots);

	// Return available slots
	return possibleSlots;
    }

    /**
     * Returns list of all possible slots within 24Hr with size of duration
     * which is selected slot time from client.
     * 
     * @param slotTime
     *            Selected duration for appointment event.
     * @param date
     *            Selected date for appointment event.
     * @return List of possible slots
     */
    public static List<List<Long>> getAllPossibleSlots(int slotTime, String date, Long startTime, int timezone,
	    String timezoneName)
    {
	System.out.println("In getAllPossibleSlots");
	System.out.println(slotTime + " " + date + " " + timezone + " " + timezoneName + " " + startTime);

	// List of list of slots
	List<List<Long>> listOfLists = new ArrayList<List<Long>>();

	// Selected date
	Date sd = new Date(startTime * 1000);
	System.out.println(sd);

	Calendar cal = Calendar.getInstance();
	cal.setTime(sd);
	cal.setTimeZone(TimeZone.getTimeZone(timezoneName));
	sd = cal.getTime();

	// DateUtil startDateUtil = new DateUtil(sd);
	// startDateUtil.toTZ(timezoneName);
	// startDateUtil.toMidnight();

	System.out.println(sd);

	// Number of slots possible within 24Hrs with selected slot
	// time(duration)
	int itr = (60 / slotTime) * 24;

	// Make slots
	for (int i = 1; i <= itr; i++)
	{
	    // List of long which are start time and end time
	    List<Long> slots = new ArrayList<Long>();

	    long slot = sd.getTime() / 1000;

	    // Start time of slot
	    slots.add(slot);

	    // Add duration (slot time) in start time
	    // startDateUtil.addMinutes(slotTime);
	    Date d = cal.getTime();
	    long time = d.getTime();
	    time += slotTime * 60 * 1000;
	    d.setTime(time);
	    cal.setTime(d);
	    sd = cal.getTime();
	    System.out.println(sd);

	    // End time of slot
	    slot = sd.getTime() / 1000;
	    slots.add(slot);

	    // Add slot in list of slots
	    listOfLists.add(slots);
	}

	System.out.println("All available slots:");
	printList(listOfLists);
	return listOfLists;
    }

    /**
     * Returns filled time slots on selected date from Agile calendar. Make
     * slots size of filled slots as per selected slot time(duration).
     * 
     * @param username
     *            Client's name
     * @param slotTime
     *            Selected duration (time slot)
     * @param date
     *            Selected date
     * @param epochTime
     *            Client's epoch time
     * @param endTime
     * @param startTime
     * @return List of filled slots from Agile calendar on selected date
     */
    private static List<List<Long>> getFilledAgileSlots(String username, int slotTime, Long startTime, Long endTime)
    {
	System.out.println("In getFilledAgileSlots");

	List<List<Long>> filledSlots = new ArrayList<List<Long>>();

	System.out.println("check for " + startTime + " " + endTime);

	// Get agile events on selected timings
	List<Event> agileEvents = EventUtil.getEvents(startTime, endTime);

	// Add filled slot in nested list
	for (Event e : agileEvents)
	{
	    /*
	     * Make sub slot of filled slot as per selected duration(slot time)
	     * and add in list
	     */
	    filledSlots.addAll(makeSlots(slotTime, e.start, e.end));
	}

	return filledSlots;
    }

    /**
     * Makes small slots from given slot, suppose slot size is 4Hrs and selected
     * slotTime is 1Hr, so it will create 4 small slots of 1Hr, same with 30min
     * slotTime it will create 8 small slots from original slot. Making sub
     * small slots with size slotTime makes easy to compare with possible slots
     * list, so matching slots are easy to remove.
     * 
     * @param slotTime
     *            Selected duration (time slot)
     * @param start
     *            start time of slot
     * @param end
     *            end time of slot
     * @return list of sub slots of slotTime size
     */
    public static List<List<Long>> makeSlots(int slotTime, Long start, Long end)
    {
	System.out.println("In makeSlots");

	// List to store slots
	List<List<Long>> listOfLists = new ArrayList<List<Long>>();

	// Start time of original slot
	Date sd = new Date();
	sd.setTime(start * 1000);

	DateUtil startDateUtil = new DateUtil();
	startDateUtil.setTime(sd);

	// End time of original slot
	Date ed = new Date();
	ed.setTime(end * 1000);

	DateUtil endDateUtil = new DateUtil();
	endDateUtil.setTime(ed);

	for (int i = 1;; i++)
	{
	    // List to store start and end time of slot
	    List<Long> slots1 = new ArrayList<Long>();

	    // Start time of slot. First sub slot's start time is same as
	    // original slot's start time.
	    long slot = startDateUtil.getTime().getTime() / 1000;

	    // Add start time
	    slots1.add(slot);

	    // Add slotTime(duration) to make end time of sub slot
	    startDateUtil.addMinutes(slotTime);
	    slot = startDateUtil.getTime().getTime() / 1000;

	    /*
	     * if end time of sub slot is greater than original end time so
	     * assign original end time.
	     */
	    if (startDateUtil.getTime().getTime() > endDateUtil.getTime().getTime())
		slot = endDateUtil.getTime().getTime() / 1000;

	    // Add end time
	    slots1.add(slot);
	    listOfLists.add(slots1);

	    // If next start time greater than original end time so stop making
	    // new slots.
	    if (startDateUtil.getTime().getTime() >= endDateUtil.getTime().getTime())
		break;
	}

	// print list of slot
	// System.out.println("makeSlots:");
	// printList(listOfLists);

	return listOfLists;
    }

    /**
     * Removes slots which are valid match with odd timing slots, like selected
     * duration (slot time) is 60min, but filled slot is of 15min or 30min, e.g.
     * filled slot is 11.15 to 11.45, and possible slot is 11-12, so need to
     * check edges of slots like 11.15 comes in 11-12 so need to remove possible
     * slot from list.
     * 
     * @param possibleSlots
     *            List of available slots
     * @param filledSlots
     *            List of filled slots
     * @return Return updated list of slot
     */
    private static List<List<Long>> removeAllOddSlots(List<List<Long>> possibleSlots, List<List<Long>> filledSlots)
    {
	// Iterate possible slot's list
	for (Iterator<List<Long>> pit = possibleSlots.iterator(); pit.hasNext();)
	{
	    List<Long> pitSlot = pit.next();

	    // Iterate filled slot's list
	    for (Iterator<List<Long>> fit = filledSlots.iterator(); fit.hasNext();)
	    {
		List<Long> fitSlot = fit.next();

		/*
	         * Start/end time of filled slot is in between available slot so
	         * remove available slot
	         */
		if ((fitSlot.get(0) > pitSlot.get(0) && fitSlot.get(0) < pitSlot.get(1))
		        || (fitSlot.get(1) > pitSlot.get(0) && fitSlot.get(1) < pitSlot.get(1)))
		{
		    // Remove possible slot
		    pit.remove();
		    break;
		}
	    }
	}

	// Return updated list of slot
	return possibleSlots;
    }

    /**
     * Prints list of slots
     * 
     * @param listOfSlots
     *            List of slots to be printed
     */
    private static void printList(List<List<Long>> listOfSlots)
    {
	System.out.println("In printList");
	int j = 0;
	for (List<Long> e : listOfSlots)
	{
	    System.out.println("Slot: " + j);
	    for (Long t : e)
	    {
		System.out.println(t);
	    }
	    j++;
	}
    }

    /**
     * Creates WebCalendarEvent. Searches for contact by email, if duplicate
     * contact is there so add that contact as related to and creates new agile
     * event. If contact not found so new contact is created.
     * 
     * @param wce
     *            WebCalendarEvent entity.
     * @param contact
     *            Contact entity.
     * @return result
     * @throws JSONException
     */
    public static String createEvents(WebCalendarEvent wce, Contact contact) throws JSONException
    {
	System.out.println("In createEvents");
	System.out.println(wce.toString());

	// Domain user id
	Long domainUserId = wce.domainUserId;

	// Agile user id
	Long agileUserId = wce.agileUserId;

	// Selected slot for email
	String selectedDateSlot = wce.date;

	String timezone = wce.timezone;

	Long epoch_start_date = null;
	// Add properties value in contact entity
	contact.properties = new ArrayList<ContactField>();
	contact.properties.add(new ContactField(Contact.FIRST_NAME, wce.userName, null));

	if (!wce.email.isEmpty())
	    contact.properties.add(new ContactField(Contact.EMAIL, wce.email, null));

	if (!wce.email.isEmpty())
	    contact.properties.add(new ContactField(Contact.PHONE, wce.phoneNumber, null));

	contact.type = Type.PERSON;

	// If slots are not selected
	if (wce.selectedSlotsString.isEmpty())
	    return "Slot is empty";

	// Selected slots in json array
	JSONArray jsonArray = new JSONArray(wce.selectedSlotsString);

	// Looping for multiple selected slots. Create List from json array.
	for (int i = 0; i < jsonArray.length(); i++)
	{
	    // Get single slot from selected multiple slots
	    JSONObject explrObject = jsonArray.getJSONObject(i);

	    // Get start and end time from slot
	    List<Long> slot = new ArrayList<Long>();
	    slot.add(explrObject.getLong("start"));
	    slot.add(explrObject.getLong("end"));

	    // Add slot in WebCalendarEvent entity field
	    wce.selectedSlots.add(slot);
	}

	// Looping on list, Each selected slot will create new agile event.
	for (List<Long> slot : wce.selectedSlots)
	{
	    // Create wce obj and save it.
	    WebCalendarEvent saveMe = new WebCalendarEvent();

	    // Assign proper name on basis of slot time duration
	    if (wce.slot_time.compareTo((long) 15) == 0)
		saveMe.name = "say hi";
	    if (wce.slot_time.compareTo((long) 30) == 0)
		saveMe.name = "let's keep it short";
	    if (wce.slot_time.compareTo((long) 60) == 0)
		saveMe.name = "let's chat";

	    // Assign slot time
	    saveMe.slot_time = wce.slot_time;

	    // Get assigned slot name
	    wce.name = saveMe.name;

	    // WCE save
	    saveMe.save();

	    System.out.println(saveMe);

	    // Check if the email exists with the current email address
	    boolean isDuplicate = ContactUtil.isExists(contact.getContactFieldValue("EMAIL"));

	    // if it is not exists
	    if (!isDuplicate)
	    {
		// Set lead owner(current domain user)
		Key<DomainUser> owner_key = new Key<DomainUser>(DomainUser.class, domainUserId);
		contact.setContactOwner(owner_key);

		// Save as new contact
		contact.save();

		System.out.println("Contacts properties = ");
		for (ContactField f : contact.properties)
		{
		    System.out.println("\t" + f.name + " - " + f.value);
		}
		System.out.println("contact tags : " + contact.tags);
	    }
	    else
	    {
		// Get already present contact
		contact = ContactUtil.searchContactByEmail(wce.email);
	    }

	    // If contact is valid
	    if (contact.id != null)
	    {
		// Create agile event
		// String title, Long start, Long end, boolean isEventStarred,
		// Long contactId, Long agileUserId
		Event newEvnt = new Event("", null, null, false, null, agileUserId);

		// Set property values
		newEvnt.title = wce.name.concat(" with ".concat(wce.userName)); // name
		newEvnt.start = slot.get(0); // start time
		newEvnt.end = slot.get(1); // end time
		newEvnt.color = "#36C";

		epoch_start_date = newEvnt.start;
		String cid = contact.id.toString(); // related contact

		// Add contact in event
		if (cid != null)
		{
		    newEvnt.contacts = new ArrayList<String>();
		    boolean add = newEvnt.contacts.add(cid);
		}

		// save agile event
		newEvnt.save();
	    }
	}

	// If user want confirmation, send confirmation email.
	if (wce.confirmation.equalsIgnoreCase("on"))
	{
	    DomainUser user = DomainUserUtil.getDomainUser(domainUserId);
	    String body = "<p>Your appointment was scheduled with " + user.name + " on "
		    + getNearestDateOnlyFromEpoch(epoch_start_date, timezone) + "</p><p>Duration - " + wce.slot_time
		    + " minutes</p><p>Note message : " + wce.notes + "</p>";

	    // Saves Contact Email
	    ContactEmailUtil.saveContactEmailAndSend("noreply@agilecrm.com", "Agile CRM", wce.email, null, null,
		    "Appointment Scheduled", body, "-", contact, false);
	}
	return "Done";
    }

    public static List<String> getSlotDetails()
    {
	JSONObject slot = new JSONObject();
	/* JSONArray slots = new JSONArray(); */

	List<String> slots = new ArrayList<String>();

	try
	{
	    slot.put("time", 15);
	    slot.put("title", "say hi");
	    slots.add(slot.toString());
	    System.out.println(slot);

	    slot.put("time", 30);
	    slot.put("title", "let's keep it short");
	    slots.add(slot.toString());
	    System.out.println(slot);

	    slot.put("time", 60);
	    slot.put("title", "let's chat");
	    slots.add(slot.toString());

	    System.out.println(slot);

	}
	catch (JSONException e)
	{
	    e.printStackTrace();
	}
	return slots;

    }

    /**
     * parse timezone from date.toString();
     * 
     * @param sDate
     * @return
     */
    public static String parseTimeZone(String sDate)
    {
	try
	{
	    DateFormat dbFormatter = new SimpleDateFormat("ddd MMM dd yyyy HH:mm:ssZ");
	    System.out.println(dbFormatter.getTimeZone());

	    // Thu Aug 14 2014 00:00:00 GMT 0530 (India Standard Time)

	    dbFormatter.parse(sDate);

	    System.out.println(dbFormatter.getTimeZone());

	    return dbFormatter.getTimeZone().toString();
	}
	catch (ParseException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	return null;

    }

    // Get Nearest Date only (12am)
    public static String getNearestDateOnlyFromEpoch(long timeInMilliSecs, String timeZone)
    {
	System.out.println(timeZone);

	DateFormat dateFormat = new SimpleDateFormat("MMMM d yyyy, h:mm a");
	return getGMTDateInMilliSecFromTimeZoneId(timeZone, timeInMilliSecs * 1000, dateFormat);
    }

    // Get string of date based on timeZone
    public static String getGMTDateInMilliSecFromTimeZoneId(String timeZoneId, long timeInMilliSecs,
	    DateFormat dateFormat)
    {

	if (dateFormat == null)
	{
	    dateFormat = new SimpleDateFormat();
	}

	if (timeZoneId == null || timeZoneId.trim().length() == 0)
	{
	    return dateFormat.format(new Date());
	}

	Calendar cal = Calendar.getInstance();
	cal.setTimeInMillis(timeInMilliSecs);
	try
	{
	    // Convert timezone id
	    // timeZoneId = (timeZoneId.startsWith("-")) ?
	    // timeZoneId.replace("-", "") : "-" + timeZoneId.replace("+", "");
	    // timeZoneId = timeZoneId.replace("-", "");

	    // converting offset time to milliseconds
	    int offset = Integer.parseInt(timeZoneId) * 60 * 1000;

	    // zone id's based on offset
	    String[] idsArr = TimeZone.getAvailableIDs(offset);

	    TimeZone tz = TimeZone.getTimeZone(idsArr[0]);
	    dateFormat.setTimeZone(tz);
	    cal.setTimeZone(tz);
	    return dateFormat.format(cal.getTime());
	}
	catch (Exception e)
	{
	    // TODO: handle exception
	    e.printStackTrace();
	}

	return dateFormat.format(new Date());
    }

}
