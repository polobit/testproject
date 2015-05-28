package com.agilecrm.user.util;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.OnlineCalendarPrefs;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class OnlineCalendarUtil
{
	// Dao
	public static ObjectifyGenericDao<OnlineCalendarPrefs> dao = new ObjectifyGenericDao<OnlineCalendarPrefs>(
			OnlineCalendarPrefs.class);

	public static OnlineCalendarPrefs getOnlineCalendarPrefs(Long id)
	{
		try
		{
			return dao.get(id);
		}
		catch (EntityNotFoundException e)
		{
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * gets online calendar prefs based on domainUser id
	 * 
	 * @param domainUserId
	 *            domainUserId
	 * @return
	 */
	public static OnlineCalendarPrefs getCalendarPrefs(Long domainUserId)
	{
		Objectify ofy = ObjectifyService.begin();
		Key<DomainUser> userKey = new Key<DomainUser>(DomainUser.class, domainUserId);

		OnlineCalendarPrefs calPrefs = OnlineCalendarPrefs.dao.getByProperty("user", userKey);

		return calPrefs;
	}

	/**
	 * 
	 */
	public static Key<DomainUser> getKey(OnlineCalendarPrefs prefs)
	{

		Key<DomainUser> userKey = prefs.getDomainOwnerKey();
		return userKey;
	}

	public static Long getDomainUserID(OnlineCalendarPrefs prefs)
	{

		Key<DomainUser> userKey = getKey(prefs);
		return userKey.getId();
	}

	/**
	 * gets the schedule preferences based on schedule id
	 * 
	 * @param schedule_id
	 * @return
	 */
	public static OnlineCalendarPrefs getOnlineCalendarPrefs(String schedule_id)
	{
		OnlineCalendarPrefs prefs = dao.ofy().query(OnlineCalendarPrefs.class).filter("schedule_id", schedule_id).get();
		return prefs;
	}

	/**
	 * 
	 * @param name
	 *            domainuser name
	 * @return online schedule id
	 */
	public static String getScheduleid(String name)
	{
		String scheduleid = null;
		if (name.contains(" "))
		{
			scheduleid = name.replace(" ", "_");
			return scheduleid;
		}
		else
		{
			scheduleid = name;
			return scheduleid;
		}
	}

}
