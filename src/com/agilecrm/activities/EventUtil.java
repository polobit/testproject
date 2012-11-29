package com.agilecrm.activities;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;

public class EventUtil
{
    // Dao
    private static ObjectifyGenericDao<Event> dao = new ObjectifyGenericDao<Event>(
	    Event.class);

    /**
     * The Event locator based on id
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

    // Get Event from start to end for FullCalendar
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
}
