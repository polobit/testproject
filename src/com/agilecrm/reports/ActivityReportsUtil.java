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

    public static List<Key<ActivityReports>> getAllActivityReports(Long userId)
    {
	return dao.listKeysByProperty("user", new Key<DomainUser>(DomainUser.class, userId));
    }

    /**
     * Fetches all the available reports
     * 
     * @return {@link List} of {@link Reports}
     */
    public static List<ActivityReports> fetchAllReports()
    {
	return dao.fetchAll();
    }

    /**
     * Get report based on given Id
     * 
     * @param id
     * @return {@link Reports}
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

    public static List<Key<ActivityReports>> getAllReportKeysByDuration(String duration)
    {
	System.out.println("fetching the reports - " + duration);
	return dao.listKeysByProperty("duration", duration);
    }

    public static Map<String, Object> generateActivityReports(Long id, Long endTime)
    {
	ActivityReports report = getActivityReport(id);
	List<ActivityType> activities = report.activity;
	List<DomainUser> users = report.getUsersList();
	Map<String, Object> activityReports = new HashMap<String, Object>();
	try
	{
	    Map<String, Long> timeBounds = getTimeBound(report);
	    if (endTime != null)
		timeBounds.put("endTime", endTime);

	    String format = "EEE, MMM d, yyyy HH:mm z";

	    activityReports.put("start_time", MustacheUtil.convertDate(format, timeBounds.get("startTime")));
	    activityReports.put("end_time", MustacheUtil.convertDate(format, timeBounds.get("endTime")));
	    activityReports.put("report_name", report.name);

	    List<Map<String, Object>> userReport = new ArrayList<Map<String, Object>>();
	    for (DomainUser user : users)
	    {
		Map<String, Object> activityReport = new HashMap<String, Object>();
		activityReport.put("user_id", user.id);
		activityReport.put("user_name", user.name);
		activityReports.put("domain", user.domain);
		activityReport.put("pic",
			UserPrefsUtil.getUserPrefs(AgileUser.getCurrentAgileUserFromDomainUser(user.id)).pic);
		if (activities.contains(ActivityReports.ActivityType.DEAL))
		    activityReport.put("deals",
			    getDealActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
		if (activities.contains(ActivityReports.ActivityType.EVENT))
		    activityReport.put("events",
			    getEventActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
		if (activities.contains(ActivityReports.ActivityType.TASK))
		    activityReport.put("tasks",
			    getTaskActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
		if (activities.contains(ActivityReports.ActivityType.EMAIL))
		    activityReport.put("emails",
			    getEmailActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
		if (activities.contains(ActivityReports.ActivityType.NOTES))
		    activityReport.put("notes",
			    getNotesActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
		if (activities.contains(ActivityReports.ActivityType.DOCUMENTS))
		    activityReport.put("docs",
			    getDocumentsActivityReport(user, timeBounds.get("startTime"), timeBounds.get("endTime")));
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

    public static Map<String, Object> getDealActivityReport(DomainUser user, Long startTime, Long endTime)
    {

	List<Key<Opportunity>> dealWon = new ArrayList<Key<Opportunity>>();
	List<Key<Opportunity>> dealLost = new ArrayList<Key<Opportunity>>();
	List<Key<Opportunity>> dealUpdated = new ArrayList<Key<Opportunity>>();
	List<Key<Opportunity>> dealCreated = new ArrayList<Key<Opportunity>>();
	List<Key<Opportunity>> mileChange = new ArrayList<Key<Opportunity>>();
	List<Activity> activities = ActivityUtil.getActivitiesByFilter(user.id, Activity.EntityType.DEAL.toString(),
		null, null, startTime, endTime, 0, null);
	List<Activity> wonActivities = new ArrayList<Activity>();
	List<Activity> lostActivities = new ArrayList<Activity>();
	List<Activity> newDealActivities = new ArrayList<Activity>();
	List<Activity> mileChangeActivities = new ArrayList<Activity>();
	UserPrefs pref = UserPrefsUtil.getUserPrefs(AgileUser.getCurrentAgileUserFromDomainUser(user.id));
	System.out.println("Deals ---- " + activities.size());
	for (Activity act : activities)
	{
	    if (act.activity_type == Activity.ActivityType.DEAL_LOST)
	    {
		dealLost.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
		act.related_contact_ids = getActivityRelateContacts(act, user.domain, " related to ");
		lostActivities.add(act);
	    }
	    else if (act.activity_type == Activity.ActivityType.DEAL_CLOSE)
	    {
		dealWon.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
		act.related_contact_ids = getActivityRelateContacts(act, user.domain, " related to ");
		wonActivities.add(act);
	    }
	    else if (act.activity_type == Activity.ActivityType.DEAL_MILESTONE_CHANGE)
	    {
		mileChange.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
		act.related_contact_ids = getActivityRelateContacts(act, user.domain, " related to ");
		mileChangeActivities.add(act);
	    }
	    else
		dealUpdated.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
	}

	List<String> activityTypeList = new ArrayList<String>();
	activityTypeList.add(Activity.ActivityType.DEAL_ADD.toString());
	activityTypeList.add(Activity.ActivityType.DEAL_OWNER_CHANGE.toString());

	activities = dao.ofy().query(Activity.class).filter("entity_type = ", Activity.EntityType.DEAL.toString())
		.filter("activity_type in ", activityTypeList).filter("time >= ", startTime)
		.filter("time <= ", endTime).list();
	System.out.println("-------act assigned---" + activities.size());
	for (Activity act : activities)
	{
	    System.out.println(act.custom1.equals(user.name) + "-----ass name---" + act.custom1);
	    if (act.custom1.equals(user.name))
	    {
		act.related_contact_ids = getActivityRelateContacts(act, user.domain, " related to ");
		dealCreated.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
		newDealActivities.add(act);
	    }
	}

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
	DecimalFormat formatter = new DecimalFormat("#,###");
	for (Opportunity deal : dealsWon)
	{
	    wonValue += deal.expected_value;
	    wonCount++;
	}
	for (Opportunity deal : dealsLost)
	{
	    lostValue += deal.expected_value;
	    lostCount++;
	}

	for (Opportunity deal : dealsCreated)
	{
	    newValue += deal.expected_value;
	    newCount++;
	}

	for (Opportunity deal : dealsMileChange)
	{
	    mileValue += deal.expected_value;
	    mileCount++;
	}

	String currency = pref.currency != null ? pref.currency.substring(pref.currency.indexOf("-") + 1) : "$";
	System.out.println("--------currency--------" + currency);
	Map<String, Object> dealsReport = new HashMap<String, Object>();
	try
	{
	    if (wonCount > 0)
	    {
		dealsReport.put("won_count", wonCount);
		dealsReport.put("won_value", formatter.format(wonValue));
		dealsReport.put("deals_won", wonActivities);
	    }
	    if (lostCount > 0)
	    {
		dealsReport.put("lost_count", lostCount);
		dealsReport.put("lost_value", formatter.format(lostValue));
		dealsReport.put("deals_lost", lostActivities);
	    }

	    if (newCount > 0)
	    {
		dealsReport.put("new_count", newCount);
		dealsReport.put("new_value", formatter.format(newValue));
		dealsReport.put("deals_created", newDealActivities);
	    }

	    if (mileCount > 0)
	    {
		dealsReport.put("mile_count", mileCount);
		dealsReport.put("mile_value", formatter.format(mileValue));
		dealsReport.put("mile_change", mileChangeActivities);
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

    public static Map<String, Object> getEventActivityReport(DomainUser user, Long startTime, Long endTime)
    {
	List<Event> events = new ArrayList<Event>();
	events = EventUtil.getEvents(startTime, endTime, AgileUser.getCurrentAgileUserFromDomainUser(user.id).id);

	List<Activity> eventActivity = ActivityUtil.getActivitiesByFilter(user.id,
		Activity.EntityType.EVENT.toString(), null, null, startTime, endTime, 0, null);
	List<Activity> eventAddActivity = new ArrayList<Activity>();
	List<Activity> eventMovedActivity = new ArrayList<Activity>();
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

	    int total = events.size() + eventMovedActivity.size();
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

    public static Map<String, Object> getTaskActivityReport(DomainUser user, Long startTime, Long endTime)
    {
	List<Activity> taskComplete = new ArrayList<Activity>();
	List<Activity> taskUpdated = new ArrayList<Activity>();
	List<Activity> taskCreated = new ArrayList<Activity>();
	List<Activity> activities = ActivityUtil.getActivitiesByFilter(user.id, Activity.EntityType.TASK.toString(),
		null, null, startTime, endTime, 0, null);
	System.out.println("Tasks ---- " + activities.size());
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

	activities = ActivityUtil.getActivitiesByFilter(null, Activity.EntityType.TASK.toString(),
		Activity.ActivityType.TASK_ADD + " OR " + Activity.ActivityType.TASK_OWNER_CHANGE, null, startTime,
		endTime, 0, null);

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
		tasksReport.put("taks_assigned_count", taskCreated.size());
		tasksReport.put("taks_assigned", taskCreated);
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

    public static Map<String, Object> getEmailActivityReport(DomainUser user, Long startTime, Long endTime)
    {
	List<String> activityTypeList = new ArrayList<String>();
	activityTypeList.add(Activity.ActivityType.EMAIL_SENT.toString());
	activityTypeList.add(Activity.ActivityType.BULK_ACTION.toString());

	List<Activity> activities = dao.ofy().query(Activity.class).filter("activity_type in ", activityTypeList)
		.filter("time >= ", startTime).filter("time <= ", endTime).list();

	int emailsCount = 0;
	List<Activity> emailActivity = new ArrayList<Activity>();

	for (Activity activity : activities)
	{
	    if (activity.activity_type == Activity.ActivityType.EMAIL_SENT)
	    {
		emailsCount++;
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

    public static Map<String, Object> getNotesActivityReport(DomainUser user, Long startTime, Long endTime)
    {

	List<Activity> activities = ActivityUtil.getActivitiesByFilter(user.id, Activity.EntityType.CONTACT.toString(),
		Activity.ActivityType.NOTE_ADD.toString(), null, startTime, endTime, 0, null);

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

    private static Map<String, Long> getTimeBound(ActivityReports report)
    {
	Calendar cal = Calendar.getInstance();
	cal.set(Calendar.HOUR_OF_DAY, 0);
	cal.set(Calendar.MINUTE, 0);
	cal.set(Calendar.SECOND, 0);
	cal.set(Calendar.MILLISECOND, 0);
	Map<String, Long> timeBound = new HashMap<String, Long>();
	if (report.frequency.equals(ActivityReports.Frequency.DAILY))
	{
	    cal.add(Calendar.DATE, -1);
	    timeBound.put("startTime", cal.getTimeInMillis() / 1000);
	    cal.add(Calendar.DATE, 1);
	    timeBound.put("endTime", cal.getTimeInMillis() / 1000);
	}
	else if (report.frequency.equals(ActivityReports.Frequency.WEEKLY))
	{
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
	    int todayDate = cal.get(Calendar.DATE);
	    // cal.add(Calendar.MONTH, 1);
	    int todayDay = cal.get(Calendar.DAY_OF_WEEK);
	    int offset = todayDay < 6 ? Calendar.FRIDAY - todayDay : (todayDay == 6 ? 0 : todayDay + Calendar.FRIDAY);
	    System.out.print("Offset --------- " + offset);
	    cal.add(Calendar.DATE, offset);
	    System.out.print("First Friday --------- " + cal.toString());
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

    public static void sendActivityReport(Long reportId, Long endTime)
    {
	ActivityReports report = getActivityReport(reportId);
	// Send reports email
	SendMail.sendMail(report.sendTo, report.name + " - " + SendMail.REPORTS_SUBJECT, "activity_reports",
		ActivityReportsUtil.generateActivityReports(reportId, endTime));
    }

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
}
