package com.agilecrm.user.util;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.OnlineCalendarPrefs;
import com.agilecrm.util.VersioningUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

/**
 * while fetching onlinecalendar prefs based on schedule id, we have to convert
 * it to lowercase
 * 
 * @author jagadeesh
 *
 */
public class OnlineCalendarUtil
{
	// Dao
	public static ObjectifyGenericDao<OnlineCalendarPrefs> dao = new ObjectifyGenericDao<OnlineCalendarPrefs>(
			OnlineCalendarPrefs.class);

	/**
	 * returns Online calendar prefs entity based on id
	 * 
	 * @param id
	 * @return
	 */
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
		if (domainUserId == null)
			return null;
		try
		{
			Key<DomainUser> userKey = new Key<DomainUser>(DomainUser.class, domainUserId);

			OnlineCalendarPrefs calPrefs = OnlineCalendarPrefs.dao.getByProperty("user", userKey);

			return calPrefs;
		}
		catch (Exception e)
		{
			System.out.println("Exception occured in online calendar prefs" + e.getMessage());
			return null;
		}
	}

	/**
	 * returns domainsuer key
	 */
	public static Key<DomainUser> getKey(OnlineCalendarPrefs prefs)
	{

		if (prefs != null)
		{
			Key<DomainUser> userKey = prefs.getDomainOwnerKey();
			return userKey;
		}
		return null;
	}

	/**
	 * returns domainUser id
	 * 
	 * @param prefs
	 * @return
	 */
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
		try
		{
			if (StringUtils.isNotEmpty(schedule_id))
				schedule_id = schedule_id.toLowerCase();
			OnlineCalendarPrefs prefs = dao.ofy().query(OnlineCalendarPrefs.class).filter("schedule_id", schedule_id)
					.get();
			return prefs;
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 
	 * creates schedule id based on username when he is registering After this
	 * user can edit his online calendar prefs in online calendar page
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

	/**
	 * gets the calendar URL based on domain and domainUSer id
	 * 
	 * @param id
	 * @param domain
	 * @return
	 */
	public static String getDomainUserCalendarUrl(Long domainUserId, String domain, DomainUser user)
	{
		if (domainUserId == null || StringUtils.isBlank(domain))
		{
			return null;
		}
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set(domain);

		try
		{
			String online_calendar_url = VersioningUtil.getHostURLByApp(domain);
			OnlineCalendarPrefs prefs = getCalendarPrefs(domainUserId);
			if (prefs != null)
			{
				String scheduleid = prefs.schedule_id;
				if (StringUtils.isNotEmpty(scheduleid))
					online_calendar_url += "calendar/" + scheduleid;
			}
			else
			{
				if (user == null)
					user = DomainUserUtil.getDomainUser(domainUserId);
				if (user != null)
					online_calendar_url += "calendar/" + getScheduleid(user.name);
			}
			return online_calendar_url;
		}
		catch (Exception e)
		{
			System.out.println("exception occured when given call from post load");
			e.printStackTrace();
			return null;
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}

	/**
	 * we are saving schedule id in domainuser also when user updating his
	 * schedule id to avoid additional call for prefs in camapign merge fields
	 * 
	 * @param prefs
	 */
	public static void saveScheduleIdInDomainUser(OnlineCalendarPrefs prefs)
	{
		try
		{
			DomainUser user = DomainUserUtil.getCurrentDomainUser();
			if (user == null)
			{
				user = DomainUserUtil.getDomainUser(getDomainUserID(prefs));
			}
			if (user != null)
			{
				user.schedule_id = prefs.schedule_id;
				user.save();
			}

		}
		catch (Exception e)
		{
			System.out.println("exception occured while saving scheduleid in domainUser");
		}
	}
}
