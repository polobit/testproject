package com.agilecrm.reports;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.Event;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.activities.util.EventUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.reports.ActivityReports.ActivityType;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

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
	List<ActivityType> activities = report.activity_type;
	List<String> userIds = report.user_ids;
	Map<String, Object> activityReports = new HashMap<String, Object>();
	try
	{
	    Map<String, Long> timeBounds = getTimeBound(report);
	    if (endTime != null)
		timeBounds.put("end_time", endTime);

	    activityReports.put("start_time", timeBounds.get("startTime"));
	    activityReports.put("end_time", timeBounds.get("endTime"));
	    activityReports.put("report_name", report.name);
	    List<Map<String, Object>> userReport = new ArrayList<Map<String, Object>>();
	    for (String userId : userIds)
	    {
		Map<String, Object> activityReport = new HashMap<String, Object>();
		activityReport.put("user_id", userId);
		activityReport.put("user_name", DomainUserUtil.getDomainUser(Long.parseLong(userId)).name);

		if (activities.contains(ActivityReports.ActivityType.DEAL))
		    activityReport.put(
			    "deals",
			    getDealActivityReport(Long.parseLong(userId), timeBounds.get("startTime"),
				    timeBounds.get("endTime")));
		if (activities.contains(ActivityReports.ActivityType.DEAL))
		    activityReport.put(
			    "events",
			    getEventActivityReport(Long.parseLong(userId), timeBounds.get("startTime"),
				    timeBounds.get("endTime")));
		if (activities.contains(ActivityReports.ActivityType.DEAL))
		    activityReport.put(
			    "tasks",
			    getTaskActivityReport(Long.parseLong(userId), timeBounds.get("startTime"),
				    timeBounds.get("endTime")));
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

    public static Map<String, Object> getDealActivityReport(Long user_id, Long startTime, Long endTime)
    {

	List<Key<Opportunity>> dealWon = new ArrayList<Key<Opportunity>>();
	List<Key<Opportunity>> dealLost = new ArrayList<Key<Opportunity>>();
	List<Key<Opportunity>> dealUpdated = new ArrayList<Key<Opportunity>>();
	List<Key<Opportunity>> dealCreated = new ArrayList<Key<Opportunity>>();
	List<Activity> activities = ActivityUtil.getActivitiesByFilter(user_id, Activity.EntityType.DEAL.toString(),
		null, null, startTime, endTime, 0, null);
	List<Activity> wonActivities = new ArrayList<Activity>();
	List<Activity> lostActivities = new ArrayList<Activity>();
	System.out.println("Deals ---- " + activities.size());
	for (Activity act : activities)
	{
	    if (act.activity_type == Activity.ActivityType.DEAL_LOST)
	    {
		dealLost.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
		lostActivities.add(act);
	    }
	    else if (act.activity_type == Activity.ActivityType.DEAL_CLOSE)
	    {
		dealWon.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
		wonActivities.add(act);
	    }
	    else if (act.activity_type == Activity.ActivityType.DEAL_ADD)
		dealCreated.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
	    else
		dealUpdated.add(new Key<Opportunity>(Opportunity.class, act.entity_id));
	}

	List<Opportunity> dealsWon = Opportunity.dao.fetchAllByKeys(dealWon);
	List<Opportunity> dealsLost = Opportunity.dao.fetchAllByKeys(dealLost);
	List<Opportunity> dealsCreated = Opportunity.dao.fetchAllByKeys(dealCreated);
	List<Opportunity> dealsUpdated = Opportunity.dao.fetchAllByKeys(dealUpdated);

	int wonCount = 0;
	int lostCount = 0;
	double wonValue = 0;
	double lostValue = 0;
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

	Map<String, Object> dealsReport = new HashMap<String, Object>();
	try
	{
	    dealsReport.put("won_count", wonCount);
	    dealsReport.put("lost_count", lostCount);
	    dealsReport.put("won_value", wonValue);
	    dealsReport.put("lost_value", lostValue);
	    dealsReport.put("deals_won", wonActivities);
	    dealsReport.put("deals_lost", lostActivities);
	    dealsReport.put("deals_created", dealsCreated);
	    dealsReport.put("deals_updated", dealsUpdated);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while deal report creation - " + e.getMessage());
	}

	return dealsReport;
    }

    public static Map<String, Object> getEventActivityReport(Long user_id, Long startTime, Long endTime)
    {
	List<Event> events = new ArrayList<Event>();
	events = EventUtil.getEvents(startTime, endTime, AgileUser.getCurrentAgileUserFromDomainUser(user_id).id);

	Map<String, Object> eventsReport = new HashMap<String, Object>();
	try
	{
	    eventsReport.put("events_count", events.size());
	    eventsReport.put("events", events);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while event report creation - " + e.getMessage());
	}

	return eventsReport;
    }

    public static Map<String, Object> getTaskActivityReport(Long user_id, Long startTime, Long endTime)
    {
	List<Activity> taskComplete = new ArrayList<Activity>();
	List<Activity> taskUpdated = new ArrayList<Activity>();
	List<Activity> taskCreated = new ArrayList<Activity>();
	List<Activity> activities = ActivityUtil.getActivitiesByFilter(user_id, Activity.EntityType.TASK.toString(),
		null, null, startTime, endTime, 0, null);
	System.out.println("Tasks ---- " + activities.size());
	for (Activity act : activities)
	{
	    if (act.activity_type == Activity.ActivityType.TASK_COMPLETED)
		taskComplete.add(act);
	    else if (act.activity_type == Activity.ActivityType.TASK_ADD)
		taskCreated.add(act);
	    else if (act.activity_type == Activity.ActivityType.TASK_PROGRESS_CHANGE)
		taskUpdated.add(act);
	}

	Map<String, Object> tasksReport = new HashMap<String, Object>();
	try
	{
	    tasksReport.put("tasks_done", taskComplete);
	    tasksReport.put("tasks_inprogress", taskUpdated);
	    tasksReport.put("taks_assigned", taskCreated);
	    tasksReport.put("tasks_done_count", taskComplete.size());
	    tasksReport.put("tasks_inprogress_count", taskUpdated.size());
	    tasksReport.put("taks_assigned_count", taskCreated.size());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.out.println("Exception occured while event report creation - " + e.getMessage());
	}

	return tasksReport;
    }

    private static Map<String, Long> getTimeBound(ActivityReports report)
    {
	Calendar cal = Calendar.getInstance();
	cal.set(Calendar.HOUR_OF_DAY, 0);
	cal.set(Calendar.MINUTE, 0);
	cal.set(Calendar.SECOND, 0);
	cal.set(Calendar.MILLISECOND, 0);
	Map<String, Long> timeBound = new HashMap<String, Long>();
	if (report.duration.equals(ActivityReports.Duration.DAILY))
	{
	    cal.add(Calendar.DATE, -1);
	    timeBound.put("startTime", cal.getTimeInMillis() / 1000);
	    cal.add(Calendar.DATE, 1);
	    timeBound.put("endTime", cal.getTimeInMillis() / 1000);
	}
	else if (report.duration.equals(ActivityReports.Duration.WEEKLY))
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
	else if (report.duration.equals(ActivityReports.Duration.MONTHLY))
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
}
