package com.agilecrm.reports;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.reports.ActivityReports.ActivityType;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.email.MustacheUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

import edu.emory.mathcs.backport.java.util.Arrays;

public class ActivityReportsUtil
{
    public static ObjectifyGenericDao<ActivityReports> dao = new ObjectifyGenericDao<ActivityReports>(
	    ActivityReports.class);

    /**
     * Get the activity reports of a user.
     * 
     * @param userId
     *            id of the user.
     * @return List of Keys of activity reports.
     */
    public static List<Key<ActivityReports>> getAllActivityReports(Long userId)
    {
	return dao.listKeysByProperty("user", new Key<DomainUser>(DomainUser.class, userId));
    }

    /**
     * Fetches all the available activity reports
     * 
     * @return List of activity reports.
     */
    public static List<ActivityReports> fetchAllReports()
    {
	return dao.fetchAll();
    }

    /**
     * Get report based on given Id
     * 
     * @param id
     *            id of the activity report.
     * @return Activity report.
     */
    public static ActivityReports getActivityReport(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (EntityNotFoundException e)
	{
	    System.out.println("Exception in getting activity report." + e.getMessage());
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Get the list of all the Activity reports of the particular frequency.
     * 
     * @param frequency
     *            frequency of the activity reports.
     * @return List of keys of activity reports.
     */
    public static List<Key<ActivityReports>> getAllReportKeysByDuration(String frequency)
    {
	System.out.println("fetching the reports - " + frequency);
	return dao.listKeysByProperty("duration", frequency);
    }

    /**
     * Generate the data required to show in the activity report.
     * 
     * @param id
     *            id of the activity report.
     * @param endTime
     *            lower bound for the time to get the activities.
     * @return Data to show in the Activity report.
     */
    @SuppressWarnings("unchecked")
    public static Map<String, Object> generateActivityReports(Long id, Long endTime)
    {
	ActivityReports report = getActivityReport(id);
	System.out.println(report.toString());
	List<ActivityType> activities = report.activity;
	Map<String, Object> activityReports = new HashMap<String, Object>();

	try
	{
	    List<DomainUser> users = report.getUsersList();
	    // Calculate the time bounds for the activities depending on the
	    // frequency.
	    Map<String, Long> timeBounds = getTimeBound(report);
	    System.out.println("time intervals - " + timeBounds.toString());
	    // If user mentioned any the upper time bound (end time).
	    if (endTime != null)
		timeBounds.put("endTime", endTime);

	    // Format for dates in the report.
	    String format = "EEE, MMM d, yyyy HH:mm z";

	    // Fill the map object with the required data.
	    activityReports.put("start_time", MustacheUtil.convertDate(format, timeBounds.get("startTime")));
	    activityReports.put("end_time", MustacheUtil.convertDate(format, timeBounds.get("endTime")));
	    activityReports.put("report_name", report.name);

	    List<Map<String, Object>> userReport = new ArrayList<Map<String, Object>>();
	    // For every user selected in the activity report.
	    for (DomainUser user : users)
	    {
		Map<String, Object> activityReport = new HashMap<String, Object>();
		activityReport.put("user_id", user.id);
		activityReport.put("user_name", user.name);
		activityReports.put("domain", user.domain);
		activityReport.put("pic",
			UserPrefsUtil.getUserPrefs(AgileUser.getCurrentAgileUserFromDomainUser(user.id)).pic);
		int count = 0;
		// Check for the entities/activities selected by the user for
		// activity report.
		if (activities.contains(ActivityReports.ActivityType.DEAL))
		{
		    activityReport.put("deals",
			    getDealActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
		    count += getTotalCount((Map<String, Object>) activityReport.get("deals"), "deals_total");
		}
		if (activities.contains(ActivityReports.ActivityType.EVENT))
		{
		    activityReport.put("events",
			    getEventActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
		    count += getTotalCount((Map<String, Object>) activityReport.get("events"), "events_total");
		}
		if (activities.contains(ActivityReports.ActivityType.TASK))
		{
		    activityReport.put("tasks",
			    getTaskActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
		    count += getTotalCount((Map<String, Object>) activityReport.get("tasks"), "tasks_total");
		}
		if (activities.contains(ActivityReports.ActivityType.EMAIL))
		{
		    activityReport.put("emails",
			    getEmailActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
		    count += getTotalCount((Map<String, Object>) activityReport.get("emails"), "emails_count");
		}
		if (activities.contains(ActivityReports.ActivityType.NOTES))
		{
		    activityReport.put("notes",
			    getNotesActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
		    count += getTotalCount((Map<String, Object>) activityReport.get("notes"), "notes_contacts_count");
		}
		if (activities.contains(ActivityReports.ActivityType.DOCUMENTS))
		{
		    activityReport.put("docs",
			    getDocumentsActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
		    count += getTotalCount((Map<String, Object>) activityReport.get("docs"), "doc_count");
		}
		if (count > 0)
		    activityReport.put("total", count);
		userReport.add(activityReport);
	    }
	    activityReports.put("reports", userReport);
	}
	catch (Exception je)
	{
	    je.printStackTrace();
	    System.out.println("Exception occured in generating reports. " + je.getMessage());
	}
	return activityReports;
    }

    /**
     * Get the report of the deals.
     * 
     * @param user
     *            by whom the activities are performed.
     * @param startTime
     *            the lower bound of the time(start time) for getting activities
     *            (Activities after this time).
     * @param endTime
     *            the upper bound of the time(end time) for getting activities
     *            (Activities before this time).
     * @return the report on the deals.
     */
    public static Map<String, Object> getDealActivityReport(DomainUser user, Long startTime, Long endTime)
    {

	// Local variable declaration.
	List<Key<Opportunity>> dealWon = new ArrayList<Key<Opportunity>>();
	List<Key<Opportunity>> dealLost = new ArrayList<Key<Opportunity>>();
	List<Key<Opportunity>> dealUpdated = new ArrayList<Key<Opportunity>>();
	List<Key<Opportunity>> dealCreated = new ArrayList<Key<Opportunity>>();
	List<Key<Opportunity>> mileChange = new ArrayList<Key<Opportunity>>();

	Map<Long, Activity> wonActivities = new HashMap<Long, Activity>();
	Map<Long, Activity> lostActivities = new HashMap<Long, Activity>();
	Map<Long, Activity> newDealActivities = new HashMap<Long, Activity>();
	Map<Long, Activity> mileChangeActivities = new HashMap<Long, Activity>();

	// Get all the activities of the user on deals. Instead of getting by
	// activity type. This will reduce the DB calls.
	List<Activity> activities = ActivityUtil.getActivitiesByFilter(user.id, Activity.EntityType.DEAL.toString(),
		null, null, startTime, endTime, 0, null);

	UserPrefs pref = UserPrefsUtil.getUserPrefs(AgileUser.getCurrentAgileUserFromDomainUser(user.id));

	// Separate the activities based on the activity type.
	for (Activity act : activities)
	{
	    if (act.activity_type == Activity.ActivityType.DEAL_LOST)
	    {
		dealLost.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
		act.related_contact_ids = getActivityRelateContacts(act, user.domain, " related to ");
		lostActivities.put(act.entity_id, act);
	    }
	    else if (act.activity_type == Activity.ActivityType.DEAL_CLOSE)
	    {
		dealWon.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
		act.related_contact_ids = getActivityRelateContacts(act, user.domain, " related to ");
		wonActivities.put(act.entity_id, act);
	    }
	    else if (act.activity_type == Activity.ActivityType.DEAL_MILESTONE_CHANGE)
	    {
		mileChange.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
		act.related_contact_ids = getActivityRelateContacts(act, user.domain, " related to ");
		mileChangeActivities.put(act.entity_id, act);
	    }
	    else
		dealUpdated.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
	}

	// Get the deals assigned to this user (Can be assigned by the other
	// users also.)
	List<String> activityTypeList = new ArrayList<String>();
	activityTypeList.add(Activity.ActivityType.DEAL_ADD.toString());
	activityTypeList.add(Activity.ActivityType.DEAL_OWNER_CHANGE.toString());

	activities = dao.ofy().query(Activity.class).filter("entity_type = ", Activity.EntityType.DEAL.toString())
		.filter("activity_type in ", activityTypeList).filter("time >= ", startTime)
		.filter("time <= ", endTime).list();

	for (Activity act : activities)
	{
	    if (act.custom1.equals(user.name))
	    {
		act.related_contact_ids = getActivityRelateContacts(act, user.domain, " related to ");
		dealCreated.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
		newDealActivities.put(act.entity_id, act);
	    }
	}

	// Local variable declaration.
	List<Opportunity> dealsWon = Opportunity.dao.fetchAllByKeys(dealWon);
	List<Opportunity> dealsLost = Opportunity.dao.fetchAllByKeys(dealLost);
	List<Opportunity> dealsCreated = Opportunity.dao.fetchAllByKeys(dealCreated);
	List<Opportunity> dealsUpdated = Opportunity.dao.fetchAllByKeys(dealUpdated);
	List<Opportunity> dealsMileChange = Opportunity.dao.fetchAllByKeys(mileChange);

	int wonCount = 0;
	int lostCount = 0;
	int newCount = 0;
	int mileCount = 0;
	double wonValue = 0;
	double lostValue = 0;
	double newValue = 0;
	double mileValue = 0;
	String currency = pref.currency != null ? pref.currency.substring(pref.currency.indexOf("-") + 1) : "$";

	// Fill the map object with required data to show in the report.
	Map<String, Object> dealsReport = new HashMap<String, Object>();
	try
	{
	    // Calculate the total values of all the deals based on the activity
	    // type.
	    DecimalFormat formatter = new DecimalFormat("#,###");
	    for (Opportunity deal : dealsWon)
	    {
		wonValue += deal.expected_value;

		String summary = "(" + currency + formatter.format(deal.expected_value) + ", " + deal.probability + "%";
		if (!deal.getPipeline().name.equals("Default"))
		    summary += ", " + deal.getPipeline().name;
		summary += ")";
		wonActivities.get(deal.id).custom4 = summary;
		wonCount++;
	    }
	    for (Opportunity deal : dealsLost)
	    {
		lostValue += deal.expected_value;
		String summary = "(" + currency + formatter.format(deal.expected_value) + ", " + deal.probability + "%";
		if (!deal.getPipeline().name.equals("Default"))
		    summary += ", " + deal.getPipeline().name;
		summary += ")";
		lostActivities.get(deal.id).custom4 = summary;
		lostCount++;
	    }

	    for (Opportunity deal : dealsCreated)
	    {
		newValue += deal.expected_value;
		String summary = "(" + currency + formatter.format(deal.expected_value) + ", " + deal.probability + "%";
		if (!deal.getPipeline().name.equals("Default"))
		    summary += ", " + deal.getPipeline().name;
		summary += ")";
		newDealActivities.get(deal.id).custom4 = summary;
		newCount++;
	    }

	    for (Opportunity deal : dealsMileChange)
	    {
		mileValue += deal.expected_value;
		String summary = "(" + currency + formatter.format(deal.expected_value) + ", " + deal.probability + "%";
		if (!deal.getPipeline().name.equals("Default"))
		    summary += ", " + deal.getPipeline().name;
		summary += ")";
		mileChangeActivities.get(deal.id).custom4 = summary;
		mileCount++;
	    }

	    if (wonCount > 0)
	    {
		dealsReport.put("won_count", wonCount);
		dealsReport.put("won_value", formatter.format(wonValue));
		dealsReport.put("deals_won", wonActivities.values());
	    }
	    if (lostCount > 0)
	    {
		dealsReport.put("lost_count", lostCount);
		dealsReport.put("lost_value", formatter.format(lostValue));
		dealsReport.put("deals_lost", lostActivities.values());
	    }

	    if (newCount > 0)
	    {
		dealsReport.put("new_count", newCount);
		dealsReport.put("new_value", formatter.format(newValue));
		dealsReport.put("deals_created", newDealActivities.values());
	    }

	    if (mileCount > 0)
	    {
		dealsReport.put("mile_count", mileCount);
		dealsReport.put("mile_value", formatter.format(mileValue));
		dealsReport.put("mile_change", mileChangeActivities.values());
	    }

	    // dealsReport.put("deals_updated", dealsUpdated);
	    dealsReport.put("currency", currency);
	    int total = wonCount + lostCount + newCount;
	    if (total > 0)
		dealsReport.put("deals_total", total);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while deal report creation - " + e.getMessage());
	}

	return dealsReport;
    }

    /**
     * Get the activity report on events of a user.
     * 
     * @param user
     *            User to which the events are for.
     * @param startTime
     *            the lower bound of the time(start time) for getting activities
     *            (Activities after this time).
     * @param endTime
     *            the upper bound of the time(end time) for getting activities
     *            (Activities before this time).
     * @return report on the events.
     */
    public static Map<String, Object> getEventActivityReport(DomainUser user, Long startTime, Long endTime)
    {
	// Events that are completed by the given user.
	List<Event> events = EventUtil.getEvents(startTime, endTime,
		AgileUser.getCurrentAgileUserFromDomainUser(user.id).id);

	List<Activity> eventAddActivity = new ArrayList<Activity>();
	List<Activity> eventMovedActivity = new ArrayList<Activity>();

	// Get all the activities on the user performed on the events.
	List<Activity> eventActivity = ActivityUtil.getActivitiesByFilter(user.id,
		Activity.EntityType.EVENT.toString(), null, null, startTime, endTime, 0, null);

	// Get activities of the events whose start time is changed.
	for (Activity activity : eventActivity)
	{
	    if (activity.activity_type == Activity.ActivityType.EVENT_ADD)
	    {
		eventAddActivity.add(activity);
	    }
	    else if (activity.activity_type == Activity.ActivityType.EVENT_EDIT
		    && activity.custom3.indexOf("start_date") > 0)
	    {
		List<String> fields = Arrays.asList(activity.custom3.substring(1, activity.custom3.length() - 1).split(
			","));
		List<String> newFieldValues = Arrays.asList(activity.custom2
			.substring(1, activity.custom2.length() - 1).split(","));
		List<String> oldFieldValues = Arrays.asList(activity.custom1
			.substring(1, activity.custom1.length() - 1).split(","));
		int index = fields.indexOf("start_date");
		activity.custom4 = "'" + activity.label + "'  rescheduled from " + oldFieldValues.get(index)
			+ oldFieldValues.get(index + 1) + " to " + newFieldValues.get(index)
			+ newFieldValues.get(index + 1);
		eventMovedActivity.add(activity);

	    }
	}

	for (Event event : events)
	{
	    event.color = MustacheUtil.convertDate("MMM dd HH:mm", event.start);
	}

	// Fill the map with the required data to show in the activity report.
	Map<String, Object> eventsReport = new HashMap<String, Object>();
	try
	{
	    if (events.size() > 0)
	    {
		eventsReport.put("events_count", events.size());
		eventsReport.put("events", events);
	    }

	    if (eventMovedActivity.size() > 0)
	    {
		eventsReport.put("event_moved_count", eventMovedActivity.size());
		eventsReport.put("events_moved", eventMovedActivity);
	    }

	    if (eventAddActivity.size() > 0)
	    {
		eventsReport.put("events_added_count", eventAddActivity.size());
		eventsReport.put("events_added", eventAddActivity);
	    }

	    int total = events.size() + eventMovedActivity.size() + eventAddActivity.size();
	    if (total > 0)
		eventsReport.put("events_total", total);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while event report creation - " + e.getMessage());
	}

	return eventsReport;
    }

    /**
     * Get the activity reports on tasks of a user.
     * 
     * @param user
     *            user to which the tasks are belong to.
     * @param startTime
     *            the lower bound of the time(start time) for getting activities
     *            (Activities after this time).
     * @param endTime
     *            the upper bound of the time(end time) for getting activities
     *            (Activities before this time).
     * @return
     */
    public static Map<String, Object> getTaskActivityReport(DomainUser user, Long startTime, Long endTime)
    {
	List<Activity> taskComplete = new ArrayList<Activity>();
	List<Activity> taskUpdated = new ArrayList<Activity>();
	List<Activity> taskCreated = new ArrayList<Activity>();

	// Get all the activities of the user on tasks. Instead of getting by
	// activity type. This will reduce the DB calls.
	List<Activity> activities = ActivityUtil.getActivitiesByFilter(user.id, Activity.EntityType.TASK.toString(),
		null, null, startTime, endTime, 0, null);
	// Separate activities based on the activity types.
	for (Activity act : activities)
	{
	    if (act.activity_type == Activity.ActivityType.TASK_COMPLETED)
	    {
		act.related_contact_ids = getActivityRelateContacts(act, user.domain, " related to ");
		taskComplete.add(act);
	    }
	    else if (act.activity_type == Activity.ActivityType.TASK_PROGRESS_CHANGE)
	    {
		act.related_contact_ids = getActivityRelateContacts(act, user.domain, " related to ");
		taskUpdated.add(act);
	    }
	}

	// Get the deals assigned to this user (Can be assigned by the other
	// users also.)
	List<String> activityTypeList = new ArrayList<String>();
	activityTypeList.add(Activity.ActivityType.TASK_ADD.toString());
	activityTypeList.add(Activity.ActivityType.TASK_OWNER_CHANGE.toString());

	activities = dao.ofy().query(Activity.class).filter("entity_type = ", Activity.EntityType.TASK.toString())
		.filter("activity_type in ", activityTypeList).filter("time >= ", startTime)
		.filter("time <= ", endTime).list();

	for (Activity act : activities)
	{
	    if (act.custom1.equals(user.name))
	    {
		act.related_contact_ids = getActivityRelateContacts(act, user.domain, " related to ");
		taskCreated.add(act);
	    }
	}

	Map<String, Object> tasksReport = new HashMap<String, Object>();
	try
	{
	    if (taskComplete.size() > 0)
	    {
		tasksReport.put("tasks_done_count", taskComplete.size());
		tasksReport.put("tasks_done", taskComplete);

	    }

	    if (taskUpdated.size() > 0)
	    {
		tasksReport.put("tasks_inprogress_count", taskUpdated.size());
		tasksReport.put("tasks_inprogress", taskUpdated);

	    }

	    if (taskCreated.size() > 0)
	    {
		tasksReport.put("tasks_assigned_count", taskCreated.size());
		tasksReport.put("tasks_assigned", taskCreated);
	    }

	    int total = taskCreated.size() + taskUpdated.size() + taskComplete.size();
	    if (total > 0)
		tasksReport.put("tasks_total", total);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while event report creation - " + e.getMessage());
	}

	return tasksReport;
    }

    /**
     * Get the report on the emails sent by the user.
     * 
     * @param user
     *            user who sent the emails.
     * @param startTime
     *            the lower bound of the time(start time) for getting activities
     *            (Activities after this time).
     * @param endTime
     *            the upper bound of the time(end time) for getting activities
     *            (Activities before this time).
     * @return
     */
    public static Map<String, Object> getEmailActivityReport(DomainUser user, Long startTime, Long endTime)
    {

	// Get activities for email sent.
	List<String> activityTypeList = new ArrayList<String>();
	activityTypeList.add(Activity.ActivityType.EMAIL_SENT.toString());
	activityTypeList.add(Activity.ActivityType.BULK_ACTION.toString());

	List<Activity> activities = dao.ofy().query(Activity.class)
		.filter("user", new Key<DomainUser>(DomainUser.class, user.id))
		.filter("activity_type in ", activityTypeList).filter("time >= ", startTime)
		.filter("time <= ", endTime).list();

	int emailsCount = 0;
	List<Activity> emailActivity = new ArrayList<Activity>();

	for (Activity activity : activities)
	{
	    if (activity.activity_type == Activity.ActivityType.EMAIL_SENT)
	    {
		emailsCount++;
		// Prepare the summary to show in the email, as it is not
		// possible to format in the template.
		activity.label = "<a href=\"https://" + user.domain + ".agilecrm.com/#contact/" + activity.entity_id
			+ "\">" + activity.label + "</a>";
		emailActivity.add(activity);
	    }
	    else if (activity.activity_type == Activity.ActivityType.BULK_ACTION
		    && activity.custom1.equals("SEND_EMAIL"))
	    {
		try
		{
		    emailsCount += Integer.parseInt(activity.custom3);
		}
		catch (Exception e)
		{
		    emailsCount++;
		}

		activity.label = activity.custom3 + " " + activity.label;
		activity.custom3 = activity.custom2;
		emailActivity.add(activity);
	    }
	}

	Map<String, Object> emailReport = new HashMap<String, Object>();
	try
	{
	    if (emailsCount > 0)
	    {
		emailReport.put("emails_count", emailsCount);
		emailReport.put("emails_sent", emailActivity);
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while event report creation - " + e.getMessage());
	}

	return emailReport;
    }

    /**
     * Get the activity reports on the notes added to contact by the user.
     * 
     * @param user
     *            who added notes to the contacts.
     * @param startTime
     *            the lower bound of the time(start time) for getting activities
     *            (Activities after this time).
     * @param endTime
     *            the upper bound of the time(end time) for getting activities
     *            (Activities before this time).
     * @return report on the notes added by the user.
     */
    public static Map<String, Object> getNotesActivityReport(DomainUser user, Long startTime, Long endTime)
    {

	List<Activity> activities = ActivityUtil.getActivitiesByFilter(user.id, Activity.EntityType.CONTACT.toString(),
		Activity.ActivityType.NOTE_ADD.toString(), null, startTime, endTime, 0, null);

	for (Activity activity : activities)
	{
	    activity.custom4 = getActivityRelateContacts(activity, user.domain, "");
	}

	Map<String, Object> notesReport = new HashMap<String, Object>();
	try
	{
	    if (activities.size() > 0)
	    {
		notesReport.put("notes_contacts_count", activities.size());
		notesReport.put("notes_contacts", activities);
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while event report creation - " + e.getMessage());
	}
	return notesReport;
    }

    /**
     * Get the activity report on the documents uploaded by the user.
     * 
     * @param user
     *            who uploaded the documents.
     * @param startTime
     *            the lower bound of the time(start time) for getting activities
     *            (Activities after this time).
     * @param endTime
     *            the upper bound of the time(end time) for getting activities
     *            (Activities before this time).
     * @return report on the documents uploaded.
     */
    public static Map<String, Object> getDocumentsActivityReport(DomainUser user, Long startTime, Long endTime)
    {
	List<Activity> activities = ActivityUtil.getActivitiesByFilter(user.id,
		Activity.EntityType.DOCUMENT.toString(), Activity.ActivityType.DOCUMENT_ADD.toString(), null,
		startTime, endTime, 0, null);
	for (Activity act : activities)
	{
	    act.custom4 = getActivityRelateContacts(act, user.domain, " related to ");
	}

	Map<String, Object> docReport = new HashMap<String, Object>();
	try
	{
	    if (activities.size() > 0)
	    {
		docReport.put("doc_count", activities.size());
		docReport.put("doc_activities", activities);
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while event report creation - " + e.getMessage());
	}

	return docReport;
    }

    /**
     * Get the time bound os the activities based on the activity report
     * frequency.
     * 
     * @param report
     *            activity report object.
     * @return start time and the end time for getting the activities.
     */
    private static Map<String, Long> getTimeBound(ActivityReports report)
    {
	Calendar cal = Calendar.getInstance();
	cal.set(Calendar.HOUR_OF_DAY, 0);
	cal.set(Calendar.MINUTE, 0);
	cal.set(Calendar.SECOND, 0);
	cal.set(Calendar.MILLISECOND, 0);
	Map<String, Long> timeBound = new HashMap<String, Long>();

	// Based on the frequency.
	if (report.frequency.equals(ActivityReports.Frequency.DAILY))
	{
	    // 12:00 AM to 12:00 AM.
	    cal.add(Calendar.DATE, -1);
	    timeBound.put("startTime", cal.getTimeInMillis() / 1000);
	    cal.add(Calendar.DATE, 1);
	    timeBound.put("endTime", cal.getTimeInMillis() / 1000);
	}
	else if (report.frequency.equals(ActivityReports.Frequency.WEEKLY))
	{
	    // Friday to Friday.
	    int daysBackToFri = cal.get(Calendar.DAY_OF_WEEK);
	    if (daysBackToFri == Calendar.FRIDAY)
		timeBound.put("endTime", cal.getTimeInMillis() / 1000);
	    else
	    {
		cal.add(Calendar.DATE, Calendar.FRIDAY - daysBackToFri);
		timeBound.put("endTime", cal.getTimeInMillis() / 1000);
	    }
	    cal.add(Calendar.DATE, -7);
	    timeBound.put("startTime", cal.getTimeInMillis() / 1000);
	}
	else if (report.frequency.equals(ActivityReports.Frequency.MONTHLY))
	{
	    // First Friday of the previous month to the first Friday of this
	    // month.
	    int todayDate = cal.get(Calendar.DATE);
	    cal.set(Calendar.DATE, 1);
	    int todayDay = cal.get(Calendar.DAY_OF_WEEK);
	    int offset = todayDay < 6 ? Calendar.FRIDAY - todayDay : (todayDay == 6 ? 0 : Calendar.FRIDAY);
	    cal.add(Calendar.DATE, offset);
	    if (todayDate <= cal.get(Calendar.DATE))
	    {
		timeBound.put("endTime", cal.getTimeInMillis() / 1000);
		cal.add(Calendar.MONTH, -1);
		cal.set(Calendar.DATE, 1);
		todayDay = cal.get(Calendar.DAY_OF_WEEK);
		offset = todayDay < 6 ? Calendar.FRIDAY - todayDay : (todayDay == 6 ? 0 : todayDay + Calendar.FRIDAY);
		cal.add(Calendar.DATE, offset);
		timeBound.put("startTime", cal.getTimeInMillis() / 1000);
	    }
	    else
	    {
		timeBound.put("startTime", cal.getTimeInMillis() / 1000);
		cal.add(Calendar.MONTH, 1);
		cal.set(Calendar.DATE, 1);
		todayDay = cal.get(Calendar.DAY_OF_WEEK);
		offset = todayDay < 6 ? Calendar.FRIDAY - todayDay : (todayDay == 6 ? 0 : todayDay + Calendar.FRIDAY);
		cal.add(Calendar.DATE, offset);
		timeBound.put("endTime", cal.getTimeInMillis() / 1000);

	    }
	}
	return timeBound;
    }

    /**
     * To send the activity report as a mail to the email addresses given the
     * activity report.
     * 
     * @param reportId
     *            id of the activity report to be sent.
     * @param endTime
     *            end time of the activities to be sent in the report.
     */
    public static void sendActivityReport(Long reportId, Long endTime)
    {
	ActivityReports report = getActivityReport(reportId);
	// Send reports email
	SendMail.sendMail(report.sendTo, report.name + " - " + SendMail.REPORTS_SUBJECT, "activity_reports",
		ActivityReportsUtil.generateActivityReports(reportId, endTime));
    }

    /**
     * Prepare the related contacts as HTML text with the links to their page.
     * 
     * @param activity
     *            activity having the information about the replated contacts.
     * @param domain
     *            domain of the user.
     * @param prefix
     *            prefix to be added before the contacts like 'related to' etc.
     * @return HTML string format of the related contacts with the link.
     */
    private static String getActivityRelateContacts(Activity activity, String domain, String prefix)
    {
	try
	{
	    if (activity.related_contact_ids != null && activity.related_contact_ids.length() != 0)
	    {
		String result = prefix;

		JSONArray contacts = new JSONArray(activity.related_contact_ids);
		for (int i = 0; i < contacts.length(); i++)
		{
		    result += "<a href=\"https://" + domain + ".agilecrm.com/#contact"
			    + contacts.getJSONObject(i).getString("contactid") + "\" target=\"_blank\">"
			    + contacts.getJSONObject(i).getString("contactname") + "</a>";
		    if (i + 1 != contacts.length())
			result += ", ";

		}
		return result;
	    }
	}
	catch (org.json.JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	return "";
    }

    /**
     * Check for the count in the report and return the count.
     * 
     * @param report
     *            activity report
     * @param field
     *            name of the count field
     * @return number of entries in the report.
     */
    private static Integer getTotalCount(Map<String, Object> report, String field)
    {
	if (report.containsKey(field))
	{
	    return (Integer) report.get(field);
	}
	return 0;
    }
}
