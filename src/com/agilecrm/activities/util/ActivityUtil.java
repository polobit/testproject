package com.agilecrm.activities.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.Activity.EntityType;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.Task;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.Workflow;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Query;

/**
 * <code>ActivityUtil</code> is a utility class to process the data of activity
 * class, it processes when fetching the data and saving the activity to
 * activity database.
 * <p>
 * This utility class includes methods needs to return activities based on user,
 * entoty_id, entity_type and activity_type.
 * </p>
 * 
 * @author
 * 
 */
public class ActivityUtil
{
    // Dao
    private static ObjectifyGenericDao<Activity> dao = new ObjectifyGenericDao<Activity>(Activity.class);

    /**
     * To save save the contact activity.
     * 
     * @param activity_type
     *            the type of the activity performed on the Contact (ADD, EDIT
     *            etc..)
     * @param contact
     *            the contact object on which the activity is performed.
     * @param data
     *            extra information about the activity like Tag name when a tag
     *            is added. null if nothing.
     */
    public static Activity createContactActivity(ActivityType activity_type, Contact contact, String data)
    {
	Activity activity = new Activity();
	activity.label = contact.getContactFieldByName("first_name").value + " "
		+ contact.getContactFieldByName("last_name").value;
	activity.activity_type = activity_type;
	activity.entity_type = EntityType.CONTACT;
	activity.entity_id = contact.id;

	if (StringUtils.isNotEmpty(data))
	    activity.custom1 = data;

	activity.save();
	return activity;
    }

    /**
     * To save the task activity.
     * 
     * @param activity_type
     *            the type of the activity performed on the Contact (ADD, EDIT
     *            etc..)
     * @param task
     *            the task object on which the activity is performed.
     * @param data
     *            the extra information of the activity like the progress when
     *            ever user changed the progress. null if nothing.
     */
    public static Activity createTaskActivity(ActivityType activity_type, Task task, String data)
    {
	Activity activity = new Activity();
	activity.label = task.subject;
	activity.activity_type = activity_type;
	activity.entity_type = EntityType.TASK;
	activity.entity_id = task.id;

	// If user changed the progress, save it.
	if (activity_type == ActivityType.PROGRESS)
	    activity.custom1 = String.valueOf(task.is_complete);

	if (StringUtils.isNotEmpty(data))
	    activity.custom1 = data;

	activity.save();
	return activity;
    }

    /**
     * To save the event activity.
     * 
     * @param activity_type
     *            the type of the activity performed on the Contact (ADD, EDIT
     *            etc..)
     * @param event
     *            the event object on which the activity is performed.
     * @param data
     *            the extra information about the activity performed on the
     *            event. null if nothing.
     */
    public static Activity createEventActivity(ActivityType activity_type, Event event, String data)
    {
	Activity activity = new Activity();
	activity.label = event.title;
	activity.activity_type = activity_type;
	activity.entity_type = EntityType.EVENT;
	activity.entity_id = event.id;

	if (StringUtils.isNotEmpty(data))
	    activity.custom1 = data;

	activity.save();
	return activity;
    }

    /**
     * To save the deal activity.
     * 
     * @param activity_type
     *            the type of the activity performed on the Contact (ADD, EDIT
     *            etc..)
     * @param deal
     *            the deal object on which the activity is performed.
     * @param data
     *            the extra information about the activity like the new
     *            milestone name when the user change the milestone. null if
     *            nothing.
     */
    public static Activity createDealActivity(ActivityType activity_type, Opportunity deal, String data)
    {
	Activity activity = new Activity();
	activity.label = deal.name;
	activity.activity_type = activity_type;
	activity.entity_type = EntityType.DEAL;
	activity.entity_id = deal.id;

	// save the new milestone, if user changed the milestone.
	if (activity_type == ActivityType.MILESTONE)
	    activity.custom1 = deal.milestone;

	if (StringUtils.isNotEmpty(data))
	    activity.custom1 = data;

	activity.save();
	return activity;
    }

    /**
     * To save campaign activity. This will include the email clicks also.
     * 
     * @param activity_type
     *            the type of the activity performed on the Contact (ADD, EDIT
     *            etc..)
     * @param workflow
     *            the campaign object on which the activity is performed.
     * @param data
     *            the extra information of the activity like the email subject
     *            when ever the email sent out. null if nothing.
     */
    public static Activity createCampaignActivity(ActivityType activity_type, Workflow workflow, String data)
    {
	Activity activity = new Activity();
	activity.label = workflow.name;
	activity.activity_type = activity_type;
	activity.entity_type = EntityType.CAMPAIGN;
	activity.entity_id = workflow.id;

	if (StringUtils.isNotEmpty(data))
	    activity.custom1 = data;

	activity.save();
	return activity;
    }

    /**
     * Fetches all the activities with out any filtering
     * 
     * @param max
     *            maximum number of the activities to retrieve.
     * @param cursor
     *            for paging.
     * @return all the activities.
     */
    public static List<Activity> getActivities(int max, String cursor)
    {
	try
	{
	    return dao.fetchAll(max, cursor);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get all the activities of the currently logged in user.
     * 
     * @param max
     *            maximum number of the activities to retrieve.
     * @param cursor
     *            for paging.
     * @return the list of the activities.
     */
    public static List<Activity> getActivitiesOfCurrentUser(Integer max, String cursor)
    {
	try
	{
	    Query<Activity> query = dao.ofy().query(Activity.class);
	    query.filter("user", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId())).order(
		    "time");
	    if (max != null && max > 0)
		dao.fetchAll(max, cursor);

	    return query.list();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Fetch list of activities based on the given filters sorted on the time of
     * activity.
     * 
     * @param user_id
     *            the id of the user who performed the activity.
     * @param entity_type
     *            the type of the entity.
     * @param activity_type
     *            activity type.
     * @param entity_id
     *            the id of the entity on which the activity is performed.
     * @param max
     *            maximum number of the activities to retrieve.
     * @param cursor
     *            starting cursor for paging.
     * @return the list of activities based on the given filter.
     */
    public static List<Activity> getActivitiesByFilter(Long user_id, String entity_type, String activity_type,
	    Long entity_id, Integer max, String cursor)
    {
	try
	{
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    Query<Activity> query = dao.ofy().query(Activity.class);
	    if (!StringUtils.isEmpty(entity_type))
		searchMap.put("entity_type", entity_type);
	    if (!StringUtils.isEmpty(activity_type))
		searchMap.put("activity_type", activity_type);
	    if (user_id != null)
		searchMap.put("user", new Key<DomainUser>(DomainUser.class, user_id));

	    if (entity_id != null)
		searchMap.put("entity_id", entity_id);

	    query.filter("user", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId())).order(
		    "time");
	    if (max != null && max > 0)
		dao.fetchAllByOrder(max, cursor, searchMap, true, false, "time");

	    return dao.listByProperty(searchMap);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}
