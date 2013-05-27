package com.agilecrm.activities.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.util.DateUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

/**
 * <code>TaskUtil</code> is utility class used to process data of {@link Task}
 * class, It processes only when fetching the data from <code>Task<code> class
 * <p>
 * This utility class includes methods needed to return all tasks (based on status)
 * and related  to any particular contact.
 * 
 * </p>
 * 
 * @author Rammohan
 * 
 */
public class TaskUtil
{
    // Dao
    private static ObjectifyGenericDao<Task> dao = new ObjectifyGenericDao<Task>(
	    Task.class);

    /**
     * Returns a Task based on Id. If no task is present with that id, returns
     * null.
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
     * Gets tasks related to a particular contact
     * 
     * @param contactId
     *            contact id to get the tasks related to a contact
     * @return List of tasks related to a contact
     * @throws Exception
     */
    public static List<Task> getContactTasks(Long contactId) throws Exception
    {
	Key<Contact> contactKey = new Key<Contact>(Contact.class, contactId);
	return dao.listByProperty("related_contacts = ", contactKey);
    }

    /**
     * Gets list of tasks whose due date is less than current date (mid night
     * time) and which are not completed.
     * 
     * @return List of overdue tasks
     */
    public static List<Task> getOverdueTasks()
    {
	try
	{
	    // Gets Today's date
	    DateUtil startDateUtil = new DateUtil();
	    Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

	    System.out.println("check for " + startTime);

	    Map<String, Object> conditionsMap = new HashMap<String, Object>();
	    conditionsMap.put("due <=", startTime);
	    conditionsMap.put("is_complete", false);

	    // Get tasks before today's time and which are not completed
	    return dao.listByProperty(conditionsMap);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all the tasks irrespective of their state of completion
     * 
     * @return List of all tasks
     */
    public static List<Task> getAllTasks()
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
     * Gets all the tasks which are not completed (includes overdue tasks).
     * 
     * @return List of pending tasks
     */
    public static List<Task> getAllPendingTasks()
    {
	try
	{
	    return dao.listByProperty("is_complete", false);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets the list of tasks which have been pending for particular number of
     * days to till date (mid night time), but due date is not approached. (For
     * example tasks have been pending for 2 days or 3 days etc..)
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
	    // Gets Today's date
	    DateUtil startDateUtil = new DateUtil();
	    Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

	    // Gets Date after numDays days
	    DateUtil endDateUtil = new DateUtil();
	    Long endTime = endDateUtil.addDays(numDays + 1).toMidnight()
		    .getTime().getTime() / 1000;

	    System.out.println("check for " + startTime + " " + endTime);

	    // Gets list of tasks filtered on given conditions
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
     * Gets the list of tasks which have been pending for particular number of
     * days to till date (mid night time) and having the same owner, to remind
     * the owner (user) about the pending tasks.
     * 
     * @param numDays
     *            Number of days that the tasks have been pending
     * @param owner
     *            Owner key to get the pending tasks of a particular owner
     * @return List of tasks that have been pending for particular number of
     *         days and related to the same owner
     */
    public static List<Task> getPendingTasksToRemind(int numDays,
	    Key<AgileUser> owner)
    {
	// Gets Today's date
	DateUtil startDateUtil = new DateUtil();
	Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

	// Gets Date after numDays days
	DateUtil endDateUtil = new DateUtil();
	Long endTime = endDateUtil.addDays(numDays).toMidnight().getTime()
		.getTime() / 1000;

	System.out.println("check for " + startTime + " " + endTime);

	// Gets list of tasks filtered on given conditions
	List<Task> tasks = dao.ofy().query(Task.class)
		.filter("due >", startTime).filter("due <=", endTime)
		.filter("is_complete", false).list();

	System.out.println("Due tasks: " + tasks);

	if (tasks.isEmpty())
	    return tasks;

	List<Task> dueTasksList = new ArrayList<Task>();

	for (Task task : tasks)
	{
	    if (task == null)
		continue;

	    // Compare task owner with current owner.
	    boolean value = task.compareTaskOwner(owner);

	    if (value)
		dueTasksList.add(task);
	}

	return dueTasksList;
    }

    public static List<Task> getTasksRelatedToCurrentUser()
    {
	return dao
		.ofy()
		.query(Task.class)
		.filter("owner",
			new Key<DomainUser>(DomainUser.class, SessionManager
				.get().getDomainId())).order("-created_time")
		.limit(10).list();
    }

    /**
     * Gets all the tasks based on owner and type.
     * 
     * @return List of tasks
     */
    public static List<Task> getTasksRelatedToOwnerOfType(String type,
	    String owner)
    {
	try
	{
	    Query<Task> query = dao.ofy().query(Task.class);
	    if (StringUtils.isNotBlank(type))
		query = query.filter("type", type);

	    if (StringUtils.isNotBlank(owner))
		query = query.filter("owner", new Key<DomainUser>(
			DomainUser.class, Long.parseLong(owner)));

	    return query.list();

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Completes tasks by Ids
     * 
     * @param ids
     */
    public static void completeBulkTasks(List<Task> tasks)
    {
	// Add keys
	for (Task task : tasks)
	{
	    task.is_complete = true;
	}

	// Updates all
	Task.dao.putAll(tasks);
    }
}
