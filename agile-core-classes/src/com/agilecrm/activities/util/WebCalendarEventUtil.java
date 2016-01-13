package com.agilecrm.activities.util;

import java.io.IOException;
import java.net.URISyntaxException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TimeZone;
import java.util.TreeSet;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.account.AccountPrefs;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.account.util.EmailGatewayUtil;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Event.EventType;
import com.agilecrm.activities.WebCalendarEvent;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Contact.Type;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.OnlineCalendarPrefs;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.OnlineCalendarUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.IcalendarUtil;
import com.agilecrm.util.VersioningUtil;
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
	 * @throws JSONException
	 */
	public static List<List<Long>> getSlots(Long userid, int slotTime, String date, String timezoneName,
			Long epochTime, Long startTime, Long endTime, Long agileuserid, int timezone) throws ParseException,
			JSONException
	{
		DomainUser domain_user = DomainUserUtil.getDomainUser(userid);
		OnlineCalendarPrefs prefs = OnlineCalendarUtil.getCalendarPrefs(userid);
		String domainUser_timezone = UserPrefsUtil.getUserTimezoneFromUserPrefs(domain_user.id);
		String business_hours = null;
		if (prefs != null)
		{
			business_hours = prefs.business_hours;
		}
		if (StringUtils.isEmpty(business_hours))
			business_hours = domain_user.business_hours;
		if (StringUtils.isEmpty(domainUser_timezone))
		{
			domainUser_timezone = domain_user.timezone;
		}
		List<List<Long>> listOfLists = new ArrayList<List<Long>>();

		// Get all permutations possible based on selected slottime(duration) in
		// 24 Hr.
		List<List<Long>> possibleSlots = getAllPossibleSlots(slotTime, date, startTime, timezone, timezoneName);
		//List<List<Long>>freeSlots = getAllFreeSlots(slotTime, date, startTime, timezone, timezoneName, endTime);
		
		// Get all filled slots from Agile calendar.
		List<List<Long>> filledAgileSlots = getFilledAgileSlots(agileuserid, slotTime, startTime, endTime);

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

		if (possibleSlots != null && possibleSlots.size() > 0)
		{
			for (int i = 0; i <= possibleSlots.size() - 1; i++)
			{
				List<Long> slots = possibleSlots.get(i);
				Long main = slots.get(0);
				if (checkBussinessHour(main, domainUser_timezone, new JSONArray(business_hours), slotTime))
				{
					listOfLists.add(slots);
				}

			}
		}

		// Return available slots
		return listOfLists;
	}

	/**
	 * 
	 * @param eppoch
	 *            checks this epoch time is in business hours of user or not
	 * @param usertimezone
	 *            domain user timezone
	 * @param business_hours_array
	 * @return if epoch is in between business hour then it return true else
	 *         false
	 * @throws JSONException
	 */
	public static boolean checkBussinessHour(Long eppoch, String usertimezone, JSONArray business_hours_array,
			int slottime) throws JSONException
	{
		// used to store business hours
		List<Long> business_hours = new ArrayList<>();

		// from time is "9" formTime_mins is "00"
		String fromTime = null;
		String fromTime_mins = null;
		String tillTime = null;
		String tillTime_mins = null;

		Long night_starttime = 0L;
		Long night_endtime = 0L;

		String night_fromtime = null; // stores like "9"
		String night_fromTimeMins = null; // stores like "00"

		String night_endTime = null;
		String night_endTimeMins = null;

		// check for timezone
		if (StringUtils.isEmpty(usertimezone))
		{
			AccountPrefs acprefs = AccountPrefsUtil.getAccountPrefs();
			usertimezone = acprefs.timezone;
			if (StringUtils.isEmpty(usertimezone))
			{
				usertimezone = "UTC";
			}
		}
		// according domain user timezone gets the weekday
		// i.e in java sun,mon,tue,wed,thu,fri,sat 1,2,3,4,5,6,7 respectivly
		TimeZone tz = TimeZone.getTimeZone(usertimezone);
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(eppoch * 1000);
		calendar.setTimeZone(tz);

		// business hours will be stored like array of json objects.
		// starts from Monday.
		// according to js Monday is 1
		// according DB storage of business hours Monday is 0.
		int week_day = getWeekDayAccordingToJS(calendar.get(Calendar.DAY_OF_WEEK));

		int date = calendar.get(Calendar.DATE);

		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH);

		// in backend business hours will be stored as
		// [{"isActive":true,"timeTill":"03:00","timeFrom":"14:00"},{"isActive":false,"timeTill":null,"timeFrom":null},...]
		// 0 position is monday and 1 position is tuesday according to business
		// hours plugin
		JSONObject business = new JSONObject(business_hours_array.get(week_day).toString());

		// if(isActive) true i.e working day if not return empty list
		if (business.getString("isActive") == "true")
		{

			fromTime = business.getString("timeFrom").split(":")[0];
			fromTime_mins = business.getString("timeFrom").split(":")[1];

			tillTime = business.getString("timeTill").split(":")[0];
			tillTime_mins = business.getString("timeTill").split(":")[1];

		}

		if (StringUtils.isNotEmpty(fromTime) && StringUtils.isNotEmpty(tillTime))
		{
			Long endtime = null;

			//
			Long starttime = getEppochTime(date, month, year, Integer.parseInt(fromTime),
					Integer.parseInt(fromTime_mins), tz);
			starttime = starttime - 60;

			// if fromTime < tillTime considered as morning shift
			// else considered as night shift

			if (Integer.parseInt(fromTime) < Integer.parseInt(tillTime))
			{
				endtime = getEppochTime(date, month, year, Integer.parseInt(tillTime), Integer.parseInt(tillTime_mins),
						tz);

				endtime = endtime - (slottime * 60);
				int night_before_wkday = getNightWeekDayAccordingToJS(week_day);
				JSONObject night_business_hours = new JSONObject(business_hours_array.get(night_before_wkday)
						.toString());

				if (night_business_hours.getString("isActive") == "true")
				{

					// we have to pass hour to calendar only 00 format.
					// calendar give time in sec according to date and hour

					night_fromtime = night_business_hours.getString("timeFrom").split(":")[0];
					night_fromTimeMins = night_business_hours.getString("timeFrom").split(":")[1];

					night_endTime = night_business_hours.getString("timeTill").split(":")[0];
					night_endTimeMins = night_business_hours.getString("timeTill").split(":")[1];
					if (Integer.parseInt(night_fromtime) > Integer.parseInt(night_endTime))
					{
						night_starttime = getEppochTime(date, month, year, Integer.parseInt("00"),
								Integer.parseInt("00"), tz);

						night_endtime = getEppochTime(date, month, year, Integer.parseInt(night_endTime),
								Integer.parseInt(night_endTimeMins), tz);
						night_endtime = night_endtime - (slottime * 60);
					}
				}
			}
			else
			{

				endtime = getEppochTime(date + 1, month, year, Integer.parseInt(tillTime),
						Integer.parseInt(tillTime_mins), tz);

				int night_wkday = getNightWeekDayAccordingToJS(week_day);
				JSONObject night_business = new JSONObject(business_hours_array.get(night_wkday).toString());

				if (night_business.getString("isActive") == "true")
				{

					// we have to pass hour to calendar only 00 format.
					// calendar give time in sec according to date and hour

					night_fromtime = night_business.getString("timeFrom").split(":")[0];
					night_fromTimeMins = night_business.getString("timeFrom").split(":")[1];
					night_endTime = night_business.getString("timeTill").split(":")[0];
					night_endTimeMins = night_business.getString("timeTill").split(":")[1];

					if (Integer.parseInt(night_fromtime) > Integer.parseInt(night_endTime))
					{
						night_starttime = getEppochTime(date, month, year, Integer.parseInt("00"),
								Integer.parseInt("00"), tz);

						night_endtime = getEppochTime(date, month, year, Integer.parseInt(night_endTime),
								Integer.parseInt(night_endTimeMins), tz);
						night_endtime = night_endtime - (slottime * 60);
					}

				}
			}

			if ((eppoch > starttime && eppoch < endtime) || (eppoch > night_starttime && eppoch < night_endtime))
			{
				return true;
			}
		}
		return false;
	}

	/**
	 * 
	 * @param wkday
	 *            int weekday. according jquery business hours plugin monday to
	 *            sun represented as 0 to 6 according to java sunday to sat
	 *            represented as 1 to 7 as we are storing business hours in
	 *            jsonarray we have to get appropriate week number to get business
	 *            hours
	 * @return weekday according jquery business hours plugin
	 */

	public static int getWeekDayAccordingToJS(int wkday)
	{

		if (wkday == 1)
		{
			return 6;
		}
		else if (wkday == 2)
		{
			return 0;
		}
		else if (wkday == 3)
		{
			return 1;
		}
		else if (wkday == 4)
		{
			return 2;
		}
		else if (wkday == 5)
		{
			return 3;
		}
		else if (wkday == 6)
		{
			return 4;
		}
		else if (wkday == 7)
		{
			return 5;
		}
		return wkday;
	}

	/**
	 * if night ours is the business hours then it will give the weekday before
	 * actual weekday to calculate business hours for before day also
	 * 
	 * @param if wkday is monday
	 * @return sunday
	 */
	public static int getNightWeekDayAccordingToJS(int wkday)
	{

		if (wkday == 0)
		{
			return 6;
		}
		else if (wkday == 1)
		{
			return 0;
		}
		else if (wkday == 2)
		{
			return 1;
		}
		else if (wkday == 3)
		{
			return 2;
		}
		else if (wkday == 4)
		{
			return 3;
		}
		else if (wkday == 5)
		{
			return 4;
		}
		else if (wkday == 6)
		{
			return 5;
		}
		return wkday;
	}

	/**
	 * 
	 * @param date
	 *            date of the day number
	 * @param month
	 *            month of the year number
	 * @param year
	 *            year
	 * @param time
	 *            hour of the day
	 * @param timezone
	 *            sets the calendar to this particular timezone
	 * @return
	 */
	public static Long getEppochTime(int date, int month, int year, int time, int minutes, TimeZone timezone)
	{
		Calendar calendar = new GregorianCalendar();
		calendar.set(year, month, date, time, minutes);
		calendar.setTimeZone(timezone);
		Date d = calendar.getTime();
		Long epoch = d.getTime() / 1000;

		return epoch;

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

		// List of list of slots
		List<List<Long>> listOfLists = new ArrayList<List<Long>>();

		// Selected date
		Date sd = new Date(startTime * 1000);

		Calendar cal = Calendar.getInstance();
		cal.setTime(sd);
		cal.setTimeZone(TimeZone.getTimeZone(timezoneName));
		sd = cal.getTime();

		// DateUtil startDateUtil = new DateUtil(sd);
		// startDateUtil.toTZ(timezoneName);
		// startDateUtil.toMidnight();

		// Number of slots possible within 24Hrs with selected slot
		// time(duration)
		int itr = (60 / slotTime) * 24;
		
		// 3400 sec per hour. 86400 per day.
		
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

			// End time of slot
			slot = sd.getTime() / 1000;
			slots.add(slot);

			// Add slot in list of slots
			listOfLists.add(slots);
		}

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
	private static List<List<Long>> getFilledAgileSlots(Long userid, int slotTime, Long startTime, Long endTime)
	{

		List<List<Long>> filledSlots = new ArrayList<List<Long>>();

		// Get agile events on selected timings
		//List<Event> agileEvents = EventUtil.getEvents(startTime, endTime, userid);
		
		List<Event> loadEvents = EventUtil.getBlockedEvents(startTime, endTime, userid);

		// Add filled slot in nested list
		for (Event e : loadEvents)
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

			for (Long t : e)
			{

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
	 * @throws URISyntaxException
	 * @throws ParseException
	 * @throws IOException
	 */
	public static String createEvents(WebCalendarEvent wce, Contact contact) throws JSONException
	{
		System.out.println("In createEvents");

		// Domain user id
		Long domainUserId = wce.domainUserId;

		// Agile user id
		Long agileUserId = wce.agileUserId;

		// Selected slot for email
		String selectedDateSlot = wce.date;

		String timezone = wce.timezone;
		List<Long> selected_slot = new ArrayList<Long>();
		DomainUser _user = new DomainUser();
		_user.name = wce.userName;
		_user.email = wce.email;

		Event newEvnt = null;

		Event client_event = new Event();

		DomainUser user = DomainUserUtil.getDomainUser(domainUserId);
		JSONObject meeting_duration = new JSONObject(user.meeting_durations);
		net.fortuna.ical4j.model.Calendar iCal = null;
		net.fortuna.ical4j.model.Calendar agileUseiCal = null;
		String domain_url = VersioningUtil.getHostURLByApp(user.domain);

		Long epoch_start_date = null;
		// Add properties value in contact entity
		contact.properties = new ArrayList<ContactField>();
		contact.properties.add(new ContactField(Contact.FIRST_NAME, wce.userName, null));

		if (!wce.email.isEmpty())
			contact.properties.add(new ContactField(Contact.EMAIL, wce.email, null));

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
			// slot is assigned to selected slot to check availabity out side
			selected_slot = slot;
			// Add slot in WebCalendarEvent entity field
			wce.selectedSlots.add(slot);
		}

		// checks for the availability of slot

		boolean isAvailable = checkSlotAvailability(wce, selected_slot);
		if (!isAvailable)
			return "slot booked";

		// Looping on list, Each selected slot will create new agile event.
		for (List<Long> slot : wce.selectedSlots)
		{
			// Create wce obj and save it.
			WebCalendarEvent saveMe = new WebCalendarEvent();

			// Assign proper name on basis of slot time duration
			/*
			 * if (wce.slot_time.compareTo((long) 15) == 0) saveMe.name =
			 * meeting_duration.getString("15mins"); ; if
			 * (wce.slot_time.compareTo((long) 30) == 0) saveMe.name =
			 * meeting_duration.getString("30mins"); ; if
			 * (wce.slot_time.compareTo((long) 60) == 0) saveMe.name =
			 * meeting_duration.getString("60mins"); ;
			 */

			// Assign slot time
			saveMe.slot_time = wce.slot_time;

			// Get assigned slot name
			// wce.name = saveMe.name;

			// WCE save
			// saveMe.save();

			// Check if the email exists with the current email address
			boolean isDuplicate = ContactUtil.isExists(contact.getContactFieldValue("EMAIL").toLowerCase());
			try
			{
				// if it is not exists
				if (!isDuplicate)
				{
					// Set lead owner(current domain user)
					Key<DomainUser> owner_key = new Key<DomainUser>(DomainUser.class, domainUserId);
					contact.setContactOwner(owner_key);

					// Save as new contact
					contact.save();

					for (ContactField f : contact.properties)
					{
						System.out.println("\t" + f.name + " - " + f.value);
					}
				}
				else
				{
					// Get already present contact
					contact = ContactUtil.searchContactByEmail((wce.email));
				}
			}
			catch (Exception e)
			{
				System.out.println("exception in catch block  " + e.getMessage());
				e.printStackTrace();

			}

			// If contact is validz
			if (contact != null && contact.id != null)
			{
				// Create agile event
				// String title, Long start, Long end, boolean isEventStarred,
				// Long contactId, Long agileUserId
				newEvnt = new Event("", null, null, false, null, agileUserId);

				// Set property values
				newEvnt.title = wce.name.concat(" with ".concat(wce.userName)); // name
				client_event.title = wce.name.concat(" with ".concat(user.name));
				client_event.start = newEvnt.start = slot.get(0); // start time
				client_event.end = newEvnt.end = slot.get(1); // end time
				client_event.created_time = System.currentTimeMillis() / 1000;
				newEvnt.color = "#36C";
				newEvnt.type = EventType.WEB_APPOINTMENT;

				if (StringUtils.isNotEmpty(wce.phoneNumber) && !"Meeting Type".equalsIgnoreCase(wce.phoneNumber))
				{
					newEvnt.meeting_type = wce.phoneNumber.trim();
				}
				if (StringUtils.isNotEmpty(wce.notes))
				{
					newEvnt.description = wce.notes;
				}
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

				agileUseiCal = IcalendarUtil.getICalFromEvent(newEvnt, _user, user.email, user.name);
				String[] attachments_to_agile_user = { "text/calendar", "mycalendar.ics", agileUseiCal.toString() };
				String usermail = null;

				if (StringUtils.isNotEmpty(wce.phoneNumber) && !"Meeting Type".equalsIgnoreCase(wce.phoneNumber))
				{

					usermail = "<p>" + wce.userName + " (" + wce.email
							+ ") has scheduled an appointment </p><span>Type: '" + wce.name + "' (" + wce.slot_time
							+ "mins)</span><br/><span>Meeting Type: " + wce.phoneNumber + "</span><br/><span>Note: "
							+ wce.notes + "</span><br/><p><a href=https://" + user.domain
							+ ".agilecrm.com/#calendar>View this new event in Agile Calendar</a></p>";
				}
				else
				{
					usermail = "<p>" + wce.userName + " (" + wce.email
							+ ") has scheduled an appointment </p><span>Type: '" + wce.name + "' (" + wce.slot_time
							+ "mins)</span><br/><span>Note: " + wce.notes + "</span><br/><p><a href=https://"
							+ user.domain + ".agilecrm.com/#calendar>View this new event in Agile Calendar</a></p>";
				}

				EmailGatewayUtil.sendEmail(null, wce.email, wce.userName, user.email, null, null,
						"Appointment Scheduled", null, usermail, null, null, null, null, attachments_to_agile_user);
			}
			else
			{
				// Create agile event
				// String title, Long start, Long end, boolean isEventStarred,
				// Long contactId, Long agileUserId
				newEvnt = new Event("", null, null, false, null, agileUserId);

				// Set property values
				newEvnt.title = wce.name.concat(" with ".concat(wce.userName)); // name
				client_event.title = wce.name.concat(" with ".concat(user.name));
				client_event.start = newEvnt.start = slot.get(0); // start time
				client_event.end = newEvnt.end = slot.get(1); // end time
				client_event.created_time = System.currentTimeMillis() / 1000;
				newEvnt.color = "#36C";
				newEvnt.type = EventType.WEB_APPOINTMENT;
				if (StringUtils.isNotEmpty(wce.phoneNumber) && !"Meeting Type".equalsIgnoreCase(wce.phoneNumber))
				{
					newEvnt.meeting_type = wce.phoneNumber.trim();
				}
				if (StringUtils.isNotEmpty(wce.notes))
				{
					newEvnt.description = wce.notes;
				}

				epoch_start_date = newEvnt.start;

				// save agile event
				newEvnt.save();

				agileUseiCal = IcalendarUtil.getICalFromEvent(newEvnt, _user, user.email, user.name);
				String[] attachments_to_agile_user = { "text/calendar", "mycalendar.ics", agileUseiCal.toString() };
				String usermail = null;

				if (StringUtils.isNotEmpty(wce.phoneNumber) && !"Meeting Type".equalsIgnoreCase(wce.phoneNumber))
				{

					usermail = "<p>" + wce.userName + " (" + wce.email
							+ ") has scheduled an appointment </p><span>Duration: " + wce.slot_time
							+ "mins</span><br/><span>Meeting Type: " + wce.phoneNumber + "</span><br/><span>Note: "
							+ wce.notes + "</span><br/><p><a href=https://" + user.domain
							+ ".agilecrm.com/#calendar>View this new event in Agile Calendar</a></p>";
				}
				else
				{
					usermail = "<p>" + wce.userName + " (" + wce.email
							+ ") has scheduled an appointment </p><span>Duration: " + wce.slot_time
							+ "mins</span><br/><span>Note: " + wce.notes + "</span><br/><p><a href=https://"
							+ user.domain + ".agilecrm.com/#calendar>View this new event in Agile Calendar</a></p>";
				}

				EmailGatewayUtil.sendEmail(null, wce.email, wce.userName, user.email, null, null,
						"Appointment Scheduled", null, usermail, null, null, null, null, attachments_to_agile_user);

			}

		}

		// If user want confirmation, send confirmation email.
		if (wce.confirmation.equalsIgnoreCase("on"))
		{

			iCal = IcalendarUtil.getICalFromEvent(client_event, user, wce.email, null);

			String link = "https://www.agilecrm.com/?utm_source=powered-by&medium=email&utm_campaign=" + user.domain;

			String cancel_link = domain_url + "appointment/cancel/" + newEvnt.id;
			String client_mail = null;
			if (StringUtils.isNotEmpty(wce.phoneNumber) && !"Meeting Type".equalsIgnoreCase(wce.phoneNumber))
			{
				client_mail = "<p>You have a new appointment with <b>" + user.name + "</b> (" + user.email
						+ ")</p><span>Duration: " + wce.slot_time + "mins</span><br/><span>Phone: " + wce.phoneNumber
						+ "</span><br/><span>Note: " + wce.notes + "</span><br/><p><a href=" + cancel_link
						+ ">Cancel this appointment</a></p><p>This event has been scheduled using <a href=" + link
						+ ">Agile CRM</a></p>";
			}
			else
			{
				client_mail = "<p>You have a new appointment with <b>" + user.name + "</b> (" + user.email
						+ ")</p><span>Duration: " + wce.slot_time + "mins</span><br/><span>Note: " + wce.notes
						+ "</span><br/><p><a href=" + cancel_link
						+ ">Cancel this appointment</a></p><p>This event has been scheduled using <a href=" + link
						+ ">Agile CRM</a></p>";
			}

			String[] attachments = { "text/calendar", "mycalendar.ics", iCal.toString() };

			EmailGatewayUtil.sendEmail(null, user.email, user.name, wce.email, null, null, "Appointment Scheduled",
					null, client_mail, null, null, null, null, attachments);

		}
		return "Done";
	}

	/**
	 * fetches slots
	 * 
	 * @param id
	 * @param meeting_types
	 * @return
	 */
	public static List<String> getSlotDetails(Long id, String meeting_types)
	{
		JSONObject slot = new JSONObject();
		/* JSONArray slots = new JSONArray(); */

		List<String> slots = new ArrayList<String>();

		DomainUser dm = null;
		if (id != null)
		{
			dm = DomainUserUtil.getDomainUser(id);
		}
		else
		{
			dm = new DomainUser();
			dm.meeting_durations = meeting_types;
		}

		try
		{
			JSONObject js = new JSONObject(dm.meeting_durations);
			if (StringUtils.isNotEmpty(js.getString("15mins")))
			{
				slot.put("time", 15);
				slot.put("title", js.get("15mins"));
				slots.add(slot.toString());
			}
			if (StringUtils.isNotEmpty(js.getString("30mins")))
			{
				slot.put("time", 30);
				slot.put("title", js.get("30mins"));
				slots.add(slot.toString());
			}
			if (StringUtils.isNotEmpty(js.getString("60mins")))
			{
				slot.put("time", 60);
				slot.put("title", js.get("60mins"));
				slots.add(slot.toString());
			}

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

			// Thu Aug 14 2014 00:00:00 GMT 0530 (India Standard Time)

			dbFormatter.parse(sDate);

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

		DateFormat dateFormat = new SimpleDateFormat("EEE, MMMM d yyyy, h:mm a (z)");
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

	// gives the date if timezone is not offset timezone is like Asia/kolkatha
	public static String getGMTDateInMilliSecFromTimeZone(String timeZoneId, long timeInMilliSecs, DateFormat dateFormat)
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

			TimeZone tz = TimeZone.getTimeZone(timeZoneId);
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

	/**
	 * based on hours returns AM /PM from JSP page
	 * 
	 * @param hours
	 * @return
	 */

	public static String returnTimeInAmPm(String hours)
	{
		if ("null".equalsIgnoreCase(hours))
			return null;
		
		return hours;
	/*
		String str = hours.substring(0, 2);
		String mins = hours.substring(3);
		if ("00".equals(str) || "24".equals(str))
			return "00:" + mins + "am";
		else if ("12".equals(str))
			return "12:" + mins + "pm";
		Map<String, String> time_map = new HashMap<>();
		for (int i = 13, k = 1; i <= 23; i++, k++)
		{
			time_map.put(String.valueOf(i), String.valueOf(k));
		}
		if (Integer.parseInt(str) < 12)
		{
			return Integer.parseInt(str) + ":" + mins + "am";
		}
		else
		{
			return time_map.get(str) + ":" + mins + "pm";
		}
*/
	}

	/**
	 * checks the selcted slot availabilty while creating event intracting with
	 * 
	 * {@link checkSlotInListOfLists}
	 * 
	 * @param wce
	 * @return
	 */

	public static boolean checkSlotAvailability(WebCalendarEvent wce, List<Long> slot)
	{
		List<List<Long>> filledGoogleSlots = GoogleCalendarUtil.getFilledGoogleSlots(wce.domainUserId,
				(int) (long) wce.slot_time, wce.timezone_offset, wce.timezone, wce.midnight_start_time,
				wce.midnight_end_time);
		List<List<Long>> filledAgileSlots = getFilledAgileSlots(wce.agileUserId, (int) (long) wce.slot_time,
				wce.midnight_start_time, wce.midnight_end_time);
		boolean googleAvailability = checkSlotInListOfLists(filledGoogleSlots, slot);
		boolean agileAvailability = checkSlotInListOfLists(filledAgileSlots, slot);
		if (googleAvailability && agileAvailability)
			return true;
		return false;
	}

	/**
	 * 
	 * @param filledslots
	 * @param selectedslot
	 * @return
	 */
	public static boolean checkSlotInListOfLists(List<List<Long>> filledslots, List<Long> selectedslot)
	{
		if (filledslots == null || filledslots.isEmpty())
			return true;
		Long start_time = selectedslot.get(0);
		Long end_time = selectedslot.get(1);
		for (List<Long> slot : filledslots)
		{
			if ((slot.get(0) <= start_time && slot.get(1) > start_time)
					|| (slot.get(0) < end_time && slot.get(1) >= end_time))
			{
				return false;
			}
		}
		return true;
	}

	/**
	 * converts the buffer time to seconds or milliseconds
	 * 
	 * @param hours
	 * @param secOrMil
	 *            units for buffertime mins / hours
	 * @return
	 */
	public static long convertHoursToMilliSeconds(int bufferTime, String secOrMil)
	{

		long milliSecs = 0L;
		try
		{
			if ("minutes".equalsIgnoreCase(secOrMil))
			{
				milliSecs = (long) (bufferTime * 60 * 1000);
			}
			else if ("hours".equalsIgnoreCase(secOrMil))
			{
				milliSecs = (long) bufferTime * 60 * 60 * 1000;
			}
		}
		catch (Exception e)
		{
			System.out.println("exception occured while calculating buffertime" + e.getMessage());
		}

		return milliSecs;

	}

	/**
	 * from team calendar removes duplicate schedulids
	 * jagadeesh.agilecrm.com/calednar/jagadeesh,jagadeesh
	 * 
	 * @param scheduleid
	 * @return
	 */
	public static List<String> removeDuplicateScheduleIds(String scheduleid)
	{
		String[] names = scheduleid.split(",");
		List<String> list = Arrays.asList(names);
		Set<String> toRetain = new TreeSet<String>(String.CASE_INSENSITIVE_ORDER);
		toRetain.addAll(list);
		Set<String> set = new LinkedHashSet<String>(list);
		set.retainAll(new LinkedHashSet<String>(toRetain));
		list = new ArrayList<String>(set);
		return list;
	}

	/**
	 * creates json object from with required values for team online calendar
	 * 
	 * @param online_prefs
	 * @param _domain_user
	 * @param agile_user
	 * @return
	 */
	public static JSONObject createNewJSONFromOnlineCalendarPage(OnlineCalendarPrefs online_prefs,
			DomainUser _domain_user, AgileUser agile_user)
	{
		JSONObject domain_user_json = new JSONObject();
		try
		{
			domain_user_json.put("id", _domain_user.id);
			domain_user_json.put("name", _domain_user.name);
			domain_user_json.put("agile_user_id", agile_user.id);
			if (online_prefs != null)
			{
				domain_user_json.put("meeting_durations", online_prefs.meeting_durations);
				domain_user_json.put("meeting_types", online_prefs.meeting_types.split(","));
				domain_user_json.put("slot_details", getSlotDetails(null, online_prefs.meeting_durations));
				domain_user_json.put("buffer_time",
						convertHoursToMilliSeconds(online_prefs.bufferTime, online_prefs.bufferTimeUnit));
			}
			else
			{
				domain_user_json.put("meeting_durations", _domain_user.meeting_durations);
				domain_user_json.put("meeting_types", _domain_user.meeting_types.split(","));
				domain_user_json.put("slot_details", getSlotDetails(null, _domain_user.meeting_durations));
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		// TODO: handle exception
		return domain_user_json;
	}

	/**
	 * creates list of values to show all user details in team calendar
	 * 
	 * @param business_hours
	 *            array current day business hours
	 * @param us_prefs
	 *            current user prefs
	 * @param _domain_user
	 *            current domain user
	 * @return
	 */
	public static List<String> getProfileListWithValuesForTeamCalednar(JSONArray business_hours, UserPrefs us_prefs,
			DomainUser _domain_user)
	{

		List<String> profile = new ArrayList<String>();
		try
		{
			JSONObject _hours = new JSONObject(business_hours.get(
					getWeekDayAccordingToJS(Calendar.getInstance().get(Calendar.DAY_OF_WEEK))).toString());

			String from_time = WebCalendarEventUtil.returnTimeInAmPm(_hours.getString("timeFrom"));

			String end_time = WebCalendarEventUtil.returnTimeInAmPm(_hours.getString("timeTill"));
			if (StringUtils.isEmpty(us_prefs.pic))
				us_prefs.pic = "/img/gravatar.png";
			profile.add(us_prefs.pic);
			profile.add(_domain_user.name);
			if (StringUtils.isNotEmpty(from_time) && StringUtils.isNotEmpty(end_time))
				profile.add(from_time + " - " + end_time);
			else
				profile.add("Today is holiday");
			profile.add(StringUtils.isNotEmpty(us_prefs.timezone) ? us_prefs.timezone : AccountPrefsUtil
					.getAccountPrefs().timezone);
			profile.add(String.valueOf(_domain_user.id));
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return profile;
	}

	/**
	 * if url is jagadeesh.agilecrm.com/calenar/jagadeesh/1-3 only 1 and 3 slots
	 * will be shown and remaining will be hidden. if user enters 1-1-2 this
	 * method removes duplicates slots
	 * @param slots
	 * @return  array of removed slots
	 */
	public static String[] getSlotsArrayFromUrl(String slots)
	{
		String[] slots_array = null;
		slots_array = slots.split("-");
		List<String> list = Arrays.asList(slots_array);
		Set<String> set = new HashSet<String>(list);
		String[] result = new String[set.size()];
		String after_sorting[] = set.toArray(result);
		if (after_sorting.length == slots_array.length)
		{
			slots_array = slots_array;
		}
		else
		{
			slots_array = after_sorting;
		}
		return slots_array;
	}
	
	public static void getBaseDetails() {
		Long user_id = 5629499534213120L;
		String date = "Wed Feb 03 2016 11:15:34 GMT 0530 (India Standard Time)";
		int slot_time = 60;
		String timezone_name = "Asia/Kolkata";
		long epoch_time = 1453314600L;
		long startTime = 1453314600L;
		long endTime = 1453401000L;
		// long agile_user_id = 5716606839685120L;
		Long agile_user_id = null;
		int timezone = -330;
		try {
			List<List<Long>> list = WebCalendarEventUtil.getSlots(user_id,
					slot_time, date, timezone_name, epoch_time, startTime,
					endTime, agile_user_id, timezone);
			System.out.println(list);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
}