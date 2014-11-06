package com.agilecrm.reports;

import java.util.List;

import org.json.JSONObject;

import com.agilecrm.activities.Activity;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
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

    public static JSONObject getEventActivityReport(Long user_id, Long startTime, Long endTime)
    {

	JSONObject eventActivities = new JSONObject();
	ActivityUtil.getActivitiesByFilter(user_id, Activity.EntityType.EVENT.toString(),
		Activity.ActivityType.EVENT_ADD.toString(), startTime, endTime, null, 0, null);

	return null;
    }

    public static JSONObject getTimeBound(ActivityReports report)
    {

	return null;
    }
}
