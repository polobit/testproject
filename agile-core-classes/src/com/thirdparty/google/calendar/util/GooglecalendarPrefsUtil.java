package com.thirdparty.google.calendar.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.thirdparty.google.calendar.GoogleCalenderPrefs;
import com.thirdparty.google.calendar.GoogleCalenderPrefs.CALENDAR_TYPE;

public class GooglecalendarPrefsUtil {
	/**
	 * Fetches calendar prefs based on id
	 * 
	 * @param id
	 * @return
	 */
	public static GoogleCalenderPrefs getCalendarPref(Long id) {
		return getCalendarPref(new Key<GoogleCalenderPrefs>(
				GoogleCalenderPrefs.class, id));
	}

	/**
	 * Fetches calendar prefs based on prefs key
	 * 
	 * @param prefsKey
	 * @return
	 */
	public static GoogleCalenderPrefs getCalendarPref(
			Key<GoogleCalenderPrefs> prefsKey) {
		try {
			return GoogleCalenderPrefs.dao.get(prefsKey);
		} catch (EntityNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Fethes calendar preferences for based on current domain user key
	 * 
	 * @return
	 */
	public static GoogleCalenderPrefs getCalendarPref() {
		GoogleCalenderPrefs prefs = GoogleCalenderPrefs.dao.getByProperty(
				"domainUserKey", new Key<DomainUser>(DomainUser.class,
						SessionManager.get().getDomainId()));

		return prefs;

	}

	/**
	 * Fethes calendar preferences for based on current domain user key
	 * 
	 * @return
	 */
	public static List<GoogleCalenderPrefs> getCalendarPrefList() {
		List<GoogleCalenderPrefs> prefs = GoogleCalenderPrefs.dao
				.listByProperty("domainUserKey", new Key<DomainUser>(
						DomainUser.class, SessionManager.get().getDomainId()));

		return prefs;
	}

	public static GoogleCalenderPrefs getCalendarPrefsByType(
			CALENDAR_TYPE calendar_type) {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		queryMap.put("calendar_type", calendar_type);
		queryMap.put("domainUserKey", new Key<DomainUser>(DomainUser.class,
				SessionManager.get().getDomainId()));

		GoogleCalenderPrefs prefs = GoogleCalenderPrefs.dao
				.getByProperty(queryMap);
		return prefs;
	}

	/**
	 * Fetches current user calendar prefs and updates new access token and
	 * returns new object
	 * 
	 * @return
	 */

	public static GoogleCalenderPrefs getPrefsAndRefreshToken() {
		// Current user calendar prefs
		GoogleCalenderPrefs prefs = getCalendarPref();
		System.out.println(prefs);
		if (prefs == null)
			return prefs;

		try {
			// Refreshes access token
			prefs.refreshToken();
			return prefs;
		} catch (IOException e) {

			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}

	}

	public static void updatePrefs(GoogleCalenderPrefs prefs) {
		if (prefs == null || prefs.id == null)
			return;

		if (prefs.calendar_type == null
				|| prefs.calendar_type == CALENDAR_TYPE.GOOGLE) {
			GoogleCalenderPrefs oldPrefs = getCalendarPrefsByType(CALENDAR_TYPE.GOOGLE);
			if (oldPrefs != null) {
				oldPrefs.prefs = prefs.prefs;
				prefs = oldPrefs;
			}
		}

		prefs.save();
	}

	public static void deletePrefs(CALENDAR_TYPE calendar_type) {
		GoogleCalenderPrefs prefs = getCalendarPrefsByType(calendar_type);
		if (prefs == null)
			return;

		prefs.delete();
	}

}
