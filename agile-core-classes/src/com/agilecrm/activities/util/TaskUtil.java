package com.agilecrm.activities.util;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.WordUtils;

import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
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

    // Gets the current user pending tasks
    public static List<Task> getPendingTasksForCurrentUser()
    {
	try
	{
	    return dao.ofy().query(Task.class)
		    .filter("owner", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		    .order("due").filter("is_complete", false).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    // Gets the all user pending tasks
    public static List<Task> getPendingTasksForAllUser()
    {
	try
	{
	    return dao.ofy().query(Task.class).order("due").filter("is_complete", false).list();
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

	List<String> default_tasks = getDefaultTaskNames();
	// Gets list of tasks filtered on given conditions
	List<Task> dueTasks = dao.ofy().query(Task.class)
		.filter("owner", new Key<DomainUser>(DomainUser.class, domainUserId)).filter("due >", startTime)
		.filter("due <=", endTime).filter("is_complete", false).list();

	List<Task> dueTaskList = new ArrayList<>();

	if (dueTasks.isEmpty())
	{
	    return dueTasks;
	}

	for (Task ts : dueTasks)
	{
	    if (!default_tasks.contains(ts.subject) && !ts.subject.contains("Tweet about Agile")
		    && !ts.subject.contains("Like Agile on Facebook"))
		dueTaskList.add(ts);
	}

	return dueTaskList;
    }

    public static List<Task> getTasksRelatedToCurrentUser()
    {
	return dao.ofy().query(Task.class)
		.filter("owner", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		.order("-created_time").list();
    }

    /**
     * Gets all the tasks based on owner and type.
     * 
     * @return List of tasks
     */
    public static List<Task> getTasksRelatedToOwnerOfType(String criteria, String type, String owner, boolean pending,
	    Integer max, String cursor)
    {
	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    Query<Task> query = dao.ofy().query(Task.class);

	    if (StringUtils.isNotBlank(criteria))
	    {
		if (criteria.equalsIgnoreCase("PRIORITY"))
		    searchMap.put("priority_type", type);
		if (criteria.equalsIgnoreCase("STATUS"))
		    searchMap.put("status", type);
		if (criteria.equalsIgnoreCase("CATEGORY"))
		    searchMap.put("type", type);
	    }
	    else if (StringUtils.isNotBlank(type))
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

    /**
     * * Returns Count of tasks related to a contact and of a particular type.
     * 
     * @param taskType
     *            - type of task
     * @param contactId
     *            - Id of the contact related to task.
     * @return Count of tasks related to a contact
     * @throws Exception
     */
    public static int getTaskCountForContact(String taskType, Long contactId) throws Exception
    {
	Query<Task> query = dao.ofy().query(Task.class)
		.filter("related_contacts =", new Key<Contact>(Contact.class, contactId));

	if (!StringUtils.isEmpty(taskType))
	    query.filter("type =", taskType);

	return query.count();
    }

    /**
     * * Returns tasks related to a contact and of a particular type, if not
     * type gives all.
     * 
     * @param taskType
     *            - type of task
     * @param contactId
     *            - Id of the contact related to task.
     * @return List of tasks related to a contact
     * @throws Exception
     */
    public static List<Task> getContactSortedTasks(String taskType, Long contactId) throws Exception
    {
	Query<Task> query = dao.ofy().query(Task.class)
		.filter("related_contacts =", new Key<Contact>(Contact.class, contactId)).order("due");

	if (!StringUtils.isEmpty(taskType))
	    query.filter("type =", taskType);

	return query.list();
    }

    /************************ New task view methods ******************************/
    /**
     * Gets count of tasks based on type of category.
     * 
     * @return JSON object of count and type
     */
    public static String getCountOfTasksCategoryType(String criteria, String type, String owner, boolean pending)
    {
	JSONObject countAndType = new JSONObject();

	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    Query<Task> query = dao.ofy().query(Task.class);

	    if (StringUtils.isNotBlank(owner))
		searchMap.put("owner", new Key<DomainUser>(DomainUser.class, Long.parseLong(owner)));

	    if (pending)
		searchMap.put("is_complete", !pending);

	    if (StringUtils.isNotBlank(type))
		searchMap.put("type", type);

	    countAndType.put("type", type);
	    countAndType.put("count", dao.getCountByProperty(searchMap));

	    System.out.println("countAndType : " + countAndType.toString());

	    return countAndType.toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets all the tasks based on due, owner and type.
     * 
     * @return List of tasks
     */
    public static List<Task> getTasksRelatedToOwnerOfTypeAndDue(String criteria, String type, String owner,
	    boolean pending, Integer max, String cursor, Long startTime, Long endTime)
    {
	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    Query<Task> query = dao.ofy().query(Task.class);

	    System.out.println(criteria + " " + type);
	    System.out.println("startTime: " + startTime);
	    System.out.println("endTime: " + endTime);

	    if (type.equalsIgnoreCase("OVERDUE"))
	    {
		searchMap.put("due <", startTime);
	    }
	    else if (type.equalsIgnoreCase("TODAY"))
	    {
		searchMap.put("due >=", startTime);
		searchMap.put("due <", endTime);
	    }
	    else if (type.equalsIgnoreCase("TOMORROW"))
	    {
		searchMap.put("due >=", endTime);
		searchMap.put("due <", endTime + 86400);
	    }
	    else if (type.equalsIgnoreCase("LATER"))
	    {
		searchMap.put("due >=", endTime + 86400);
	    }

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
     * Gets all the tasks based on owner and type.
     * 
     * @return List of tasks
     */
    public static List<Task> getTasksRelatedToOwnerOfTypeAndCategory(String criteria, String type, String owner,
	    boolean pending, Integer max, String cursor)
    {
	System.out.println(criteria + " " + type + " " + owner);

	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    Query<Task> query = dao.ofy().query(Task.class);

	    if (StringUtils.isNotBlank(owner))
		searchMap.put("owner", new Key<DomainUser>(DomainUser.class, Long.parseLong(owner)));

	    if (pending)
		searchMap.put("is_complete", !pending);

	    if (StringUtils.isNotBlank(criteria))
	    {
		if (criteria.equalsIgnoreCase("PRIORITY"))
		    searchMap.put("priority_type", type);
		if (criteria.equalsIgnoreCase("STATUS"))
		{
		    searchMap.put("status", type);

		    if (type.equalsIgnoreCase("COMPLETED"))
			searchMap.put("is_complete", true);
		    else if (type.equalsIgnoreCase("YET_TO_START"))
			searchMap.put("is_complete", false);
		}

		if (criteria.equalsIgnoreCase("CATEGORY"))
		    searchMap.put("type", type);
	    }
	    else if (StringUtils.isNotBlank(type))
		searchMap.put("type", type);

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
     * Gets the list of tasks which have been pending for Today
     * 
     * @return List of tasks that have been pending for Today
     */
    public static List<Task> getTodayPendingTasks(Long startTime, Long endTime, String duration)
    {
	try
	{
	    // Gets Today's date
	    /*
	     * DateUtil startDateUtil = new DateUtil(); Long startTime =
	     * startDateUtil.toMidnight().getTime().getTime() / 1000;
	     */
	    // Date startDate = new Date();
	    // Long startTime = startDate.getTime() / 1000;

	    // Gets Date after numDays days
	    /*
	     * DateUtil endDateUtil = new DateUtil(); Long endTime =
	     * (endDateUtil.addDays(1).toMidnight().getTime().getTime() / 1000)
	     * - 1;
	     */

	    DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();

	    // Gets list of tasks filtered on given conditions
	    if (duration != null && duration.equalsIgnoreCase("all-over-due"))
		return dao.ofy().query(Task.class)
			.filter("owner", new Key<DomainUser>(DomainUser.class, domainUser.id)).filter("due <", endTime)
			.filter("is_complete", false).limit(50).list();
	    else
		return dao.ofy().query(Task.class)
			.filter("owner", new Key<DomainUser>(DomainUser.class, domainUser.id))
			.filter("due >=", startTime).filter("due <", endTime).filter("is_complete", false).limit(50)
			.list();

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Gets the current user pending tasks upto today midnight
     * 
     * @return due tasks count upto today
     */
    public static int getOverDueTasksUptoTodayForCurrentUser()
    {
	try
	{

	    DateUtil due_date_util = new DateUtil();
	    Long due_time = (due_date_util.getTime().getTime() / 1000) - 1;
	    int count = dao.ofy().query(Task.class)
		    .filter("owner", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId()))
		    .filter("due <", due_time).filter("is_complete", false).count();
	    return count;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return 0;
	}
    }

    /**
     * This method returns all the tasks which are incomplete for a given
     * contact and an owner
     * 
     * @param domainUserOwnerKey
     *            Domain user key which is the owner of the task
     * @param contactKey
     *            Contact key which has the incomplete task
     * @return List of incomplete tasks
     * 
     * @author Kona
     */
    public static List<Task> getIncompleteTasks(Key<DomainUser> domainUserOwnerKey, Key<Contact> contactKey)
    {
	Map<String, Object> searchMap = new HashMap<String, Object>();

	if (domainUserOwnerKey != null)
	    searchMap.put("owner", domainUserOwnerKey);

	if (contactKey != null)
	    searchMap.put("related_contacts", contactKey);

	searchMap.put("is_complete", false);
	try
	{
	    System.out
		    .println("The domain user key is:" + domainUserOwnerKey + " and the contact key is:" + contactKey);
	    return dao.listByProperty(searchMap);
	}
	catch (Exception e)
	{
	    System.out.println("Inside getIncompleteTask of TaskUtil and the message is: " + e.getMessage());
	}

	return new ArrayList<Task>();
    }

    /**
     * Returns a list of tasks as completed.
     * 
     * @param tasks
     *            List of tasks whose status has to be marked as completed
     * @return List of tasks which are completed
     * 
     * @author Kona
     */
    public static List<Task> setStatusAsComplete(List<Task> tasks)
    {
	try
	{
	    Iterator<Task> taskIterator = tasks.iterator();

	    while (taskIterator.hasNext())
	    {
		Task currenttask = taskIterator.next();

		if (!currenttask.is_complete)
		    currenttask.is_complete = true;
	    }

	    dao.putAll(tasks);

	    return tasks;
	}
	catch (Exception e)
	{
	    System.out.println(" Exception in setStatusAsComplete of TaskUtil.java and the message is: "
		    + e.getMessage());
	    return tasks;
	}
    }

    /**
     * 
     * @return defaults task names as a list to stop due task mails
     */
    public static List<String> getDefaultTaskNames()
    {
	List<String> default_task = new ArrayList<>();
	default_task.add("Give feedback about Agile");
	default_task.add("Call Grandmother");
	default_task.add("Meet Homer to finalize the Deal (Bring Donuts!)");
	default_task
		.add("<a href=\"https://twitter.com/share?url=https%3A%2F%2Fwww.agilecrm.com&amp;text=Sell%20like%20Fortune%20500%20with%20%23AgileCRM%20-%20\" target=\"_blank\"rel=\"nofollow\" title=\"Link: https://twitter.com/share?url=https%3A%2F%2Fwww.agilecrm.com&amp;text=Sell%20like%20Fortune%20500%20with%20%23AgileCRM%20-%20\">Tweet about Agile</a>");
	default_task
		.add("<a href=\"https://www.facebook.com/crmagile\" target=\"_blank\" rel=\"nofollow\" title=\"Link: https://www.facebook.com/crmagile\">Like Agile on Facebook</a>");
	return default_task;
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
     * 
     *            * @param timezone timezone to initialize dateUtil in that
     *            particular timezone
     * 
     * @return List of tasks that have been pending for particular number of
     *         days and related to the same owner
     */
    public static List<Task> getPendingTasksToRemind(int numDays, Long domainUserId, String timezone)
    {
	// Gets Today's date
	DateUtil startDateUtil = new DateUtil().toTZ(timezone);
	Long startTime = startDateUtil.toMidnight().getTime().getTime() / 1000;

	// Gets Date after numDays days
	DateUtil endDateUtil = new DateUtil().toTZ(timezone);
	Long endTime = endDateUtil.addDays(numDays).toMidnight().getTime().getTime() / 1000;

	System.out.println("check for " + startTime + " " + endTime);

	List<String> default_tasks = getDefaultTaskNames();
	// Gets list of tasks filtered on given conditions
	List<Task> dueTasks = dao.ofy().query(Task.class)
		.filter("owner", new Key<DomainUser>(DomainUser.class, domainUserId)).filter("due >", startTime)
		.filter("due <=", endTime).filter("is_complete", false).list();

	List<Task> dueTaskList = new ArrayList<>();

	if (dueTasks.isEmpty())
	{
	    return dueTasks;
	}

	for (Task ts : dueTasks)
	{
	    if (!default_tasks.contains(ts.subject) && !ts.subject.contains("Tweet about Agile")
		    && !ts.subject.contains("Like Agile on Facebook"))
		dueTaskList.add(ts);
	}

	return dueTaskList;
    }

    /***************************************************************************/

    /**
     * Gets all the tasks based on owner and type.
     * 
     * @return List of tasks
     */
    public static List<Task> getTasksRelatesToOwnerOfTypeAndCategory(Long owner, String category, String status,
	    Long startTime, Long endTime, String tasks, List<Key<DomainUser>> usersKeyList)
    {
	List<Task> tasksList1 = new ArrayList<Task>();
	List<Task> tasksList2 = new ArrayList<Task>();
	try
	{
	    Map<String, Object> searchMap1 = new HashMap<String, Object>();
	    Map<String, Object> searchMap2 = new HashMap<String, Object>();
	    if (owner != null)
	    {
		searchMap1.put("owner", new Key<DomainUser>(DomainUser.class, owner));
		searchMap2.put("owner", new Key<DomainUser>(DomainUser.class, owner));
	    }

	    if (StringUtils.isNotBlank(category))
	    {
		searchMap1.put("type", category);
		searchMap2.put("type", category);
	    }

	    if (StringUtils.isNotBlank(status))
	    {
		searchMap1.put("status", status);
		searchMap2.put("status", status);
	    }

	    if (startTime != null)
	    {
		if (tasks.equalsIgnoreCase("all-tasks"))
		{
		    searchMap1.put("due >=", startTime);
		    searchMap2.put("task_completed_time >=", startTime);
		}
		else
		    searchMap1.put("task_completed_time >=", startTime);
	    }
	    if (endTime != null)
	    {
		if (tasks.equalsIgnoreCase("all-tasks"))
		{
		    searchMap1.put("due <", endTime);
		    searchMap2.put("task_completed_time <", endTime);
		}
		else
		    searchMap1.put("task_completed_time <", endTime);
	    }

	    if (usersKeyList != null)
	    {
		searchMap1.put("owner in", usersKeyList);
		searchMap2.put("owner in", usersKeyList);
	    }

	    tasksList1 = dao.listByProperty(searchMap1);
	    if (tasks.equalsIgnoreCase("all-tasks"))
	    {
		HashSet<Long> hashSet = new HashSet<Long>();
		tasksList2 = dao.listByProperty(searchMap2);
		for (Task task : tasksList1)
		{
		    hashSet.add(task.id);
		}
		for (Task task : tasksList2)
		{
		    if (!hashSet.contains(task.id))
		    {
			tasksList1.add(task);
			hashSet.add(task.id);
		    }
		}
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
	return tasksList1;
    }

    /**
     * Gets the count of completed tasks of a user
     * 
     * @return List of tasks that have been pending for Today
     */
    public static int getCompletedTasksOfUser(Long startTime, Long endTime, Long ownerId)
    {
	try
	{
	    return dao.ofy().query(Task.class).filter("owner", new Key<DomainUser>(DomainUser.class, ownerId))
		    .filter("task_completed_time >=", startTime).filter("task_completed_time <", endTime)
		    .filter("is_complete", true).count();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return 0;
	}
    }

    public static List<Task> getNewTasks(Integer max, String cursor)
    {
	try
	{
	    return dao.ofy().query(Task.class).order("-created_time").filter("is_complete", false).limit(5).list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
    
    /**
	 * * Returns tasks related to a deal and of a particular type, if not
	 * type gives all.
	 * 
	 * @param taskType
	 *            - type of task
	 * @param dealId
	 *            - Id of the deal related to task.
	 * @return List of tasks related to a deal
	 * @throws Exception
	 */
	public static List<Task> getDealSortedTasks(String taskType, Long dealId) throws Exception
	{
		Query<Task> query = dao.ofy().query(Task.class)
				.filter("related_deals =", new Key<Opportunity>(Opportunity.class, dealId)).order("due");

		if (!StringUtils.isEmpty(taskType))
			query.filter("type =", taskType);

		return query.list();
	}
	
}
