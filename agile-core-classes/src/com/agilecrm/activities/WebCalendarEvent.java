package com.agilecrm.activities;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * <code>WebCalendarEvent</code> class represents the events for FullCalendar
 * based on the specified time duration. Events are time based such as
 * meetings/appointment with admin. They show up in calendar.
 * <p>
 * The WebCalendarEvent entity includes name of event and slot time. This class
 * will create <code>Event</code> with proper searched or newly created
 * <code>Contact</code>.
 * </p>
 * 
 */
@XmlRootElement
@Cached
public class WebCalendarEvent
{

	@Override
	public String toString()
	{
		return "WebCalendarEvent [id=" + id + ", name=" + name + ", domainUserId=" + domainUserId + ", agileUserId="
				+ agileUserId + ", slot_time=" + slot_time + ", userName=" + userName + ", email=" + email + ", date="
				+ date + ", notes=" + notes + ", phoneNumber=" + phoneNumber + ", selectedSlots=" + selectedSlots
				+ ", selectedSlotsString=" + selectedSlotsString + ", confirmation=" + confirmation + ", timezone="
				+ timezone + "]";
	}

	// Key
	@Id
	public Long id;

	// Name of WebCalendarEvent
	public String name;

	// Duration of WebCalendarEvent
	public Long slot_time;

	// Following fields are used to create contact and event.
	@NotSaved
	public String userName = null;

	@NotSaved
	public Long domainUserId = null;

	@NotSaved
	public Long agileUserId = null;

	@NotSaved
	public String email = null;

	@NotSaved
	public String date = null;

	@NotSaved
	public String notes = null;

	@NotSaved
	public String phoneNumber = null;

	@NotSaved
	public List<List<Long>> selectedSlots = new ArrayList<List<Long>>();

	@NotSaved
	public String selectedSlotsString = null;

	@NotSaved
	public String confirmation = "off";

	@NotSaved
	public String timezone = null;

	@NotSaved
	public Long midnight_start_time = 0L;

	@NotSaved
	public Long midnight_end_time = 0L;

	@NotSaved
	public int timezone_offset = 0;

	// Dao
	public static ObjectifyGenericDao<WebCalendarEvent> dao = new ObjectifyGenericDao<WebCalendarEvent>(
			WebCalendarEvent.class);

	/**
	 * Default constructor
	 */
	public WebCalendarEvent()
	{

	}

	/**
	 * Parameterized constructor
	 */
	public WebCalendarEvent(String name, Long slotTime)
	{
		this.name = name;
		this.slot_time = slotTime;
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
	}

}