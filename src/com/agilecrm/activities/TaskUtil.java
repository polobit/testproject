package com.agilecrm.activities;

import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.agilecrm.util.DateUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class TaskUtil
{
    // Dao
    private static ObjectifyGenericDao<Task> dao = new ObjectifyGenericDao<Task>(
	    Task.class);

    /**
     * The Task locator based on id
     * 
     * @param id
     *            Id of a task
     * @return {@link Task} related to the id
     */
    public static Task getTask(Long id)
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
     * Get tasks related to a particular contact
     * 
     * @param contactId
     *            contact id to get the to get the tasks of a contact
     * @return List of contact related tasks
     * @throws Exception
     */
    public static List<Task> getContactTasks(Long contactId) throws Exception
    {
	Objectify ofy = ObjectifyService.begin();
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);

	return ofy.query(Task.class).filter("related_contacts = ", contactKey)
		.list();
    }

    /**
     * Get list of tasks whose due date is less than current date (mid night
     * time).
     * 
     * @return List of overdue tasks
     */
    public static List<Task> getOverdueTasks()
    {
	try
	{
	    // Get Today's date
	    DateUtil startDateUtil = new DateUtil();
	    Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

	    System.out.println("check for " + startTime);
	    // Get tasks before today's time and which are not completed
	    return dao.ofy().query(Task.class).filter("due <=", startTime)
		    .filter("is_complete", false).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get all the tasks irrespective of their state of completion, i.e both
     * completed and pending tasks.
     * 
     * @return List of all tasks
     */
    public static List<Task> getAllTasks()
    {
	try
	{
	    return dao.ofy().query(Task.class).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get all tasks which are not completed
     * 
     * @return List of pending tasks
     */
    public static List<Task> getAllPendingTasks()
    {
	try
	{
	    return dao.ofy().query(Task.class).filter("is_complete", false)
		    .list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get the tasks which have been pending for particular number of days to
     * till date (mid night time). (For example tasks have been pending for 2
     * days or 3 days etc..)
     * 
     * @param numDays
     *            Number of days that the tasks have been pending
     * @return List of tasks that have been pending for particular number of
     *         days
     */
    public static List<Task> getPendingTasks(int numDays)
    {
	try
	{
	    // Get Today's date
	    DateUtil startDateUtil = new DateUtil();
	    Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

	    // Get Date after days days
	    DateUtil endDateUtil = new DateUtil();
	    Long endTime = endDateUtil.addDays(numDays + 1).toMidnight()
		    .getTime().getTime() / 1000;

	    System.out.println("check for " + startTime + " " + endTime);

	    // Get end start and endtime
	    return dao.ofy().query(Task.class).filter("due >=", startTime)
		    .filter("due <=", endTime).filter("is_complete", false)
		    .list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get the tasks which have been pending for particular number of days to
     * till date (mid night time) and having the same owner, to remind him/her
     * about the pending tasks.
     * 
     * @param numDays
     *            Number of days that the tasks have been pending
     * @param owner
     *            Owner key to get the pending tasks of a partucular owner
     * @return
     */
    public static List<Task> getPendingTasksToRemind(int numDays,
	    Key<AgileUser> owner)
    {
	try
	{
	    // Get Today's date
	    DateUtil startDateUtil = new DateUtil();
	    Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

	    // Get Date after days days
	    DateUtil endDateUtil = new DateUtil();
	    Long endTime = endDateUtil.addDays(numDays + 1).toMidnight()
		    .getTime().getTime() / 1000;

	    System.out.println("check for " + startTime + " " + endTime);

	    // Get end start and endtime
	    return dao.ofy().query(Task.class).filter("owner =", owner)
		    .filter("due >=", startTime).filter("due <=", endTime)
		    .filter("is_complete", false).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}
