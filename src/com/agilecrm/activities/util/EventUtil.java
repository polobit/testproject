package com.agilecrm.activities.util;

import java.util.List;

import com.agilecrm.activities.Event;
import com.agilecrm.db.ObjectifyGenericDao;

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
    private static ObjectifyGenericDao<Event> dao = new ObjectifyGenericDao<Event>(
	    Event.class);

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
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}
