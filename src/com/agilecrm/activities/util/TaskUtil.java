package com.agilecrm.activities.util;

import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.WordUtils;
import org.json.JSONObject;

import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
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
    private static ObjectifyGenericDao<Task> dao = new ObjectifyGenericDao<Task>(Task.class);

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
	    return dao.ofy().query(Task.class)
		    .filter("owner", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		    .order("due").filter("is_complete", false).limit(50).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Gets the current user pending tasks maximum 7 only
    public static List<Task> getAllPendingTasksForCurrentUser()
    {
	try
	{

	    /*
	     * Date date=new Date();
	     * 
	     * int thisWeekDate = (7-date.getDay());
	     * System.out.println("all pending tasks this week="+thisWeekDate);
	     */
	    return dao.ofy().query(Task.class)
		    .filter("owner", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		    .order("due").filter("is_complete", false).limit(7).list();
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
	    Long endTime = endDateUtil.addDays(numDays + 1).toMidnight().getTime().getTime() / 1000;

	    System.out.println("check for " + startTime + " " + endTime);

	    // Gets list of tasks filtered on given conditions
	    return dao.ofy().query(Task.class).filter("due >=", startTime).filter("due <=", endTime)
		    .filter("is_complete", false).list();
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
    public static List<Task> getPendingTasksToRemind(int numDays, Long domainUserId)
    {
	// Gets Today's date
	DateUtil startDateUtil = new DateUtil();
	Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

	// Gets Date after numDays days
	DateUtil endDateUtil = new DateUtil();
	Long endTime = endDateUtil.addDays(numDays).toMidnight().getTime().getTime() / 1000;

	System.out.println("check for " + startTime + " " + endTime);

	// Gets list of tasks filtered on given conditions
	List<Task> dueTasks = dao.ofy().query(Task.class)
		.filter("owner", new Key<DomainUser>(DomainUser.class, domainUserId)).filter("due >", startTime)
		.filter("due <=", endTime).filter("is_complete", false).list();

	return dueTasks;
    }

    public static List<Task> getTasksRelatedToCurrentUser()
    {
	return dao.ofy().query(Task.class)
		.filter("owner", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		.order("-created_time").limit(10).list();
    }

    /**
     * Gets all the tasks based on owner and type.
     * 
     * @return List of tasks
     */
    public static List<Task> getTasksRelatedToOwnerOfType(String type, String owner, boolean pending, Integer max,
	    String cursor)
    {
	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    Query<Task> query = dao.ofy().query(Task.class);
	    if (StringUtils.isNotBlank(type))
		searchMap.put("type", type);

	    if (StringUtils.isNotBlank(owner))
		searchMap.put("owner", new Key<DomainUser>(DomainUser.class, Long.parseLong(owner)));

	    if (pending)
		searchMap.put("is_complete", !pending);
	    if (max != null)
		return dao.fetchAllByOrder(max, cursor, searchMap, true, false, "due");

	    return dao.listByProperty(searchMap);

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

    /**
     * * Returns Count of tasks of a owner of a particular type, if owner is
     * null returns count of all tasks of the type
     * 
     * @param taskType
     *            - type of task
     * @param owner
     *            - owner of task, null to get all of the type
     */
    public static int getTaskCount(Task.Type taskType, String owner)
    {
	Query<Task> query = dao.ofy().query(Task.class).filter("type =", taskType);

	if (StringUtils.isEmpty(owner))
	    return query.count();

	return query.filter("owner =", new Key<DomainUser>(DomainUser.class, Long.valueOf(owner))).count();
    }

    /**
     * Returns JSON representation of stats of task types,<br/>
     * "Meeting":42,"FollowUp":90,...
     * 
     * @param owner
     *            - owner of the tasks, can be null for getting overall stats
     * @return - the JSON object representing the stats
     */
    public static JSONObject getStats(String owner)
    {
	JSONObject stats = new JSONObject();

	try
	{
	    for (Task.Type type : EnumSet.allOf(Task.Type.class))
	    {
		stats.put(WordUtils.capitalizeFully(type.toString().replace('_', ' ')), getTaskCount(type, owner));
		// Reformat type for front-end.
		// e.g. MEETING -> Meeting, FOLLOW_UP -> Follow Up
	    }

	    return stats;
	}
	catch (Exception e)
	{
	    return null;
	}
    }
}
